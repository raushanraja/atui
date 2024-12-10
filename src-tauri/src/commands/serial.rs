#[tauri::command]
pub fn availableports() -> Vec<String> {
    let ports = crate::modem::serial::get_available_ports();
    println!("available_ports: {:?}", ports);
    return ports;
}
