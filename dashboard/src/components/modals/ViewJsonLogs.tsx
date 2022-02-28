import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import ClickOutside from 'react-click-outside';
import { closeModal } from '../../actions/modal';
import ReactJson from 'react-json-view';

class ViewJsonLogs extends Component {
    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyBoard);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyBoard);
    }

    handleKeyBoard = (e: $TSFixMe) => {
        switch (e.key) {
            case 'Escape':
            case 'Enter':
                return this.handleCloseModal();
            default:
                return false;
        }
    };

    handleCloseModal = () => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'closeModal' does not exist on type 'Read... Remove this comment to see the full error message
        this.props.closeModal({
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Readonly<{... Remove this comment to see the full error message
            id: this.props.data.viewJsonModalId,
        });
    };

    render() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Readonly<{... Remove this comment to see the full error message
        const { viewJsonModalId, title, jsonLog, rootName } = this.props.data;
        return (
            <div className="ModalLayer-wash Box-root Flex-flex Flex-alignItems--flexStart Flex-justifyContent--center">
                <div
                    className="ModalLayer-contents"
                    tabIndex={-1}
                    style={{ marginTop: 40 }}
                >
                    <div className="bs-BIM">
                        <div className="bs-Modal bs-Modal--large">
                            <ClickOutside
                                onClickOutside={this.handleCloseModal}
                            >
                                <div className="bs-Modal-header">
                                    <div className="bs-Modal-header-copy">
                                        <span className="Text-color--inherit Text-display--inline Text-fontSize--20 Text-fontWeight--medium Text-lineHeight--24 Text-typeface--base Text-wrap--wrap">
                                            <span
                                                id={
                                                    title &&
                                                    typeof title === 'string'
                                                        ? title.replace(
                                                              / /g,
                                                              '_'
                                                          )
                                                        : 'json'
                                                }
                                            >
                                                {title}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div className="bs-Modal-content Text-overflow--scroll Text-wrap--wrap">
                                    <span className="Text-color--inherit Text-display--inline Text-fontSize--14 Text-fontWeight--regular Text-lineHeight--24 Text-typeface--base">
                                        <ReactJson
                                            src={jsonLog}
                                            theme="rjv-default"
                                            iconStyle="triangle"
                                            name={rootName ? rootName : false}
                                        />
                                    </span>
                                </div>
                                <div className="bs-Modal-footer">
                                    <div className="bs-Modal-footer-actions">
                                        <button
                                            className="bs-Button bs-DeprecatedButton bs-Button--grey btn__modal"
                                            type="button"
                                            onClick={() =>
                                                // @ts-expect-error ts-migrate(2339) FIXME: Property 'closeModal' does not exist on type 'Read... Remove this comment to see the full error message
                                                this.props.closeModal({
                                                    id: viewJsonModalId,
                                                })
                                            }
                                            autoFocus={true}
                                        >
                                            <span>Close</span>
                                            <span className="cancel-btn__keycode">
                                                Esc
                                            </span>
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
ViewJsonLogs.displayName = 'ViewJsonLogs';

// @ts-expect-error ts-migrate(2339) FIXME: Property 'propTypes' does not exist on type 'typeo... Remove this comment to see the full error message
ViewJsonLogs.propTypes = {
    closeModal: PropTypes.func.isRequired,
    data: PropTypes.object,
    title: PropTypes.string,
};

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = (dispatch: $TSFixMe) => bindActionCreators({ closeModal }, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(ViewJsonLogs);