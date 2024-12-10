#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod modem;

use commands::greet::greet;
use commands::serial::availableports;

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
fn main() {
    run()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, availableports])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
