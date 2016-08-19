var questionView = require('./questionView.js');
var summaryView = require('./summaryView.js');
var voiceRecordingView = require('./voiceRecordingView.js');

window.addEventListener('load', function () {
    validateAllQuestions();
    showNextScreen();
}, false);

 getAllQuestionsArray = function() {
    var allQuestionViews = [];
    var allQuestionNodes = document.getElementsByClassName("question");
    for (i = 1; i <= allQuestionNodes.length; i++) {
        allQuestionViews[i - 1] = questionView.getQuestionView(i);
    }
    return allQuestionViews;
};

getFirstUnansweredQuestion = function() {
    var isUnanswered = function (question) {
        return !question.hasAnswer();
    };
    return getAllQuestionsArray().find(isUnanswered);
};

showNextScreen = function() {
    hideAllQuestions();
    var nextQuestion = getFirstUnansweredQuestion();
    var nextScreen = nextQuestion ? nextQuestion : summaryView.getSummaryView();

    return nextScreen.show();
};

hideAllQuestions = function() {
    getAllQuestionsArray()
        .map(function (question) {
            question.hide();
        });
};

goToQuestion = function(questionID) {
    hideAllQuestions();
    questionView.getQuestionView(questionID).show();
};

validateAnswer = function(questionID) {
    var question = questionView.getQuestionView(questionID);
    question.validateFormInput();
};

validateAllQuestions = function () {
    getAllQuestionsArray()
        .map(function (question) {
            question.validateFormInput();
        });
};

showSummary = function() {
    hideAllQuestions();
    summaryView.getSummaryView().show();
};

updateSummaryField = function(questionID) {
    var answer = questionView.getQuestionView(questionID).getAnswer();

    var summary = summaryView.getSummaryView();
    summary.updateQuestionResponseWith(answer, questionID);
};

updateQuestionFieldFromSummary = function(questionID) {
    var answer = summaryView.getSummaryView().getAnswer(questionID);

    var question = questionView.getQuestionView(questionID);
    question.update(answer);
};

clickButtonOnEnterPress = function(event, callback, questionID) {
    if (event.keyCode == 13) {
        event.preventDefault();
        callback(questionID);
        return false;
    }
};

confirmationMessage = function() {
    getAllQuestionsArray().map(function (question) {
        question.reset();
    });

    summaryView.getSummaryView().hide();
    voiceRecordingView.resetVoiceMessage();
    document.getElementById("confirmation").classList.remove("hidden");
};


startEditing = function(questionID) {
    summaryView.getSummaryView().enableEdit(questionID);
};

finishEditing = function(questionID) {
    updateQuestionFieldFromSummary(questionID);
    summaryView.getSummaryView().disableEdit(questionID);
};

module.exports = {
  getAllQuestionsArray: getAllQuestionsArray,

  getFirstUnansweredQuestion: getFirstUnansweredQuestion,

  showNextScreen: showNextScreen,

  hideAllQuestions: hideAllQuestions,

  goToQuestion: goToQuestion,

  validateAnswer: validateAnswer,

  validateAllQuestions: validateAllQuestions,

  showSummary: showSummary,

  updateSummaryField: updateSummaryField,

  updateQuestionFieldFromSummary: updateQuestionFieldFromSummary,

  clickButtonOnEnterPress: clickButtonOnEnterPress,

  confirmationMessage: confirmationMessage,

  startEditing: startEditing,

  finishEditing: finishEditing,
};
