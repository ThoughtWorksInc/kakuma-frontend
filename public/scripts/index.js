
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
        question.show();
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

function hideAllQuestions() {
  getAllQuestionsArray()
    .map(function(question) {
      question.hide();
    });
}

function answerSubmit(questionID) {
  // hideAllQuestions();
  // var firstUnansweredQuestion = getFirstUnansweredQuestion();
  // if (firstUnansweredQuestion) {
  //   firstUnansweredQuestion
  //     .show()
  // }

  goToQuestion(questionID + 1);
}

function goToQuestion(questionID) {
  hideAllQuestions();
  getQuestionView(questionID).show();
}

function validateInput(questionID) {
   var question = getQuestionView(questionID);

   if(question.hasAnswer()){
     question.enableSubmitButton();
   } else {
     question.disableSubmitButton();
   }
}

function showSummary(){
  hideAllQuestions();
  getSummaryView().show();
}

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
  }
  return summaryView;
}

function updateSummaryField(questionID) {
  var question = getQuestionView(questionID);
  var answer = question.getAnswer();

  var summary = getSummaryView();
  summary.updateQuestionResponseWith(answer, questionID);
}


//
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

function clickButtonOnEnterPress(event, questionNumber) {
  if (event.keyCode == 13) {
    event.preventDefault();
    answerSubmit(questionNumber);
    return false;
  }
}

function confirmationMessage() {
  getAllQuestionsArray().map(function(question){
    question.reset();
  });

  getSummaryView().hide();
  resetVoiceMessage();
  document.getElementsByClassName("confirmation")[0].classList.remove("hidden");
}

// window.onload  = function() {answerSubmit();};
