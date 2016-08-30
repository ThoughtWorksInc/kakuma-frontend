describe("Question View", function () {
    "use strict";

    var questionView = require('../../app/javascripts/questionView.js');
    var question, questionInput;

    beforeEach(function () {
        document.body.innerHTML += '<div id="question-1" class="question"><input class="question-input">' +
            '<button class="next"></button></div>';
        question = document.getElementById("question-1");
        questionInput = question.getElementsByClassName("question-input")[0];
    });

    it("should hide a question", function () {
        questionView.getQuestionView(1).hide();
        expect(question.classList).toContain("hidden");
    });

    it("should display a question", function () {
        question.classList.add("hidden");
        questionView.getQuestionView(1).show();
        expect(question.classList).not.toContain("hidden");
    });

    it("should set focus on a question", function () {
        questionView.getQuestionView(1).focusInput();
        expect(questionInput.focus).toBeTruthy()
    });

    it("should get value from input", function () {
        questionInput.value = "Mashmash";
        expect(questionView.getQuestionView(1).getAnswer()).toEqual("Mashmash");
    });

    it("should update value from input", function () {
        questionInput.value = "Mashmash";
        questionView.getQuestionView(1).update("Mosh");
        expect(questionView.getQuestionView(1).getAnswer()).toEqual("Mosh");
    });

    it("should enable submit button", function () {
        var submitButton = question.getElementsByClassName("next")[0];
        submitButton.disabled = true;
        questionView.getQuestionView(1).enableSubmitButton();
        expect(submitButton.disabled).toBeFalsy();
    });

    it("should disable submit button", function () {
        var submitButton = question.getElementsByClassName("next")[0];
        submitButton.disabled = false;
        questionView.getQuestionView(1).disableSubmitButton();
        expect(submitButton.disabled).toBeTruthy();
    });

    it("should reset input values", function () {
        questionInput.value = "Mashmash";
        questionView.getQuestionView(1).reset();
        expect(questionInput.value).toEqual("");
    });
});