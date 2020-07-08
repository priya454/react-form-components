import React, { Fragment, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl/dist';
import moment from 'moment';

import { VALIDATION_TYPES } from '../../constants/inputs/validationTypes';
import { TEMP_VALIDATORS_FOR_DATEPICKER } from '../../utils/validators/validators';
import InstructionalText from '../../components/ssap/notifications/InstructionalText';


const DatePicker = props => {

    const {
        inputData: {
            isInputRequired,
            name,
            value,
            divClass
        },
        indexInArray,
        label: {
            dataInstructions,
            replacements
        }
    } = props;

    const [ date, setDate] = useState('');
    const [ month, setMonth ] = useState('');
    const [ year, setYear ] = useState('');

    useEffect(() => {
        if (value === null || value === '') {
            setDate('');
            setMonth('');
            setYear('');
        } else {
            const timeValue = moment(value);
            setDate(timeValue.format('DD'));
            setMonth(timeValue.format('MM'));
            setYear(timeValue.format('YYYY'));
        }
    }, [value]);

    const handleValueChange = e => {
        const { name, value } = e.target;

        if((!TEMP_VALIDATORS_FOR_DATEPICKER[VALIDATION_TYPES.IS_ALL_NUMERIC].verifier(value)
            && TEMP_VALIDATORS_FOR_DATEPICKER[VALIDATION_TYPES.IS_NOT_EMPTY].verifier(value))) {
            return null;
        }

        switch(name) {
            case 'month':
                if ((+value > 12 || +value < 0) || value.length > 2) {
                    return null;
                }
                break;
            case 'date':
                if ((value > 31 || value < 0) || value.length > 2) {
                    return null;
                }
                break;
            case 'year':
                if(value.length > 4) {
                    return null;
                }
                break;
        }

        switch(name) {
            case 'date':
                setDate(value);
                break;
            case 'month':
                setMonth(value);
                break;
            case 'year':
                setYear(value);
                break;
        }
    };

    const handleBlur = () => {
        const newTimeStamp = moment({
            date: +date,
            month: +month - 1,
            year: +year
        });
        props.inputActions.handleFieldChange(
            isNaN(newTimeStamp.toDate().getTime())
            || newTimeStamp.toDate().getTime() < -62135654400000 ?
                null : newTimeStamp.format('YYYY-MM-DD')
        );
    };

    return (
        <Fragment>
            <div className="grid-row gi-component gi-datepicker">
                <div className="grid-col-12">
                    <fieldset className="usa-fieldset">
                        <legend className={`usa-legend gi-datepicker__label ${props.label.labelClass}`}>
                            <span className={`required-${isInputRequired}`}>{props.label.text}</span>
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

                        <span className={`grid-row usa-memorable-date ${divClass}`}>
                            <span className="usa-form-group usa-form-group--month gi-form-group_month txt-left">
                                <label htmlFor={`hhm${indexInArray}_${name}_1`}>
                                    <FormattedMessage id="common.month"/>
                                </label>
                                <input
                                    id={`hhm${indexInArray}_${name}_1`}
                                    name="month"
                                    type="number"
                                    maxLength={2}
                                    value={month}
                                    placeholder="MM"
                                    onChange={handleValueChange}
                                    onBlur={handleBlur}
                                    className="usa-input usa-input--inline gi-datepicker_input"
                                />
                            </span>
                            <span className="usa-form-group usa-form-group--day gi-form-group_day txt-left">
                                <label htmlFor={`hhm${indexInArray}_${name}_2`}>
                                    <FormattedMessage id="common.day"/>
                                </label>
                                <input
                                    id={`hhm${indexInArray}_${name}_2`}
                                    name="date"
                                    type="number"
                                    maxLength={2}
                                    value={date}
                                    placeholder="DD"
                                    onChange={handleValueChange}
                                    onBlur={handleBlur}
                                    className="usa-input usa-input--inline gi-datepicker_input"
                                />
                            </span>
                            <span className="usa-form-group usa-form-group--year gi-form-group_year txt-left">
                                <label htmlFor={`hhm${indexInArray}_${name}_3`}>
                                    <FormattedMessage id="common.year"/>
                                </label>
                                <input
                                    id={`hhm${indexInArray}_${name}_3`}
                                    name="year"
                                    type="number"
                                    maxLength={4}
                                    value={year}
                                    placeholder="YYYY"
                                    onChange={handleValueChange}
                                    onBlur={handleBlur}
                                    className="usa-input usa-input--inline gi-datepicker_input"
                                />
                            </span>
                        </span>
                    </fieldset>
                </div>
            </div>


        </Fragment>
    );
};

export default DatePicker;
