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

    buildElicitSlotResponse({event, message, slot, buttons_promise}) {
        return new Promise((resolve, reject) => {
            buttons_promise().then((buttons) => {
                let chunks = _.chunk(buttons, 5);
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
    
                let response = {
                    sessionAttributes: {},
                    dialogAction : {
                        type: "ElicitSlot",
                        message: {
                            contentType: "PlainText",
                            content: message
                        },
                        intentName: event['currentIntent']['name'],
                        slots: event['currentIntent']['slots'],
                        slotToElicit: slot,
                        responseCard: {
                            version: 1,
                            contentType: "application/vnd.amazonaws.card.generic",
                            genericAttachments: genericAttachments
                        }
                    }
                };
                return resolve(response);
            }).catch((err) => {
                return reject(err);
            });
        });
    }
};

module.exports = Dialog;