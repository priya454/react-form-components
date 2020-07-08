import React, { Fragment } from 'react';

import { normalizeStringToBooleanValue } from '../../utils/normalize/normalizeStringToBooleanValue';


const RadioCheckBoxes = props => {

    const handleValueChange = e => {
        const { dataset: { value } } = e.target;
        props.inputActions.handleFieldChange(!normalizeStringToBooleanValue(value));
    };

    const {
        inputData: {
            checked,
            id,
            classes,
            isInputRequired,
            name,
            type
        },
        label: {
            text,
            labelClass
        },
        legend: {
            legendText
        }
    } = props;

    return (
        <Fragment>
            <div className={`gi-component gi-${type}`}>
                {legendText &&
                    <legend className={`${labelClass && labelClass.join(' ')} required-${isInputRequired}`}>
                        {legendText}
                    </legend>
                }
                <input
                    id={id}
                    name={name}
                    className={`usa-radio__input gi-${type}__input ${classes && classes.join(' ')} required-${isInputRequired}`}
                    type="radio"
                    checked={checked}
                    onChange={() => {}}
                    value={checked}
                />
                <label
                    htmlFor={id}
                    className={`usa-radio__label gi-${type}__label`}
                    data-value={checked}
                    onClick={handleValueChange}
                >
                    {text}
                </label>
            </div>
        </Fragment>
    );
};

export default RadioCheckBoxes;
