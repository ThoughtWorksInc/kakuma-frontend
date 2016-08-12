window.onload  = function() {
  validateAllQuestions();
  showNextScreen();
};

function getAllQuestionsArray () {
  var allQuestionViews = [];
  var allQuestionNodes = document.getElementsByClassName("question");
  for (i = 1; i <= allQuestionNodes.length; i++) {
    allQuestionViews[i-1] = getQuestionView(i);
  }
  return allQuestionViews;
}

function getFirstUnansweredQuestion() {
  var isUnanswered = function (question) {
    return !question.hasAnswer();
  };
  return getAllQuestionsArray().find(isUnanswered);
}

function showNextScreen() {
  hideAllQuestions();
  var nextQuestion = getFirstUnansweredQuestion();
  var nextScreen = nextQuestion ? nextQuestion : getSummaryView();

  return nextScreen.show();
}

function hideAllQuestions() {
  getAllQuestionsArray()
    .map(function(question) {
      question.hide();
    });
}

function goToQuestion(questionID) {
  hideAllQuestions();
  getQuestionView(questionID).show();
}

function validateAnswer(questionID) {
   var question = getQuestionView(questionID);
   question.validateFormInput();
}

function validateAllQuestions(){
  getAllQuestionsArray()
    .map(function(question) {
      question.validateFormInput();
    });
}

function showSummary(){
  hideAllQuestions();
  getSummaryView().show();
}

function updateSummaryField(questionID) {
  var answer = getQuestionView(questionID).getAnswer();

  var summary = getSummaryView();
  summary.updateQuestionResponseWith(answer, questionID);
}

function clickButtonOnEnterPress(event, callback, questionID) {
  if (event.keyCode == 13) {
    event.preventDefault();
    callback(questionID);
    return false;
  }
}

function confirmationMessage() {
  getAllQuestionsArray().map(function(question){
    question.reset();
  });

  getSummaryView().hide();
  resetVoiceMessage();
  document.getElementById("confirmation").classList.remove("hidden");
}


 function startEditing(questionID) {
   getSummaryView().enableEdit(questionID);
 }

function finishEditing(questionID) {
  getSummaryView().disableEdit(questionID);
}
