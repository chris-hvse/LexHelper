const LexEvent = require(__dirname + '/lex_event');

class Fulfillment extends LexEvent {
    _defaultMatcher() {
        return true;
    }

    _defaultExecutor() {
        return new Promise((resolve) => {
            // Do nothing
            let response = {
                sessionAttributes : {},
                dialogAction : {
                    type : "Close",
                    fulfillmentState : "Fulfilled"
                }
            };

            return resolve(response);
        });
    };

    buildCloseResponse(result, message) {
        let response = {
            sessionAttributes : {},
            dialogAction : {
                type : "Close",
                fulfillmentState: result
            }
        };

        if (message) {
            response['dialogAction']['message'] = {
                contentType: 'PlainText',
                content: message
            };
        }

        return Promise.resolve(response);
    }

    constructor() {
        super();
        this.actions.unshift({
            matcher: this._defaultMatcher,
            executor: this._defaultExecutor
        });
    }
};

module.exports = Fulfillment;