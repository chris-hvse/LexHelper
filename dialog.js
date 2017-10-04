const LexEvent = require(__dirname + '/lex_event');

class Dialog extends LexEvent {
    _defaultMatcher(event) {
        return true;
    }

    _defaultExecutor(lex_event, event) {
        return new Promise((resolve, reject) => {
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
};

module.exports = Dialog;