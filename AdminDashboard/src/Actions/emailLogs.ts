import BackendAPI from 'CommonUI/src/utils/api/backend';
import { Dispatch } from 'redux';
import * as types from '../constants/emailLogs';
import Route from 'Common/Types/api/route';
import PositiveNumber from 'Common/Types/PositiveNumber';

// Fetch All Email Logs
export const fetchEmailLogsRequest = (): void => {
    return {
        type: types.FETCH_EMAILLOGS_REQUEST,
    };
};

export const fetchEmailLogsSuccess = (emailLogs: $TSFixMe): void => {
    return {
        type: types.FETCH_EMAILLOGS_SUCCESS,
        payload: emailLogs,
    };
};

export const fetchEmailLogsError = (error: $TSFixMe): void => {
    return {
        type: types.FETCH_EMAILLOGS_FAILURE,
        payload: error,
    };
};

export const fetchEmailLogs =
    (skip: PositiveNumber, limit: PositiveNumber) =>
    async (dispatch: Dispatch) => {
        skip = skip ? parseInt(skip) : 0;
        limit = limit ? parseInt(limit) : 10;

        dispatch(fetchEmailLogsRequest());

        try {
            const response = await BackendAPI.get(
                `email-logs?skip=${skip}&limit=${limit}`
            );

            const data = response.data;

            dispatch(fetchEmailLogsSuccess(data));

            return response;
        } catch (error) {
            let errorMsg;
            if (error && error.response && error.response.data)
                errorMsg = error.response.data;
            if (error && error.data) {
                errorMsg = error.data;
            }
            if (error && error.message) {
                errorMsg = error.message;
            } else {
                errorMsg = 'Network Error';
            }
            dispatch(fetchEmailLogsError(errorMsg));
        }
    };

// Search Email Logs.
export const searchEmailLogsRequest = (): void => {
    return {
        type: types.SEARCH_EMAILLOGS_REQUEST,
    };
};

export const searchEmailLogsSuccess = (emailLogs: $TSFixMe): void => {
    return {
        type: types.SEARCH_EMAILLOGS_SUCCESS,
        payload: emailLogs,
    };
};

export const searchEmailLogsError = (error: $TSFixMe): void => {
    return {
        type: types.SEARCH_EMAILLOGS_FAILURE,
        payload: error,
    };
};

export const searchEmailLogs =
    (filter: $TSFixMe, skip: PositiveNumber, limit: PositiveNumber) =>
    async (dispatch: Dispatch) => {
        const values = {
            filter,
        };

        dispatch(searchEmailLogsRequest());

        try {
            const response = await BackendAPI.post(
                `email-logs/search?skip=${skip}&limit=${limit}`,
                values
            );

            const data = response.data;

            dispatch(searchEmailLogsSuccess(data));
            return response;
        } catch (error) {
            let errorMsg;
            if (error && error.response && error.response.data)
                errorMsg = error.response.data;
            if (error && error.data) {
                errorMsg = error.data;
            }
            if (error && error.message) {
                errorMsg = error.message;
            } else {
                errorMsg = 'Network Error';
            }
            dispatch(searchEmailLogsError(errorMsg));
        }
    };

// Delete All Email Logs
export const deleteEmailLogsRequest = (): void => {
    return {
        type: types.DELETE_ALL_EMAILLOGS_REQUEST,
    };
};

export const deleteEmailLogsSuccess = (message: $TSFixMe): void => {
    return {
        type: types.DELETE_ALL_EMAILLOGS_SUCCESS,
        payload: message,
    };
};

export const deleteEmailLogsError = (error: $TSFixMe): void => {
    return {
        type: types.DELETE_ALL_EMAILLOGS_FAILURE,
        payload: error,
    };
};

export const deleteEmailLogs =
    () =>
    async (dispatch: Dispatch): void => {
        dispatch(deleteEmailLogsRequest());

        try {
            const response = await delete `email-logs`;

            const message = response.data.message;

            dispatch(deleteEmailLogsSuccess(message));
        } catch (error) {
            let errorMsg;
            if (error && error.response && error.response.data)
                errorMsg = error.response.data;
            if (error && error.data) {
                errorMsg = error.data;
            }
            if (error && error.message) {
                errorMsg = error.message;
            } else {
                errorMsg = 'Network Error';
            }
            dispatch(deleteEmailLogsError(errorMsg));
        }
    };

// fetch emailLogStatus

export const fetchEmailLogStatusRequest = (promise: $TSFixMe): void => {
    return {
        type: types.FETCH_EMAILLOG_STATUS_REQUEST,
        payload: promise,
    };
};

export const fetchEmailLogStatusError = (error: $TSFixMe): void => {
    return {
        type: types.FETCH_EMAILLOG_STATUS_FAILED,
        payload: error,
    };
};

export const fetchEmailLogStatusSuccess = (emailLogStatus: $TSFixMe): void => {
    return {
        type: types.FETCH_EMAILLOG_STATUS_SUCCESS,
        payload: emailLogStatus,
    };
};

export const resetFetchEmailLogStatus = (): void => {
    return {
        type: types.FETCH_EMAILLOG_STATUS_RESET,
    };
};

// Calls the API to fetch emailLogStatus
export const fetchEmailLogStatus =
    () =>
    async (dispatch: Dispatch): void => {
        dispatch(fetchEmailLogStatusRequest());

        try {
            const response = await BackendAPI.get(
                'globalConfig/emailLogMonitoringStatus'
            );

            dispatch(fetchEmailLogStatusSuccess(response.data));
            return response;
        } catch (error) {
            let errorMsg;
            if (error && error.response && error.response.data)
                errorMsg = error.response.data;
            if (error && error.data) {
                errorMsg = error.data;
            }
            if (error && error.message) {
                errorMsg = error.message;
            } else {
                errorMsg = 'Network Error';
            }
            dispatch(fetchEmailLogStatusError(errorMsg));
            return 'error';
        }
    };

// change emailLogStatus

export const changeEmailLogStatusRequest = (promise: $TSFixMe): void => {
    return {
        type: types.CHANGE_EMAILLOG_STATUS_REQUEST,
        payload: promise,
    };
};

export const changeEmailLogStatusError = (error: $TSFixMe): void => {
    return {
        type: types.CHANGE_EMAILLOG_STATUS_FAILED,
        payload: error,
    };
};

export const changeEmailLogStatusSuccess = (emailLogStatus: $TSFixMe): void => {
    return {
        type: types.CHANGE_EMAILLOG_STATUS_SUCCESS,
        payload: emailLogStatus,
    };
};

export const resetConfirmEmailLogStatus = (): void => {
    return {
        type: types.CHANGE_EMAILLOG_STATUS_RESET,
    };
};

// Calls the API to change emailLogStatus
export const emailLogStatusChange =
    (values: $TSFixMe) => async (dispatch: Dispatch) => {
        dispatch(changeEmailLogStatusRequest());

        try {
            const response = await BackendAPI.post(new Route('globalConfig/'), [
                { name: 'emailLogMonitoringStatus', value: values.status },
            ]);

            const data = response.data;
            dispatch(changeEmailLogStatusSuccess(data));
            return data;
        } catch (error) {
            let errorMsg;
            if (error && error.response && error.response.data)
                errorMsg = error.response.data;
            if (error && error.data) {
                errorMsg = error.data;
            }
            if (error && error.message) {
                errorMsg = error.message;
            } else {
                errorMsg = 'Network Error';
            }
            dispatch(changeEmailLogStatusError(errorMsg));
            return 'error';
        }
    };