import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'uuid... Remove this comment to see the full error message
import { v4 as uuidv4 } from 'uuid';
import { fetchSsos, deleteSso, fetchSso } from '../../actions/sso';
import { fetchSsoDefaultRoles } from '../../actions/ssoDefaultRoles';
import moment from 'moment';
import { openModal } from '../../actions/modal';
import SsoDeleteModal from './sso/SsoDeleteModal';
import { SsoAddModal, SsoUpdateModal } from './sso/SsoModal';
import ShouldRender from '../basic/ShouldRender';

export class Component extends React.Component {
    state = {
        ssoModalId: uuidv4(),
        page: 1,
    };

    async componentDidMount() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'fetchSsos' does not exist on type 'Reado... Remove this comment to see the full error message
        await this.props.fetchSsos();

        window.addEventListener('keydown', this.handleKeyboard);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyboard);
    }

    handleKeyboard = (event: $TSFixMe) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'modalId' does not exist on type 'Readonl... Remove this comment to see the full error message
        const { modalId, modalList } = this.props;
        const { ssoModalId } = this.state;

        if (event.target.localName === 'body' && event.key) {
            switch (event.key) {
                case 'N':
                case 'n':
                    if (modalList.length === 0 && modalId !== ssoModalId) {
                        event.preventDefault();
                        return this.addSso();
                    }
                    return false;
                default:
                    return false;
            }
        }
    };

    addSso = async () => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'openModal' does not exist on type 'Reado... Remove this comment to see the full error message
        this.props.openModal({
            id: this.state.ssoModalId,
            onConfirm: () => {},
            content: SsoAddModal,
        });
        this.setState({ page: 1 });
    };

    deleteSso = async (ssoId: $TSFixMe) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'openModal' does not exist on type 'Reado... Remove this comment to see the full error message
        this.props.openModal({
            id: ssoId,
            onConfirm: async () => {
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'deleteSso' does not exist on type 'Reado... Remove this comment to see the full error message
                await this.props.deleteSso(ssoId);
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'fetchSsoDefaultRoles' does not exist on ... Remove this comment to see the full error message
                await this.props.fetchSsoDefaultRoles();
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'fetchSsos' does not exist on type 'Reado... Remove this comment to see the full error message
                return this.props.fetchSsos();
            },
            content: SsoDeleteModal,
        });
    };

    editSso = async (ssoId: $TSFixMe) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'fetchSso' does not exist on type 'Readon... Remove this comment to see the full error message
        this.props.fetchSso(ssoId);
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'openModal' does not exist on type 'Reado... Remove this comment to see the full error message
        this.props.openModal({
            id: ssoId,
            onConfirm: async () => {
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'fetchSsos' does not exist on type 'Reado... Remove this comment to see the full error message
                return this.props.fetchSsos();
            },
            content: SsoUpdateModal,
        });
    };

    previousClicked = async () => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'ssos' does not exist on type 'Readonly<{... Remove this comment to see the full error message
        const { ssos } = this.props;
        const { skip, limit } = ssos;
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'fetchSsos' does not exist on type 'Reado... Remove this comment to see the full error message
        await this.props.fetchSsos(skip - limit >= 0 ? skip - limit : 0, limit);
        this.setState({ page: this.state.page > 1 ? this.state.page - 1 : 1 });
    };

    nextClicked = async () => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'ssos' does not exist on type 'Readonly<{... Remove this comment to see the full error message
        const { ssos } = this.props;
        const { skip, limit } = ssos;
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'fetchSsos' does not exist on type 'Reado... Remove this comment to see the full error message
        await this.props.fetchSsos(skip + limit, limit);
        this.setState({ page: this.state.page + 1 });
    };

    render() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'ssos' does not exist on type 'Readonly<{... Remove this comment to see the full error message
        const { ssos } = this.props;
        const { count, skip, limit } = ssos;
        const canPrev = skip > 0;
        const canNext = skip + limit < count;
        const numberOfPages = Math.ceil(parseInt(count) / 10);
        return (
            <div
                id="oneuptimeSso"
                className="bs-ContentSection Card-root Card-shadow--medium"
            >
                <div className="Box-root">
                    <div className="ContentHeader Box-root Box-background--white Box-divider--surface-bottom-1 Flex-flex Flex-direction--column Padding-horizontal--20 Padding-vertical--16">
                        <div className="Box-root Flex-flex Flex-direction--row Flex-justifyContent--spaceBetween">
                            <div className="ContentHeader-center Box-root Flex-flex Flex-direction--column Flex-justifyContent--center">
                                <span className="ContentHeader-title Text-color--inherit Text-display--inline Text-fontSize--16 Text-fontWeight--medium Text-lineHeight--28 Text-typeface--base Text-wrap--wrap">
                                    <span
                                        style={{
                                            textTransform: 'capitalize',
                                        }}
                                    >
                                        Single sign-on (SSO)
                                    </span>
                                </span>
                                <span className="ContentHeader-description Text-color--inherit Text-display--inline Text-fontSize--14 Text-fontWeight--regular Text-lineHeight--20 Text-typeface--base Text-wrap--wrap">
                                    <span>
                                        Admins and agents use your SSO service
                                        to sign in to OneUptime. Requires
                                        configuration.
                                    </span>
                                </span>
                            </div>
                            <div className="ContentHeader-end Box-root Flex-flex Flex-alignItems--center Margin-left--16">
                                <div className="Box-root">
                                    <div className="ContentHeader-end Box-root Flex-flex Flex-alignItems--center Margin-left--16">
                                        <div>
                                            <button
                                                id="add-sso"
                                                className="bs-Button bs-ButtonLegacy ActionIconParent"
                                                type="button"
                                                onClick={this.addSso}
                                                style={{
                                                    marginLeft: '8px',
                                                    paddingTop: 3,
                                                    paddingBottom: 3,
                                                }}
                                            >
                                                <span className="bs-FileUploadButton bs-Button--icon bs-Button--new keycode__wrapper">
                                                    <span>Add SSO</span>
                                                    <span className="new-btn__keycode">
                                                        N
                                                    </span>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ overflow: 'auto hidden' }}>
                        <table className="Table">
                            <thead className="Table-body">
                                <tr className="Table-row db-ListViewItem db-ListViewItem-header">
                                    <td
                                        className="Table-cell Table-cell--align--left Table-cell--verticalAlign--top Table-cell--width--minimized Table-cell--wrap--noWrap db-ListViewItem-cell"
                                        style={{
                                            height: '1px',
                                            minWidth: '270px',
                                        }}
                                    >
                                        <div className="db-ListViewItem-cellContent Box-root Padding-all--8">
                                            <span className="db-ListViewItem-text Text-color--dark Text-display--inline Text-fontSize--13 Text-fontWeight--medium Text-lineHeight--20 Text-typeface--upper Text-wrap--wrap">
                                                <span>domain</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td
                                        id="placeholder-left"
                                        className="Table-cell Table-cell--align--left Table-cell--verticalAlign--top Table-cell--wrap--noWrap db-ListViewItem-cell"
                                        style={{
                                            height: '1px',
                                            maxWidth: '48px',
                                            minWidth: '48px',
                                            width: '48px',
                                        }}
                                    >
                                        <div className="db-ListViewItem-cellContent Box-root Padding-all--8">
                                            <span className="db-ListViewItem-text Text-color--dark Text-display--inline Text-fontSize--13 Text-fontWeight--medium Text-lineHeight--20 Text-typeface--upper Text-wrap--wrap"></span>
                                        </div>
                                    </td>
                                    <td
                                        className="Table-cell Table-cell--align--left Table-cell--verticalAlign--top Table-cell--width--minimized Table-cell--wrap--noWrap db-ListViewItem-cell"
                                        style={{ height: '1px' }}
                                    >
                                        <div className="db-ListViewItem-cellContent Box-root Padding-all--8">
                                            <span className="db-ListViewItem-text Text-color--dark Text-display--inline Text-fontSize--13 Text-fontWeight--medium Text-lineHeight--20 Text-typeface--upper Text-wrap--wrap">
                                                <span>Created At</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td
                                        id="placeholder-right"
                                        className="Table-cell Table-cell--align--left Table-cell--verticalAlign--top Table-cell--wrap--noWrap db-ListViewItem-cell"
                                        style={{
                                            height: '1px',
                                            maxWidth: '48px',
                                            minWidth: '48px',
                                            width: '48px',
                                        }}
                                    >
                                        <div className="db-ListViewItem-cellContent Box-root Padding-all--8">
                                            <span className="db-ListViewItem-text Text-color--dark Text-display--inline Text-fontSize--13 Text-fontWeight--medium Text-lineHeight--20 Text-typeface--upper Text-wrap--wrap"></span>
                                        </div>
                                    </td>
                                    <td
                                        className="Table-cell Table-cell--align--left Table-cell--verticalAlign--top Table-cell--width--minimized Table-cell--wrap--noWrap db-ListViewItem-cell"
                                        style={{
                                            height: '1px',
                                            textAlign: 'right',
                                        }}
                                    >
                                        <div className="db-ListViewItem-cellContent Box-root Padding-all--8">
                                            <span className="db-ListViewItem-text Text-color--dark Text-display--inline Text-fontSize--13 Text-fontWeight--medium Text-lineHeight--20 Text-typeface--upper Text-wrap--wrap">
                                                <span>actions</span>
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            </thead>
                            <tbody className="Table-body">
                                {ssos.count === 0 && (
                                    <tr className="Table-row db-ListViewItem bs-ActionsParent db-ListViewItem--hasLink">
                                        <td
                                            className="Table-cell Table-cell--align--left Table-cell--verticalAlign--top Table-cell--width--minimized Table-cell--wrap--wrap db-ListViewItem-cell db-ListViewItem-cell--breakWord"
                                            style={{
                                                height: '1px',
                                                minWidth: '270px',
                                            }}
                                            // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'number | ... Remove this comment to see the full error message
                                            colSpan="5"
                                        >
                                            <div className="db-ListViewItem-cellContent Box-root Padding-all--8">
                                                <span className="db-ListViewItem-text Text-color--cyan Text-display--inline Text-fontSize--14 Text-fontWeight--medium Text-lineHeight--20 Text-typeface--base Text-wrap--wrap">
                                                    <div
                                                        id="no-sso-message"
                                                        style={{
                                                            textAlign: 'center',
                                                            marginTop: '10px',
                                                        }}
                                                        className="Box-root Margin-right--16"
                                                    >
                                                        <span>
                                                            No SSOs created yet
                                                        </span>
                                                    </div>
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {ssos.ssos.map((sso: $TSFixMe) => <tr
                                    key={sso._id}
                                    className="Table-row db-ListViewItem bs-ActionsParent db-ListViewItem--hasLink"
                                >
                                    <td
                                        className="Table-cell Table-cell--align--left Table-cell--verticalAlign--top Table-cell--width--minimized Table-cell--wrap--wrap db-ListViewItem-cell db-ListViewItem-cell--breakWord"
                                        style={{
                                            height: '1px',
                                            minWidth: '270px',
                                        }}
                                    >
                                        <div className="db-ListViewItem-cellContent Box-root Padding-all--8">
                                            <span className="db-ListViewItem-text Text-color--cyan Text-display--inline Text-fontSize--14 Text-fontWeight--medium Text-lineHeight--20 Text-typeface--base Text-wrap--wrap">
                                                <div className="Box-root Margin-right--16">
                                                    <span id="sso-domain">
                                                        {sso.domain}
                                                    </span>
                                                </div>
                                            </span>
                                        </div>
                                    </td>
                                    <td
                                        aria-hidden="true"
                                        className="Table-cell Table-cell--align--left Table-cell--verticalAlign--top Table-cell--wrap--noWrap db-ListViewItem-cell"
                                        style={{
                                            height: '1px',
                                            maxWidth: '48px',
                                            minWidth: '48px',
                                            width: '48px',
                                        }}
                                    >
                                        <div className="db-ListViewItem-link">
                                            <div className="db-ListViewItem-cellContent Box-root Padding-all--8">
                                                ⁣
                                            </div>
                                        </div>
                                    </td>
                                    <td
                                        className="Table-cell Table-cell--align--left Table-cell--verticalAlign--top Table-cell--width--minimized Table-cell--wrap--noWrap db-ListViewItem-cell"
                                        style={{ height: '1px' }}
                                    >
                                        <div className="db-ListViewItem-link">
                                            <div className="db-ListViewItem-cellContent Box-root Padding-all--8">
                                                {moment(
                                                    sso.createdAt
                                                ).fromNow()}
                                            </div>
                                        </div>
                                    </td>
                                    <td
                                        aria-hidden="true"
                                        className="Table-cell Table-cell--align--left Table-cell--verticalAlign--top Table-cell--wrap--noWrap db-ListViewItem-cell"
                                        style={{
                                            height: '1px',
                                            maxWidth: '48px',
                                            minWidth: '48px',
                                            width: '48px',
                                        }}
                                    >
                                        <div className="db-ListViewItem-link">
                                            <div className="db-ListViewItem-cellContent Box-root Padding-all--8">
                                                ⁣
                                            </div>
                                        </div>
                                    </td>
                                    <td
                                        className="Table-cell Table-cell--align--left Table-cell--verticalAlign--top Table-cell--width--minimized Table-cell--wrap--noWrap db-ListViewItem-cell"
                                        style={{
                                            height: '1px',
                                            textAlign: 'right',
                                        }}
                                    >
                                        <div
                                            className="db-ListViewItem-link"
                                            style={{
                                                marginTop: 10,
                                                paddingRight: 20,
                                            }}
                                        >
                                            <button
                                                className="bs-Button bs-DeprecatedButton db-Trends-editButton bs-Button--icon bs-Button--edit"
                                                id="edit-button"
                                                onClick={() =>
                                                    this.editSso(sso._id)
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bs-Button bs-DeprecatedButton db-Trends-editButton bs-Button--icon bs-Button--delete"
                                                id="delete-button"
                                                onClick={() =>
                                                    this.deleteSso(sso._id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>)}
                            </tbody>
                        </table>

                        <div className="bs-Tail bs-Tail--separated bs-Tail--short">
                            <div className="bs-Tail-copy">
                                {/* Code Refactor to remove undefined*/}
                                <span>
                                    <ShouldRender if={numberOfPages > 0}>
                                        Page {this.state.page} of{' '}
                                        {numberOfPages} (
                                        <span id="sso-count">{count} </span>SSO
                                        <ShouldRender if={count > 1}>
                                            s
                                        </ShouldRender>
                                        )
                                    </ShouldRender>
                                </span>
                            </div>
                            <div className="bs-Tail-actions">
                                <div className="ButtonGroup Box-root Flex-flex Flex-alignItems--center Flex-direction--row Flex-justifyContent--flexStart">
                                    <div className="Box-root Margin-right--8">
                                        <button
                                            id="previous-button"
                                            onClick={this.previousClicked}
                                            className={
                                                'Button bs-ButtonLegacy' +
                                                (canPrev ? '' : 'Is--disabled')
                                            }
                                            disabled={!canPrev}
                                            data-db-analytics-name="list_view.pagination.previous"
                                            type="button"
                                        >
                                            <div className="Button-fill bs-ButtonLegacy-fill Box-root Box-background--white Flex-inlineFlex Flex-alignItems--center Flex-direction--row Padding-horizontal--8 Padding-vertical--4">
                                                <span className="Button-label Text-color--default Text-display--inline Text-fontSize--14 Text-fontWeight--medium Text-lineHeight--20 Text-typeface--base Text-wrap--noWrap">
                                                    <span>Previous</span>
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                    <div className="Box-root">
                                        <button
                                            id="next-button"
                                            onClick={this.nextClicked}
                                            className={
                                                'Button bs-ButtonLegacy' +
                                                (canNext ? '' : 'Is--disabled')
                                            }
                                            disabled={!canNext}
                                            data-db-analytics-name="list_view.pagination.next"
                                            type="button"
                                        >
                                            <div className="Button-fill bs-ButtonLegacy-fill Box-root Box-background--white Flex-inlineFlex Flex-alignItems--center Flex-direction--row Padding-horizontal--8 Padding-vertical--4">
                                                <span className="Button-label Text-color--default Text-display--inline Text-fontSize--14 Text-fontWeight--medium Text-lineHeight--20 Text-typeface--base Text-wrap--noWrap">
                                                    <span>Next</span>
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'displayName' does not exist on type 'typ... Remove this comment to see the full error message
Component.displayName = 'SettingsForm';

// @ts-expect-error ts-migrate(2339) FIXME: Property 'propTypes' does not exist on type 'typeo... Remove this comment to see the full error message
Component.propTypes = {
    ssos: PropTypes.object.isRequired,
    fetchSsos: PropTypes.func.isRequired,
    fetchSso: PropTypes.func.isRequired,
    deleteSso: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    modalId: PropTypes.string,
    modalList: PropTypes.array,
    fetchSsoDefaultRoles: PropTypes.func,
};

const mapDispatchToProps = (dispatch: $TSFixMe) => {
    return bindActionCreators(
        {
            fetchSsos,
            fetchSso,
            deleteSso,
            openModal,
            fetchSsoDefaultRoles,
        },
        dispatch
    );
};

function mapStateToProps(state: $TSFixMe) {
    return {
        ssos: state.sso.ssos,
        modalId: state.modal.modals[0] && state.modal.modals[0].id,
        modalList: state.modal.modals,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);