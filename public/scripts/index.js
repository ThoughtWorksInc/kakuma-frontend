var answerArray = [];
var progress = null;
var selectedQuestion = null;

function getQuestionNode (questionNumber) {
  return document.getElementById("question-" + questionNumber);
}

function hideAllInputFields() {
  var inputFieldCollection = document.getElementsByClassName("input-container");
  var inputContainer = Array.prototype.map.call(inputFieldCollection, function(element) {
    element.classList.add("hidden");
  });
}

function updateQuestionWithResponse(questionContainer, answer){
  var responseContainer = questionContainer.getElementsByClassName('response-container')[0];

  questionContainer
    .getElementsByClassName("question-container")[0]
    .classList.add("hidden");

  hideAllInputFields();

  var answerThing =responseContainer.getElementsByClassName("response-text")[0].innerHTML = answer;

  responseContainer.classList.remove("hidden");
}

function updateResponse() {

}

function displayQuestion(questionNumber) {
  var questionNode = getQuestionNode(questionNumber);
  questionNode.classList.remove("hidden");
  questionNode.getElementsByClassName("input-container")[0].classList.remove("hidden");
}

function answerSubmit(questionNumber) {
  var questionNode = getQuestionNode(questionNumber);

  var answer = questionNode.getElementsByClassName("answer")[0].value;

  updateQuestionWithResponse(questionNode, answer);

  var totalNumberOfQuestions = document.getElementsByClassName("question").length;
  if (questionNumber < totalNumberOfQuestions)
  {
    displayQuestion(questionNumber + 1);
  }

  //update progress variable
}

function goWithTheEditMaybe(questionNumber) {
  hideAllInputFields();
  //hide all the text boxes.

  var questionUnderEditInputField = getQuestionNode(questionNumber).getElementsByClassName("input-container")[0];

  questionUnderEditInputField.classList.remove("hidden");
  //display input box for the question we /do/ want

  //modify styling of the current quesiont - apply shiny

}
