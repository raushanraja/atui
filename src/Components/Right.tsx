import { createEffect, createSignal, onCleanup, Setter } from 'solid-js';
import { IoSendOutline } from 'solid-icons/io';

enum Sender {
    'System',
    'User',
}

type Message = {
    message: string;
    sender: Sender;
};

type MessageProps = {
    messages?: Array<Message>;
};

type CommandInputPorps = {
    setInput: Setter<string>;
};

function System(message: Message) {
    return (
        <div class='chat chat-start mx-2'>
            <div class='chat-bubble'>{message.message}</div>
            <div class='chat-footer opacity-50'>System</div>
        </div>
    );
}

function User(message: Message) {
    return (
        <div class='chat chat-end mx-2'>
            <div class='chat-bubble'>{message.message}</div>
            <div class='chat-footer opacity-50'>User</div>
        </div>
    );
}

function LogView(props: MessageProps) {
    let containerRef: HTMLDivElement | undefined;
    let prev = 0;
    createEffect(() => {
        const interval = setInterval(() => {
            if (containerRef) {
                const current = containerRef.scrollHeight;
                if (current > prev) {
                    prev = current;
                    containerRef.scrollTop = prev;
                }
            }
        }, 300);
        onCleanup(() => clearInterval(interval));
    });

    return (
        <div
            ref={containerRef}
            class='row-span-9 rounded-md bg-base-300 overflow-scroll 
            px-4 py-2 scroll-m-3 scroll-smooth snap-y snap-end'>
            {props?.messages?.map((message) => {
                if (!message.message) {
                    return;
                }
                if (message.sender === Sender.System) {
                    return System(message);
                } else {
                    return User(message);
                }
            })}
        </div>
    );
}

function CommandInput(props: CommandInputPorps) {
    const handleChange = (e: Event) => {
        e.preventDefault();
        const htmlformelement = e.target as HTMLFormElement;
        const formdata = new FormData(htmlformelement);
        const atcommand = formdata.get('atcommand') as string;
        if (atcommand) {
            props.setInput(atcommand);
        }
        htmlformelement.reset();
    };

    return (
        <div class='row-span-3 p-4 grid gap-4 bg-base-300'>
            <form onSubmit={handleChange}>
                <label class='input input-bordered flex items-center gap-2 mb-4 w-full'>
                    <input
                        type='text'
                        name='atcommand'
                        placeholder='Type here'
                        class='grow'
                    />
                    <IoSendOutline size={24} />
                </label>
                <button type='submit' class='btn btn-primary w-full'>
                    Send Command
                </button>
            </form>
        </div>
    );
}

function Right() {
    const [input, setInput] = createSignal('');
    const [messages, setMessage] = createSignal<Array<Message>>([
        {
            message: 'AT\n',
            sender: Sender.User,
        },
        {
            message: 'OK\n',
            sender: Sender.System,
        },
    ]);

    createEffect(() => {
        setMessage((prev) => [
            ...prev,
            {
                message: input(),
                sender: Sender.User,
            },
        ]);
    });

    return (
        <div class='col-span-3 p-4 grid grid-rows-12 gap-4 bg-base-200 max-h-full overflow-hidden'>
            <LogView messages={messages()} />
            <CommandInput setInput={setInput} />
        </div>
    );
}

export default Right;
