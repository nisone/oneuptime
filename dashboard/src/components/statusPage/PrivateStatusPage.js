import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import {
    updatePrivateStatusPage,
    updatePrivateStatusPageRequest,
    updatePrivateStatusPageSuccess,
    updatePrivateStatusPageError,
    fetchProjectStatusPage,
} from '../../actions/statusPage';
import { FormLoader } from '../basic/Loader';
import ShouldRender from '../basic/ShouldRender';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { openModal } from '../../actions/modal';
import DataPathHoC from '../DataPathHoC';
import SubscriberAdvanceOptions from '../modals/SubscriberAdvanceOptions';
import { logEvent } from '../../analytics';
import { SHOULD_LOG_ANALYTICS } from '../../config';
import PricingPlan from '../basic/PricingPlan';

export class PrivateStatusPage extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            subscriberAdvanceOptionModalId: uuid.v4(),
            showMoreOptions: false,
        };
    }

    submitForm = values => {
        const { status } = this.props.statusPage;
        const { projectId } = status;

        this.props
            .updatePrivateStatusPage(projectId._id || projectId, {
                _id: status._id,
                isPrivate: values.isPrivate,
                isSubscriberEnabled: values.isSubscriberEnabled,
                isGroupedByMonitorCategory: values.isGroupedByMonitorCategory,
                showScheduledEvents: values.showScheduledEvents,
                moveIncidentToTheTop: values.moveIncidentToTheTop,
            })
            .then(() => {
                this.props.fetchProjectStatusPage(projectId, true);
            });
        if (SHOULD_LOG_ANALYTICS) {
            logEvent(
                'EVENT: DASHBOARD > PROJECT > STATUS PAGES > STATUS PAGE > PRIVATE STATUS PAGE UPDATED'
            );
        }
    };

    showMoreOptionsToggle = () =>
        this.setState(prevState => ({
            showMoreOptions: !prevState.showMoreOptions,
        }));

    render() {
        const { handleSubmit } = this.props;
        const { subscriberAdvanceOptionModalId, showMoreOptions } = this.state;
        return (
            <div className="bs-ContentSection Card-root Card-shadow--medium">
                <div className="Box-root">
                    <div className="bs-ContentSection-content Box-root Box-divider--surface-bottom-1 Flex-flex Flex-alignItems--center Flex-justifyContent--spaceBetween Padding-horizontal--20 Padding-vertical--16">
                        <div className="Box-root">
                            <span className="Text-color--inherit Text-display--inline Text-fontSize--16 Text-fontWeight--medium Text-lineHeight--24 Text-typeface--base Text-wrap--wrap">
                                <span>More Options</span>
                            </span>
                            <p>
                                <span>
                                    Here are more options for your status page
                                </span>
                            </p>
                        </div>
                        <div
                            className="bs-Fieldset-row"
                            style={{
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <label style={{ marginRight: 10 }}>
                                {showMoreOptions
                                    ? 'Hide more advanced options'
                                    : 'Show more advanced options'}
                            </label>
                            <div>
                                <label className="Toggler-wrap">
                                    <input
                                        className="btn-toggler"
                                        type="checkbox"
                                        onChange={() =>
                                            this.showMoreOptionsToggle()
                                        }
                                        name="planDuration"
                                        id="planDuration"
                                        checked={showMoreOptions}
                                    />
                                    <span className="TogglerBtn-slider round"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(this.submitForm)}>
                        <div className="bs-ContentSection-content Box-root Box-background--offset Box-divider--surface-bottom-1 Padding-horizontal--8 Padding-vertical--2">
                            <div>
                                <div className="bs-Fieldset-wrapper Box-root Margin-bottom--2">
                                    <fieldset
                                        data-test="RetrySettings-failedAndExpiring"
                                        className="bs-Fieldset"
                                    >
                                        <div className="bs-Fieldset-rows">
                                            <div className="bs-Fieldset-row">
                                                <label
                                                    className="bs-Fieldset-label"
                                                    style={{ flex: '25% 0 0' }}
                                                >
                                                    <span></span>
                                                </label>
                                                <div className="bs-Fieldset-fields bs-Fieldset-fields--wide">
                                                    <div
                                                        className="Box-root"
                                                        style={{
                                                            height: '5px',
                                                        }}
                                                    ></div>
                                                    <div className="Box-root Flex-flex Flex-alignItems--stretch Flex-direction--column Flex-justifyContent--flexStart">
                                                        <label className="Checkbox">
                                                            <Field
                                                                component="input"
                                                                type="checkbox"
                                                                name={
                                                                    'isGroupedByMonitorCategory'
                                                                }
                                                                data-test="RetrySettings-failedPaymentsCheckbox"
                                                                className="Checkbox-source"
                                                                id="statuspage.isGroupedByMonitorCategory"
                                                            />
                                                            <div className="Checkbox-box Box-root Margin-top--2 Margin-right--2">
                                                                <div className="Checkbox-target Box-root">
                                                                    <div className="Checkbox-color Box-root"></div>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="Box-root"
                                                                style={{
                                                                    paddingLeft:
                                                                        '5px',
                                                                }}
                                                            >
                                                                <span>
                                                                    Group
                                                                    Monitor by
                                                                    Categories
                                                                </span>
                                                                <label className="bs-Fieldset-explanation">
                                                                    <span>
                                                                        Group
                                                                        monitor
                                                                        on
                                                                        public
                                                                        status
                                                                        page by
                                                                        categories.
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bs-Fieldset-row">
                                                <label
                                                    className="bs-Fieldset-label"
                                                    style={{ flex: '25% 0 0' }}
                                                >
                                                    <span></span>
                                                </label>
                                                <div className="bs-Fieldset-fields bs-Fieldset-fields--wide">
                                                    <div
                                                        className="Box-root"
                                                        style={{
                                                            height: '5px',
                                                        }}
                                                    ></div>
                                                    <PricingPlan
                                                        plan="Growth"
                                                        hideChildren={false}
                                                    >
                                                        <div className="Box-root Flex-flex Flex-alignItems--stretch Flex-direction--column Flex-justifyContent--flexStart">
                                                            <label className="Checkbox">
                                                                <Field
                                                                    component="input"
                                                                    type="checkbox"
                                                                    name={
                                                                        'isPrivate'
                                                                    }
                                                                    data-test="RetrySettings-failedPaymentsCheckbox"
                                                                    className="Checkbox-source"
                                                                    id="statuspage.isPrivate"
                                                                />
                                                                <div className="Checkbox-box Box-root Margin-top--2 Margin-right--2">
                                                                    <div className="Checkbox-target Box-root">
                                                                        <div className="Checkbox-color Box-root"></div>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="Box-root"
                                                                    style={{
                                                                        paddingLeft:
                                                                            '5px',
                                                                    }}
                                                                >
                                                                    <span>
                                                                        Private
                                                                        Status
                                                                        Page
                                                                    </span>
                                                                    <label className="bs-Fieldset-explanation">
                                                                        <span>
                                                                            Making
                                                                            the
                                                                            status
                                                                            page
                                                                            private
                                                                            will
                                                                            only
                                                                            make
                                                                            it
                                                                            visible
                                                                            to
                                                                            your
                                                                            internal
                                                                            team.
                                                                        </span>
                                                                    </label>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </PricingPlan>
                                                </div>
                                            </div>
                                            <div className="bs-Fieldset-row">
                                                <label
                                                    className="bs-Fieldset-label"
                                                    style={{ flex: '25% 0 0' }}
                                                >
                                                    <span></span>
                                                </label>
                                                <div className="bs-Fieldset-fields bs-Fieldset-fields--wide">
                                                    <div
                                                        className="Box-root"
                                                        style={{
                                                            height: '5px',
                                                        }}
                                                    ></div>
                                                    <div className="Box-root Flex-flex Flex-alignItems--stretch Flex-direction--column Flex-justifyContent--flexStart">
                                                        <label className="Checkbox">
                                                            <Field
                                                                component="input"
                                                                type="checkbox"
                                                                name={
                                                                    'showScheduledEvents'
                                                                }
                                                                data-test="RetrySettings-failedPaymentsCheckbox"
                                                                className="Checkbox-source"
                                                                id="statuspage.showScheduledEvents"
                                                            />
                                                            <div className="Checkbox-box Box-root Margin-top--2 Margin-right--2">
                                                                <div className="Checkbox-target Box-root">
                                                                    <div className="Checkbox-color Box-root"></div>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="Box-root"
                                                                style={{
                                                                    paddingLeft:
                                                                        '5px',
                                                                }}
                                                            >
                                                                <span>
                                                                    Show
                                                                    Scheduled
                                                                    events
                                                                </span>
                                                                <label className="bs-Fieldset-explanation">
                                                                    <span>
                                                                        {' '}
                                                                        Enable
                                                                        this to
                                                                        allow
                                                                        your
                                                                        users to
                                                                        see
                                                                        scheduled
                                                                        events
                                                                        like
                                                                        Database
                                                                        migration,
                                                                        Scheduled
                                                                        downtime,
                                                                        etc.
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bs-Fieldset-row">
                                                <label
                                                    className="bs-Fieldset-label"
                                                    style={{ flex: '25% 0 0' }}
                                                >
                                                    <span></span>
                                                </label>
                                                <div className="bs-Fieldset-fields bs-Fieldset-fields--wide">
                                                    <div
                                                        className="Box-root"
                                                        style={{
                                                            height: '5px',
                                                        }}
                                                    ></div>
                                                    <PricingPlan
                                                        plan="Growth"
                                                        hideChildren={false}
                                                    >
                                                        <div className="Box-root Flex-flex Flex-alignItems--stretch Flex-direction--column Flex-justifyContent--flexStart">
                                                            <label className="Checkbox">
                                                                <Field
                                                                    component="input"
                                                                    type="checkbox"
                                                                    name={
                                                                        'isSubscriberEnabled'
                                                                    }
                                                                    data-test="RetrySettings-failedPaymentsCheckbox"
                                                                    className="Checkbox-source"
                                                                    id="statuspage.isSubscriberEnabled"
                                                                />
                                                                <div className="Checkbox-box Box-root Margin-top--2 Margin-right--2">
                                                                    <div className="Checkbox-target Box-root">
                                                                        <div className="Checkbox-color Box-root"></div>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="Box-root"
                                                                    style={{
                                                                        paddingLeft:
                                                                            '5px',
                                                                    }}
                                                                >
                                                                    <span>
                                                                        Enable
                                                                        Subscribers
                                                                    </span>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </PricingPlan>
                                                    <p
                                                        className="bs-Fieldset-explanation"
                                                        style={{
                                                            paddingLeft: '21px',
                                                        }}
                                                    >
                                                        <span>
                                                            Enabling this will
                                                            allow your users to
                                                            subscribe and get
                                                            notifications for
                                                            your incidents.{' '}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="button-as-anchor"
                                                            style={{
                                                                cursor:
                                                                    'pointer',
                                                            }}
                                                            onClick={() => {
                                                                this.props.openModal(
                                                                    {
                                                                        id: subscriberAdvanceOptionModalId,
                                                                        content: DataPathHoC(
                                                                            SubscriberAdvanceOptions,
                                                                            {}
                                                                        ),
                                                                    }
                                                                );
                                                            }}
                                                        >
                                                            Advanced options for
                                                            subscribers
                                                        </button>
                                                    </p>
                                                </div>
                                            </div>

                                            {showMoreOptions && (
                                                <>
                                                    <div
                                                        className="bs-Fieldset-row"
                                                        style={{
                                                            paddingBottom: 0,
                                                        }}
                                                    >
                                                        <label
                                                            className="bs-Fieldset-label"
                                                            style={{
                                                                flex: '25% 0 0',
                                                            }}
                                                        >
                                                            <span></span>
                                                        </label>
                                                        <div className="bs-Fieldset-fields bs-Fieldset-fields--wide">
                                                            <div
                                                                className="Box-root"
                                                                style={{
                                                                    height:
                                                                        '5px',
                                                                }}
                                                            ></div>
                                                            <div className="Box-root Flex-flex Flex-alignItems--stretch Flex-direction--column Flex-justifyContent--flexStart">
                                                                <div
                                                                    className="Box-root"
                                                                    style={{
                                                                        marginLeft:
                                                                            '20px',
                                                                        fontWeight: 500,
                                                                    }}
                                                                >
                                                                    <span>
                                                                        More
                                                                        Advanced
                                                                        Options
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bs-Fieldset-row">
                                                        <label
                                                            className="bs-Fieldset-label"
                                                            style={{
                                                                flex: '25% 0 0',
                                                            }}
                                                        >
                                                            <span></span>
                                                        </label>
                                                        <div className="bs-Fieldset-fields bs-Fieldset-fields--wide">
                                                            <div
                                                                className="Box-root"
                                                                style={{
                                                                    height:
                                                                        '5px',
                                                                }}
                                                            ></div>
                                                            <div className="Box-root Flex-flex Flex-alignItems--stretch Flex-direction--column Flex-justifyContent--flexStart">
                                                                <label className="Checkbox">
                                                                    <Field
                                                                        component="input"
                                                                        type="checkbox"
                                                                        name={
                                                                            'moveIncidentToTheTop'
                                                                        }
                                                                        data-test="RetrySettings-failedPaymentsCheckbox"
                                                                        className="Checkbox-source"
                                                                        id="statuspage.moveIncidentToTheTop"
                                                                    />
                                                                    <div className="Checkbox-box Box-root Margin-top--2 Margin-right--2">
                                                                        <div className="Checkbox-target Box-root">
                                                                            <div className="Checkbox-color Box-root"></div>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className="Box-root"
                                                                        style={{
                                                                            paddingLeft:
                                                                                '5px',
                                                                        }}
                                                                    >
                                                                        <span>
                                                                            Show
                                                                            incidents
                                                                            to
                                                                            the
                                                                            top
                                                                            of
                                                                            the
                                                                            status
                                                                            page
                                                                        </span>
                                                                        <label className="bs-Fieldset-explanation">
                                                                            <span>
                                                                                Move
                                                                                the
                                                                                list
                                                                                of
                                                                                incidents
                                                                                to
                                                                                the
                                                                                top
                                                                                of
                                                                                the
                                                                                status
                                                                                page
                                                                                instead
                                                                                of
                                                                                at
                                                                                the
                                                                                bottom.
                                                                            </span>
                                                                        </label>
                                                                    </div>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        </div>

                        <div className="bs-ContentSection-footer bs-ContentSection-content Box-root Box-background--white Flex-flex Flex-alignItems--center Flex-justifyContent--spaceBetween Padding-horizontal--20 Padding-vertical--12">
                            <span className="db-SettingsForm-footerMessage"></span>
                            <div className="bs-Tail-copy">
                                <div
                                    className="Box-root Flex-flex Flex-alignItems--stretch Flex-direction--row Flex-justifyContent--flexStart"
                                    style={{ marginTop: '10px' }}
                                >
                                    <ShouldRender
                                        if={
                                            this.props.statusPage
                                                .privateStatusPage.error
                                        }
                                    >
                                        <div className="Box-root Margin-right--8">
                                            <div className="Icon Icon--info Icon--color--red Icon--size--14 Box-root Flex-flex"></div>
                                        </div>
                                        <div className="Box-root">
                                            <span style={{ color: 'red' }}>
                                                {
                                                    this.props.statusPage
                                                        .privateStatusPage.error
                                                }
                                            </span>
                                        </div>
                                    </ShouldRender>
                                </div>
                            </div>
                            <div>
                                <button
                                    className="bs-Button bs-DeprecatedButton bs-Button--blue"
                                    disabled={
                                        this.props.statusPage.privateStatusPage
                                            .requesting
                                    }
                                    type="submit"
                                >
                                    {!this.props.statusPage.privateStatusPage
                                        .requesting && <span>Save </span>}
                                    {this.props.statusPage.privateStatusPage
                                        .requesting && <FormLoader />}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

PrivateStatusPage.displayName = 'PrivateStatusPage';

const PrivateStatusPageForm = reduxForm({
    form: 'PrivateStatusPages', // a unique identifier for this form
    enableReinitialize: true,
})(PrivateStatusPage);

PrivateStatusPage.propTypes = {
    updatePrivateStatusPage: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    statusPage: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    fetchProjectStatusPage: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            updatePrivateStatusPage,
            updatePrivateStatusPageRequest,
            updatePrivateStatusPageSuccess,
            updatePrivateStatusPageError,
            fetchProjectStatusPage,
            openModal,
        },
        dispatch
    );

const mapStateToProps = state => {
    const initialValues = {};
    const { currentProject } = state.project;
    const {
        statusPage,
        statusPage: { status },
    } = state;

    if (status) {
        initialValues.isPrivate = status.isPrivate;
        initialValues.isSubscriberEnabled = status.isSubscriberEnabled;
        initialValues.isGroupedByMonitorCategory =
            status.isGroupedByMonitorCategory;
        initialValues.showScheduledEvents = status.showScheduledEvents;
        initialValues.moveIncidentToTheTop = status.moveIncidentToTheTop;
    }

    return { initialValues, statusPage, currentProject };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PrivateStatusPageForm);
