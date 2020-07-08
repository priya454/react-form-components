import React, { Fragment } from 'react';
//import { normalizeStringToBooleanValue } from '../../../utils/normalize/normalizeStringToBooleanValue';
import { FormattedMessage } from 'react-intl/dist';

const Checkbox = props => {

    const {
        inputData: {
            //checked,
            classes,
            id,
            isInputRequired,
            //name,
            type,
            disabled,
            //registeredInputs
        },
        label: {
            text,
            labelClass
        },
        checked,
        name,
        onChange
    } = props;

    return(
        <div className={`gi-component gi-${type} ${classes}`}>
            <Fragment>
                <input
                    id={id}
                    name={name}
                    className={`usa-checkbox__input gi-${type}__input required-${isInputRequired}`}
                    type="checkbox"
                    role="checkbox"
                    aria-checked={checked}
                    aria-required={isInputRequired}
                    data-value={checked}
                    aria-labelledby={`${type}_${id}_label`}
                    onChange={onChange}
                    disabled={disabled}
                    checked={checked}
                />

                <label
                    id={`${type}_${id}_label`}
                    htmlFor={id}
                    data-value={checked === null ? '' : checked}
                    //onClick={handleValueChange}
                    className={`usa-checkbox__label gi-${type}__label ${labelClass && labelClass.join(' ')}`}
                >
                    <FormattedMessage id={ text } />
                </label>
            </Fragment>
        </div>
    );


};


export default Checkbox;