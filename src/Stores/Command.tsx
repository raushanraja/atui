import { createStore } from 'solid-js/store';
import { ATI } from '../Utils/Parsers/ATI';

export type ATResponse = {
    message: string;
    id: string;
    cmdtype: string;
};
export type ATCommand = ATResponse & {
    should_parse: boolean;
};

export type CommandStore = {
    commands: Array<ATCommand>;
    responses: Array<ATResponse>;
    deviceInfo: ATI;
};

const [commandStore, setStore] = createStore<CommandStore>({
    commands: [],
    responses: [],
    deviceInfo: {
        manufacturer: '',
        model: '',
        revision: '',
    },
});

const addCommand = (command: ATCommand) => {
    setStore('commands', (prev: Array<ATCommand>) => [...prev, command]);
};

const removeCommand = (id: string) => {
    setStore('commands', (commands) => commands.filter((f) => f.id != id));
};

const removeLastCommand = () => {
    if (commandStore.commands.length == 0) return;
    setStore('commands', (commands) => commands.slice(0, -1));
};

const getLastCommand = () => {
    if (commandStore.commands.length == 0) return;
    return commandStore.commands[commandStore.commands.length - 1];
};

const addResponse = (command: ATResponse) => {
    setStore('responses', (resp: Array<ATResponse>) => [...resp, command]);
};

const removeResponse = (id: string) => {
    setStore('responses', (responses) => responses.filter((f) => f.id != id));
};

const setDeviceInfo = (info: ATI) => {
    setStore('deviceInfo', info);
};

export {
    commandStore,
    addCommand,
    addResponse,
    removeCommand,
    removeResponse,
    removeLastCommand,
    getLastCommand,
    setDeviceInfo,
};
