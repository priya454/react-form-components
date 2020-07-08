import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl/dist';

const Link = (props) => {

    const {
        id,
        outerClass,
        classes,
        path,
        text,
        additionalProperties,
        replacements
    } = props;

    return (
        <Fragment>
            <div className={`gi-component ${outerClass ? outerClass.join(' ') : ''}`}>
                {additionalProperties ?
                    <a
                        href={path}
                        data-automation-id={id}
                        className={`gi-link ${classes ? classes.join(' ') : ''}`}
                        target={additionalProperties.target}
                        rel={additionalProperties.rel}
                    >
                        <FormattedMessage
                            id={text}
                            values={replacements}
                        />
                    </a>
                    : <a
                        href={path}
                        data-automation-id={id}
                        className={`gi-link ${classes ? classes.join(' ') : ''}`}>
                        <FormattedMessage id={text}/>
                    </a>
                }
            </div>
        </Fragment>
    );
};

export default Link;