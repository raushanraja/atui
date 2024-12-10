import { v7 } from 'uuid';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { addCommand, addResponse, ATResponse } from '../Stores/Command';

let started_listening = false;
export async function send_command(message: string, type: string = 'CMD') {
    const command = {
        message: message,
        id: v7(),
        cmdtype: type,
    };
    addCommand(command);
    await invoke('send_at_command', { command: command });
}

export async function at_response_listener() {
    if (!started_listening) {
        started_listening = true;
        await listen('atresponse', (event) => {
            const response = JSON.parse(event.payload as string) as ATResponse;
            console.log(response);
            addResponse(response);
        });
    }
}
