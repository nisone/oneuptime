import React from 'react';
import PropTypes from 'prop-types';
import { RenderSelect } from '../../basic/RenderSelect';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'redu... Remove this comment to see the full error message
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { Validate } from '../../../config';
import {
    addSsoDefaultRole,
    updateSsoDefaultRole,
    fetchSsoDefaultRoles,
} from '../../../actions/ssoDefaultRoles';

/**
 * Domain
 * project
 * Role
 */
const fields = [
    {
        key: 'domain',
        label: 'Domain',
        placeholder: 'Select a domain',
        component: RenderSelect,
    },
    {
        key: 'project',
        label: 'Project',
        placeholder: 'Select a project',
        component: RenderSelect,
    },
    {
        key: 'role',
        label: 'Role',
        placeholder: 'Select a role',
        component: RenderSelect,
    },
];

// Client side validation
function validate(values: $TSFixMe) {
    const errors = {};

    if (!Validate.text(values.domain)) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'domain' does not exist on type '{}'.
        errors.domain = 'Domain is required.';
    }

    if (!Validate.text(values.project)) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'project' does not exist on type '{}'.
        errors.project = 'Project is required.';
    }

    if (!Validate.text(values.role)) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'role' does not exist on type '{}'.
        errors.role = 'Role is required.';
    }

    return errors;
}

const Form = ({
    formTitle,
    onSubmit,
    ssos,
    projects,
    errorMessage,
    handleSubmit,
    fetchSsoDefaultRoles,
    closeThisDialog
}: $TSFixMe) => {
    const optionsArray = [
        ssos.map((sso: $TSFixMe) => ({
            value: sso._id,
            label: sso.domain
        })),
        projects.map((project: $TSFixMe) => ({
            value: project._id,
            label: project.name
        })),
        [
            { value: 'Administrator', label: 'Administrator' },
            { value: 'Member', label: 'Member' },
            { value: 'Viewer', label: 'Viewer' },
        ],
    ];
    const submitForm = async (data: $TSFixMe) => {
        const { _id: id } = data;
        const success = await onSubmit({ id, data });
        if (!success) return;
        fetchSsoDefaultRoles();
        closeThisDialog();
    };
    return (
        <div className="ModalLayer-wash Box-root Flex-flex Flex-alignItems--flexStart Flex-justifyContent--center">
            <div
                className="ModalLayer-contents"
                // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'number | ... Remove this comment to see the full error message
                tabIndex="-1"
                style={{ marginTop: '40px' }}
            >
                <div className="bs-Modal-header">
                    <div
                        className="bs-Modal-header-copy"
                        style={{
                            marginBottom: '10px',
                            marginTop: '10px',
                        }}
                    >
                        <span className="Text-color--inherit Text-display--inline Text-fontSize--20 Text-fontWeight--medium Text-lineHeight--24 Text-typeface--base Text-wrap--wrap">
                            <span>{formTitle}</span>
                        </span>
                    </div>
                </div>
                <form onSubmit={handleSubmit(submitForm)}>
                    <div className="bs-ContentSection-content Box-root Box-background--offset Box-divider--surface-bottom-1 Padding-horizontal--8 Padding-vertical--2">
                        <div>
                            <div className="bs-Fieldset-wrapper Box-root Margin-bottom--2">
                                <fieldset className="bs-Fieldset">
                                    <div className="bs-Fieldset-rows">
                                        {fields.map((field, index) => (
                                            <div
                                                key={field.key}
                                                className="bs-Fieldset-row"
                                            >
                                                <label className="bs-Fieldset-label">
                                                    {field.label}
                                                </label>
                                                <div
                                                    className="bs-Fieldset-fields"
                                                    style={{
                                                        paddingTop: 3,
                                                    }}
                                                >
                                                    <Field
                                                        className="db-select-nw"
                                                        name={field.key}
                                                        id={field.key}
                                                        placeholder={
                                                            field.placeholder
                                                        }
                                                        component={
                                                            field.component
                                                        }
                                                        // disabled={
                                                        //   sso &&
                                                        //   sso.requesting
                                                        // }
                                                        style={{
                                                            width: '350px',
                                                        }}
                                                        autoFocus={
                                                            field.key ===
                                                            'domain'
                                                                ? true
                                                                : false
                                                        }
                                                        options={
                                                            optionsArray[index]
                                                        }
                                                        required
                                                    />
                                                    <span
                                                        style={{
                                                            marginTop: '10px',
                                                        }}
                                                    >
                                                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'description' does not exist on type '{ k... Remove this comment to see the full error message
                                                        {field.description}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>

                    <div className="bs-ContentSection-footer bs-ContentSection-content Box-root Box-background--white Flex-flex Flex-alignItems--center Flex-justifyContent--spaceBetween Padding-horizontal--20 Padding-vertical--12">
                        <span
                            className="db-SettingsForm-footerMessage"
                            style={{ color: 'red' }}
                        >
                            {errorMessage}
                        </span>
                        <div style={{ display: 'flex' }}>
                            <button
                                className="bs-Button bs-DeprecatedButton btn__modal"
                                type="button"
                                onClick={closeThisDialog}
                            >
                                <span>Cancel</span>
                                <span className="cancel-btn__keycode">Esc</span>
                            </button>
                            <button
                                id="save-button"
                                className="bs-Button bs-Button--blue btn__modal"
                                // disabled={updatingSso || addingSso}
                                // type="submit"
                                // autoFocus={formTitle === 'Update SSO'}
                            >
                                <span>Save</span>
                                <span className="create-btn__keycode">
                                    <span className="keycode__icon keycode__icon--enter" />
                                </span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
const ReduxConnectedForm = reduxForm({
    form: 'role-modal',
    enableReinitialize: true,
    validate,
})(Form);

Form.displayName = 'Form';

Form.propTypes = {
    formTitle: PropTypes.string,
    onSubmit: PropTypes.func,
    ssos: PropTypes.string,
    projects: PropTypes.string,
    errorMessage: PropTypes.string,
    handleSubmit: PropTypes.func,
    fetchSsoDefaultRoles: PropTypes.func,
    closeThisDialog: PropTypes.func.isRequired,
};

export const CreateDefaultRoleModal = connect(
    state => ({
        formTitle: 'Create New Default Role',
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'sso' does not exist on type 'DefaultRoot... Remove this comment to see the full error message
        ssos: state.sso.ssos.ssos,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'project' does not exist on type 'Default... Remove this comment to see the full error message
        projects: state.project.projects.projects,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'ssoDefaultRoles' does not exist on type ... Remove this comment to see the full error message
        errorMessage: state.ssoDefaultRoles.addSsoDefaultRole.error,
    }),
    dispatch => ({
        onSubmit: ({
            data
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '(dispatch: $TSFixMe) => Promise<... Remove this comment to see the full error message
        }: $TSFixMe) => dispatch(addSsoDefaultRole({ data })),
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '(dispatch: $TSFixMe) => Promise<... Remove this comment to see the full error message
        fetchSsoDefaultRoles: () => dispatch(fetchSsoDefaultRoles()),
    })
)(ReduxConnectedForm);

export const UpdateDefaultRoleModal = connect(
    state => {
        const initialValues = {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'ssoDefaultRoles' does not exist on type ... Remove this comment to see the full error message
            ...state.ssoDefaultRoles.ssoDefaultRole.ssoDefaultRole,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'ssoDefaultRoles' does not exist on type ... Remove this comment to see the full error message
            ...(state.ssoDefaultRoles.ssoDefaultRole.ssoDefaultRole.domain
                ? {
                      domain:
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'ssoDefaultRoles' does not exist on type ... Remove this comment to see the full error message
                          state.ssoDefaultRoles.ssoDefaultRole.ssoDefaultRole
                              .domain._id,
                  }
                : {
                      domain: null,
                  }),
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'ssoDefaultRoles' does not exist on type ... Remove this comment to see the full error message
            ...(state.ssoDefaultRoles.ssoDefaultRole.ssoDefaultRole.project
                ? {
                      project:
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'ssoDefaultRoles' does not exist on type ... Remove this comment to see the full error message
                          state.ssoDefaultRoles.ssoDefaultRole.ssoDefaultRole
                              .project._id,
                  }
                : {
                      project: null,
                  }),
        };
        return {
            initialValues,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'sso' does not exist on type 'DefaultRoot... Remove this comment to see the full error message
            ssos: state.sso.ssos.ssos,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'project' does not exist on type 'Default... Remove this comment to see the full error message
            projects: state.project.projects.projects,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'ssoDefaultRoles' does not exist on type ... Remove this comment to see the full error message
            errorMessage: state.ssoDefaultRoles.updateSsoDefaultRole.error,
        };
    },
    dispatch => ({
        onSubmit: ({
            id,
            data
        }: $TSFixMe) =>
            // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '(dispatch: $TSFixMe) => Promise<... Remove this comment to see the full error message
            dispatch(updateSsoDefaultRole({ id, data })),
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '(dispatch: $TSFixMe) => Promise<... Remove this comment to see the full error message
        fetchSsoDefaultRoles: () => dispatch(fetchSsoDefaultRoles()),
    })
)(ReduxConnectedForm);