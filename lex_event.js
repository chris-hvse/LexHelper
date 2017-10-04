const Joi = require('joi');
const ValidationError = require(__dirname + '/errors').ValidationError;
const MissingResponseError = require(__dirname + '/errors').MissingResponseError;
const MissingActionError = require(__dirname + '/errors').MissingActionError;

class LexEvent {
    constructor() {
        /**
         *  list of actions, in the schema of:
         *  [{
         *      matcher: function(event) => boolean,
         *      executor: function(event) => Promise
         *  }]
        */
        this.actions = [];
        this.response = null;
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

            Joi.validate(event, schema, (err, value) => {
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

    addResponse(response) {
        this.response = response;
    }

    executeMatchingAction(event) {
        for(let action of this.actions) {
            if (action['matcher'](event)) {
                return Promise.resolve(action['executor'](this, event));
            }
        }
        return Promise.reject(new MissingActionError('No matching action was found.'));
    }

    respond(response_callback) {
        return new Promise((resolve, reject) => {
            if (this.response) {
                response_callback(null, this.response);
                return resolve(this.response);
            } else {
                return reject(new MissingResponseError());
            }
        });
    }
}

module.exports = LexEvent;