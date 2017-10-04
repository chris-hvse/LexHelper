const LexEvent = require(__dirname + '/lex_event');

class Fulfillment extends LexEvent {
    _defaultMatcher(event) {
        return true;
    }

    _defaultExecutor(lex_event, event) {
        return new Promise((resolve, reject) => {
            // Do nothing
            let response = {
                sessionAttributes : {},
                dialogAction : {
                    type : "Close",
                    fulfillmentState : "Fulfilled"
                }
            }

            lex_event.addResponse(response);
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
};

module.exports = Fulfillment;