import { commandStore } from '../../Stores/Command';
import Kard from '../Card';

function DeviceStatus() {
    const deviceInfo = commandStore.deviceInfo;

    return (
        <div class='bg-base-200 flex-1 rounded-md'>
            <Kard title='Device Info'>
                <div class='stats stats-vertical shadow w-full h-full'>
                    <div class='stat'>
                        <div class='stat-title'>Manufacturer</div>
                        <div class='stat-value text-sm text-wrap'>
                            {deviceInfo.manufacturer}
                        </div>
                    </div>
                    <div class='stat'>
                        <div class='stat-title'>Model</div>
                        <div class='stat-value text-sm text-wrap'>
                            {deviceInfo.model}
                        </div>
                    </div>

                    <div class='stat'>
                        <div class='stat-title'>Revision</div>
                        <div class='stat-value text-sm text-wrap'>
                            {deviceInfo.revision}
                        </div>
                    </div>
                </div>
            </Kard>
        </div>
    );
}

export default DeviceStatus;
