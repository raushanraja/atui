import { IoSendOutline } from 'solid-icons/io';
import { Setter } from 'solid-js';
import { send_command } from '../../Hooks/Command';

type CommandInputPorps = {
    setInput: Setter<string>;
};

function CommandInput(props: CommandInputPorps) {
    const handleChange = async (e: Event) => {
        e.preventDefault();
        const htmlformelement = e.target as HTMLFormElement;
        const formdata = new FormData(htmlformelement);
        const atcommand = formdata.get('atcommand') as string;
        if (atcommand) {
            props.setInput(atcommand);
            await send_command(atcommand + '\r');
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

export default CommandInput;
