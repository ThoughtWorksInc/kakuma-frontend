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
  //what is the next unanswered question???
  return getAllQuestionsArray().find(isUnanswered);
}

function answerSubmit(questionNumber) {

  var answer = getQuestionView(questionNumber).getAnswer();

  hideAllInputFields();

  getQuestionView(questionNumber)
    .displayResponseWith(answer)
    .hideQuestionText()
    .displayEditButton()
    .removeEditHighlight()
    console.log(getQuestionView(1));


  //what is the next unanswered question???
  var firstUnansweredQuestion = getFirstUnansweredQuestion();

  if (firstUnansweredQuestion) { //There may not be any more unanswered questions.
    firstUnansweredQuestion.show();
    firstUnansweredQuestion.scrollTo();
  } //else - we're at the end - some kinda confirmation that they are ready to submit

  //update progress variable
}

function editResponse(questionNumber) {
  //hide all the text boxes.
  hideAllInputFields();
  removeAllEditHighlights();
  //display input box for the question we /do/ want
  getQuestionView(questionNumber)
      .showTextbox()
      .removeEditButton();

  //modify styling of the current question - apply shiny
  getQuestionView(questionNumber).highlightQuestionForEdit()

}

function clickButtonOnEnterPress(event, questionNumber) {
  if (event.keyCode == 13) {
    event.preventDefault();
    answerSubmit(questionNumber);
    return false;
  }
}