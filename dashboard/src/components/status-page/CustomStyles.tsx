import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    updateStatusPageCustomHTML,
    fetchProjectStatusPage,
} from '../../actions/statusPage';
import ShouldRender from '../basic/ShouldRender';
import PropTypes from 'prop-types';
import { FormLoader } from '../basic/Loader';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'redu... Remove this comment to see the full error message
import { Field, reduxForm } from 'redux-form';
import RenderCodeEditor from '../basic/RenderCodeEditor';

export class CustomStyles extends Component {
    state = {
        syntaxError: {},
    };
    headerHTML = null;
    footerHTML = null;
    customCSS = null;
    customJS = null;

    shouldComponentUpdate(nextProps: $TSFixMe, nextState: $TSFixMe) {
        const { recent } = nextState.syntaxError;
        const { syntaxError } = this.state;
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        const noError = !syntaxError[recent] && !nextState.syntaxError[recent];
        if (
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'statusPage' does not exist on type 'Read... Remove this comment to see the full error message
            this.props.statusPage.customHTML.requesting !==
            nextProps.statusPage.customHTML.requesting
        ) {
            return true;
        }

        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        if (noError || syntaxError[recent] === nextState.syntaxError[recent]) {
            return false;
        }

        return true;
    }

    validateScript = (editor: $TSFixMe) => {
        const annotations = editor.getSession().getAnnotations();
        const errors = annotations.filter(
            ({
                type,
                text
            }: $TSFixMe) =>
                (type === 'error' || text.includes('Unknown property')) && text
        );

        return !!errors.length;
    };

    submitForm = (values: $TSFixMe) => {
        const { syntaxError } = this.state;
        if (Object.values(syntaxError).includes(true)) {
            return;
        }
        const {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'updateStatusPageCustomHTML' does not exi... Remove this comment to see the full error message
            updateStatusPageCustomHTML,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'fetchProjectStatusPage' does not exist o... Remove this comment to see the full error message
            fetchProjectStatusPage,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'statusPage' does not exist on type 'Read... Remove this comment to see the full error message
            statusPage,
        } = this.props;

        // eslint-disable-next-line prefer-const
        let { _id, projectId } = statusPage.status;
        projectId = projectId ? projectId._id || projectId : null;
        if (_id) values._id = _id;
        updateStatusPageCustomHTML(projectId, values).then(() =>
            fetchProjectStatusPage(projectId, true, 0, 10)
        );
    };

    handleChange = (onChange: $TSFixMe, script: $TSFixMe) => {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        const currentEditor = this[script];
        const value = currentEditor.getValue();

        if (this.validateScript(currentEditor)) {
            this.setState({
                syntaxError: {
                    ...this.state.syntaxError,
                    [script]: true,
                    recent: script,
                },
            });
        } else {
            this.setState({
                syntaxError: {
                    ...this.state.syntaxError,
                    [script]: false,
                    recent: script,
                },
            });
        }
        onChange(value);
    };

    render() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'handleSubmit' does not exist on type 'Re... Remove this comment to see the full error message
        const { handleSubmit, statusPage } = this.props;
        const { syntaxError } = this.state;

        const scripts = [
            {
                name: 'headerHTML',
                mode: 'html',
                label: 'Header HTML',
                placeholder: `<div>\n\t<!-- HTML code -->\n</div>`,
            },
            {
                name: 'footerHTML',
                mode: 'html',
                label: 'Footer HTML',
                placeholder: `<div>\n\t<!-- HTML code -->\n</div>`,
            },
            {
                name: 'customCSS',
                mode: 'css',
                label: 'Custom CSS',
                placeholder: `.your-css-class{\n\t/* CSS code */\n}`,
            },
            {
                name: 'customJS',
                mode: 'html',
                label: 'Custom JS',
                placeholder: `<script>\n\t// your JS code here (also include the <script> tag)\n</script>  `,
            },
        ];

        return (
            <div className="bs-ContentSection Card-root Card-shadow--medium">
                <div className="Box-root">
                    <div className="ContentHeader Box-root Box-background--white Box-divider--surface-bottom-1 Flex-flex Flex-direction--column Padding-horizontal--20 Padding-vertical--16">
                        <div className="Box-root Flex-flex Flex-direction--row Flex-justifyContent--spaceBetween">
                            <div className="ContentHeader-center Box-root Flex-flex Flex-direction--column Flex-justifyContent--center">
                                <span className="ContentHeader-title Text-color--inherit Text-display--inline Text-fontSize--16 Text-fontWeight--medium Text-lineHeight--28 Text-typeface--base Text-wrap--wrap">
                                    <span
                                        style={{ textTransform: 'capitalize' }}
                                    >
                                        Custom HTML, CSS and Javascript
                                    </span>
                                </span>
                                <span className="ContentHeader-description Text-color--inherit Text-display--inline Text-fontSize--14 Text-fontWeight--regular Text-lineHeight--20 Text-typeface--base Text-wrap--wrap">
                                    <span>
                                        Add custom header and footer HTML, plus
                                        CSS and Javascript on the status page.
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(this.submitForm)}>
                        <div
                            className="bs-ContentSection-content Box-root Box-divider--surface-bottom-1"
                            style={{ overflow: 'hidden', overflowX: 'auto' }}
                        >
                            <div>
                                <div className="bs-Fieldset-wrapper Box-root">
                                    <fieldset className="Box-background--offset">
                                        <div className="bs-Fieldset-rows">
                                            {scripts.map((script, i) => (
                                                <div
                                                    className="bs-Fieldset-row"
                                                    key={i}
                                                >
                                                    <label className="bs-Fieldset-label script-label">
                                                        {script.label}
                                                    </label>
                                                    <div className="bs-Fieldset-fields script-editor-wrapper">
                                                        <Field
                                                            key={i}
                                                            id={script.name}
                                                            name={script.name}
                                                            component={
                                                                RenderCodeEditor
                                                            }
                                                            mode={script.mode}
                                                            theme="github"
                                                            height="150px"
                                                            width="100%"
                                                            onLoad={(editor: $TSFixMe) => {
                                                                // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                                                this[
                                                                    script.name
                                                                ] = editor;
                                                            }}
                                                            onBlur={(input: $TSFixMe) => this.handleChange(
                                                                input.onChange,
                                                                script.name
                                                            )
                                                            }
                                                            placeholder={
                                                                script.placeholder
                                                            }
                                                        />
                                                        <ShouldRender
                                                            if={
                                                                // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                                                syntaxError[
                                                                    script.name
                                                                ]
                                                            }
                                                        >
                                                            <div className="bs-Tail-copy">
                                                                <div
                                                                    className="Box-root Flex-flex Flex-alignItems--stretch Flex-direction--row Flex-justifyContent--flexStart"
                                                                    style={{
                                                                        marginTop:
                                                                            '10px',
                                                                    }}
                                                                >
                                                                    <div className="Box-root Margin-right--8">
                                                                        <div className="Icon Icon--info Icon--color--red Icon--size--14 Box-root Flex-flex"></div>
                                                                    </div>
                                                                    <div className="Box-root">
                                                                        <span
                                                                            id="syntaxError"
                                                                            style={{
                                                                                color:
                                                                                    'red',
                                                                            }}
                                                                        >
                                                                            Invalid
                                                                            syntax
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </ShouldRender>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        </div>

                        <div className="bs-ContentSection-footer bs-ContentSection-content Box-root Box-background--white Flex-flex Flex-alignItems--center Flex-justifyContent--spaceBetween Padding-horizontal--20 Padding-vertical--12">
                            <span className="db-SettingsForm-footerMessage">
                                <ShouldRender
                                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'statusPage' does not exist on type 'Read... Remove this comment to see the full error message
                                    if={this.props.statusPage.customHTML.error}
                                >
                                    <div className="bs-Tail-copy">
                                        <div
                                            className="Box-root Flex-flex Flex-alignItems--stretch Flex-direction--row Flex-justifyContent--flexStart"
                                            style={{ marginTop: '10px' }}
                                        >
                                            <div className="Box-root Margin-right--8">
                                                <div className="Icon Icon--info Icon--color--red Icon--size--14 Box-root Flex-flex"></div>
                                            </div>
                                            <div className="Box-root">
                                                <span style={{ color: 'red' }}>
                                                    {
                                                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'statusPage' does not exist on type 'Read... Remove this comment to see the full error message
                                                        this.props.statusPage
                                                            .customHTML.error
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </ShouldRender>
                            </span>

                            <div>
                                <button
                                    className="bs-Button bs-DeprecatedButton bs-Button--blue"
                                    disabled={
                                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'statusPage' does not exist on type 'Read... Remove this comment to see the full error message
                                        this.props.statusPage.customHTML
                                            .requesting
                                    }
                                    type="submit"
                                    id="btnAddCustomStyles"
                                >
                                    <ShouldRender
                                        if={!statusPage.customHTML.requesting}
                                    >
                                        <span>Save</span>
                                    </ShouldRender>
                                    <ShouldRender
                                        if={statusPage.customHTML.requesting}
                                    >
                                        <FormLoader />
                                    </ShouldRender>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'displayName' does not exist on type 'typ... Remove this comment to see the full error message
CustomStyles.displayName = 'Custom Styles';

// @ts-expect-error ts-migrate(2339) FIXME: Property 'propTypes' does not exist on type 'typeo... Remove this comment to see the full error message
CustomStyles.propTypes = {
    statusPage: PropTypes.object.isRequired,
    updateStatusPageCustomHTML: PropTypes.func.isRequired,
    fetchProjectStatusPage: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
};

const CustomStylesForm = reduxForm({
    form: 'CustomStyles', // a unique identifier for this form
    enableReinitialize: true,
})(CustomStyles);

const mapDispatchToProps = (dispatch: $TSFixMe) => bindActionCreators(
    {
        updateStatusPageCustomHTML,
        fetchProjectStatusPage,
    },
    dispatch
);

const mapStateToProps = ({
    statusPage
}: $TSFixMe) => {
    const { headerHTML, footerHTML, customCSS, customJS } = statusPage.status;
    return {
        initialValues: {
            headerHTML,
            footerHTML,
            customCSS,
            customJS,
        },
        statusPage,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomStylesForm);