use tauri::Emitter;
use tracing::info;

use crate::commands::serial::AtCommand;

#[tauri::command]
pub async fn send_at_command_mock(command: String, app: tauri::AppHandle) -> Result<(), String> {
    info!("Mocking AT command: {}", command);
    match command.as_str() {
        "ATI\r" | "ATI" => {
            info!("Mocking AT command: ATI matched");
            let resp_string =
                "Sierra Wireless, Incorporated\r\nMC7455\r\nSWI9X30C_02.33.03.00\r\nOK\r\n";
            let response = AtCommand::new_with_string(
                resp_string.to_string(),
                None,
                crate::commands::serial::CMDType::RESPONSE,
            );
            let response = serde_json::to_string(&response).unwrap();
            app.emit("atresponse", response).unwrap();
        }
        _ => {
            info!("Mocking AT command: {}, didn't match on handler", command);
        }
    }

    Ok(())
}
