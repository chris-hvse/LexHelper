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
    matcher: action_matcher,
    executor: action_executor
});
```
You can add multiple actions with different matchers to select the right action for the incoming Lex Event. The action_matcher and action_executor functions have the header:
```
/**
 * Function to match with event
 * @param {Object} event - the event object where we check our conditions for our action
 * @return {Boolean} isMatching
 */
 function action_matcher(event) {}

/**
 * Function to execute action and create response
 * @param {Object} lex_event - the contextualized lex event object (dialog or fulfillment)
 * @param {Object} event - the event object passed by lex
 * @return {Promise} response
 */
 function action_executor(lex_event, event) {}
```
This will execute the first matching, prioritizing from last added to first.
```
lex_event.executeMatchingAction(event).then((response) => {
    
});
```
