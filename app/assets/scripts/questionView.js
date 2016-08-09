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
    getRadios: function() {
      var radios =  this.questionNode.getElementsByClassName("radio");
      return radios.length > 0 ? radios : null;
    },
    getCheckedRadioButton: function(radios) {
      for (var i = 0; i < radios.length; i++) {
        radio = radios[i];
        if(radio.checked === true) {
          return radio;
        }
      }
      return null;
    },
    getAnswer: function() {
      var answerInput;

      var radios = this.getRadios();
      if(radios) {
        var checkedRadioButton = this.getCheckedRadioButton(radios);
        if(checkedRadioButton) {
          answerInput = checkedRadioButton;
        } else {
          return null;
        }
      } else {
        answerInput = this.questionNode.getElementsByClassName("question-input")[0];
      }
      return answerInput.value;
    },
    hasAnswer: function() {
      if (this.getAnswer()) {
        return true;
      }
      return false;
    },

    reset: function() {
      var radios = this.getRadios();
      if(radios){
        var checkedRadioButton = this.getCheckedRadioButton(radios)
        checkedRadioButton.checked = false;
      } else {
      this.questionNode.getElementsByClassName("question-input")[0].value = "";
      }
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
