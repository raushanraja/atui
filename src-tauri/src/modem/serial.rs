use bytes::BytesMut;
use futures::{
    stream::{SplitSink, SplitStream},
    StreamExt,
};
use tokio_serial::{available_ports, SerialStream};
use tokio_util::codec::{Decoder, Encoder, Framed};
use tracing::info;

use crate::commands::serial::{AtCommand, CMDType};

pub struct LineCodec;

impl Decoder for LineCodec {
    type Item = String;
    type Error = std::io::Error;

    fn decode(&mut self, src: &mut BytesMut) -> Result<Option<Self::Item>, Self::Error> {
        // Sample Data: <CR><LF><response><CR><LF>
        if src.is_empty() {
            return Ok(None);
        }
        // Parse the buffer
        if let Ok(data) = std::str::from_utf8(src.split_to(src.len()).as_ref()) {
            return Ok(Some(data.trim().to_string()));
        } else {
            return Ok(None);
        }
    }
}

impl Encoder<String> for LineCodec {
    type Error = std::io::Error;
    fn encode(&mut self, item: String, dst: &mut BytesMut) -> Result<(), Self::Error> {
        if item.trim().len() > 0 {
            dst.extend_from_slice(item.as_bytes());
            dst.extend_from_slice(b"\r");
        } else {
            Err(std::io::Error::new(
                std::io::ErrorKind::InvalidData,
                "Empty String",
            ))?;
        }
        Ok(())
    }
}

pub fn get_available_ports() -> Vec<String> {
    if let Ok(ports) = available_ports() {
        return ports
            .into_iter()
            .map(|p| p.port_name)
            .collect::<Vec<String>>();
    }
    Vec::new()
}

pub async fn split_serial(
    serial: SerialStream,
) -> (
    SplitSink<Framed<SerialStream, LineCodec>, String>,
    SplitStream<Framed<SerialStream, LineCodec>>,
) {
    let framed = LineCodec.framed(serial);
    framed.split()
}

pub async fn serial_read_task(
    mut reader: SplitStream<Framed<SerialStream, LineCodec>>,
    serial_tx: tokio::sync::mpsc::Sender<AtCommand>,
) {
    info!("Starting Read:");
    while let Some(line) = reader.next().await {
        match line {
            Ok(line) => {
                let _ = serial_tx
                    .send(AtCommand::new_with_string(
                        line.clone(),
                        None,
                        CMDType::RESPONSE,
                    ))
                    .await;
                info!("Received: {}", line)
            }
            Err(e) => println!("Error: {:?}", e),
        }
    }

    info!("Exiting, closed");
}
