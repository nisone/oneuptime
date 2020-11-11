import React from 'react';
import { connect } from 'react-redux';
import ErrorTrackerDetail from './ErrorTrackerDetail';

export function ErrorTrackerList(props) {
    let errorTrackerDetails = null;

    if (props.errorTrackers && props.errorTrackers.length > 0) {
        errorTrackerDetails = props.errorTrackers.map((errorTracker, i) => (
            <div id={`errorTracker${i}`} key={errorTracker._id}>
                <ErrorTrackerDetail
                    componentId={props.componentId}
                    index={errorTracker._id}
                    key={errorTracker._id}
                />
            </div>
        ));
    }

    return errorTrackerDetails;
}

ErrorTrackerList.displayName = 'ErrorTrackerList';

const mapStateToProps = state => ({
    currentProject: state.project.currentProject,
});

export default connect(mapStateToProps)(ErrorTrackerList);