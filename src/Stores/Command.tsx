import { createStore } from 'solid-js/store';

export type ATResponse = {
    message: string;
    id: string;
    cmdtype: string;
};

export type CommandStore = {
    commands: Array<ATResponse>;
    responses: Array<ATResponse>;
};

const [commandStore, setStore] = createStore<CommandStore>({
    commands: [],
    responses: [],
});

const addCommand = (command: ATResponse) => {
    setStore('commands', (prev: Array<ATResponse>) => [...prev, command]);
};

const removeCommand = (id: string) => {
    setStore('commands', (commands) => commands.filter((f) => f.id != id));
};

const addResponse = (command: ATResponse) => {
    setStore('responses', (resp: Array<ATResponse>) => [...resp, command]);
};

const removeResponse = (id: string) => {
    setStore('responses', (responses) => responses.filter((f) => f.id != id));
};

export { commandStore, addCommand, addResponse, removeCommand, removeResponse };
