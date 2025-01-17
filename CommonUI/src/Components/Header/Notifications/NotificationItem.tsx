import React, { FunctionComponent, ReactElement } from 'react';
import CircularIconImage from '../../Icon/CircularIconImage';
import Icon, { IconProp } from '../../Icon/Icon';
import OneUptimeDate from 'Common/Types/Date';

export interface ComponentProps {
    icon: IconProp;
    title: string;
    description: string;
    createdAt: Date;
}

const NotificationItem: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): ReactElement => {
    return (
        <a className="text-reset notification-item" href="/">
            <div className="d-flex">
                <CircularIconImage icon={props.icon} />
                <div className="flex-grow-1">
                    <h6 className="mt-0 mb-1">{props.title}</h6>
                    <div className="font-size-12 text-muted">
                        <p className="mb-1">{props.description}</p>
                        <p className="mb-0">
                            <Icon icon={IconProp.Time} /> &nbsp;
                            {OneUptimeDate.fromNow(props.createdAt)}{' '}
                        </p>
                    </div>
                </div>
            </div>
        </a>
    );
};

export default NotificationItem;
