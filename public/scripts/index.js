var answerArray = [];
var progress = null;
var selectedQuestion = null;

function getQuestionNode (questionNumber) {
  return document.getElementById("question-" + questionNumber);
}

function getQuestionView(questionNumber) {
  var questionView = {
    questionNode: getQuestionNode(questionNumber),
    showTextbox: function () {
      this.questionNode.getElementsByClassName("input-container")[0]
        .classList
        .remove("hidden");
    }
  };
  return questionView;
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

function editResponse(questionNumber) {
  //hide all the text boxes.
  hideAllInputFields();

  //display input box for the question we /do/ want
  getQuestionView(questionNumber).showTextbox();

  // var questionUnderEditInputField = getQuestionNode(questionNumber).getElementsByClassName("input-container")[0];
  // questionUnderEditInputField.classList.remove("hidden");

  //modify styling of the current quesiont - apply shiny
  // getQuestion(questionNumber).applyStylingForUnderEdit()

}
