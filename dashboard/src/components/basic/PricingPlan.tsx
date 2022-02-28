import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'uuid... Remove this comment to see the full error message
import { v4 as uuidv4 } from 'uuid';
import { PricingPlan, IS_SAAS_SERVICE } from '../../config';
import PricingPlanModal from './PricingPlanModal';
import { openModal } from '../../actions/modal';
import isOwnerOrAdmin from '../../utils/isOwnerOrAdmin';
import { User } from '../../config';
import Unauthorised from '../modals/Unauthorised';

const PricingPlanComponent = ({
    plan,
    hideChildren,
    children,
    currentProject,
    openModal,
    disabled = false
}: $TSFixMe) => {
    let category;
    const [pricingPlanModalId] = useState(uuidv4()); // initialise modal ID
    const isEnterprise =
        currentProject &&
        (currentProject.stripePlanId === 'enterprise' ? true : false);

    if (currentProject) {
        if (
            !isEnterprise &&
            PricingPlan.getPlanById(currentProject.stripePlanId)
        ) {
            // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
            category = PricingPlan.getPlanById(currentProject.stripePlanId)
                .category;
        }
    }

    const createAllowedPlans = (plan: $TSFixMe) => {
        const plans = ['Startup', 'Growth', 'Scale', 'Enterprise'];
        const planIndex = plans.indexOf(plan);
        const allowedPlans = [];
        for (let i = planIndex; i < plans.length; i++) {
            allowedPlans.push(plans[i]);
        }

        return allowedPlans;
    };

    const isAllowed = (plan: $TSFixMe, category: $TSFixMe) => {
        const allowedPlans = createAllowedPlans(plan);
        return allowedPlans.includes(category);
    };

    const handleModal = (e: $TSFixMe) => {
        e.preventDefault();
        // javascript enables bubbling by default
        // prevent propagation of the bubble
        e.stopPropagation();
        const userId = User.getUserId();
        if (!isOwnerOrAdmin(userId, currentProject)) {
            return openModal({
                id: userId,
                content: Unauthorised,
            });
        }

        openModal({
            id: pricingPlanModalId,
            content: PricingPlanModal,
            propArr: [{ plan }],
        });
    };

    return (
        <Fragment>
            {disabled || isEnterprise || !IS_SAAS_SERVICE ? (
                children
            ) : isAllowed(plan, category) ? (
                children
            ) : !hideChildren ? (
                <div id="pricingPlan" onClick={handleModal}>
                    {children}
                </div>
            ) : null}
        </Fragment>
    );
};

PricingPlanComponent.displayName = 'PricingPlan Component';

PricingPlanComponent.propTypes = {
    plan: PropTypes.string.isRequired,
    hideChildren: PropTypes.bool.isRequired,
    children: PropTypes.element.isRequired,
    currentProject: PropTypes.object,
    openModal: PropTypes.func,
    disabled: PropTypes.bool,
};

const mapStateToProps = (state: $TSFixMe) => {
    const currentPlanId =
        state.project &&
        state.project.currentProject &&
        state.project.currentProject.stripePlanId
            ? state.project.currentProject.stripePlanId
            : '';

    return {
        currentProject: state.project.currentProject,
        currentPlanId,
        error: state.project.changePlan.error,
    };
};

const mapDispatchToProps = (dispatch: $TSFixMe) => bindActionCreators({ openModal }, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PricingPlanComponent);