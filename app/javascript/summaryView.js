function getSummaryView(){
  var summaryView = {
    node: document.getElementById("form-summary"),
    updateQuestionResponseWith: function(answer, questionID) {
      var response = document.getElementById("summary-response-"+ questionID);
      response.value = answer;
    },
    show: function() {
      this.node.classList.remove("hidden");
    },
    hide: function() {
      this.node.classList.add("hidden");
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
    }
  };
  return summaryView;
}
