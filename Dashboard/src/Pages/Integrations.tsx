import React, { Component } from 'react';
import { connect } from 'react-redux';

import { PropTypes } from 'prop-types';

import { Fade } from 'react-awesome-reveal';
import WebHookBox from '../components/webHooks/WebHookBox';
import ZapierBox from '../components/zapier/ZapierBox';

import BreadCrumbItem from '../components/breadCrumb/BreadCrumbItem';
import getParentRoute from '../Utils/getParentRoute';
import MSTeamsBox from '../components/webHooks/MSTeamsBox';
import SlackBox from '../components/webHooks/SlackBox';
import IncomingRequestBox from '../components/webHooks/IncomingRequestBox';

import { Tab, Tabs, TabList, TabPanel, resetIdCounter } from 'react-tabs';

interface IntegrationsProps {
    location?: {
        pathname?: string
    };
    currentProject: object;
    switchToProjectViewerNav?: boolean;
}

class Integrations extends Component<ComponentProps> {
    constructor(props: $TSFixMe) {
        super(props);
        this.state = {
            tabIndex: 0,
        };
    }
    componentWillMount() {
        resetIdCounter();
    }

    tabSelected = (index: $TSFixMe) => {
        const tabSlider = document.getElementById('tab-slider');

        tabSlider.style.transform = `translate(calc(${tabSlider.offsetWidth}px*${index}), 0px)`;
        this.setState({
            tabIndex: index,
        });
    };
    override render() {
        const {

            location: { pathname },

            currentProject,

            switchToProjectViewerNav,
        } = this.props;
        const projectName = currentProject ? currentProject.name : '';
        const projectId = currentProject ? currentProject._id : '';
        return (
            <Fade>
                <BreadCrumbItem
                    route="/"
                    name={projectName}
                    projectId={projectId}
                    slug={currentProject ? currentProject.slug : null}

                    switchToProjectViewerNav={switchToProjectViewerNav}
                />
                <BreadCrumbItem

                    route={getParentRoute(pathname)}
                    name="Project Settings"
                />
                <BreadCrumbItem route={pathname} name="Integrations" />
                <Tabs
                    selectedTabClassName={'custom-tab-selected'}
                    onSelect={(tabIndex: $TSFixMe) => this.tabSelected(tabIndex)}

                    selectedIndex={this.state.tabIndex}
                >
                    <div className="Flex-flex Flex-direction--columnReverse">
                        <TabList
                            id="customTabList"
                            className={'custom-tab-list'}
                        >
                            <Tab
                                className={
                                    'custom-tab custom-tab-3 webhook-tab'
                                }
                            >
                                Webhooks
                            </Tab>
                            <Tab
                                className={
                                    'custom-tab custom-tab-3 http-request-tab'
                                }
                            >
                                Incoming Http Request
                            </Tab>
                            <Tab
                                className={
                                    'custom-tab custom-tab-3 microsoft-slack-zapier-tab'
                                }
                            >
                                Microsoft, Slack and Zapier
                            </Tab>
                            <div id="tab-slider" className="custom-tab-3"></div>
                        </TabList>
                    </div>
                    <TabPanel>
                        <Fade>
                            <WebHookBox />
                        </Fade>
                    </TabPanel>
                    <TabPanel>
                        <Fade>
                            <IncomingRequestBox />
                        </Fade>
                    </TabPanel>
                    <TabPanel>
                        <Fade>
                            <MSTeamsBox />
                            <SlackBox />
                            <ZapierBox />
                        </Fade>
                    </TabPanel>
                </Tabs>
            </Fade>
        );
    }
}


Integrations.propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string,
    }),
    currentProject: PropTypes.object.isRequired,
    switchToProjectViewerNav: PropTypes.bool,
};


Integrations.displayName = 'Integrations';

const mapStateToProps = (state: RootState) => {
    return {
        currentProject: state.project.currentProject,
        switchToProjectViewerNav: state.project.switchToProjectViewerNav,
    };
};

export default connect(mapStateToProps)(Integrations);