import React, { Fragment, useEffect, useState } from 'react';

// Utils

import { phoneNumberTools } from '../../utils/tools/phoneNumberTools';
import validators from '../../utils/validators/validators';


// Constants

import { VALIDATION_TYPES } from '../../constants/inputs/validationTypes';


const PhoneNumberInput = props => {

    const {
        inputData: {
            id,
            isInputRequired,
            helperClasses,
            name,
            placeholder,
            type,
            value,
            validationType
        },
        inputActions: {
            handleFieldChange
        },
        label: {
            text,
            labelClasses
        },
        labelIcon = {}
    } = props;

    const [ currentValue, updateCurrentValue ] = useState(phoneNumberTools.getAdjustedPhoneNumber(value));

    useEffect(() => {
        const newValue = phoneNumberTools.getAdjustedPhoneNumber(value);
        updateCurrentValue(newValue ? newValue : '');
    }, [value]);

    const handlePhoneChange = e => {
        const { value: nextPhoneNumberValue } = e.target;

        if((nextPhoneNumberValue.length > currentValue.length) &&
            isNaN(+nextPhoneNumberValue.slice(-1)) ||
            nextPhoneNumberValue.length > 14) {
            return null;
        }

        const phoneNumberToSave = phoneNumberTools.autoFillPhone(nextPhoneNumberValue, currentValue);

        updateCurrentValue(phoneNumberToSave);
    };

    const handlePhoneBlur = () => {
        const isPhoneNumberValid =
            validators
                .find(validator => validator.validatorType === VALIDATION_TYPES[validationType])
                .verifier({ value: currentValue });

        updateCurrentValue(isPhoneNumberValid ? currentValue : '');
        handleFieldChange(isPhoneNumberValid ? phoneNumberTools.cleanedUpPhone(currentValue) : null);
    };


    return (
        <Fragment>
            <div className={`grid-row gi-component gi-${type} ${helperClasses && helperClasses.join(' ')}`}>
                <label
                    htmlFor={id}
                    className={`tablet:grid-col-4 gi-${type}__label ${labelClasses && labelClasses.join(' ')} iconed-${!!labelIcon.icon} required-${isInputRequired}`}
                    aria-label={isInputRequired}
                >
                    { text }
                    { labelIcon.icon ? labelIcon.icon : null }
                </label>

                <input
                    id={id}
                    className={`tablet:grid-col-6 gi-${type}__input`}
                    name={name}
                    autoComplete="new-password"
                    type="text"
                    value={currentValue || ''}
                    aria-required={isInputRequired}
                    placeholder={placeholder}
                    onChange={handlePhoneChange}
                    onBlur={handlePhoneBlur}
                />
            </div>
        </Fragment>
    );
};

export default PhoneNumberInput;

