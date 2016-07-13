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
      return this;
    },
    highlightQuestionForEdit: function() {
      this.questionNode.classList.add("edit-highlight");
    },
    removeEditHighlight: function() {
      this.questionNode.classList.remove("edit-highlight");
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

function getFirstUnansweredQuestion() {
  var isUnanswered = function (question) {
    if (question.getAnswer()){
      return false;
    } return true;
  }
  //what is the next unanswered question???
  return getAllQuestionsArray().find(isUnanswered);
}

function answerSubmit(questionNumber) {

  var answer = getQuestionView(questionNumber).getAnswer();

  hideAllInputFields();

  getQuestionView(questionNumber)
    .displayResponseWith(answer)
    .hideQuestionText()
    .removeEditHighlight();

  //what is the next unanswered question???
  var firstUnansweredQuestion = getFirstUnansweredQuestion();

  if (firstUnansweredQuestion) { //There may not be any more unanswered questions.
    firstUnansweredQuestion.show();
  } //else - we're at the end - some kinda confirmation that they are ready to submit

  //update progress variable
}

function editResponse(questionNumber) {
  //hide all the text boxes.
  hideAllInputFields();

  //display input box for the question we /do/ want
  getQuestionView(questionNumber).showTextbox();

  //modify styling of the current question - apply shiny
  getQuestionView(questionNumber).highlightQuestionForEdit()

}
