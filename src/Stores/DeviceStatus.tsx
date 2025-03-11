import { createStore } from 'solid-js/store';
export type DeviceStatus = {
    port: string;
    initialized: boolean;
    connected: boolean;
};

export type DeviceStatusStore = {
    port: string;
    initialized: boolean;
    connected: boolean;
};

const [deviceStatusStore, setDeviceStatusStore] =
    createStore<DeviceStatusStore>({
        port: '',
        initialized: false,
        connected: false,
    });

const updatedInit = (initialized: boolean) => {
    setDeviceStatusStore('initialized', initialized);
};

const updateConnected = (connected: boolean) => {
    setDeviceStatusStore('connected', connected);
};

const updatePort = (port: string) => {
    setDeviceStatusStore('port', port);
};

export {
    deviceStatusStore,
    setDeviceStatusStore,
    updatedInit,
    updateConnected,
    updatePort,
};
