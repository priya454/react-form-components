import React, { Fragment } from 'react';
import PropTypes from 'prop-types';


const Input  = props => {

    const {
        inputData: {
            disabled,
            id,
            isInputRequired,
            helperClasses,
            name,
            placeholder,
            type,
            value
        },
        inputActions: {
            handleFieldChange,
            handleFieldBlur
        },
        label: {
            text,
            labelClasses
        },
        labelIcon = {}
    } = props;

    const handleValueChange = e => {
        handleFieldChange(e.target.value);
    };

    const handleValueBlur = e => {
        handleFieldBlur(e.target.value);
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
                    disabled={disabled}
                    name={name}
                    type="text"
                    value={value || ''}
                    aria-required={isInputRequired}
                    placeholder={placeholder}
                    onChange={handleValueChange}
                    onBlur={handleValueBlur}
                    onFocus={props.inputActions.onFieldFocus}
                />
            </div>
        </Fragment>
    );
};

Input.propTypes = {
    inputData: PropTypes.shape({
        name: PropTypes.string.isRequired,
        classes: PropTypes.arrayOf([PropTypes.string]),
        value: PropTypes.any,
        placeholder: PropTypes.string,
    })
};

export default Input;
