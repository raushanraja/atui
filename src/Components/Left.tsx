import { JSXElement } from 'solid-js';
import { ThemeSelector } from './Theme';

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
    return (
        <div class='bg-base-200 flex-1 rounded-md'>
            <Kard title='Port Selection : Disconnected'>
                <select class='select select-bordered w-full'>
                    <option disabled selected>
                        Select a port to Connect
                    </option>
                    <option>Han Solo</option>
                    <option>Greedo</option>
                </select>
                <div class='flex justify-between gap-2 mt-4'>
                    <button class='btn btn-success flex-1'>Connect</button>
                    <button class='btn btn-error flex-1'>Disconnect</button>
                </div>
            </Kard>
        </div>
    );
}

function DeviceStatus() {
    return (
        <div class='bg-base-200 flex-1 rounded-md'>
            <Kard title='Device Status'>
                <div> Hello </div>
            </Kard>
        </div>
    );
}

function NetworkInfo() {
    return (
        <div class='bg-base-200 flex-1 rounded-md'>
            <Kard title='Network Status'>
                <div> Hello </div>
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
