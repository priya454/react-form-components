import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useIntl } from 'react-intl/dist';
import ReactHtmlParser from 'react-html-parser';

// Components

import Checkbox from '../inputs/Checkbox';
import DatePicker from '../inputs/DatePicker';
import Dropdown from '../inputs/Dropdown';
import Input from '../inputs/Input';
import InputWithLRBtn from '../inputs/InputWithLRBtn';
import MoneyInput from '../inputs/MoneyInput';
import PhoneNumberInput from '../inputs/PhoneNumberInput';
import RadioButtons from '../inputs/RadioButtons';
import RadioCheckBoxes from '../inputs/RadioCheckBoxes';
import SocialSecurityNumberInput from '../inputs/SocialSecurityNumberInput';
import ValidationErrorMessage from '../../components/ssap/notifications/ValidationErrorMessage';

// ActionCreators

import { changeInputStatus, registerInput, reRegisterInput, removeInput } from '../../actions/ssap/ssapActionCreators';

// Hooks

import { useToggle } from '../../hooks/useToggle';

// Utils

import mergeRecursively from '../../utils/miscellaneous/mergeRecursively';
import { pageNumberAdjuster } from '../../utils/normalize/pageNumberAdjuster';
import { localStorageHyperDashboardTools } from '../../utils/tools/localStorageHyperDashboardTools';

// Constants

import validators from '../../utils/validators/validators';
import { INPUT_TYPES } from '../../constants/inputs/inputTypes';
import { VALIDATION_ERROR_MESSAGES } from '../../constants/inputs/validationErrorMessages';


const UniversalInput = props => {

    const {
        inputData,
        inputData: {
            currentData,
            disabled,
            isInputRequired,
            fields,
            name,
            options,
            optionsReplacements,
            placeholder,
            type,
            validationErrorMessage,
            value,
            valuesToMatch,
            validationType,
            isToggleReRegistration = undefined
        },
        indexInArray,
        inputActions,
        inputActions: {
            onFieldBlur,
            onFieldChange
        },
        errorClasses,
        label,
        label: {
            text: labelText,
            labelTextReplacements
        },
        legend = { legendText: '', legendTextReplacements: {} },
    } = props;

    const {
        parentForm: {
            name: formName
        },
        form,
        page
    } = props;

    const {
        isFormSubmitted,
        registeredInputs
    } = form[formName];

    const [ isCharExceptionShown, toggleVisibility ] = useToggle(false);
    const [ notEligibleChars, changeChars ] = useState('');

    const intlApi = useIntl();

    const getLastField = arr => {
        return arr && arr.length >= 1 ? `_${arr[arr.length - 1]}` : '';
    };

    const getHouseholdMemberIndex = index => {
        return index !== undefined ? `_hhm${index}` : '';
    };

    const createInputID = () => {
        return [
            pageNumberAdjuster(page),
            getHouseholdMemberIndex(indexInArray),
            getLastField(fields),
            `_${name}`
        ].join('');
    };

    const validate = (value, valuesToMatch) => {

        const isValidatorsGeneratorResultsShown = localStorageHyperDashboardTools.getValueByPropName('isValidatorsGeneratorResultsShown', false);

        if (!validator) {
            return true;
        }

        if(!isInputRequired && (value === null || value === '')) {
            return true;
        } else if(isInputRequired && (value === null || value === '')){
            return false;
        } else {
            return !!(validator && validator.verifier !== undefined && validator.verifier({
                value,
                valuesToMatch,
                isGenShown: isValidatorsGeneratorResultsShown
            }));
        }
    };

    const ID = createInputID();
    const validator = validators.find(v => v.validatorType === props.inputData.validationType);

    useEffect(() => { // Mounting and unmounting inputs causes registration and removing
        props.actions.registerInput({
            inputId: ID,
            initialInputValue: value,
            isInputTouched: null,
            inputName: name,
            inputValue: value,
            isInputRequired: isInputRequired,
            inputIsValid: validate(value, valuesToMatch),
            messages: validator && validator.messages,
            inputValidationType: validationType ? validationType : null,
            validOf() {
                return this.inputIsValid;
            },
            valueOf() {
                return this.inputValue;
            }
        }, formName);
        return () => {
            props.actions.removeInput({ inputId: ID }, formName);
        };
    }, []);

    useEffect(() => {
        if(isToggleReRegistration !== undefined) {
            props.actions.reRegisterInput({
                inputId: ID,
                initialInputValue: value,
                isInputTouched: null,
                inputName: name,
                inputValue: value,
                isInputRequired: isInputRequired,
                inputIsValid: validate(value, valuesToMatch),
                messages: validator && validator.messages,
                inputValidationType: validationType ? validationType : null,
                validOf() {
                    return this.inputIsValid;
                },
                valueOf() {
                    return this.inputValue;
                }
            }, formName);
        }
    }, [ isToggleReRegistration ]);

    useEffect(() => { // Here we watch on any change in registered input and validate it
        const isValid = validate(value, valuesToMatch);

        props.actions.changeInputStatus({
            inputId: ID,
            inputValue: value,
            inputIsValid: isValid
        }, formName);

    }, [value]);

    useEffect(() => {
        isFormSubmitted !== null && validate(value, valuesToMatch);
    }, [isFormSubmitted]);

    const getNewData = updatedValue => {
        const resolvedName = name[0] === '_' ? name.slice(1) : name;
        const injectedProp = { [resolvedName]: updatedValue };
        return mergeRecursively(currentData, injectedProp, [], fields, updatedValue, resolvedName);
    };

    const handleFieldChange = (updatedValue, text = undefined) => {
        onFieldChange && onFieldChange(getNewData(updatedValue), indexInArray, fields, [name, updatedValue, disabled, text]);
    };

    const handleFieldBlur = updatedValue => {
        if(/^[\x20-\x7e]*$/.test(updatedValue)) {
            isCharExceptionShown && toggleVisibility(false);
            isCharExceptionShown && changeChars('');
            onFieldBlur && onFieldBlur(getNewData(updatedValue), indexInArray, fields, [name, updatedValue, disabled]);
        } else {
            toggleVisibility(true);
            changeChars([...updatedValue].reduce((res, char) => !/^[\x20-\x7e]*$/.test(char) ? [ ...res, char ] : res, []).join(', '));
            handleFieldChange('');
        }
    };

    const getInput = () => {

        const wrapStringWithLessGreater = str => `\u003C${str}\u003E`;

        const checkIntlId = (id, pattern) => {
            if(typeof id === 'string' && id.includes(pattern)) {
                return true;
            } else {
                localStorageHyperDashboardTools
                    .getValueByPropName('isReactIntlWarningsShown', false) && id && console.log(
                    `Property ${wrapStringWithLessGreater((p => p[p.length - 1])(pattern.split('.')))} in input with name ${wrapStringWithLessGreater(name)} does not have expected pattern id ${wrapStringWithLessGreater(pattern)}`
                );
                return false;
            }
        };

        const processId = (id, pattern, replacements = {}) => {
            return checkIntlId(id, pattern) ? intlApi.formatMessage({ id }, replacements ) : id;
        };

        const intlOptionsExceptionsList = [
            'countyCode',
            'state',
            'foreignPassportCountryOfIssuance',
            'tribeName',
            'fosterCareState',
            'ageWhenLeftFosterCare'
        ];
        
        const processOptions = (options, exceptions) => {
            
            const isInputOptionsUnderExceptions = exceptions.some(exception => exception === name);
            
            return options ? 
                { 
                    options: options.map(option => {

                        return  isInputOptionsUnderExceptions && option.value !== 'default' ?
                            option :
                            {
                                ...option,
                                text: ReactHtmlParser(processId( option.text, 'input.option', optionsReplacements))
                            };
                    }) 
                } :
                {};
        };

        const injectedProps = {
            ...props,
            inputData:{
                ...inputData,
                type: type.toLowerCase(),
                id: ID,
                placeholder: processId(placeholder, 'input.placeholder'),
                ...processOptions(options, intlOptionsExceptionsList)
            },
            inputActions: {
                ...inputActions,
                handleFieldChange: handleFieldChange, // Injecting handleFieldChange()
                handleFieldBlur: handleFieldBlur      // Injecting handleFieldBlur()
            },
            label: {
                ...label,
                text: processId(labelText, 'input.label', labelTextReplacements)
            },
            legend: {
                ...legend,
                legendText: processId(legend.legendText, 'input.legend', legend.legendTextReplacements)
            }
        };



        switch (type) {
            case INPUT_TYPES.CHECKBOX:
                return <Checkbox { ...injectedProps }/>;

            case INPUT_TYPES.DATE_PICKER:
                return <DatePicker { ...injectedProps } />;

            case INPUT_TYPES.DROPDOWN:
                return <Dropdown { ...injectedProps } />;

            case INPUT_TYPES.REGULAR_INPUT:
                return <Input { ...injectedProps } />;

            case INPUT_TYPES.INPUT_LR_BUTTONS:
                return <InputWithLRBtn { ...injectedProps } />;

            case INPUT_TYPES.MONEY_INPUT:
                return <MoneyInput { ...injectedProps } />;

            case INPUT_TYPES.PHONE_NUMBER_INPUT:
                return <PhoneNumberInput { ...injectedProps }/>;

            case INPUT_TYPES.RADIO_BUTTONS:
                return <RadioButtons { ...injectedProps } />;

            case INPUT_TYPES.RADIO_CHECKBOXES:
                return <RadioCheckBoxes { ...injectedProps }/>;

            case INPUT_TYPES.SSN_INPUT:
                return <SocialSecurityNumberInput { ...injectedProps }/>;

            default:
                return null;
        }
    };
    
    const getValidationErrorMessage = () => {

        switch(true) {

            case isCharExceptionShown:
                return (
                    <ValidationErrorMessage
                        isVisible
                        messageText={intlApi.formatMessage(  { id: VALIDATION_ERROR_MESSAGES.INVALID_CHARS },{ notEligibleChars })}
                        errorClasses={ errorClasses }
                    />
                );

            case isFormSubmitted && !isInputValid:
                return (
                    <ValidationErrorMessage
                        isVisible
                        messageText={message}
                        errorClasses={ errorClasses }
                    />
                );

            default: 
                return null;
        }
    };

    const inputFromForm = registeredInputs.length > 0 && registeredInputs.find(input => input.inputId === ID);

    const isInputValid = inputFromForm && inputFromForm.inputIsValid;

    const message = validationErrorMessage ? validationErrorMessage : inputFromForm && inputFromForm.messages && inputFromForm.messages[0];

    return (
        <Fragment>
            {
                getValidationErrorMessage()
            }
            {
                getInput()
            }
        </Fragment>
    );
};

const mapStateToProps = state => ({
    form: state.ssap.form,
    page: state.ssap.page
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({
        changeInputStatus,
        registerInput,
        reRegisterInput,
        removeInput
    }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UniversalInput);
