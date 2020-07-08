import React, { Fragment, useState, useEffect } from 'react';

// Component

import ValidationErrorMessage from '../../components/ssap/notifications/ValidationErrorMessage';

// Utils

import { socialSecurityNumberTools } from '../../utils/tools/socialSecurityNumberTools';
import validators from '../../utils/validators/validators';

// Constants

import { VALIDATION_TYPES } from '../../constants/inputs/validationTypes';
import { VALIDATION_ERROR_MESSAGES } from '../../constants/inputs/validationErrorMessages';


const SocialSecurityNumberInput = props => {

    const {
        inputData: {
            id,
            isInputRequired,
            helperClasses,
            name,
            placeholder,
            type,
            value,
            valuesToMatch,
            validationType
        },
        inputActions: {
            handleFieldChange
        },
        label: {
            text,
            labelClasses
        },
    } = props;

    const [ localState, setLocalState ] = useState({
        currentSsn: value,
        isHidden: true
    });

    const [ isWarningVisible, toggleVisability ] = useState(false);

    const {
        currentSsn,
        isHidden
    } = localState;

    useEffect(() => {
        if(isHidden) {
            setLocalState(state => ({
                ...state,
                currentSsn: value
            }));
        }
    }, [value, isHidden]);

    const showWarning = () => {
        toggleVisability(true);
        setTimeout(() => {
            toggleVisability(false);
        }, 3000);
    };

    const handleSsnFocus = () => {
        setLocalState({
            currentSsn: socialSecurityNumberTools.getOnFocus(currentSsn),
            isHidden: false
        });
    };

    const handleSsnChange = e => {
        const { value: nextSsnValue } = e.target;

        if(
            (nextSsnValue.length > currentSsn.length) && isNaN(+nextSsnValue.slice(-1)) ||
            nextSsnValue.length > 11
        ) {
            return null;
        }

        const ssnNumberToSave = socialSecurityNumberTools.autoFillSsn(nextSsnValue, currentSsn);

        setLocalState(state => ({
            ...state,
            currentSsn: ssnNumberToSave
        }));
    };

    const handleSsnBlur = () => {
        const isSsnNumberValid =
            validators
                .find(validator => validator.validatorType === VALIDATION_TYPES[validationType])
                .verifier({ value: socialSecurityNumberTools.cleanedUpSsn(currentSsn) });

        const isSsnUnique = validators
            .find(validator => validator.validatorType === VALIDATION_TYPES.UNIQUE)
            .verifier({ value: socialSecurityNumberTools.cleanedUpSsn(currentSsn), valuesToMatch: valuesToMatch });

        if(!isSsnUnique) {
            showWarning();
        }

        handleFieldChange((isSsnNumberValid && isSsnUnique) ? socialSecurityNumberTools.cleanedUpSsn(currentSsn) : null);

        setLocalState(state => ({
            ...state,
            isHidden: true
        }));
    };

    return (
        <Fragment>
            <ValidationErrorMessage
                isVisible={isWarningVisible}
                messageText={VALIDATION_ERROR_MESSAGES.NOT_UNIQUE_SSN}
                errorClasses={['margin-l-0']}
            />
            <div className={`grid-row gi-component gi-${type} ${helperClasses && helperClasses.join(' ')}`}>
                <label
                    htmlFor={id}
                    className={`tablet:grid-col-4 gi-${type}__label ${labelClasses && labelClasses.join(' ')} required-${isInputRequired}`}
                    aria-label={isInputRequired}
                >
                    { text }
                </label>
                <input
                    id={id}
                    className={`tablet:grid-col-6 gi-${type}__input`}
                    name={name}
                    type="text"
                    value={
                        isHidden ?
                            socialSecurityNumberTools.maskSsn(currentSsn) :
                            socialSecurityNumberTools.getAdjustedSsn(currentSsn)
                    }
                    aria-required={isInputRequired}
                    placeholder={placeholder}
                    onChange={handleSsnChange}
                    onBlur={handleSsnBlur}
                    onFocus={handleSsnFocus}
                />
            </div>
        </Fragment>
    );
};

export default SocialSecurityNumberInput;

