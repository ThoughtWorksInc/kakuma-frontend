var answerArray = [];
var progress = null;
var selectedQuestion = null;

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
  }
  //what is the next unanswered question???
  return getAllQuestionsArray().find(isUnanswered);
}

function answerSubmit(questionNumber) {

  var answer = getQuestionView(questionNumber).getAnswer();

  hideAllInputFields();

  getQuestionView(questionNumber)
    .displayResponseWith(answer)
    .hideQuestionText()
    .removeEditHighlight();

  //what is the next unanswered question???
  var firstUnansweredQuestion = getFirstUnansweredQuestion();

  if (firstUnansweredQuestion) { //There may not be any more unanswered questions.
    firstUnansweredQuestion.show();
  } //else - we're at the end - some kinda confirmation that they are ready to submit

  //update progress variable
}

function editResponse(questionNumber) {
  //hide all the text boxes.
  hideAllInputFields();
  removeAllEditHighlights();
  //display input box for the question we /do/ want
  getQuestionView(questionNumber).showTextbox();

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


function playAnimation (){
  document.getElementById("mic-gif").src = "../images/mic.gif"
}

function startTimer () {
  var seconds = 60;
  var interval = setInterval(function() {
      seconds--;
      document.getElementById("timer").innerHTML = seconds;
      if(seconds == 0) {
        clearInterval(interval);
      }
  }, 1000);
}

function moveSlider() {
  document.getElementById("slider-status-mark").classList.add("animate");
  document.getElementById("slider-status-fill").classList.add("animate");

  // Array.prototype.map.call(document.getElementsByClassName("slider"), function(element) {
  //   element.classList.add("animate");
  // });
}

function setRecordingToFinished() {
  // document.getElementById("slider-status-mark").classList.remove("animate");
  // document.getElementById("slider-status-fill").classList.remove("animate");
  document.getElementById("slider-bar").classList.add("finished");
}

function recordVoice() {
  // play gif for 60 seconds
  playAnimation();

  //timer counts down from 60 sec
  startTimer();

  //Move
  moveSlider();

  //after 60 seconds display finished gif
  // Set background to green, show play button, show delete button
  setTimeout(setRecordingToFinished, 60000);
}
