import React, { Fragment } from 'react';

// Components

import InstructionalText from '../../components/ssap/notifications/InstructionalText';

// Utils

import { normalizeStringToBooleanValue } from '../../utils/normalize/normalizeStringToBooleanValue';


const Checkbox = props => {

    const handleValueChange = e => {
        const { dataset: { value } } = e.currentTarget;
        props.inputActions.handleFieldChange(!normalizeStringToBooleanValue(value));
    };

    const keyPress = e => {
        const isEnterOrSpace = e.key === ' ' || e.key === 'SpaceBar' || e.key === 'Enter' || e.keyCode === 32 || e.keyCode === 13;
        if (isEnterOrSpace) {
            handleValueChange(e);
        }
    };

    const {
        inputData: {
            checked,
            classes,
            id,
            isInputRequired,
            name,
            type,
            disabled
        },
        label: {
            dataInstructions,
            replacements,
            text,
            labelClass
        }
    } = props;

    return (
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
                    onKeyPress={keyPress}
                    checked={checked === null ? '' : checked}
                    onChange={() => {}}
                    disabled={disabled}
                    value={checked === null ? '' : checked}
                />

                <label
                    id={`${type}_${id}_label`}
                    htmlFor={id}
                    data-value={checked === null ? '' : checked}
                    onClick={handleValueChange}
                    className={`usa-checkbox__label gi-${type}__label ${labelClass && labelClass.join(' ')}`}
                >
                    {text}
                </label>

                {dataInstructions &&
                <InstructionalText
                    Component={
                        <span data-instructions={dataInstructions}/>
                    }
                    replacements={replacements}
                />}

            </Fragment>
        </div>
    );
};

export default Checkbox;
