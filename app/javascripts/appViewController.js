var appViewController = new function () {
    var self = this;

    window.addEventListener('load', function () {
        self.validateAllQuestions();
        self.showNextScreen();
    }, false);


     this.getAllQuestionsArray = function() {
        var allQuestionViews = [];
        var allQuestionNodes = document.getElementsByClassName("question");
        for (i = 1; i <= allQuestionNodes.length; i++) {
            allQuestionViews[i - 1] = getQuestionView(i);
        }
        return allQuestionViews;
    };

    this.getFirstUnansweredQuestion = function() {
        var isUnanswered = function (question) {
            return !question.hasAnswer();
        };
        return self.getAllQuestionsArray().find(isUnanswered);
    };

    this.showNextScreen = function() {
        self.hideAllQuestions();
        var nextQuestion = self.getFirstUnansweredQuestion();
        var nextScreen = nextQuestion ? nextQuestion : getSummaryView();

        return nextScreen.show();
    };

    this.hideAllQuestions = function() {
        self.getAllQuestionsArray()
            .map(function (question) {
                question.hide();
            });
    };

    this.goToQuestion = function(questionID) {
        self.hideAllQuestions();
        getQuestionView(questionID).show();
    };

    this.validateAnswer = function(questionID) {
        var question = getQuestionView(questionID);
        question.validateFormInput();
    };

    this.validateAllQuestions = function () {
        self.getAllQuestionsArray()
            .map(function (question) {
                question.validateFormInput();
            });
    };

    this.showSummary = function() {
        self.hideAllQuestions();
        getSummaryView().show();
    };

    this.updateSummaryField = function(questionID) {
        var answer = getQuestionView(questionID).getAnswer();

        var summary = getSummaryView();
        summary.updateQuestionResponseWith(answer, questionID);
    };

    this.updateQuestionFieldFromSummary = function(questionID) {
        var answer = getSummaryView().getAnswer(questionID);

        var question = getQuestionView(questionID);
        question.update(answer);
    };

    this.clickButtonOnEnterPress = function(event, callback, questionID) {
        if (event.keyCode == 13) {
            event.preventDefault();
            callback(questionID);
            return false;
        }
    };

    this.confirmationMessage = function() {
        self.getAllQuestionsArray().map(function (question) {
            question.reset();
        });

        getSummaryView().hide();
        resetVoiceMessage();
        document.getElementById("confirmation").classList.remove("hidden");
    };


    this.startEditing = function(questionID) {
        getSummaryView().enableEdit(questionID);
    };

    this.finishEditing = function(questionID) {
        self.updateQuestionFieldFromSummary(questionID);
        getSummaryView().disableEdit(questionID);
    };
}
