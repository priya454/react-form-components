import React, { Fragment, useEffect } from 'react';

import { counterReducer, useCounterReducer  } from '../../hooks/useCounter';


const InputWithLRBtn = props => {
    const {
        inputData: {
            id,
            isInputRequired,
            outerClass,
            name,
            placeholder,
            type,
            value
        },
        inputActions: {
            handleFieldChange
        },
        label: {
            text,
            labelClasses
        },
        button : {
            btnLId,
            btnRId,
            lBtnText,
            rBtnText,
            minCount,
            maxCount,
            btnClasses
        }
    } = props;


    const [currentState, dispatch] = useCounterReducer(counterReducer, { count: value });

    useEffect(() => {
        handleFieldChange(currentState.count);
    },[currentState.count]);
    const handleCounterClick = (clickType) => {
        const payloadForDispatch = {
            type: clickType.type
        };
        if(clickType.payload) {
            payloadForDispatch.payload = clickType.payload.count.match(/^\s?[0-9]*$/) ? { count: clickType.payload.count } : { count : currentState.count };

            if (!payloadForDispatch.payload.count || payloadForDispatch.payload.count === 'NaN') {
                payloadForDispatch.payload = { count: +clickType.payload.count +1 };
            } else if (+payloadForDispatch.payload.count > minCount && +payloadForDispatch.payload.count <= maxCount) {
                payloadForDispatch.payload = { count: +clickType.payload.count };
            } else {
                payloadForDispatch.payload = { count: 1 };
            }
        }
        dispatch(payloadForDispatch);
    };

    return (
        <Fragment>
            <div className={`gi-component gi-${type} ${outerClass && outerClass.join(' ')}`}>
                <button
                    id={`left__${btnLId}`}
                    className={`${btnClasses && btnClasses} usa-button gi-button gi-button__primary btn--left`}
                    onClick={() => handleCounterClick({ type: 'DECREMENT' })}
                    disabled={currentState.count <= minCount}
                >{lBtnText}
                </button>
                <label
                    htmlFor={id}
                    className={`gi-${type}-label ${labelClasses && labelClasses.join(' ')}`}
                    aria-label={isInputRequired}
                >
                    { text }
                </label>
                <input
                    id={id}
                    className={`gi-${type}-input`}
                    name={name}
                    type="text"
                    value={currentState.count}
                    aria-required={isInputRequired}
                    placeholder={placeholder}
                    onChange={(e) => handleCounterClick({ type: 'MANUAL', payload: { count: e.target.value } })}
                />
                <button
                    id={`right__${btnRId}`}
                    className={`${btnClasses && btnClasses} usa-button gi-button gi-button__primary btn--right`}
                    onClick={() => handleCounterClick({ type: 'INCREMENT' })}
                    disabled = {currentState.count >= maxCount}
                >{rBtnText}
                </button>
            </div>
        </Fragment>
    );
};
export default InputWithLRBtn;
