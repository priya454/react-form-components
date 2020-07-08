import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl/dist';


const ErrorMessage = props => {

    const {
        isVisible,
        messageText = false,
        textReplacements,
        errorWrapperClasses,
        errorClasses
    } = props;

    return (
        <div className={`grid-row margin-tb-5 ${errorWrapperClasses ? errorWrapperClasses.join(' ') : ''}`}>
            <span className={`${isVisible ? 'shown' : 'hidden'} error--msg ${errorClasses ? errorClasses.join(' ') : ''}`}>
                <em>
                    <FontAwesomeIcon icon="exclamation"/>
                </em>
                <FormattedMessage
                    id={ messageText === false ? 'common.no_text' : messageText }
                    values={{ text: textReplacements }}/>
            </span>
        </div>
    );
};

export default ErrorMessage;