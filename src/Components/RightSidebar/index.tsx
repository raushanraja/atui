/* eslint-disable @typescript-eslint/no-misused-promises */
import { createEffect, createSignal } from 'solid-js';
import { commandStore } from '../../Stores/Command';
import LogView from './LogView';
import CommandInput from './CommandInput';

enum Sender {
    'System',
    'User',
}

type Message = {
    message: string;
    sender: Sender;
};

function RightSidebar() {
    const [input, setInput] = createSignal('');
    const [messages, setMessage] = createSignal<Array<Message>>([]);

    createEffect(() => {
        setMessage((prev) => [
            ...prev,
            {
                message: input(),
                sender: Sender.User,
            },
        ]);
    });

    createEffect(() => {
        const length = commandStore.responses.length;
        const message = commandStore.responses?.[length - 1];
        if (message) {
            setMessage((prev) => [
                ...prev,
                {
                    message: message.message,
                    sender: Sender.System,
                },
            ]);
        }
    });

    return (
        <div class='col-span-3 p-4 flex flex-col gap-4 bg-base-200 max-h-full overflow-hidden'>
            <LogView messages={messages()} />
            <CommandInput setInput={setInput} />
        </div>
    );
}

export default RightSidebar;
