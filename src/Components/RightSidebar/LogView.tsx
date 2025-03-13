import { createEffect, onCleanup } from 'solid-js';

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

function System(message: Message) {
    return (
        <div class='chat chat-start mx-2'>
            <div class='chat-bubble'>
                {message.message.split('\r\n').map((str) => (
                    <p>{str}</p>
                ))}
            </div>
            <div class='chat-footer opacity-50'>System</div>
        </div>
    );
}

function User(message: Message) {
    return (
        <div class='chat chat-end mx-2'>
            <div class='chat-bubble'>
                {message.message.split('\r\n').map((str) => (
                    <p>{str}</p>
                ))}
            </div>
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
            class='flex-1 rounded-md bg-base-300 overflow-scroll 
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

export default LogView;
