#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod mocks;
mod modem;

use commands::greet::greet;
use commands::serial::availableports;
use commands::serial::send_at_command;
use mocks::command::send_at_command_mock;

use commands::serial::setup_serial_async_task;
use commands::serial::AsyncProcInputTx;
use tokio::sync::mpsc;
use tokio::sync::Mutex;
use tracing_subscriber;

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
fn main() {
    run()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tracing_subscriber::fmt::init();

    let (async_proc_input_tx, async_proc_input_rx) = mpsc::channel(1);
    let (async_proc_output_tx, async_proc_output_rx) = mpsc::channel(1);
    let (serial_tx, serial_rx) = mpsc::channel(1);

    tauri::Builder::default()
        .manage(AsyncProcInputTx {
            inner: Mutex::new(async_proc_input_tx),
            serial_tx: Mutex::new(serial_tx.clone()),
            connected: Mutex::new(false),
            ssink: Mutex::new(None),
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            availableports,
            send_at_command,
            send_at_command_mock,
        ])
        .setup(|app| {
            let _ = setup_serial_async_task(
                app,
                async_proc_input_rx,
                async_proc_output_tx,
                async_proc_output_rx,
                serial_rx,
            );
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
