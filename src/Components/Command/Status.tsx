import { StatusControlCommands } from '../../Commands/status.json';
import { send_command } from '../../Hooks/Command';

// Define the type for a single command
export interface StatusControlCommand {
    Command: string; // The command string, e.g., "AT+CPAS"
    Description: string; // A description of what the command does
    Read: boolean; // Indicates whether the command reads information (true) or sets configuration (false)
}

const commands: StatusControlCommand[] = StatusControlCommands;

const StatusCommand = () => {
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
                    {commands.map((command) => {
                        return (
                            <tr>
                                <td class='font-bold font-mono'>
                                    {command.Command}
                                </td>
                                <td>{command.Description}</td>
                                <td>
                                    <button
                                        class='btn btn-md'
                                        disabled={!command.Read}
                                        onClick={() => {
                                            send_command(
                                                command.Command + '\r'
                                            );
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

export { StatusCommand };
