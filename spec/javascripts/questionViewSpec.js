describe("Question View", function () {
    "use strict";
    var question, questionInput;

    beforeEach(function () {
        document.body.innerHTML += '<div id="question-1" class="question"><input class="question-input">' +
            '<button class="next"></button></div>';
        question = document.getElementById("question-1");
        questionInput = question.getElementsByClassName("question-input")[0];
    });

    it("should hide a question", function () {
        getQuestionView(1).hide();
        expect(question.classList).toContain("hidden");
    });

    it("should display a question", function () {
        question.classList.add("hidden");
        getQuestionView(1).show();
        expect(question.classList).not.toContain("hidden");
    });

    it("should set focus on a question", function () {
        getQuestionView(1).focusInput();
        expect(questionInput.focus).toBeTruthy()
    });

    it("should get value from input", function () {
        questionInput.value = "Mashmash";
        console.info(questionInput.value);

        expect(getQuestionView(1).getAnswer()).toEqual("Mashmash");
    });

    it("should update value from input", function () {
        questionInput.value = "Mashmash";
        getQuestionView(1).update("Mosh");
        expect(getQuestionView(1).getAnswer()).toEqual("Mosh");
    });

    it("should enable submit button", function () {
        var submitButton = question.getElementsByClassName("next")[0];
        submitButton.disabled = true;
        getQuestionView(1).enableSubmitButton();
        expect(submitButton.disabled).toBeFalsy();
    });

    it("should disable submit button", function () {
        var submitButton = question.getElementsByClassName("next")[0];
        submitButton.disabled = false;
        getQuestionView(1).disableSubmitButton();
        expect(submitButton.disabled).toBeTruthy();
    });

    it("should reset input values", function () {
        questionInput.value = "Mashmash";
        getQuestionView(1).reset();
        expect(questionInput.value).toEqual("");
    });
});