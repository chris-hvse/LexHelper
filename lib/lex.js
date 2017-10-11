const Dialog = require(__dirname + '/dialog');
const Fulfillment = require(__dirname + '/fulfillment');
const ValidationError = require(__dirname + '/errors').ValidationError;

class Lex {
    contextualize(event) {
        return new Promise((resolve, reject) => {
            let lex_event = undefined;
            if (event['invocationSource'] === 'DialogCodeHook') {
                lex_event = new Dialog();
            } else if (event['invocationSource'] === 'FulfillmentCodeHook') {
                lex_event = new Fulfillment();
            } else {
                return reject(
                    new ValidationError("InvocationSource field of the received event has an invalid value: " + event['invocationSource']) 
                );
            }

            return lex_event.validate(event).then(() => {
                return resolve(lex_event);
            }).catch((err) => {
                return reject(err);
            });
        });
    }
}

module.exports = Lex;