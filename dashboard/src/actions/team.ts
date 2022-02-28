import { postApi, getApi, deleteApi, putApi } from '../api';
import * as types from '../constants/team';
import errors from '../errors';

export function teamLoadingRequest() {
    return {
        type: types.TEAM_LOADING_REQUEST,
    };
}

export function teamLoadingSuccess(team: $TSFixMe) {
    return {
        type: types.TEAM_LOADING_SUCCESS,
        payload: team,
    };
}

export function teamLoadingError(error: $TSFixMe) {
    return {
        type: types.TEAM_LOADING_FAILURE,
        payload: error,
    };
}

// Calls the API to load team.
export function teamLoading(projectId: $TSFixMe) {
    return function(dispatch: $TSFixMe) {
        const promise = getApi(`team/${projectId}`);
        dispatch(teamLoadingRequest());
        promise.then(
            function(response) {
                const team = response.data;
                dispatch(teamLoadingSuccess(team));
            },
            function(error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(teamLoadingError(errors(error)));
            }
        );

        return promise;
    };
}

export function subProjectTeamLoadingRequest() {
    return {
        type: types.TEAM_SUBPROJECT_LOADING_REQUEST,
    };
}

export function subProjectTeamLoadingSuccess(team: $TSFixMe) {
    return {
        type: types.TEAM_SUBPROJECT_LOADING_SUCCESS,
        payload: team,
    };
}

export function subProjectTeamLoadingError(error: $TSFixMe) {
    return {
        type: types.TEAM_SUBPROJECT_LOADING_FAILURE,
        payload: error,
    };
}
// Calls the API to load team.
export function subProjectTeamLoading(projectId: $TSFixMe) {
    return function(dispatch: $TSFixMe) {
        const promise = getApi(`team/${projectId}/teamMembers`);
        dispatch(subProjectTeamLoadingRequest());
        promise.then(
            function(response) {
                const team = response.data;
                dispatch(subProjectTeamLoadingSuccess(team));
            },
            function(error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(subProjectTeamLoadingError(errors(error)));
            }
        );

        return promise;
    };
}

// Team create
export function teamCreateRequest() {
    return {
        type: types.TEAM_CREATE_REQUEST,
    };
}

export function teamCreateSuccess(team: $TSFixMe) {
    return {
        type: types.TEAM_CREATE_SUCCESS,
        payload: team,
    };
}

export function teamCreateError(error: $TSFixMe) {
    return {
        type: types.TEAM_CREATE_FAILURE,
        payload: error,
    };
}

// Calls the API to create team members.
export function teamCreate(projectId: $TSFixMe, values: $TSFixMe) {
    return function(dispatch: $TSFixMe) {
        const promise = postApi(`team/${projectId}`, values);
        dispatch(teamCreateRequest());

        promise.then(
            function(response) {
                const team = response.data;
                dispatch(teamCreateSuccess(team));
            },
            function(error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(teamCreateError(errors(error)));
            }
        );

        return promise;
    };
}

export function teamDeleteRequest(id: $TSFixMe) {
    return {
        type: types.TEAM_DELETE_REQUEST,
        payload: id,
    };
}

export function teamDeleteSuccess(team: $TSFixMe) {
    return {
        type: types.TEAM_DELETE_SUCCESS,
        payload: team,
    };
}

export function teamDeleteError(error: $TSFixMe) {
    return {
        type: types.TEAM_DELETE_FAILURE,
        payload: error,
    };
}

export function teamDeleteReset() {
    return {
        type: types.TEAM_DELETE_RESET,
    };
}

export function resetTeamDelete() {
    return function(dispatch: $TSFixMe) {
        dispatch(teamDeleteReset());
    };
}

// Calls the API to delete team meber.
export function teamDelete(projectId: $TSFixMe, teamMemberId: $TSFixMe) {
    return function(dispatch: $TSFixMe) {
        const promise = deleteApi(`team/${projectId}/${teamMemberId}`, null);
        dispatch(teamDeleteRequest(teamMemberId));

        promise.then(
            function(response) {
                const team = response.data;
                dispatch(teamDeleteSuccess(team));
                return { team };
            },
            function(error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(teamDeleteError(errors(error)));
                return { error };
            }
        );

        return promise;
    };
}

export function teamMemberRequest(teamMemberId: $TSFixMe) {
    return {
        type: types.TEAM_MEMBER_REQUEST,
        payload: teamMemberId,
    };
}

export function teamMemberSuccess(teamMember: $TSFixMe) {
    return {
        type: types.TEAM_MEMBER_SUCCESS,
        payload: teamMember,
    };
}

export function teamMemberError(error: $TSFixMe) {
    return {
        type: types.TEAM_MEMBER_FAILURE,
        payload: error,
    };
}

// Calls the API to get team member.
export function getTeamMember(projectId: $TSFixMe, teamMemberId: $TSFixMe) {
    return function(dispatch: $TSFixMe) {
        const promise = getApi(`team/${projectId}/${teamMemberId}`);
        dispatch(teamMemberRequest(teamMemberId));

        promise.then(
            function(response) {
                dispatch(teamMemberSuccess(response.data));
            },
            function(error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(teamMemberError(errors(error)));
            }
        );

        return promise;
    };
}

export function teamUpdateRoleRequest(id: $TSFixMe) {
    return {
        type: types.TEAM_UPDATE_ROLE_REQUEST,
        payload: id,
    };
}

export function teamUpdateRoleSuccess(team: $TSFixMe) {
    return {
        type: types.TEAM_UPDATE_ROLE_SUCCESS,
        payload: team,
    };
}

export function teamUpdateRoleError(error: $TSFixMe) {
    return {
        type: types.TEAM_UPDATE_ROLE_FAILURE,
        payload: error,
    };
}

// Calls the API to update team member role.
export function teamUpdateRole(projectId: $TSFixMe, values: $TSFixMe) {
    return function(dispatch: $TSFixMe) {
        const promise = putApi(
            `team/${projectId}/${values.teamMemberId}/changerole`,
            values
        );
        dispatch(teamUpdateRoleRequest(values.teamMemberId));

        promise.then(
            function(response) {
                const team = response.data;
                dispatch(teamUpdateRoleSuccess(team));
            },
            function(error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(teamUpdateRoleError(errors(error)));
            }
        );

        return promise;
    };
}

// Implements pagination for Team Members table
export function paginateNext(Id: $TSFixMe) {
    return {
        type: types.PAGINATE_NEXT,
        payload: Id,
    };
}

export function paginatePrev(Id: $TSFixMe) {
    return {
        type: types.PAGINATE_PREV,
        payload: Id,
    };
}

export function paginateReset() {
    return {
        type: types.PAGINATE_RESET,
    };
}

export function paginate(type: $TSFixMe, Id: $TSFixMe) {
    return function(dispatch: $TSFixMe) {
        type === 'next' && dispatch(paginateNext(Id));
        type === 'prev' && dispatch(paginatePrev(Id));
        type === 'reset' && dispatch(paginateReset());
    };
}