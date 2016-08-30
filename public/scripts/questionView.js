
function getAllQuestionsArray() {
  var allQuestionViews = [];
  var allQuestionNodes = document.getElementsByClassName("question");
  for (i = 1; i <= allQuestionNodes.length; i++) {
    allQuestionViews[i - 1] = getQuestionView(i);
  }
  return allQuestionViews;
}

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
    setRadioValue: function(radios, value){
      for (var i = 0; i < radios.length; i++) {
        radio = radios[i];
        if(radio.value === value) {
          return radio.checked = true;
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
    update: function(answer) {
      var radios = this.getRadios();
      return radios ? this.setRadioValue(radios,answer) : this.questionNode.getElementsByClassName("question-input")[0].value = answer;

    },
    reset: function() {
      var radios = this.getRadios();
      if(radios){
        var checkedRadioButton = this.getCheckedRadioButton(radios);
        checkedRadioButton.checked = false;
      } else {
      this.questionNode.getElementsByClassName("question-input")[0].value = "";
      }
    },
    validateFormInput: function() {
      if(this.hasAnswer()){
        this.enableSubmitButton();
      } else {
        this.disableSubmitButton();
      }
      return this;
    },
    enableSubmitButton: function() {
      this.questionNode.getElementsByClassName("next")[0].disabled = false;
    },
    disableSubmitButton: function() {
      this.questionNode.getElementsByClassName("next")[0].disabled = true;
    }
  };
  return questionView;
}

module.exports = {
  getQuestionView: getQuestionView,
  getAllQuestionsArray: getAllQuestionsArray
};
