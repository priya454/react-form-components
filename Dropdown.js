import React, { Fragment } from 'react';

import { normalizeDefaultToNull } from '../../utils/normalize/normalizeDefaultToNull';
import { normalizeStringToBooleanValue } from '../../utils/normalize/normalizeStringToBooleanValue';


const Dropdown = props => {

    const {
        inputData: {
            disabled,
            id,
            inputClass,
            isInputRequired,
            handleAsNumbers,
            name,
            options,
            returnAsBoolean,
            type,
            value
        },
        label: {
            labelClass,
            text
        },
        labelIcon = {}
    } = props;

    const handleValueChange = e => {
        const { value } = e.target;

        const text = (o => o ? (o.value === 'default' ? null: o.text) : null)(options.find(o => o.value === value));

        let valueForSaving;
        switch(true) {
            case value === 'default':
                valueForSaving = normalizeDefaultToNull(value); break;
            case handleAsNumbers:
                valueForSaving = +value; break;
            case returnAsBoolean:
                valueForSaving = normalizeStringToBooleanValue(value); break;
            default:
                valueForSaving = value;
        }
        props.inputActions.handleFieldChange(valueForSaving, text);
    };



    const adjustedValue = (value === undefined || value === null || value === '') ? 'default' : value;

    return (
        <Fragment>
            <div className={`grid-row gi-component gi-${type}`}>
                <label
                    htmlFor={id}
                    className={`tablet:grid-col-4 gi-${type}__label ${labelClass && labelClass.join(' ')} iconed-${!!labelIcon.icon} required-${isInputRequired}`}
                >
                    {text}
                    { labelIcon.icon ? labelIcon.icon : null }
                </label>
                <select
                    id={id}
                    name={name}
                    aria-required={isInputRequired}
                    className={`tablet:grid-col-6 gi-${type}__select ${inputClass && inputClass.join(' ')}`}
                    disabled={disabled}
                    value={adjustedValue} // Should be refactored (undefined, '0')?
                    onChange={handleValueChange}
                    onBlur={props.inputActions.onFieldBlur}
                >
                    {
                        options.map((option, idx) => (
                            <option
                                key={`${option.value}_${idx}`}
                                value={option.value}
                            >
                                {
                                    value === (undefined || null || '') && option.value === 'default' ?
                                        'Select' :
                                        option.text
                                }
                            </option>
                        ))
                    }
                </select>
            </div>
        </Fragment>
    );
};

export default Dropdown;
