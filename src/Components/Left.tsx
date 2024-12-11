/* eslint-disable @typescript-eslint/no-misused-promises */
import { createEffect, createSignal, JSXElement } from 'solid-js';
import { ThemeSelector } from './Theme';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { send_command } from '../Hooks/Command';

type KardProps = { title: string } & {
    children: JSXElement;
};

function Kard(props: KardProps) {
    return (
        <div class='h-full p-2 bg-base-300'>
            <div class='prose font-semibold mb-4'>{props.title}</div>
            <div class='h-[calc(100%-3rem)]'>{props.children}</div>
        </div>
    );
}

function PortSelector() {
    const [ports, setAvailablePorts] = createSignal<Array<string>>([]);
    const [selectedport, setSelectedPort] = createSignal(-1);

    const [connected, setConnected] = createSignal<boolean>(false);

    async function getAvailablePorts() {
        const ports: Array<string> = await invoke('availableports', {});
        setAvailablePorts(ports);
    }

    async function connect() {
        await send_command(ports()[selectedport()], 'INIT');
    }

    async function disconnect() {
        await send_command(ports()[selectedport()], 'DINIT');
    }

    async function at() {
        await send_command('AT\r');
    }

    createEffect(() => {
        getAvailablePorts();
        listen('ATConnect', (event) => {
            setConnected(event.payload as boolean);
        });
    });

    return (
        <div class='bg-base-200 flex-1 rounded-md'>
            <Kard title='Port Selection : Disconnected'>
                <select
                    class='select select-bordered w-full'
                    onchange={(e) => setSelectedPort(parseInt(e.target.value))}>
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
                        onClick={connect}>
                        Connect
                    </button>

                    <button
                        disabled={!connected()}
                        class='btn btn-error flex-1'
                        onClick={disconnect}>
                        Disconnect
                    </button>
                </div>
                <button
                    disabled={!connected()}
                    onClick={at}
                    class='btn btn-error flex-1 w-full'>
                    AT Test Command
                </button>
            </Kard>
        </div>
    );
}

function DeviceStatus() {
    return (
        <div class='bg-base-200 flex-1 rounded-md'>
            <Kard title='Device Status'>
                <div> TODO </div>
            </Kard>
        </div>
    );
}

function NetworkInfo() {
    return (
        <div class='bg-base-200 flex-1 rounded-md'>
            <Kard title='Network Status'>
                <div> TODO </div>
            </Kard>
        </div>
    );
}

function Left() {
    return (
        <div class='col-span-2 bg-opacity-45 p-4 flex flex-col gap-4 bg-base-200'>
            <ThemeSelector />
            <PortSelector />
            <DeviceStatus />
            <NetworkInfo />
        </div>
    );
}

export default Left;
