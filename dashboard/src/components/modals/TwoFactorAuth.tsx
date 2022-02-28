import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import ClickOutside from 'react-click-outside';
import ShouldRender from '../basic/ShouldRender';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'redu... Remove this comment to see the full error message
import { reduxForm, Field } from 'redux-form';
import { Spinner } from '../basic/Loader';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'qrco... Remove this comment to see the full error message
import QRCode from 'qrcode.react';
import { RenderField } from '../basic/RenderField';
import { ListLoader } from '../basic/Loader.js';
import {
    setTwoFactorAuth,
    verifyTwoFactorAuthToken,
    generateTwoFactorQRCode,
} from '../../actions/profile';

class TwoFactorAuthModal extends Component {
    state = { next: false };

    async componentDidMount() {
        const {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'profileSettings' does not exist on type ... Remove this comment to see the full error message
            profileSettings: { data },
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'generateTwoFactorQRCode' does not exist ... Remove this comment to see the full error message
            generateTwoFactorQRCode,
        } = this.props;
        generateTwoFactorQRCode(data.id || data._id);

        window.addEventListener('keydown', this.handleKeyBoard);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyBoard);
    }

    handleKeyBoard = (e: $TSFixMe) => {
        const { next } = this.state;
        switch (e.key) {
            case 'Escape':
                return this.handleCloseModal();
            case 'Enter':
                if (next) {
                    // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
                    return document
                        .getElementById('enableTwoFactorAuthButton')
                        .click();
                } else {
                    e.preventDefault(); // prevent default behaviour of trying to submit the form
                    // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
                    return document.getElementById('nextFormButton').click();
                }
            default:
                return false;
        }
    };

    handleCloseModal = () => {
        const { next } = this.state;
        if (next) {
            this.setState({ next: false });
        } else {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'closeThisDialog' does not exist on type ... Remove this comment to see the full error message
            this.props.closeThisDialog();
        }
    };

    nextHandler = (e: $TSFixMe) => {
        e.preventDefault();
        this.setState({ next: true });
    };

    submitForm = (values: $TSFixMe) => {
        if (values.token) {
            const {
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'setTwoFactorAuth' does not exist on type... Remove this comment to see the full error message
                setTwoFactorAuth,
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'verifyTwoFactorAuthToken' does not exist... Remove this comment to see the full error message
                verifyTwoFactorAuthToken,
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'profileSettings' does not exist on type ... Remove this comment to see the full error message
                profileSettings,
            } = this.props;
            values.userId = profileSettings.data.id || profileSettings.data._id;
            verifyTwoFactorAuthToken(values).then((response: $TSFixMe) => {
                setTwoFactorAuth(response.data.twoFactorAuthEnabled);
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'closeThisDialog' does not exist on type ... Remove this comment to see the full error message
                this.props.closeThisDialog();
            });
        }
    };

    render() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'handleSubmit' does not exist on type 'Re... Remove this comment to see the full error message
        const { handleSubmit, qrCode, twoFactorAuthSetting } = this.props;
        const { next } = this.state;

        return (
            <form onSubmit={handleSubmit(this.submitForm)}>
                <div className="ModalLayer-wash Box-root Flex-flex Flex-alignItems--flexStart Flex-justifyContent--center">
                    <div
                        className="ModalLayer-contents"
                        tabIndex={-1}
                        style={{ marginTop: 40 }}
                    >
                        <div className="bs-BIM">
                            <div className="bs-Modal bs-Modal--medium">
                                <ClickOutside
                                    onClickOutside={this.handleCloseModal}
                                >
                                    <div className="bs-Modal-header">
                                        <div className="bs-Modal-header-copy">
                                            <span className="Text-color--inherit Text-display--inline Text-fontSize--20 Text-fontWeight--medium Text-lineHeight--24 Text-typeface--base Text-wrap--wrap">
                                                <span>
                                                    Two Factor Authentication
                                                </span>
                                            </span>
                                        </div>
                                        <div className="bs-Modal-messages">
                                            <ShouldRender
                                                if={twoFactorAuthSetting.error}
                                            >
                                                <p
                                                    className="bs-Modal-message"
                                                    id="modal-message"
                                                >
                                                    {twoFactorAuthSetting.error}
                                                </p>
                                            </ShouldRender>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="bs-Fieldset-wrapper Box-root Margin-bottom--2">
                                            <div className="bs-u-paddingless">
                                                <div className="bs-Modal-block">
                                                    <div>
                                                        {next ? (
                                                            <div>
                                                                <div
                                                                    className="bs-Fieldset-wrapper Box-root"
                                                                    style={{
                                                                        width:
                                                                            '90%',
                                                                        margin:
                                                                            '1px 0 6px 2%',
                                                                    }}
                                                                >
                                                                    <p>
                                                                        Input a
                                                                        token
                                                                        from
                                                                        your
                                                                        mobile
                                                                        device
                                                                        to
                                                                        complete
                                                                        setup
                                                                    </p>
                                                                </div>
                                                                <div className="bs-Modal-body">
                                                                    <Field
                                                                        className="bs-TextInput"
                                                                        component={
                                                                            RenderField
                                                                        }
                                                                        name="token"
                                                                        id="token"
                                                                        placeholder="Verification token"
                                                                        disabled={
                                                                            twoFactorAuthSetting.requesting
                                                                        }
                                                                        style={{
                                                                            width:
                                                                                '90%',
                                                                            margin:
                                                                                '5px 0 10px 2%',
                                                                        }}
                                                                        required={
                                                                            true
                                                                        }
                                                                        autoFocus={
                                                                            true
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="bs-Fieldset-wrapper Box-root">
                                                                <div
                                                                    className="bs-Fieldset-wrapper Box-root"
                                                                    style={{
                                                                        marginBottom:
                                                                            '10px',
                                                                        marginTop:
                                                                            '-5px',
                                                                    }}
                                                                >
                                                                    <p>
                                                                        Download
                                                                        the
                                                                        Google
                                                                        Authenticator
                                                                        Mobile
                                                                        app on
                                                                        your
                                                                        mobile
                                                                        device
                                                                        <span>
                                                                            {' '}
                                                                            (
                                                                            <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en">
                                                                                Android
                                                                            </a>
                                                                            ,
                                                                            <a href="https://apps.apple.com/us/app/google-authenticator/id388497605">
                                                                                {' '}
                                                                                IOS
                                                                            </a>
                                                                            )
                                                                        </span>{' '}
                                                                        and then
                                                                        scan the
                                                                        QR code
                                                                        below to
                                                                        set up
                                                                        Two-factor
                                                                        Authentication
                                                                        with an
                                                                        Authenticator
                                                                        app.
                                                                    </p>
                                                                </div>
                                                                {qrCode.data
                                                                    .otpauth_url ? (
                                                                    <>
                                                                        <QRCode
                                                                            size={
                                                                                230
                                                                            }
                                                                            value={`${qrCode.data.otpauth_url}`}
                                                                            style={{
                                                                                display:
                                                                                    'block',
                                                                                margin:
                                                                                    '0 auto',
                                                                            }}
                                                                            id="qr-code"
                                                                        />
                                                                        <div
                                                                            style={{
                                                                                marginTop:
                                                                                    '20px',
                                                                            }}
                                                                        >
                                                                            <span>
                                                                                You
                                                                                can
                                                                                also
                                                                                add
                                                                                the
                                                                                QR
                                                                                code
                                                                                below
                                                                                directly
                                                                                on
                                                                                Google
                                                                                Auhenticator
                                                                                app
                                                                                or
                                                                                Authy
                                                                            </span>
                                                                        </div>

                                                                        <div
                                                                            style={{
                                                                                marginTop:
                                                                                    '14px',
                                                                                textAlign:
                                                                                    'center',
                                                                            }}
                                                                        >
                                                                            <span>
                                                                                QR
                                                                                Code:
                                                                            </span>
                                                                            <span
                                                                                style={{
                                                                                    textDecoration:
                                                                                        'underline',
                                                                                }}
                                                                                id="otpath-url"
                                                                            >
                                                                                {' '}
                                                                                {
                                                                                    qrCode.data.otpauth_url.split(
                                                                                        'secret='
                                                                                    )[1]
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <ListLoader />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bs-Modal-footer">
                                        <div className="bs-Modal-footer-actions">
                                            <button
                                                className={`bs-Button bs-DeprecatedButton btn__modal ${twoFactorAuthSetting.requesting &&
                                                    'bs-is-disabled'}`}
                                                type="button"
                                                onClick={() => {
                                                    this.handleCloseModal();
                                                }}
                                                disabled={
                                                    twoFactorAuthSetting.requesting
                                                }
                                            >
                                                <span>Cancel</span>
                                                <span className="cancel-btn__keycode">
                                                    Esc
                                                </span>
                                            </button>
                                            {!next ? (
                                                <button
                                                    id="nextFormButton"
                                                    className={`bs-Button bs-DeprecatedButton bs-Button--blue btn__modal ${twoFactorAuthSetting.requesting &&
                                                        'bs-is-disabled'}`}
                                                    disabled={
                                                        twoFactorAuthSetting.requesting
                                                    }
                                                    onClick={this.nextHandler}
                                                    type="button"
                                                    autoFocus={true}
                                                >
                                                    <ShouldRender
                                                        if={
                                                            twoFactorAuthSetting.requesting
                                                        }
                                                    >
                                                        <Spinner />
                                                    </ShouldRender>
                                                    <span>Next</span>
                                                    <span className="create-btn__keycode">
                                                        <span className="keycode__icon keycode__icon--enter" />
                                                    </span>
                                                </button>
                                            ) : (
                                                <button
                                                    id="enableTwoFactorAuthButton"
                                                    className={`bs-Button bs-DeprecatedButton bs-Button--blue btn__modal ${twoFactorAuthSetting.requesting &&
                                                        'bs-is-disabled'}`}
                                                    type="submit"
                                                    disabled={
                                                        twoFactorAuthSetting.requesting
                                                    }
                                                >
                                                    <ShouldRender
                                                        if={
                                                            twoFactorAuthSetting.requesting
                                                        }
                                                    >
                                                        <Spinner />
                                                    </ShouldRender>
                                                    <span>Verify</span>
                                                    <span className="create-btn__keycode">
                                                        <span className="keycode__icon keycode__icon--enter" />
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </ClickOutside>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'displayName' does not exist on type 'typ... Remove this comment to see the full error message
TwoFactorAuthModal.displayName = 'TwoFactorAuthModal';

const TwoFactorAuthForm = reduxForm({
    form: 'TwoFactorAuthForm',
})(TwoFactorAuthModal);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'propTypes' does not exist on type 'typeo... Remove this comment to see the full error message
TwoFactorAuthModal.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    closeThisDialog: PropTypes.func.isRequired,
    generateTwoFactorQRCode: PropTypes.func,
    setTwoFactorAuth: PropTypes.func,
    profileSettings: PropTypes.object,
    qrCode: PropTypes.object,
    twoFactorAuthSetting: PropTypes.object,
    verifyTwoFactorAuthToken: PropTypes.func,
};

const mapStateToProps = (state: $TSFixMe) => {
    return {
        profileSettings: state.profileSettings.profileSetting,
        qrCode: state.profileSettings.qrCode,
        twoFactorAuthSetting: state.profileSettings.twoFactorAuthSetting,
    };
};

const mapDispatchToProps = (dispatch: $TSFixMe) => bindActionCreators(
    {
        setTwoFactorAuth,
        verifyTwoFactorAuthToken,
        generateTwoFactorQRCode,
    },
    dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(TwoFactorAuthForm);