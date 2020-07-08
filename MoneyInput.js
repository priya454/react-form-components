import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { currencyTools } from '../../utils/tools/currencyTools';


const MoneyInput  = props => {

    const {
        inputData: {
            id,
            isInputRequired,
            isOnlyPositiveAvailable,
            helperClasses,
            inputClasses,
            name,
            placeholder,
            type,
            value
        },
        inputActions: {
            handleFieldChange
        },
        label: {
            text,
            labelClasses
        },
    } = props;

    const [ currentValue, updateCurrentValue ] = useState(currencyTools.getMoneyFormat(value, true));

    useEffect(() => {
        updateCurrentValue(currencyTools.getMoneyFormat(value, true));
    }, [value]);

    const handleValueChange = e => {
        const { value } = e.target;

        let regex = /^[0-9.-]*$/;
        if(isOnlyPositiveAvailable) {
            regex = /^[0-9.]*$/;
        }

        if(value.match(regex) && value[Symbol.for('analyze-number')]()) {
            updateCurrentValue(value);
        }
    };

    const handleValueFocus = e => {
        const { value } = e.target;
        updateCurrentValue(value ? currencyTools.localStringToNumber(value) : '');
    };

    const handleValueBlur = () => {
        handleFieldChange(Math.trunc(currentValue * 100));
        updateCurrentValue(currencyTools.getMoneyFormat(currentValue, false));
    };

    return (
        <Fragment>
            <div className={`grid-row gi-component gi-${type} ${helperClasses && helperClasses.join(' ')}`}>
                <label
                    htmlFor={id}
                    className={`gi-${type}__label ${labelClasses && labelClasses.join(' ')} required-${isInputRequired}`}
                    aria-label={text}
                >
                    { text }
                </label>
                <input
                    id={id}
                    className={`${inputClasses && inputClasses.join(' ')} gi-${type}__input`}
                    name={name}
                    type="text"
                    value={currentValue || ''}
                    aria-required={isInputRequired}
                    placeholder={placeholder}
                    onChange={handleValueChange}
                    onBlur={handleValueBlur}
                    onFocus={handleValueFocus}
                />
            </div>
        </Fragment>
    );
};

MoneyInput.propTypes = {
    inputData: PropTypes.shape({
        name: PropTypes.string.isRequired,
        classes: PropTypes.arrayOf([PropTypes.string]),
        value: PropTypes.any,
        placeholder: PropTypes.string,
    })
};

export default MoneyInput;
