var request = require('request');

request('https://useragentidentifier.expeditedaddons.com/?api_key=' + process.env.USERAGENTIDENTIFIER_API_KEY + '&user_agent=Mozilla', function (error, response, body) {
  console.log('Status:', response.statusCode);
  console.log('Headers:', JSON.stringify(response.headers));
  console.log('Response:', body);
});

console.log(request.isMobile);
console.log(request.mobile_browser);
console.log(request.mobile_brand);


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
  console.log("removeAllEditHighlights");
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

  if (firstUnansweredQuestion) {
    firstUnansweredQuestion.show();
    firstUnansweredQuestion.scrollTo();
  }
}

function editResponse(questionNumber) {
  hideAllInputFields();
  displayAllEditIcons();
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
