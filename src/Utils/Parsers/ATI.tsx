// ATI Parser,
// This parser is used to parse the ATI data from the AT Command

import { ATResponse } from '../../Stores/Command';

export interface ATI {
    manufacturer: string;
    model: string;
    revision: string;
}

export function parseATI(response: ATResponse): ATI {
    const data = response.message.split('\n');
    console.log('ATI Data:', data);

    if (data.length < 3) {
        console.error('Invalid ATI Response data');
        return {
            manufacturer: '',
            model: '',
            revision: '',
        };
    }

    const manufacturer = data[0].trim();
    const model = data[1].trim();
    const revision = data[2]
        .replace(/[rR]evision/, '')
        .replace(':', '')
        .trim();

    const result: ATI = {
        manufacturer,
        model,
        revision,
    };
    console.log('ATI Data:', result);
    return result;
}
