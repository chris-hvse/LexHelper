const LexEvent = require(__dirname + '/lex_event');
const _  = require('lodash');

class Dialog extends LexEvent {
    _defaultMatcher() {
        return true;
    }

    _defaultExecutor(lex_event, event) {
        return new Promise((resolve) => {
            // Do nothing
            let response = {
                sessionAttributes : {},
                dialogAction : {
                    type : "Delegate",
                    slots: event['currentIntent']['slots']
                }
            };

            return resolve(response);
        });
    };

    constructor() {
        super();
        this.actions.unshift({
            matcher: this._defaultMatcher,
            executor: this._defaultExecutor
        });
    }

    buildElicitSlotResponse({event, message, slot, values}) {
        return new Promise((resolve, reject) => {
            let dialogAction = {
                type: "ElicitSlot",
                message: {
                    contentType: "PlainText",
                    content: message
                },
                intentName: event['currentIntent']['name'],
                slots: event['currentIntent']['slots'],
                slotToElicit: slot,
            }

            if (values.length != 0) {
                let chunks = _.chunk(values, 5);
                let genericAttachments = chunks.map((chunk) => {
                    let buttons = chunk.map((value) => (
                        {
                            text: value,
                            value: value
                        }
                    ));
                    return {
                        title: ' ',
                        buttons: buttons
                    };
                });

                dialogAction['responseCard'] = {
                    version: 1,
                    contentType: "application/vnd.amazonaws.card.generic",
                    genericAttachments: genericAttachments
                }
            }

            let response = {
                sessionAttributes: {},
                dialogAction : dialogAction
            };
            return resolve(response);
        });
    }

    buildElicitIntentResponse({event, message, values}) {
        return new Promise((resolve, reject) => {
            let dialogAction = {
                type: "ElicitIntent",
                message: {
                    contentType: "PlainText",
                    content: message
                }
            }

            if (values.length != 0) {
                let chunks = _.chunk(values, 5);
                let genericAttachments = chunks.map((chunk) => {
                    let buttons = chunk.map((value) => (
                        {
                            text: value,
                            value: value
                        }
                    ));
                    return {
                        title: ' ',
                        buttons: buttons
                    };
                });
                
                dialogAction['responseCard'] = {
                    version: 1,
                    contentType: "application/vnd.amazonaws.card.generic",
                    genericAttachments: genericAttachments
                }
            }

            let response = {
                sessionAttributes: {},
                dialogAction : dialogAction
            };
            return resolve(response);
        });
    }
};

module.exports = Dialog;