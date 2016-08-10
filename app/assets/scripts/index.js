window.onload  = function() {
  validateAllQuestions();
  showNextScreen();
};

function getAllQuestionsArray () {
  var allQuestionViews = [];
  var allQuestionNodes = document.getElementsByClassName("question");
  for (i = 1; i <= allQuestionNodes.length; i++) {
    allQuestionViews[i-1] = getQuestionView(i);
  }
  return allQuestionViews;
}

function getFirstUnansweredQuestion() {
  var isUnanswered = function (question) {
    return !question.hasAnswer();
  };
  return getAllQuestionsArray().find(isUnanswered);
}

function showNextScreen() {
  hideAllQuestions();
  var nextQuestion = getFirstUnansweredQuestion();
  var nextScreen = nextQuestion ? nextQuestion : getSummaryView();

  return nextScreen.show();
}

function hideAllQuestions() {
  getAllQuestionsArray()
    .map(function(question) {
      question.hide();
    });
}

function goToQuestion(questionID) {
  hideAllQuestions();
  getQuestionView(questionID).show();
}

function validateAnswer(questionID) {
   var question = getQuestionView(questionID);
   question.validateFormInput();
}

function validateAllQuestions(){
  getAllQuestionsArray()
    .map(function(question) {
      question.validateFormInput();
    });
}

function showSummary(){
  hideAllQuestions();
  getSummaryView().show();
}

function updateSummaryField(questionID) {
  var answer = getQuestionView(questionID).getAnswer();

  var summary = getSummaryView();
  summary.updateQuestionResponseWith(answer, questionID);
}

function clickButtonOnEnterPress(event, questionNumber) {
  if (event.keyCode == 13) {
    event.preventDefault();
    goToQuestion(questionNumber+1);
    return false;
  }
}

function confirmationMessage() {
  getAllQuestionsArray().map(function(question){
    question.reset();
  });

  getSummaryView().hide();
  resetVoiceMessage();
  document.getElementById("confirmation").classList.remove("hidden");
}


// function editResponse(questionNumber) {
//   hideAllInputFields();
//   //put all other answered questions back to normal answered visibility
//   displayAllEditIcons();
//   removeAllEditHighlights();
//
//   getQuestionView(questionNumber)
//       .showTextbox()
//       .removeEditButton()
//       .highlightQuestionForEdit();
// }


// function displayAllEditIcons() {
//   var icons = document.getElementsByClassName("edit-icon");
//   for (i = 0; i < icons.length; i++) {
//     if(icons[i].classList.contains("hidden")) {
//       icons[i].classList.remove("hidden");
//     }
//   }
//   return icons;
// }

// function removeAllEditHighlights() {
//   getAllQuestionsArray().map(function(questionView) {
//     questionView.removeEditHighlight();
//   });
// }
