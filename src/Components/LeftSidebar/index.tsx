import { ThemeSelector } from '../Theme';
import PortSelector from './PortSelector';
import DeviceStatus from './DeviceStatus';
import NetworkInfo from './NetworkStatus';

function LeftSidebar() {
    return (
        <div class='col-span-2 bg-opacity-45 p-4 flex flex-col gap-4 bg-base-200'>
            <ThemeSelector />
            <PortSelector />
            <DeviceStatus />
            <NetworkInfo />
        </div>
    );
}

export default LeftSidebar;
