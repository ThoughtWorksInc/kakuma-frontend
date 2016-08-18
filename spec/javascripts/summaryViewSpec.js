describe("Summary View", function () {
    "use strict";
    var summary, summaryInput;

    beforeEach(function () {
        document.body.innerHTML += '<div id="form-summary" class="question">' +
            '<input id="summary-response-1">' +
            '<button class="edit"></button></div>';
        summary = document.getElementById("form-summary");
        summaryInput = document.getElementById("summary-response-1");
    });

    it("should hide the summary", function () {
        getSummaryView().hide();
        expect(summary.classList).toContain("hidden");
    });

    it("should display the summary", function () {
        summary.classList.add("hidden");
        getSummaryView().show();
        expect(summary.classList).not.toContain("hidden");
    });

    it("should get value from summary field", function () {
        summaryInput.value = "Mishmash";
        console.log(summaryInput);
        expect(getSummaryView().getAnswer(1)).toEqual("Mishmash");
    });

    it("should enable input for editing", function() {
        summaryInput.disabled = true;
        getSummaryView().enableEdit(1);
        expect(summaryInput.disabled).toBeFalsy();
        expect(summaryInput.classList).toContain("editing");
    });

    it("should disable input when finished editing", function() {
        summaryInput.disabled = false;
        getSummaryView().disableEdit(1);
        expect(summaryInput.disabled).toBeTruthy();
        expect(summaryInput.classList).not.toContain("editing");
    })
});

