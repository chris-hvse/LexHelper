const Dialog = require(__dirname + '/dialog');
const Fulfillment = require(__dirname + '/fulfillment');
const ValidationError = require(__dirname + '/errors').ValidationError;

class Lex {
    contextualize(event) {
        return new Promise((resolve, reject) => {
            let lexEvent = undefined;
            if (event['invocationSource'] === 'DialogCodeHook') {
                lexEvent = new Dialog();
            } else if (event['invocationSource'] === 'FulfillmentCodeHook') {
                lexEvent = new Fulfillment();
            } else {
                return reject(
                    new ValidationError("InvocationSource field of the received event has an invalid value: " + event['invocationSource']) 
                );
            }

            return lexEvent.validate(event).then(() => {
                return resolve(lexEvent);
            }).catch((err) => {
                return reject(err);
            });
        });
    }
}

module.exports = Lex;