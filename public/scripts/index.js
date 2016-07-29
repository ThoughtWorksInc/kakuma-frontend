
function getAllQuestionsArray () {
  var allQuestionViews = [];
  var allQuestionNodes = document.getElementsByClassName("question");
  for (i = 1; i <= allQuestionNodes.length; i++) {
    allQuestionViews[i-1] = getQuestionView(i);
  }
  return allQuestionViews;
}

function displayAllEditIcons() {
  var icons = document.getElementsByClassName("edit-icon");
  for (i = 0; i < icons.length; i++) {
    if(icons[i].classList.contains("hidden")) {
      icons[i].classList.remove("hidden");
    }
  }
  return icons;
}

function hideAllInputFields() {
  var inputFieldCollection = document.getElementsByClassName("input-container");
  var inputContainer = Array.prototype.map.call(inputFieldCollection, function(element) {
    element.classList.add("hidden");
  });
}

function removeAllEditHighlights() {
  getAllQuestionsArray().map(function(questionView) {
    questionView.removeEditHighlight();
  });
}
function displayAllAnsweredQuestions() {
  getAllQuestionsArray()
    .map(function(question) { 
      var answerMaybe = question.getAnswer();
      if (answerMaybe) {
        question.displayResponseWith(answerMaybe)
        .hideQuestionText()
        .displayEditButton()
        .removeEditHighlight()
        .show();
      }
    });
}

function getNameToFind() {
  return document.getElementById('nameToFind').innerText;
}

function getFirstUnansweredQuestion() {
  var isUnanswered = function (question) {
    return !question.hasAnswer();
  };
  return getAllQuestionsArray().find(isUnanswered);
}

function answerSubmit(questionNumber) {
  hideAllInputFields();

  displayAllAnsweredQuestions();

  var firstUnansweredQuestion = getFirstUnansweredQuestion();
  if (firstUnansweredQuestion) {
    firstUnansweredQuestion
      .show()
      .showTextbox()
      .scrollTo();
  }
}

function editInProgress(questionNumber) {
  var question = getQuestionView(questionNumber);
  var answer = question.getAnswer();
  //copy from text to response (don't display or hide anything)
  question.updateResponseTextWith(answer);
}

function editResponse(questionNumber) {
  hideAllInputFields();
  //put all other answered questions back to normal answered visibility
  displayAllEditIcons();
  removeAllEditHighlights();
  
  getQuestionView(questionNumber)
      .showTextbox()
      .removeEditButton()
      .highlightQuestionForEdit();
}

function clickButtonOnEnterPress(event, questionNumber) {
  if (event.keyCode == 13) {
    event.preventDefault();
    answerSubmit(questionNumber);
    return false;
  }
}
  
function confirmationMessage() {
  getAllQuestionsArray().map(function(question){
    if (question.isNormalQuestion()) {
      question.reset();
    }
  });
  resetVoiceMessage();
  document.getElementsByClassName("confirmation")[0].classList.remove("hidden");
  document.getElementsByClassName("answer")[0].classList.add("hidden");
  document.getElementsByClassName("logo")[0].classList.add("hidden");
}

window.onload  = function() {answerSubmit();};
