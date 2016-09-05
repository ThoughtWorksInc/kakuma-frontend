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

describe("Summary View", function () {
    "use strict";
    
    var summaryView = require('../../app/javascripts/summaryView.js')
    var summary, summaryInput;

    beforeEach(function () {
        document.body.innerHTML += '<div id="form-summary" class="question">' +
            '<input id="summary-response-1">' +
            '<button class="edit"></button></div>';
        summary = document.getElementById("form-summary");
        summaryInput = document.getElementById("summary-response-1");
    });

    it("should hide the summary", function () {
        summaryView.getSummaryView().hide();
        expect(summary.classList).toContain("hidden");
    });

    it("should display the summary", function () {
        summary.classList.add("hidden");
        summaryView.getSummaryView().show();
        expect(summary.classList).not.toContain("hidden");
    });

    it("should get value from summary field", function () {
        summaryInput.value = "Mishmash";
        expect(summaryView.getSummaryView().getAnswer(1)).toEqual("Mishmash");
    });

    it("should enable input for editing", function() {
        summaryInput.disabled = true;
        summaryView.getSummaryView().enableEdit(1);
        expect(summaryInput.disabled).toBeFalsy();
        expect(summaryInput.classList).toContain("editing");
    });

    it("should disable input when finished editing", function() {
        summaryInput.disabled = false;
        summaryView.getSummaryView().disableEdit(1);
        expect(summaryInput.disabled).toBeTruthy();
        expect(summaryInput.classList).not.toContain("editing");
    })
});

