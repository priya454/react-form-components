import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl/dist';

import { ELEMENT_TYPES } from '../../../constants/elements/elementTypes';
const LinkButton = (props) => {

    const {
        id,
        outerClasses,
        classes,
        path,
        text,
        additionalProperties,
        replacements
    } = props;

    return (
        <Fragment>
            <div className={`gi-component ${outerClasses ? outerClasses.join(' ') : ''}`}>
                {additionalProperties ?
                    <a
                        href={path}
                        type={ ELEMENT_TYPES.BUTTON }
                        role={ ELEMENT_TYPES.BUTTON }
                        data-automation-id={id}
                        className={classes && classes.join(' ')}
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
                        type={ ELEMENT_TYPES.BUTTON }
                        role={ ELEMENT_TYPES.BUTTON }
                        data-automation-id={id}
                        className={classes && classes.join(' ')}>
                        <FormattedMessage id={text}/>
                    </a>
                }
            </div>
        </Fragment>
    );
};

export default LinkButton;