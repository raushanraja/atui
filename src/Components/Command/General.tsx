import { GeneralCommands } from '../../Commands/general.json';
import { send_command } from '../../Hooks/Command';

// types/CommandTypes.ts
export interface Command {
    Description: string;
    Read: boolean; // Make 'Read' optional
}

export interface GeneralCommandsType {
    [key: string]: Command;
}

const typedGeneralCommands: GeneralCommandsType = GeneralCommands;

const GeneralCommand = () => {
    return (
        <div class='overflow-x-auto overflow-y-scroll h-full mt-4 pb-8'>
            <table class='table table-pin-rows'>
                <thead>
                    <tr>
                        <th>Command</th>
                        <th>Description</th>
                        <th>RUN</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(typedGeneralCommands).map((key) => {
                        return (
                            <tr>
                                <td class='font-bold font-mono'>{key}</td>
                                <td>
                                    {typedGeneralCommands[key]['Description']}
                                </td>
                                <td>
                                    <button
                                        class='btn btn-md'
                                        disabled={
                                            !typedGeneralCommands[key]['Read']
                                        }
                                        onClick={() => {
                                            send_command(key + '\r');
                                        }}>
                                        RUN
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export { GeneralCommand };
