const Lex = require(__dirname + '/lex');
const TestError = require(__dirname + '/errors').TestError;

event = {
    "messageVersion": "1.0",
    "userId": "test",
    "sessionAttributes": {},
    "bot": {
        "name": "Test",
        "alias": null,
        "version": "$LATEST"
    },
    "outputDialogMode": "Text",
    "currentIntent": {
        "name": "Test",
        "slots": {
            "Slot1": null,
            "Slot2": null
        },
        "slotDetails": {
            "Slot1": {
                "resolutions": [],
                "originalValue": null
            },
            "Slot2": {
                "resolutions": [],
                "originalValue": null
            }
        },
        "confirmationStatus": "None"
    },
    "inputTranscript": "Test transcript"
};

test_default = function(event) {
    return new Promise((resolve, reject) => {
        let lex = new Lex();
        lex.contextualize(testEvent).then((lex_event) => {
            lex_event.executeMatchingAction(event).then(() => {
                lex_event.respond(() => {}).then((response) => {
                    console.log('Successfully processed event');
                    resolve(response);
                });
            });
        }).catch((err) => {
            reject(err);
        });
    });
}

it("should delegate in the response", () => {
    testEvent = Object.assign({
        invocationSource: 'DialogCodeHook'
    }, event);

    return test_default(testEvent).then((response) => {
        if (response['dialogAction']['type'] !== 'Delegate') {
            throw new TestError('Default "dialogAction" should be "Delegate"');
        }
    }).catch((err) => {
        throw err;
    });
});

it("should close in the response", () => {
    testEvent = Object.assign({
        invocationSource: 'FulfillmentCodeHook'
    }, event);

    return test_default(testEvent).then((response) => {
        if (response['dialogAction']['type'] !== 'Close') {
            throw new TestError('Default "dialogAction" should be "Close"');
        }
    }).catch((err) => {
        throw err;
    });
});