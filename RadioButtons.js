import React, { Fragment } from 'react';

// Components

import InstructionalText from '../../components/ssap/notifications/InstructionalText';

// Utils

import { normalizeStringToBooleanValue } from '../../utils/normalize/normalizeStringToBooleanValue';




const RadioButtons  = props => {

    const handleValueChange = e => {
        const { dataset: { value } } = e.target;
        props.inputActions.handleFieldChange(normalizeStringToBooleanValue(value, returnAsNumber));
    };

    const keyPress = e => {
        const isEnterOrSpace = e.key === ' ' || e.key === 'SpaceBar' || e.key === 'Enter' || e.keyCode === 32 || e.keyCode === 13;
        if (isEnterOrSpace) {
            handleValueChange(e);
        }
    };

    const {
        inputData: {
            id,
            inputClass,
            liClass,
            options,
            returnAsNumber,
            type,
            value
        },
        label: {
            labelClass,
            ulClass,
            showRequiredIcon
        },
        legend: {
            dataInstructions,
            replacements,
            legendText
        }
    } = props;

    return (
        <Fragment>
            <div className={`grid-row gi-component gi-${type}`}>
                <fieldset className="usa-fieldset">
                    <legend className={`usa-legend ${labelClass && labelClass.join(' ')}`}>
                        <span className={`required-${showRequiredIcon}`}>{legendText}</span>
                        {
                            dataInstructions &&

                            <InstructionalText
                                Component={
                                    <span data-instructions={dataInstructions} />
                                }
                                replacements={replacements}
                            />
                        }
                    </legend>



                    <ul className={`usa-list usa-list--unstyled ${ulClass}`}>
                        {
                            options.map((option, i) => (
                                <li key={`${option.text}_${i}`} className={`${liClass && liClass.join(' ')}`}>
                                    <input
                                        id={`${id}_option${i}`}
                                        className={`usa-radio__input gi-radio_buttons__input ${inputClass && inputClass.join(' ')}`}
                                        type="radio"
                                        checked={option.value === value}
                                        tabIndex="0"
                                        role="radio"
                                        aria-checked={option.value === value}
                                        data-value={option.value}
                                        aria-labelledby={`${id}_label${i}`}
                                        onKeyPress={keyPress}
                                        onChange={() => {}}
                                    />
                                    <label
                                        className="usa-radio__label gi-radio_buttons__label"
                                        id={`${id}_label${i}`}
                                        htmlFor={`${id}_option${i}`}
                                        onClick={handleValueChange}
                                        data-value={option.value}>
                                        {option.text}
                                    </label>
                                </li>
                            ))
                        }
                    </ul>
                </fieldset>
            </div>
        </Fragment>
    );
};

export default RadioButtons;





