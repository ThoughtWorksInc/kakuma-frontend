function getQuestionNode (questionNumber) {
  return document.getElementById("question-" + questionNumber);
}

function getQuestionView(questionNumber) {
  var questionView = {
    questionNode: getQuestionNode(questionNumber),
    showTextbox: function () {
      this.questionNode.getElementsByClassName("input-container")[0]
        .classList
        .remove("hidden");
      this.questionNode.getElementsByClassName("answer")[0].focus();

      return this;
    },
    show: function() {
      this.questionNode.classList.remove("hidden");
      return this;
    },
    getAnswer: function() {
      return this.questionNode.getElementsByClassName("answer")[0].value;
    },
    hasAnswer: function() {
      if (this.getAnswer()) {
        return true;
      }
      return false;
    },
    displayResponseWith: function(answer) {
      this.updateResponseTextWith(answer);
      this.questionNode.getElementsByClassName("response-container")[0].classList.remove("hidden");
      return this;
    },
    updateResponseTextWith: function(answer) {
      this.questionNode.getElementsByClassName("response-text")[0].innerHTML = answer;
      return this;
    },
    hideQuestionText:function() {
      this.questionNode.getElementsByClassName("question-container")[0]
        .classList.add("hidden");
      return this;
    },
    scrollTo: function(){
      window.scrollTo(0,document.body.scrollHeight);
      return this;
    },
    highlightQuestionForEdit: function() {
      this.questionNode.classList.add("edit-highlight");
      return this;
    },
    removeEditHighlight: function() {
      this.questionNode.classList.remove("edit-highlight");
      return this;
    },
    displayEditButton: function() {
      this.questionNode.getElementsByClassName("edit-icon")[0].classList.remove("hidden");
      return this;
    },
    removeEditButton: function() {
      this.questionNode.getElementsByClassName("edit-icon")[0].classList.add("hidden");
      return this;
    },
    reset: function() {
      this.questionNode.getElementsByClassName("answer")[0].value = "";
      this.updateResponseTextWith("");
    },
    isNormalQuestion: function() {
      return this.questionNode.getElementsByClassName("response-container").length > 0;
    }
  };
  return questionView;
}
