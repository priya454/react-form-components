import React, { Fragment, useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ActionCreators

import {
    changePage,
    changeData,
    clearFormSubmission,
    clearMethods,
    deleteForm,
    registerForm,
    saveData,
    setMethods,
    switchHyperReview,
    submitForm,
    validateForm
} from '../../actions/ssap/ssapActionCreators';

// Utils

import { cloneObject } from '../../utils/miscellaneous/cloneObject';
import { localStorageHyperDashboardTools } from '../../utils/tools/localStorageHyperDashboardTools';
import { preventerTools } from '../../utils/tools/preventerTools';
import { processJsonTools } from '../../utils/tools/processJsonTools';
import { processUiProperties } from '../../utils/tools/processUiProperties';

// Constants

import { configs } from '../../constants/configs/configs';



const Form  = props => {

    // Props from Parent Component (usually it is Page)

    const {
        topLevelValidity,
        formName
    } = props;

    if(formName === undefined) {
        console.log('Property == formName == has not been passed into Form');
    }

    // Props from Redux Store

    const isFormValidationShown = localStorageHyperDashboardTools.getValueByPropName('isFormValidationShown', false);
    const isInvalidInputsShown = localStorageHyperDashboardTools.getValueByPropName('isInvalidInputsShown', false);

    const {
        data,
        data: {
            ssapApplicationId,
            maxAchievedPage
        },
        form,
        form: {
            [formName]: {
                isEligiblyForSave,
                isFormSubmitted,
                registeredInputs
            } = {
                registeredInputs: []
            }
        },
        environment: {
            impersonation
        },
        hyperReview,
        onLocalFormExit,
        onLocalFormSubmit,
        modals,
        page,
        structure: {
            bloodRelationshipStructure,
            taxHouseholdStructure
        }
    } = props;

    const [ localState, setState ] = useState({
        isGoingToExitWithoutSaving: false,
        frozenData: cloneObject(data),
    });

    // Up to date primitive of registered inputs values to add as dependency for watching

    const registeredInputsToString = registeredInputs.map(input => input.valueOf()).toString();
    const registeredInputsValidityToStrings = registeredInputs.map(input => input.validOf()).toString();

    useEffect(() => {
        if(!form[formName]) {
            props.actions.registerForm(formName);
        }
        return () => {
            props.actions.deleteForm(formName);
        };
    }, [ formName ]);

    useEffect(() => {
        props.actions.setMethods(formName, {
            onFormSubmit,
            onFormExit,
            onFormSubmitForValidationOnly
        });
        return () => {
            props.actions.clearMethods(formName);
        };
    }, [ registeredInputsToString, isEligiblyForSave, (onLocalFormExit ? modals.length : '') ]);

    // Scrolling to the first error message on Form submit



    useEffect(() => {
        if(isFormSubmitted && !isEligiblyForSave) {
            const element = [...document.getElementsByClassName('error--msg')]
                .filter(message => message.className.match(/shown error--msg/))[0];
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isFormSubmitted]);

    // Watching for changes in inputs and auto-validation Form

    useEffect(() => {
        props.actions.validateForm(checkIfEligible(), formName);
    }, [registeredInputsValidityToStrings, topLevelValidity]);

    useEffect(() => {
        isFormSubmitted && isEligiblyForSave && props.actions.clearFormSubmission(formName);
    }, [isEligiblyForSave]);

    const getCurrentAndMaxAchievedPages = destinationPage => {
        let pageForSave;

        switch(destinationPage) {
            case 'increase':
                pageForSave = page + 1; break;
            case 'decrease':
                pageForSave = page - 1; break;
            default:
                pageForSave = destinationPage; break;
        }

        return {
            currentPage: pageForSave,
            maxAchievedPage: (maxAchievedPage < pageForSave || hyperReview) ? pageForSave : maxAchievedPage
        };
    };

    const getBody = (destinationPage, bypassedData) => {

        return {
            'application': JSON.stringify(processUiProperties({
                ...processJsonTools.convertTaxHousehold(processJsonTools.convertBloodRelationships(bypassedData ? bypassedData : data, bloodRelationshipStructure), taxHouseholdStructure),
                ...getCurrentAndMaxAchievedPages(destinationPage)
            })),
            'applicationId': ssapApplicationId,
            'csrOverride': impersonation
        };
    };

    const onFormSubmitForValidationOnly = callbacks => {
        props.actions.submitForm(formName);
        if(isEligiblyForSave) {
            callbacks && callbacks.forEach(callback => {
                callback();
            });
        }
    };

    const onFormSubmit = (destinationPage, callbacks, exceptionAction, bypassedData) => {

        const {
            blockerCallback,
            failCallback
        } = preventerTools.provideObject(callbacks && callbacks.find(cb => typeof cb === 'object'));

        props.actions.submitForm(formName);
        if (isEligiblyForSave) {
            if(onLocalFormSubmit) {
                onLocalFormSubmit(data);
                return null;
            }
            if(!exceptionAction) {
                if(configs.ENV.DEVELOPMENT) {
                    alert(`Form == ${formName} == is eligible for saving...`);
                    props.actions.changePage(destinationPage);
                    if(blockerCallback) {
                        blockerCallback();
                    } else {
                        callbacks && callbacks.forEach(callback => {
                            typeof callback === 'function' && callback();
                        });
                    }
                    props.actions.changeData({
                        ...(bypassedData ? bypassedData : data),
                        ...getCurrentAndMaxAchievedPages(destinationPage)
                    });
                    props.actions.switchHyperReview(false);
                }
                if(configs.ENV.PRODUCTION) {

                    const updateCallBacks = () => {

                        const mergeHyperReviewCallback = () => hyperReview ? [ () => props.actions.switchHyperReview(false) ] : [];

                        if(Array.isArray(callbacks)) {
                            return [
                                ...callbacks,
                                ...mergeHyperReviewCallback()
                            ];
                        } else {
                            return [
                                ...mergeHyperReviewCallback()
                            ];
                        }
                    };

                    props.actions.saveData(
                        updateCallBacks(),
                        configs.endpoints.SAVE_DATA_ENDPOINT,
                        getBody(destinationPage, bypassedData)
                    );
                }
            } else {
                exceptionAction();
            }
        } else {
            failCallback && failCallback();
        }
    };

    const onFormExit = callbacks => {

        if(onLocalFormExit) {
            onLocalFormExit(localState.frozenData);
            return null;
        }

        props.actions.changeData(localState.frozenData);
        setState(state => ({
            ...state,
            isGoingToExitWithoutSaving: true,
        }));
        callbacks && callbacks.forEach(callback => {
            callback();
        });
    };

    const checkIfEligible = () => {
        if(registeredInputs.length === 0) {
            return {
                isEligiblyForSave: true,
                isFormOnTopLevelValid: true,
                areAllInputsValid: true
            };
        }
        const isApprovedByTopLevel = topLevelValidity === undefined ? true : topLevelValidity;
        let result = true;
        registeredInputs.forEach(input => {
            if (input.inputIsValid === false || (input.isInputRequired && (input.inputValue === '' || input.inputValue === null))) {
                isInvalidInputsShown && console.log(input);
                result = false;
            }
        });
        return {
            isEligiblyForSave: isApprovedByTopLevel && result,
            isFormOnTopLevelValid: isApprovedByTopLevel,
            areAllInputsValid: result,
        };
    };

    // Consoles start

    if (registeredInputs.length > 0) {
        isFormValidationShown && console.log(`Form == ${formName} == Top level validity: `, topLevelValidity);
        isFormValidationShown && console.log(`Form == ${formName} ==`,
            registeredInputs.map(input => ({
                inputIsValid: input.inputIsValid,
                isInputRequired: input.isInputRequired,
                inputName: input.inputName,
                onFormExit: input.onFormExit
            })));
    }

    isFormValidationShown && console.log(`Form == ${formName} == eligible: `, registeredInputs.length === 0 ? true : isEligiblyForSave);

    // Consoles end

    const updateReactChildren = children => {
        return React.Children.map(children, child => {
            if(!React.isValidElement(child)) {
                return child;
            }
            let childProps = {};
            if(
                React.isValidElement(child)
                && (typeof child.props.inputData === 'object' ||
                child.props.underFormControl === true)
            ){
                childProps = {
                    parentForm: {
                        name: formName
                    }
                };
            }
            childProps.children = updateReactChildren(child.props.children);
            return React.cloneElement(child, childProps);
        });
    };

    return (
        <Fragment>
            { form[formName] && updateReactChildren(props.children) }
        </Fragment>
    );
};

const mapStateToProps = (state, ownProps) => ({

    environment: state.common.environment,
    modals: state.common.modals,

    data: ownProps.data ? ownProps.data : state.ssap.data,
    form: state.ssap.form,
    hyperReview: state.ssap.hyperReview,
    page: state.ssap.page,
    structure: state.ssap.structure
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({
        changeData,
        changePage,
        clearFormSubmission,
        deleteForm,
        saveData,
        switchHyperReview,
        submitForm,
        validateForm,
        registerForm,
        setMethods,
        clearMethods
    }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Form);
