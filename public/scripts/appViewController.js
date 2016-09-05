   // Copyright 2016 ThoughtWorks, Inc

   // Licensed under the Apache License, Version 2.0 (the "License");
   // you may not use this file except in compliance with the License.
   // You may obtain a copy of the License at

   //     http://www.apache.org/licenses/LICENSE-2.0

   // Unless required by applicable law or agreed to in writing, software
   // distributed under the License is distributed on an "AS IS" BASIS,
   // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   // See the License for the specific language governing permissions and
   // limitations under the License.

var questionView = require('./questionView.js');
var summaryView = require('./summaryView.js');
var voiceRecordingView = require('./voiceRecordingView.js');

window.addEventListener('load', function () {
    validateAllQuestions();
    showNextScreen();
}, false);

getFirstUnansweredQuestion = function() {
    var isUnanswered = function (question) {
        return !question.hasAnswer();
    };
    var allQuestionsArray = questionView.getAllQuestionsArray();
    var thing = allQuestionsArray.find(isUnanswered);
    return thing;
};

showNextScreen = function() {
    hideAllQuestions();
    var nextQuestion = getFirstUnansweredQuestion();
    var nextScreen = nextQuestion ? nextQuestion : summaryView.getSummaryView();

    return nextScreen.show();
};

hideAllQuestions = function() {
    questionView.getAllQuestionsArray()
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
    questionView.getAllQuestionsArray()
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
    questionView.getAllQuestionsArray().map(function (question) {
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

  finishEditing: finishEditing
};
