import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl/dist';

const Text = (props) => {

    const {
        id,
        classes,
        text,
        display,
        textReplacements = {},
        isReplacementALink,
        path,
        linkText
    } = props;

    return (
        <Fragment>
            {display === 'block' ?
                <Fragment>
                    <p data-automation-id={id} className={classes && classes.join(' ')}>
                        {
                            !isReplacementALink ?
                                <FormattedMessage id={ text } values={ textReplacements }/>
                                : <FormattedMessage
                                    id={text}
                                    values={{
                                        link:(
                                            <a
                                                className="usa-link--external"
                                                href={path}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FormattedMessage id={linkText}/>
                                            </a>
                                        )
                                    }}
                                />
                        }

                    </p>
                </Fragment>
                : <Fragment>
                    <span data-automation-id={id} className={classes && classes.join(' ')}>
                        <FormattedMessage id={ text } values={ textReplacements }/>
                    </span>
                </Fragment>
            }
        </Fragment>
    );
};

export default Text;