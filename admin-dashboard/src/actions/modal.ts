import * as types from '../constants/modal';

export const openModal = (obj: $TSFixMe) => {
    return {
        type: types.OPEN_MODAL,
        payload: obj,
    };
};
export const closeModal = (obj: $TSFixMe) => {
    return {
        type: types.CLOSE_MODAL,
        payload: obj,
    };
};