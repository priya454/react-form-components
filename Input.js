import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl/dist';

const Input = (props) => {
    const {
        label: {
            text,
            labelClasses,
            wrapperClasses,
            isInputRequired
        },
        inputField: {
            name,
            inputClasses,
            placeholder,
            type,
            value,
            registeredInputs
        }
    } = props;

    return (
        <Fragment>
            <div className={`grid-row gi-component gi-${type} ${wrapperClasses && wrapperClasses.join(' ')}`}>
                <label
                    htmlFor={name}
                    className={`gi-input__label ${labelClasses && labelClasses.join(' ')} required-${isInputRequired}`}
                    aria-label={isInputRequired}
                >
                    <FormattedMessage id={ text } />
                </label>
                <input
                    id={name}
                    className={`gi-${type}__input ${inputClasses && inputClasses.join(' ')}`}
                    name={name}
                    type={type}
                    ref={registeredInputs}
                    placeholder={placeholder}
                    aria-required={isInputRequired}
                    value={value}
                />
            </div>
        </Fragment>
    );
};

export default Input;