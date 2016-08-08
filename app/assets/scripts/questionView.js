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
      var answerInput;
      var answerRadios =  this.questionNode.getElementsByClassName("radio");

      if(answerRadios.length > 0) {
        for (var i = 0;i < answerRadios.length; i++) {
          radio = answerRadios[i];
          if(radio.checked === true) {
            answerInput = radio;
          }
        };
      } else {
        answerInput = this.questionNode.getElementsByClassName("question-input")[0];
      };
      return answerInput.value;
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
    enableSubmitButton: function() {
      this.questionNode.getElementsByClassName("next")[0].disabled = false;
    },
    disableSubmitButton: function() {
      this.questionNode.getElementsByClassName("next")[0].disabled = true;
    },
  };
  return questionView;
}
