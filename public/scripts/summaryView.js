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
    }
  };
  return summaryView;
}
