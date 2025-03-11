import { v7 } from 'uuid';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import {
    addCommand,
    addResponse,
    ATResponse,
    getLastCommand,
    removeLastCommand,
    setDeviceInfo,
} from '../Stores/Command';
import { parseATI } from '../Utils/Parsers/ATI';
import { DEBUG } from '../Utils/Constants';
import { deviceStatusStore, updatedInit } from '../Stores/DeviceStatus';
import toast from 'solid-toast';

let started_listening = false;
export async function send_command(
    message: string,
    type: string = 'CMD',
    should_parse: boolean = false
) {
    if (DEBUG) {
        await send_command_mock(message);
        return;
    }

    console.log('Message:', message);

    if (
        message == 'ATI\r' ||
        type == 'INIT' ||
        message == 'AT\r' ||
        deviceStatusStore.initialized
    ) {
        const command = {
            message: message,
            id: v7(),
            cmdtype: type,
            should_parse,
        };
        removeLastCommand();
        addCommand(command);
        await invoke('send_at_command', { command: command });
    } else {
        toast.error('Device not initialized', { duration: 5000 });
    }
}

export async function send_command_mock(message: string) {
    const command = {
        message: message,
        id: v7(),
        cmdtype: 'CMD',
        should_parse: true,
    };
    removeLastCommand();
    addCommand(command);
    await invoke('send_at_command_mock', { command: message });
}

export async function at_response_listener() {
    if (!started_listening || DEBUG) {
        started_listening = true;
        await listen('atresponse', (event) => {
            const response = JSON.parse(event.payload as string) as ATResponse;
            if (response.cmdtype == 'RESPONSE') {
                const lastCommand = getLastCommand();
                if (lastCommand) {
                    if (
                        lastCommand.should_parse ||
                        lastCommand.message.includes('ATI')
                    ) {
                        if (lastCommand.message.includes('ATI')) {
                            console.log('ATI Response  Should parse');
                            updatedInit(true);
                            setDeviceInfo(parseATI(response));
                        }
                    }
                }
                addResponse(response);
            }
        });
    }
}
