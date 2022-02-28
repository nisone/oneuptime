import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { openModal, closeModal } from '../../actions/modal';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'uuid... Remove this comment to see the full error message
import { v4 as uuidv4 } from 'uuid';
import ViewJsonLogs from '../modals/ViewJsonLogs';
import DataPathHoC from '../DataPathHoC';
import { bindActionCreators } from 'redux';
import { ListLoader } from '../basic/Loader';
import { getLogSuccess } from '../../actions/applicationLog';
import PropTypes from 'prop-types';
import ShouldRender from '../basic/ShouldRender';
import { socket } from '../basic/Socket';

class LogList extends Component {
    constructor(props: $TSFixMe) {
        super(props);
        this.state = { viewJsonModalId: uuidv4() };
    }
    prevClicked = (skip: $TSFixMe, limit: $TSFixMe) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'handleNavigationButtonClick' does not ex... Remove this comment to see the full error message
        const { handleNavigationButtonClick } = this.props;
        handleNavigationButtonClick(skip ? parseInt(skip, 10) - 10 : 10, limit);
    };

    nextClicked = (skip: $TSFixMe, limit: $TSFixMe) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'handleNavigationButtonClick' does not ex... Remove this comment to see the full error message
        const { handleNavigationButtonClick } = this.props;
        handleNavigationButtonClick(skip ? parseInt(skip, 10) + 10 : 10, limit);
    };

    displayTags = (tags: $TSFixMe) => {
        if (!Array.isArray(tags)) {
            return '';
        }
        return tags.map(tag => {
            return (
                <span className="tag" key={tag}>
                    {' '}
                    {tag}{' '}
                </span>
            );
        });
    };

    openModalFunc = (content: $TSFixMe) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'openModal' does not exist on type 'Reado... Remove this comment to see the full error message
        this.props.openModal({
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'viewJsonModalId' does not exist on type ... Remove this comment to see the full error message
            id: this.state.viewJsonModalId,
            content: DataPathHoC(ViewJsonLogs, {
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'viewJsonModalId' does not exist on type ... Remove this comment to see the full error message
                viewJsonModalId: this.state.viewJsonModalId,
                jsonLog: content,
                title: `Logs for ${
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'applicationLog' does not exist on type '... Remove this comment to see the full error message
                    this.props.applicationLog
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'applicationLog' does not exist on type '... Remove this comment to see the full error message
                        ? this.props.applicationLog.name
                        : 'Unknown'
                }`,
                rootName: 'content',
            }),
        });
    };

    componentWillUnmount() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'applicationLogId' does not exist on type... Remove this comment to see the full error message
        socket.removeListener(`createLog-${this.props.applicationLogId}`);
    }

    render() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'applicationLogId' does not exist on type... Remove this comment to see the full error message
        if (this.props.applicationLogId) {
            // join application log room
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'applicationLogId' does not exist on type... Remove this comment to see the full error message
            socket.emit('application_log_switch', this.props.applicationLogId);

            // @ts-expect-error ts-migrate(2339) FIXME: Property 'applicationLogId' does not exist on type... Remove this comment to see the full error message
            socket.on(`createLog-${this.props.applicationLogId}`, (data: $TSFixMe) => {
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'getLogSuccess' does not exist on type 'R... Remove this comment to see the full error message
                this.props.getLogSuccess(data);
            });
        }
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'logs' does not exist on type 'Readonly<{... Remove this comment to see the full error message
        const { logs } = this.props;
        let skip = logs && logs.skip ? logs.skip : null;
        let limit = logs && logs.limit ? logs.limit : null;
        const count = logs && logs.count ? logs.count : null;
        if (skip && typeof skip === 'string') {
            skip = parseInt(skip, 10);
        }
        if (limit && typeof limit === 'string') {
            limit = parseInt(limit, 10);
        }
        if (!skip) skip = 0;
        if (!limit) limit = 0;

        let canNext = count && count > skip + limit ? true : false;
        let canPrev = skip <= 0 ? false : true;

        if (
            logs &&
            (logs.requesting ||
                !logs.logs ||
                (logs.logs && logs.logs.length < 1))
        ) {
            canNext = false;
            canPrev = false;
        }

        return (
            <div>
                <div style={{ overflow: 'hidden', overflowX: 'auto' }}>
                    <table className="Table">
                        <thead className="Table-body">
                            <tr className="Table-row db-ListViewItem db-ListViewItem-header">
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
                                    style={{ height: '1px', minWidth: '100px' }}
                                >
                                    <div className="db-ListViewItem-cellContent Box-root Padding-all--8">
                                        <span className="db-ListViewItem-text Text-color--dark Text-display--inline Text-fontSize--13 Text-fontWeight--medium Text-lineHeight--20 Text-typeface--upper Text-wrap--wrap">
                                            <span>Type </span>
                                        </span>
                                    </div>
                                </td>
                                <td
                                    className="Table-cell Table-cell--align--left Table-cell--verticalAlign--top Table-cell--width--minimized Table-cell--wrap--noWrap db-ListViewItem-cell"
                                    style={{ height: '1px', minWidth: '210px' }}
                                >
                                    <div className="db-ListViewItem-cellContent Box-root Padding-all--8">
                                        <span className="db-ListViewItem-text Text-color--dark Text-display--inline Text-fontSize--13 Text-fontWeight--medium Text-lineHeight--20 Text-typeface--upper Text-wrap--wrap">
                                            <span>Log</span>
                                        </span>
                                    </div>
                                </td>

                                <td
                                    id="placeholder-right"
                                    className="Table-cell Table-cell--align--left Table-cell--verticalAlign--top Table-cell--wrap--noWrap db-ListViewItem-cell"
                                    style={{
                                        height: '1px',
                                        maxWidth: '28px',
                                        minWidth: '28px',
                                        width: '28px',
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
                                            <span>Created At </span>
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {logs && logs.logs && logs.logs.length > 0 ? (
                                logs.logs.map((log: $TSFixMe, i: $TSFixMe) => {
                                    return (
                                        <tr
                                            id={`applicationLog_${
                                                log.applicationLogId &&
                                                log.applicationLogId.name
                                                    ? log.applicationLogId.name
                                                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'applicationLog' does not exist on type '... Remove this comment to see the full error message
                                                    : this.props.applicationLog
                                                          .name
                                                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'applicationLog' does not exist on type '... Remove this comment to see the full error message
                                                    ? this.props.applicationLog
                                                          .name
                                                    : 'Unknown Log Container'
                                            }_${i}`}
                                            key={log._id}
                                            className="Table-row db-ListViewItem bs-ActionsParent db-ListViewItem--hasLink incidentListItem"
                                            onClick={() =>
                                                this.openModalFunc(log.content)
                                            }
                                        >
                                            <td
                                                id="placeholder-right"
                                                className="Table-cell Table-cell--align--left Table-cell--verticalAlign--top Table-cell--wrap--noWrap db-ListViewItem-cell"
                                                style={{
                                                    height: '1px',
                                                    maxWidth: '28px',
                                                    minWidth: '28px',
                                                    width: '28px',
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
                                                <div className="db-ListViewItem-link">
                                                    <div className="db-ListViewItem-cellContent Box-root Padding-horizontal--2 Padding-vertical--8 Flex-flex Flex-alignItems--center">
                                                        <span className="db-ListViewItem-text Text-color--inherit Text-display--inline Text-fontSize--14 Text-fontWeight--regular Text-lineHeight--20 Text-typeface--base Text-wrap--wrap">
                                                            <div className="Box-root Flex-flex Flex-direction--column">
                                                                <div className="db-RadarRulesListUserName Box-root Flex-flex Flex-alignItems--center Flex-direction--row Flex-justifyContent--flexStart">
                                                                    {log &&
                                                                    log.type &&
                                                                    log.type ===
                                                                        'error' ? (
                                                                        <div className="Badge Badge--color--red Box-root Flex-inlineFlex Flex-alignItems--center Padding-horizontal--8 Padding-vertical--2">
                                                                            <span className="Badge-text Text-color--red Text-display--inline Text-fontSize--12 Text-fontWeight--bold Text-lineHeight--16 Text-typeface--upper Text-wrap--noWrap">
                                                                                <span>
                                                                                    error
                                                                                </span>
                                                                            </span>
                                                                        </div>
                                                                    ) : log &&
                                                                      log.type &&
                                                                      log.type ===
                                                                          'info' ? (
                                                                        <div className="Badge Badge--color--green Box-root Flex-inlineFlex Flex-alignItems--center Padding-horizontal--8 Padding-vertical--2">
                                                                            <span className="Badge-text Text-color--green Text-display--inline Text-fontSize--12 Text-fontWeight--bold Text-lineHeight--16 Text-typeface--upper Text-wrap--noWrap">
                                                                                <span>
                                                                                    info
                                                                                </span>
                                                                            </span>
                                                                        </div>
                                                                    ) : log &&
                                                                      log.type &&
                                                                      log.type ===
                                                                          'warning' ? (
                                                                        <div className="Badge Badge--color--yellow Box-root Flex-inlineFlex Flex-alignItems--center Padding-horizontal--8 Padding-vertical--2">
                                                                            <span className="Badge-text Text-color--yellow Text-display--inline Text-fontSize--12 Text-fontWeight--bold Text-lineHeight--16 Text-typeface--upper Text-wrap--noWrap">
                                                                                <span>
                                                                                    warning
                                                                                </span>
                                                                            </span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="Badge Badge--color--red Box-root Flex-inlineFlex Flex-alignItems--center Padding-horizontal--8 Padding-vertical--2">
                                                                            <span className="Badge-text Text-color--red Text-display--inline Text-fontSize--12 Text-fontWeight--bold Text-lineHeight--16 Text-typeface--upper Text-wrap--noWrap">
                                                                                <span>
                                                                                    Unknown
                                                                                    Type
                                                                                </span>
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="Flex-flex Flex-wrap--wrap Padding-top--8">
                                                                    {this.displayTags(
                                                                        log.tags
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td
                                                className="Table-cell Table-cell--verticalAlign--top Table-cell--width--minimized Table-cell--wrap db-ListViewItem-cell"
                                                style={{
                                                    height: '1px',
                                                    maxWidth: '450px',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        maxWidth: '450px',
                                                    }}
                                                    className="db-ListViewItem-link"
                                                >
                                                    <div className="db-ListViewItem-cellContent Box-root Padding-horizontal--2 Padding-vertical--8 Flex-flex Flex-alignItems--center">
                                                        <span className="db-ListViewItem-text Text-color--inherit Text-display--inline Text-fontSize--14 Text-fontWeight--regular Text-lineHeight--20 Text-typeface--base Text-wrap--wrap">
                                                            <div className="Box-root Flex">
                                                                <div className="Box-root Flex-flex">
                                                                    <div className="db-RadarRulesListUserName Box-root Flex-flex Flex-alignItems--center Flex-direction--row Flex-justifyContent--flexStart">
                                                                        <div className="Box-root Flex-inlineFlex Flex-alignItems--center Padding-horizontal--8 Padding-vertical--2">
                                                                            {typeof log.content ===
                                                                            'string' ? (
                                                                                <span>
                                                                                    {
                                                                                        log.content
                                                                                    }
                                                                                </span>
                                                                            ) : (
                                                                                <div
                                                                                    style={{
                                                                                        display:
                                                                                            'flex',
                                                                                        alignItems:
                                                                                            'center',
                                                                                    }}
                                                                                >
                                                                                    <ShouldRender
                                                                                        if={
                                                                                            log.stringifiedContent
                                                                                        }
                                                                                    >
                                                                                        <div
                                                                                            style={{
                                                                                                color:
                                                                                                    'black',
                                                                                                backgroundColor:
                                                                                                    '#F9F9F9',
                                                                                                padding:
                                                                                                    '10px',
                                                                                                marginRight:
                                                                                                    '5px',
                                                                                            }}
                                                                                        >
                                                                                            <span>
                                                                                                {JSON.stringify(
                                                                                                    log.content,
                                                                                                    null,
                                                                                                    2
                                                                                                )}
                                                                                            </span>
                                                                                        </div>
                                                                                    </ShouldRender>

                                                                                    <button
                                                                                        title="viewJson"
                                                                                        id={`application_log_json_${log._id}`}
                                                                                        disabled={
                                                                                            !(
                                                                                                logs &&
                                                                                                !logs.requesting
                                                                                            )
                                                                                        }
                                                                                        className="bs-Button bs-DeprecatedButton db-Trends-editButton Flex-flex"
                                                                                        type="button"
                                                                                        onClick={() =>
                                                                                            this.openModalFunc(
                                                                                                log.content
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <img
                                                                                            style={{
                                                                                                width:
                                                                                                    '15px',
                                                                                                height:
                                                                                                    '15px',
                                                                                            }}
                                                                                            src={
                                                                                                '/dashboard/assets/img/more.svg'
                                                                                            }
                                                                                            alt="more-logs"
                                                                                        />
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td
                                                id="placeholder-right"
                                                className="Table-cell Table-cell--align--left Table-cell--verticalAlign--top Table-cell--wrap--noWrap db-ListViewItem-cell"
                                                style={{
                                                    height: '1px',
                                                    maxWidth: '28px',
                                                    minWidth: '28px',
                                                    width: '28px',
                                                }}
                                            >
                                                <div className="db-ListViewItem-cellContent Box-root Padding-all--8">
                                                    <span className="db-ListViewItem-text Text-color--dark Text-display--inline Text-fontSize--13 Text-fontWeight--medium Text-lineHeight--20 Text-typeface--upper Text-wrap--wrap"></span>
                                                </div>
                                            </td>
                                            <td
                                                className="Table-cell Table-cell--align--left Table-cell--verticalAlign--top Table-cell--width--minimized Table-cell--wrap--wrap db-ListViewItem-cell db-ListViewItem-cell--breakWord"
                                                style={{
                                                    height: '1px',
                                                }}
                                            >
                                                <div className="db-ListViewItem-link">
                                                    <div className="db-ListViewItem-cellContent Box-root Padding-horizontal--2 Padding-vertical--8 Flex-flex Flex-alignItems--center">
                                                        <div>
                                                            <div className="Box-root Flex-flex">
                                                                <div className="db-RadarRulesListUserName Box-root Flex-flex Flex-alignItems--center Flex-direction--row Flex-justifyContent--flexStart">
                                                                    <div className="Box-root Flex-inlineFlex Flex-alignItems--center Padding-horizontal--8 Padding-vertical--2">
                                                                        <span className="Text-display--inline Text-fontSize--14 Text-lineHeight--16 Text-wrap--noWrap">
                                                                            <span>
                                                                                {moment(
                                                                                    log.createdAt
                                                                                ).fromNow()}{' '}
                                                                            </span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div
                                                                    className="Box-root Flex Padding-horizontal--8"
                                                                    style={{
                                                                        paddingTop:
                                                                            '5px',
                                                                    }}
                                                                >
                                                                    <div className="db-RadarRulesListUserName Box-root Flex-flex Flex-alignItems--center Flex-direction--row Flex-justifyContent--flexStart">
                                                                        (
                                                                        {moment(
                                                                            log.createdAt
                                                                        ).format(
                                                                            'MMMM Do YYYY, h:mm:ss a'
                                                                        )}
                                                                        )
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr></tr>
                            )}
                        </tbody>
                    </table>
                    {logs && logs.requesting ? <ListLoader /> : null}
                </div>
                <div
                    style={{
                        textAlign: 'center',
                        marginTop: '10px',
                        padding: '0 10px',
                    }}
                >
                    {!logs ||
                    (logs &&
                        (!logs.logs || !logs.logs.length) &&
                        !logs.requesting &&
                        !logs.error)
                        ? "We don't have any logs yet"
                        : null}
                    {logs && logs.error ? logs.error : null}
                </div>
                <div className="Box-root Flex-flex Flex-alignItems--center Flex-justifyContent--spaceBetween">
                    <div className="Box-root Flex-flex Flex-alignItems--center Padding-all--20">
                        <span className="Text-color--inherit Text-display--inline Text-fontSize--14 Text-fontWeight--regular Text-lineHeight--20 Text-typeface--base Text-wrap--wrap">
                            <span>
                                <span className="Text-color--inherit Text-display--inline Text-fontSize--14 Text-fontWeight--medium Text-lineHeight--20 Text-typeface--base Text-wrap--wrap">
                                    {count
                                        ? count + (count > 1 ? ' Logs' : ' Log')
                                        : '0 Logs'}
                                </span>
                            </span>
                        </span>
                    </div>
                    <div className="Box-root Padding-horizontal--20 Padding-vertical--16">
                        <div className="Box-root Flex-flex Flex-alignItems--stretch Flex-direction--row Flex-justifyContent--flexStart">
                            <div className="Box-root Margin-right--8">
                                <button
                                    id="btnPrev"
                                    onClick={() => {
                                        this.prevClicked(skip, limit);
                                    }}
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
                                    id="btnNext"
                                    onClick={() => {
                                        this.nextClicked(skip, limit);
                                    }}
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
        );
    }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'displayName' does not exist on type 'typ... Remove this comment to see the full error message
LogList.displayName = 'LogList';

const mapDispatchToProps = (dispatch: $TSFixMe) => {
    return bindActionCreators(
        { openModal, closeModal, getLogSuccess },
        dispatch
    );
};
// @ts-expect-error ts-migrate(2339) FIXME: Property 'propTypes' does not exist on type 'typeo... Remove this comment to see the full error message
LogList.propTypes = {
    applicationLogId: PropTypes.string,
    applicationLog: PropTypes.object,
    logs: PropTypes.object,
    openModal: PropTypes.func,
    handleNavigationButtonClick: PropTypes.func,
    getLogSuccess: PropTypes.func,
};
function mapStateToProps(state: $TSFixMe, props: $TSFixMe) {
    const applicationLogId = props.applicationLog._id;
    const logs = state.applicationLog.logs[applicationLogId];
    return {
        applicationLogId,
        logs,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogList);