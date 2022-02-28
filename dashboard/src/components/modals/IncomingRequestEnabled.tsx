import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormLoader } from '../basic/Loader';
import { connect } from 'react-redux';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import ClickOutside from 'react-click-outside';
import { bindActionCreators } from 'redux';
import { closeModal } from '../../actions/modal';
import { incomingRequestToggle } from '../../actions/incomingRequest';

class IncomingRequestEnabledToggle extends Component {
    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyBoard);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyBoard);
    }

    handleKeyBoard = (e: $TSFixMe) => {
        switch (e.key) {
            case 'Escape':
                return this.handleCloseModal();
            case 'Enter':
                return this.handleClick();
            default:
                return false;
        }
    };

    handleCloseModal = () => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'closeModal' does not exist on type 'Read... Remove this comment to see the full error message
        this.props.closeModal({
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'projectId' does not exist on type 'Reado... Remove this comment to see the full error message
            id: this.props.projectId,
        });
    };

    handleClick = () => {
        let enabled = true; // This must not be changed as it corresponds to backend Incoming Request Schema
        const {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'closeModal' does not exist on type 'Read... Remove this comment to see the full error message
            closeModal,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'projectId' does not exist on type 'Reado... Remove this comment to see the full error message
            projectId,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'requestId' does not exist on type 'Reado... Remove this comment to see the full error message
            requestId,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'incomingRequestToggle' does not exist on... Remove this comment to see the full error message
            incomingRequestToggle,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'propArr' does not exist on type 'Readonl... Remove this comment to see the full error message
            propArr,
        } = this.props;
        if (propArr.isEnabled === true) {
            enabled = false;
        }
        incomingRequestToggle(projectId, requestId, { enabled }).then(() =>
            closeModal({ id: projectId })
        );
    };

    render() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'propArr' does not exist on type 'Readonl... Remove this comment to see the full error message
        const { propArr, isRequesting, closeModal, projectId } = this.props;
        return (
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
                                                Incoming HTTP Request{' '}
                                                {propArr.isEnabled === true
                                                    ? 'Enabled'
                                                    : 'Disabled'}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div className="bs-Modal-content">
                                    <span className="Text-color--inherit Text-display--inline Text-fontSize--14 Text-fontWeight--regular Text-lineHeight--24 Text-typeface--base Text-wrap--wrap">
                                        Are you sure you want to{' '}
                                        {propArr.isEnabled === true
                                            ? 'disable'
                                            : 'enable'}{' '}
                                        this Incoming HTTP Request ?
                                    </span>
                                </div>
                                <div className="bs-Modal-footer">
                                    <div className="bs-Modal-footer-actions">
                                        <button
                                            className="bs-Button bs-DeprecatedButton bs-Button--grey btn__modal"
                                            type="button"
                                            onClick={() =>
                                                closeModal({ id: projectId })
                                            }
                                            id="cancelIncomingRequestEnabledToggle"
                                        >
                                            <span>Cancel</span>
                                            <span className="cancel-btn__keycode">
                                                Esc
                                            </span>
                                        </button>
                                        <button
                                            id="incomingRequestBtn"
                                            className="bs-Button bs-DeprecatedButton bs-Button--blue btn__modal"
                                            type="button"
                                            onClick={this.handleClick}
                                            disabled={isRequesting}
                                            autoFocus={true}
                                        >
                                            {!isRequesting && (
                                                <>
                                                    <span>Ok</span>
                                                    <span className="create-btn__keycode">
                                                        <span className="keycode__icon keycode__icon--enter" />
                                                    </span>
                                                </>
                                            )}
                                            {isRequesting && <FormLoader />}
                                        </button>
                                    </div>
                                </div>
                            </ClickOutside>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'displayName' does not exist on type 'typ... Remove this comment to see the full error message
IncomingRequestEnabledToggle.displayName = 'IncomingRequestEnabledToggle';

// @ts-expect-error ts-migrate(2339) FIXME: Property 'propTypes' does not exist on type 'typeo... Remove this comment to see the full error message
IncomingRequestEnabledToggle.propTypes = {
    isRequesting: PropTypes.bool,
    closeModal: PropTypes.func,
    incomingRequestToggle: PropTypes.func,
    projectId: PropTypes.string,
    requestId: PropTypes.string,
    propArr: PropTypes.array,
};

const mapStateToProps = (state: $TSFixMe) => {
    return {
        isRequesting: state.incomingRequest.updateIncomingRequest.requesting,
        projectId: state.modal.modals[0].projectId,
        requestId: state.modal.modals[0].requestId,
    };
};

const mapDispatchToProps = (dispatch: $TSFixMe) => bindActionCreators({ closeModal, incomingRequestToggle }, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IncomingRequestEnabledToggle);