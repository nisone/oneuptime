import React, { FunctionComponent, ReactElement, useState } from 'react';
import OneUptimeDate from 'Common/Types/Date';

export enum ToastType {
    DANGER,
    SUCCESS,
    INFO,
    WARNING,
    NORMAL,
}

export interface ComponentProps {
    title: string;
    description: string;
    onClose?: () => void;
    type?: ToastType;
    createdAt?: Date;
}

const Component: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): ReactElement => {
    const [show, setShow] = useState<boolean>(true);
    let typeCssClass: string = 'text-info';

    if (props.type === ToastType.DANGER) {
        typeCssClass = 'text-danger';
    }

    if (props.type === ToastType.SUCCESS) {
        typeCssClass = 'text-success';
    }

    if (props.type === ToastType.WARNING) {
        typeCssClass = 'text-warning';
    }

    if (show) {
        return (
            <div
                className="position-fixed top-0 end-0 p-3"
                style={{ zIndex: '1005' }}
            >
                <div className="toast fade show" role="alert">
                    <div className="toast-header">
                        {props.type && (
                            <div
                                role="status"
                                className={`spinner-grow-sm spinner-grow ${typeCssClass}`}
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>
                        )}
                        <strong className="me-auto ms-2">{props.title}</strong>
                        {props.createdAt && (
                            <small>
                                {OneUptimeDate.fromNow(props.createdAt)}
                            </small>
                        )}

                        <button
                            onClick={() => {
                                setShow(false);
                                props.onClose && props.onClose();
                            }}
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="toast-body">{props.description}</div>
                </div>
            </div>
        );
    }
    return <></>;
};

export default Component;
