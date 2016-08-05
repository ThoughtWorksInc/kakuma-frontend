  function getQuestionNode (questionID) {
  return document.getElementById("question-" + questionID);
}

function getQuestionView(questionID) {
  var questionView = {
    questionNode: getQuestionNode(questionID),
    show: function() {
      this.questionNode.classList.remove("hidden");
      this.focusInput();
      return this;
    },
    hide: function() {
      this.questionNode.classList.add("hidden");
      return this;
    },
    focusInput: function() {
      this.questionNode.getElementsByClassName("question-input")[0].focus();
    },
    getAnswer: function() {
      return this.questionNode.getElementsByClassName("question-input")[0].value;
    },
    hasAnswer: function() {
      if (this.getAnswer()) {
        return true;
      }
      return false;
    },
    reset: function() {
      this.questionNode.getElementsByClassName("question-input")[0].value = "";
      this.updateResponseTextWith("");
    },
    isNormalQuestion: function() {
      return this.questionNode.getElementsByClassName("response-container").length > 0;
    },
    inputIsNotEmpty: function() {
      return this.questionNode.getElementsByClassName("question-input")[0].value.length > 0;
    },
    enableSubmitButton: function() {
      this.questionNode.getElementsByClassName("next")[0].disabled = false;
    },
    disableSubmitButton: function() {
      this.questionNode.getElementsByClassName("next")[0].disabled = true;
    },
  };
  return questionView;
}
