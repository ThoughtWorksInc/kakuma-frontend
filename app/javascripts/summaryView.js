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

module.exports = {
  getSummaryView: getSummaryView
};


function getSummaryView(){
  var summaryView = {
    node: document.getElementById("form-summary"),
    updateQuestionResponseWith: function(answer, questionID) {
      var response = document.getElementById("summary-response-"+ questionID);
      response.value = answer;
    },
    show: function() {
      this.node.classList.remove("hidden");
      return this;
    },
    hide: function() {
      this.node.classList.add("hidden");
      return this;
    },
    enableEdit: function(questionID) {
      var response = document.getElementById("summary-response-"+ questionID);
      response.disabled = false;
      response.classList.add("editing");
      response.nextSibling.classList.add("hidden");
      response.focus();
    },
    disableEdit: function(questionID) {
      var response = document.getElementById("summary-response-"+ questionID);
      response.disabled = true;
      response.classList.remove("editing");
      response.nextSibling.classList.remove("hidden");
    },
    getAnswer: function(questionID) {
      return document.getElementById("summary-response-"+ questionID).value;
    }
  };
  return summaryView;
}
