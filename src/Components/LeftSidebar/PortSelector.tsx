import { createEffect, createSignal, Setter } from 'solid-js';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import toast from 'solid-toast';
import Kard from '../Card';
import {
    deviceStatusStore,
    setDeviceStatusStore,
    updateConnected,
    updatePort,
} from '../../Stores/DeviceStatus';
import { send_command } from '../../Hooks/Command';

async function getAvailablePorts(setAvailablePorts: Setter<Array<string>>) {
    const ports: Array<string> = await invoke('availableports', {});
    setAvailablePorts(ports);
}

async function connect(port: string) {
    try {
        await send_command(port, 'INIT');
    } catch (e) {
        toast.error(e as string, { duration: 5000 });
    }
}

async function disconnect(port: string) {
    setDeviceStatusStore({
        connected: false,
        initialized: false,
        port: deviceStatusStore.port,
    });
    await send_command(port, 'DINIT');
}

async function at() {
    await send_command('AT\r');
}

function PortSelector() {
    const [ports, setAvailablePorts] = createSignal<Array<string>>([]);
    const [selectedport, setSelectedPort] = createSignal(-1);
    const [connected, setConnected] = createSignal<boolean>(false);

    const handleConnect = () => {
        connect(ports()[selectedport()]);
    };
    const handleDisconnect = () => {
        disconnect(ports()[selectedport()]);
    };

    const handleATClick = () => {
        at();
    };

    const handlePortSelect = (e: Event & { target: HTMLSelectElement }) => {
        const port = parseInt(e.target.value);
        updatePort(ports()[port]);
        setSelectedPort(port);
    };

    createEffect(() => {
        getAvailablePorts(setAvailablePorts);
        listen('ATConnect', (event) => {
            const connected_status = event.payload as boolean;
            updateConnected(connected_status);
            setConnected(connected_status);
            const interval = setInterval(() => {
                if (
                    deviceStatusStore.connected &&
                    deviceStatusStore.initialized
                ) {
                    clearInterval(interval);
                } else {
                    send_command('ATI\r', 'CMD', true);
                }
            }, 2000);
        });
    });

    const title =
        'Port Selection: ' + connected() ? 'Connected' : 'Disconnected';

    return (
        <div class='bg-base-200 flex-1 rounded-md'>
            <Kard title={title}>
                <select
                    class='select select-bordered w-full'
                    onchange={handlePortSelect}>
                    <option disabled selected>
                        Select a port to Connect
                    </option>
                    {ports().map((p, index) => {
                        return <option value={index}>{p}</option>;
                    })}
                </select>
                <div class='flex justify-between gap-2 my-4'>
                    <button
                        disabled={selectedport() < 0}
                        class='btn btn-success flex-1'
                        onClick={handleConnect}>
                        Connect
                    </button>
                    <button
                        disabled={!connected()}
                        class='btn btn-error flex-1'
                        onClick={handleDisconnect}>
                        Disconnect
                    </button>
                </div>
                <button
                    disabled={!connected()}
                    onClick={handleATClick}
                    class='btn btn-error flex-1 w-full'>
                    AT Test Command
                </button>
            </Kard>
        </div>
    );
}

export default PortSelector;
