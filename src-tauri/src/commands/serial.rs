use serde::{Deserialize, Serialize};
use tauri::{Emitter, Manager};
use tokio::sync::{mpsc, Mutex};
use tracing::{error, info};

use futures::{stream::SplitSink, SinkExt};
use tokio_serial::{SerialPortBuilderExt, SerialStream};
use tokio_util::codec::Framed;

use crate::modem::serial::{serial_read_task, split_serial, LineCodec};

#[derive(Debug, Serialize, Deserialize)]
pub enum CMDType {
    INIT,
    CMD,
    DINIT,
    RESPONSE,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AtCommand {
    message: String,
    id: String,
    cmdtype: CMDType,
}

impl AtCommand {
    pub fn new_with_string(message: String, id: Option<String>, cmdtype: CMDType) -> Self {
        Self {
            message,
            id: id.unwrap_or(uuid::Uuid::now_v7().to_string()),
            cmdtype,
        }
    }
}

pub struct AsyncProcInputTx {
    pub inner: Mutex<mpsc::Sender<AtCommand>>,
    pub serial_tx: Mutex<mpsc::Sender<AtCommand>>,
    pub connected: Mutex<bool>,
    pub ssink: Mutex<Option<SplitSink<Framed<SerialStream, LineCodec>, String>>>,
}

#[tauri::command]
pub fn availableports() -> Vec<String> {
    let ports = crate::modem::serial::get_available_ports();
    println!("available_ports: {:?}", ports);
    ports
}

#[tauri::command]
pub async fn send_at_command(
    command: AtCommand,
    state: tauri::State<'_, AsyncProcInputTx>,
) -> Result<(), String> {
    info!(?command, "at command");
    let async_proc_input_tx = state.inner.lock().await;

    match command.cmdtype {
        CMDType::INIT => {
            info!("INIT");
            let baudrate = 9600;
            let port = command.message.clone();
            let serial_tx = state.serial_tx.lock().await.clone();
            let mut ssink = state.ssink.lock().await;
            let mut connected = state.connected.lock().await;

            if !*connected {
                *connected = true;
                if let Ok(s) = tokio_serial::new(port, baudrate).open_native_async() {
                    let (sink, stream) = split_serial(s).await;
                    *ssink = Some(sink);
                    tauri::async_runtime::spawn(async move {
                        serial_read_task(stream, serial_tx).await
                    });
                } else {
                    error!("Failed to open serial port");
                    *connected = false;
                    return Err("Failed to open serial port".to_string());
                }
            }
            let _ = async_proc_input_tx
                .send(command)
                .await
                .map_err(|e| e.to_string());
        }
        CMDType::DINIT => {
            let mut ssink = state.ssink.lock().await;
            let mut connected = state.connected.lock().await;

            if ssink.is_some() {
                info!("Disconnection Called");
                *connected = false;
                let _ = ssink.as_mut().unwrap().close().await;
                *ssink = None;
            }

            info!("Disconnection Completed");
        }
        CMDType::CMD => {
            info!("COMMAND");
            let mut ssink = state.ssink.lock().await;
            if ssink.is_some() {
                let _ = ssink.as_mut().unwrap().send(command.message.clone()).await;
            }
            let _ = async_proc_input_tx
                .send(command)
                .await
                .map_err(|e| e.to_string());
        }
        _ => (),
    }

    Ok(())
}

pub fn setup_serial_async_task(
    app: &tauri::App,
    async_proc_input_rx: tokio::sync::mpsc::Receiver<AtCommand>,
    async_proc_output_tx: tokio::sync::mpsc::Sender<AtCommand>,
    mut async_proc_output_rx: tokio::sync::mpsc::Receiver<AtCommand>,
    serial_rx: tokio::sync::mpsc::Receiver<AtCommand>,
) -> tauri::Result<()> {
    info!("SetupApp");
    let serial_output_sender = async_proc_output_tx.clone();

    // Spawn async process command from FE
    tauri::async_runtime::spawn(async move {
        process_fe_command(async_proc_input_rx, async_proc_output_tx).await
    });

    // Process data read from serial
    tauri::async_runtime::spawn(async move {
        process_serial_read(serial_rx, serial_output_sender).await
    });

    // Clone app handle for frontend communication
    let app_handle = app.handle().clone();
    tauri::async_runtime::spawn(async move {
        loop {
            if let Some(output) = async_proc_output_rx.recv().await {
                at_response_reply(output, &app_handle);
            }
        }
    });

    Ok(())
}

async fn process_fe_command(
    mut input_rx: mpsc::Receiver<AtCommand>,
    output_tx: mpsc::Sender<AtCommand>,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    while let Some(input) = input_rx.recv().await {
        let output = input;
        output_tx.send(output).await?;
    }
    Ok(())
}

async fn process_serial_read(
    mut input_rx: mpsc::Receiver<AtCommand>,
    output_tx: mpsc::Sender<AtCommand>,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    while let Some(input) = input_rx.recv().await {
        let output = input;
        output_tx.send(output).await?;
    }
    Ok(())
}

fn at_response_reply<R: tauri::Runtime>(message: AtCommand, manager: &impl Manager<R>) {
    info!(?message, "atresponse");
    let response = serde_json::to_string(&message).unwrap();

    match message.cmdtype {
        CMDType::INIT => manager.app_handle().emit("ATConnect", true).unwrap(),
        CMDType::DINIT => manager.app_handle().emit("ATConnect", false).unwrap(),
        CMDType::RESPONSE => manager.app_handle().emit("atresponse", response).unwrap(),
        CMDType::CMD => (),
    }
}
