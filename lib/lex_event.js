const Joi = require('joi');
const ValidationError = require(__dirname + '/errors').ValidationError;
const MissingActionError = require(__dirname + '/errors').MissingActionError;

class LexEvent {
    constructor() {
        /**
         *  list of actions, in the schema of:
         *  [{
         *      matcher: function(event) => boolean,
         *      executor: function(lex_event, event) => Promise
         *  }]
        */
        this.actions = [];
    }

    validate(event) {
        return new Promise((resolve, reject) => {
            //TODO: more detailed schema
            const schema = Joi.object().keys({
                invocationSource: Joi.string().alphanum().required(),
                userId: Joi.string().required(),
                messageVersion: Joi.string(),
                sessionAttributes: Joi.object().allow(null),
                bot: Joi.object(),
                currentIntent: Joi.object(),
                inputTranscript: Joi.string(),
                outputDialogMode: Joi.string()
            });

            Joi.validate(event, schema, (err) => {
                if (err) {
                    return reject(new ValidationError(err.message));
                }
            });
            return resolve(event);
        });
    }

    addAction(action) {
        this.actions.unshift(action);
    }

    executeMatchingAction(event) {
        for(let action of this.actions) {
            if (action['matcher'](event)) {
                return action['executor'](this, event).then((response) => {
                    response['sessionAttributes'] = event['sessionAttributes'];
                    return Promise.resolve(response);
                }).catch((err) => {
                    return Promise.reject(err);
                });
            }
        }
        return Promise.reject(new MissingActionError('No matching action was found.'));
    }
}

module.exports = LexEvent;