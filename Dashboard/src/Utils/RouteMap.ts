import Route from 'Common/Types/API/Route';
import Dictionary from 'Common/Types/Dictionary';
import PageMap from './PageMap';
import RouteParams from './RouteParams';

const RouteMap: Dictionary<Route> = {
    [PageMap.INIT]: new Route(`/dashboard`),
    [PageMap.HOME]: new Route(`/dashboard/${RouteParams.ProjectID}/home/`),
    [PageMap.INCIDENTS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/incidents/`
    ),
    [PageMap.STATUS_PAGE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/status-pages/`
    ),
    [PageMap.LOGS]: new Route(`/dashboard/${RouteParams.ProjectID}/logs/`),

    [PageMap.MONITORS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/monitors/`
    ),
    [PageMap.AUTOMATION_SCRIPTS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/automation-scripts/`
    ),
    [PageMap.ON_CALL]: new Route(
        `/dashboard/${RouteParams.ProjectID}/on-call/`
    ),
    [PageMap.REPORTS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/reports/`
    ),
    [PageMap.ERROR_TRACKER]: new Route(
        `/dashboard/${RouteParams.ProjectID}/error-tracker/`
    ),

    // Settings Routes
    [PageMap.SETTINGS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/`
    ),
    [PageMap.SETTINGS_DANGERZONE]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/danger-zone`
    ),

    //api keys.
    [PageMap.SETTINGS_APIKEYS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/api-keys`
    ),
    [PageMap.SETTINGS_CREATE_APIKEY]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/api-keys/create`
    ),

    // labels.
    [PageMap.SETTINGS_LABELS]: new Route(
        `/dashboard/${RouteParams.ProjectID}/settings/labels`
    ),

    // logout.
    [PageMap.LOGOUT]: new Route(`/dashboard/logout`),
};

export default RouteMap;
