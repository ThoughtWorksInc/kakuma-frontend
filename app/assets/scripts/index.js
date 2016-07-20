function getAllQuestionsArray () {
  var allQuestionViews = [];
  var allQuestionNodes = document.getElementsByClassName("question");
  for (i = 1; i <= allQuestionNodes.length; i++) {
    allQuestionViews[i-1] = getQuestionView(i);
  }
  return allQuestionViews;
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

function getFirstUnansweredQuestion() {
  var isUnanswered = function (question) {
    return !question.hasAnswer();
  };
  return getAllQuestionsArray().find(isUnanswered);
}

function answerSubmit(questionNumber) {
  var answer = getQuestionView(questionNumber).getAnswer();
  var firstUnansweredQuestion = getFirstUnansweredQuestion();

  hideAllInputFields();
  getQuestionView(questionNumber)
    .displayResponseWith(answer)
    .hideQuestionText()
    .displayEditButton()
    .removeEditHighlight();

  if (firstUnansweredQuestion)
    firstUnansweredQuestion.show();
    firstUnansweredQuestion.scrollTo();
  }
}

function editResponse(questionNumber) {
  hideAllInputFields();
  removeAllEditHighlights();
  getQuestionView(questionNumber)
      .showTextbox()
      .removeEditButton();
  getQuestionView(questionNumber).highlightQuestionForEdit()
}

function clickButtonOnEnterPress(event, questionNumber) {
  if (event.keyCode == 13) {
    event.preventDefault();
    answerSubmit(questionNumber);
    return false;
  }
}

function confirmationMessage() {
  document.getElementsByClassName("confirmation")[0].classList.remove("hidden");
  document.getElementsByClassName("answer")[0].classList.add("hidden");
  document.getElementsByClassName("logo")[0].classList.add("hidden");
}
