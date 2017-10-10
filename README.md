# LexHelper
LexHelper library is here to help you write your AWS Lambda functions working as AWS Lex backend simply and without all the boilerplate code that it would usually produce.
## Usage
Using LexHelper is extremely easy. Lets start first with creating an instance of the main class Lex.
```
let lex = new Lex();
```
This instance will contextualize (validate and identify) the incoming lambda event object passed by Lex. The result is a LexEvent object which is either serving as dialog action or a fulfillment executor. More information about these at: http://docs.aws.amazon.com/lex/latest/dg/lambda-input-response-format.html
```
lex.contextualize(event).then((lex_event) => {
    
});
```
Then you can add actions to the LexEvent object in the format:
```
lex_event.addAction({
    matcher: event_matcher,
    executor: event_executor
});
```
Where the event_matcher and event_executor functions have the header:
```
/**
 * Function to match with event
 * @param {Object} event 
 * @return {Boolean} isMatching
 */
 function event_matcher(event) {}

/**
 * Function to execute action and create response
 * @param {LexEvent} lex_event,
 * @param {Event} event
 * @return {Promise} response
 */
 function sum(lex_event, event) {}
```
You can add multiple actions with different matchers to select the right action for the incoming Lex Event, the "executeMatchingAction" function will only execute the first matching, prioritizing from the last added action.
```
lex_event.executeMatchingAction(event).then((response) => {
    callback(null, response)
});
```
This will execute the action and call the callback with the response, provided by Lex in the third parameter of the Lambda function.
