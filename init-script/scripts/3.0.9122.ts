import { find, update } from '../util/db';

const incomingRequestCollection = 'incomingrequests';

// run this script once
async function run() {
    const incomingRequests = await find(incomingRequestCollection, {
        deleted: false,
        selectAllMonitors: { $exists: false },
    });

    for (const incomingRequest of incomingRequests) {
        const data = {
            selectAllMonitors: incomingRequest.isDefault,
        };

        await update(
            incomingRequestCollection,
            { _id: incomingRequest._id },
            data
        );
    }

    return `Script ran for ${incomingRequests.length} incoming requests`;
}

export default run;