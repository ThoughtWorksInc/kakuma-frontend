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
      return this;
    },
    getAnswer: function() {
      return this.questionNode.getElementsByClassName("answer")[0].value;
    },
    displayResponseWith: function(answer) {
      this.questionNode.getElementsByClassName("response-text")[0].innerHTML = answer;
      this.questionNode.getElementsByClassName("response-container")[0].classList.remove("hidden");
      return this;
    },
    hideQuestionText:function() {
      this.questionNode.getElementsByClassName("question-container")[0]
        .classList.add("hidden");
      return this;
    },
    show: function() {
      this.questionNode.classList.remove("hidden");
      this.showTextbox();
    }
  };
  return questionView;
}

function getAllQuestionsArray () {
  var allQuestionViews = [];
  var allQuestionNodes = document.getElementsByClassName("question");
  for (i = 1; i <= allQuestionNodes.length; i++) {
    allQuestionViews[i-1] = getQuestionView(i);
  }
  return allQuestionViews;
}

function hideAllInputFields() {
  var inputFieldCollection = document.getElementsByClassName("input-container");
  var inputContainer = Array.prototype.map.call(inputFieldCollection, function(element) {
    element.classList.add("hidden");
  });
}

function displayQuestion(questionNumber) {
  var questionNode = getQuestionNode(questionNumber);
  questionNode.classList.remove("hidden");
  questionNode.getElementsByClassName("input-container")[0].classList.remove("hidden");
}

function answerSubmit(questionNumber) {

  var answer = getQuestionView(questionNumber).getAnswer();

  hideAllInputFields();

  getQuestionView(questionNumber)
    .displayResponseWith(answer)
    .hideQuestionText();

  var isUnanswered = function (question) {
    if (question.getAnswer()){
      return false;
    } return true;
  }

  //what is the next unanswered question???
  var nextUnansweredQuestion = getAllQuestionsArray().find(isUnanswered);

  if (nextUnansweredQuestion) {
    nextUnansweredQuestion.show();
  } //else - we're at the end - some kinda submit???

  //update progress variable
}

function editResponse(questionNumber) {
  //hide all the text boxes.
  hideAllInputFields();

  //display input box for the question we /do/ want
  getQuestionView(questionNumber).showTextbox();

  //modify styling of the current quesiont - apply shiny
  // getQuestion(questionNumber).applyStylingForUnderEdit()

}
