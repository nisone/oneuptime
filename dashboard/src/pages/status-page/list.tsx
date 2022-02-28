import React from 'react';
import Page, {
    defaultMapDispatchToProps,
    defaultMapStateToProps,
} from '../base/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Table from '../../components/table/Table';
import StatusPageActions from '../../actions/status-page';

const listActions = new StatusPageActions().getListActions();

class StatusPages extends Page {
    constructor(props: $TSFixMe) {
        super({
            pageName: 'StatusPages',
            friendlyPageName: 'Status Pages',
            pagePath: '/status-pages',
            showTutorial: true,
            ...props,
        });
    }

    componentDidMount() {}

    render() {
        return this.renderCommon(
            <>
                <Table
                    // @ts-expect-error ts-migrate(2322) FIXME: Type '{ id: string; title: string; description: st... Remove this comment to see the full error message
                    id="status-page-table"
                    title="Status Page"
                    description="Status Pages helps your team and your customers to view real-time status and health of your monitors. Status Page helps improve transparency and trust in your organization and with your customers."
                    columns={[]}
                    isLoading={false}
                    items={[]}
                    noItemsMessage="No status pages in this project."
                    headerButtons={[
                        {
                            id: 'create-status-page-btn',
                            title: 'Create Status Page',
                            shortcutKey: 'N',
                            onClick: () => {
                                // open modal here.
                            },
                            visibleForOwner: true,
                            visibleForAdmin: true,
                            visibleForViewer: false,
                            visibleForMember: true,
                            visibleForAll: false,
                        },
                    ]}
                    onNextClicked={() => {}}
                    onPreviousClicked={() => {}}
                    totalItemsCount={0}
                    friendlyName="Status Page"
                    friendlyNamePlural="Status Pages"
                    noOfItemsInPage={10}
                    actionButtons={[
                        {
                            id: 'edit-status-page-btn',
                            title: 'Edit',
                            onClick: (id: $TSFixMe) => {
                                this.goToPageInProject(`/status-page/${id}`);
                            },
                            visibleForOwner: true,
                            visibleForAdmin: true,
                            visibleForViewer: false,
                            visibleForMember: true,
                            visibleForAll: false,
                        },
                        {
                            id: 'view-status-page-btn',
                            title: 'View Status Page',
                            onClick: (id: $TSFixMe) => {
                                this.goToPageInProject(`/status-page/${id}`);
                            },
                            visibleForOwner: true,
                            visibleForAdmin: true,
                            visibleForViewer: true,
                            visibleForMember: true,
                            visibleForAll: true,
                        },
                    ]}
                    onClickTableRow={(id: $TSFixMe) => this.goToPageInProject(`/status-page/${id}`)
                    }
                />
            </>
        );
    }
}

const mapDispatchToProps = (dispatch: $TSFixMe) => {
    return bindActionCreators(
        {
            ...defaultMapDispatchToProps(),
            ...listActions,
        },
        dispatch
    );
};

function mapStateToProps(state: $TSFixMe) {
    return {
        ...defaultMapStateToProps(state),
    };
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'propTypes' does not exist on type 'typeo... Remove this comment to see the full error message
StatusPages.propTypes = {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaultPropTypes' does not exist on type... Remove this comment to see the full error message
    ...Page.defaultPropTypes,
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'displayName' does not exist on type 'typ... Remove this comment to see the full error message
StatusPages.displayName = 'StatusPages';

export default connect(mapStateToProps, mapDispatchToProps)(StatusPages);