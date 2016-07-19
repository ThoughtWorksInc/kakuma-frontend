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



//Voice recording animation stuff
//TODO good old refactor
var isRecording = false;
var messageCompleted = false;
var isPlaying = false;
var interval;
var setTimeout = setTimeout(setRecordingToFinished, 60000);

function playAnimation (){
  document.getElementById("mic-gif").classList.remove("hidden");
  document.getElementById("mic").classList.add("hidden");
}


function startTimer () {
  var seconds = 60;
  interval = setInterval(function() {
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
}

function stopSlider() {
  document.getElementById("slider-status-mark").classList.remove("animate");
  document.getElementById("slider-status-fill").classList.remove("animate");
  document.getElementById("slider-bar").classList.add("finished");
}

function setRecordingToFinished() {
  messageCompleted = true;
  isRecording = false;
  isPlaying = false;

  clearTimeout(setTimeout);
  stopSlider();

  document.getElementById("play-btn").classList.remove("hidden");
  document.getElementById("mic-gif").classList.add("hidden");
  document.getElementById("recording-instructions").classList.add("hidden");
  toggleTimer();

  document.getElementById("recording-response-container").classList.remove("hidden");
  document.getElementById("form-button-container").classList.remove("hidden");
  document.getElementById("bin-btn").classList.remove("hidden");
}

function toggleTimer(){
  var timer = document.getElementById("timer");
  timer.innerHTML = 60;

  if(!messageCompleted && !isRecording) {
    timer.style.display = "inline-block";
  }else if(!isRecording) {
    timer.style.display = "none";
  }
}

function recordMessage() {
  isRecording = true;
  isPlaying = false;

  toggleTimer();

  playAnimation();

  document.getElementById("recording-question-container").classList.add("hidden");
  document.getElementById("recording-instructions").classList.remove("hidden");

  startTimer();
  moveSlider();
  setTimeout;
}

function playMessage() {
  document.getElementById("bin-btn").classList.remove("hidden");
  isPlaying = true;
  isRecording = false;
  moveSlider();
  setTimeout;
}

function voiceMessage() {
  if(messageCompleted) {
    document.getElementById("recording-question-container").classList.add("hidden");
    moveSlider();
    setTimeout;
  }

  if(!messageCompleted && !isRecording){
    recordMessage();
  } else if (messageCompleted && !isPlaying) {
    clearInterval(interval);
    playMessage();
  } else  {
    clearInterval(interval);
    setRecordingToFinished();
  }
}

function resetVoiceMessage() {
  messageCompleted = false;
  isPlaying = false;
  stopSlider();
  toggleTimer();

  document.getElementById("bin-btn").classList.add("hidden");
  document.getElementById("play-btn").classList.add("hidden");
  document.getElementById("mic").classList.remove("hidden");
  document.getElementById("form-button-container").classList.add("hidden");

  document.getElementById("recording-question-container").classList.remove("hidden");
  document.getElementById("recording-response-container").classList.add("hidden");
}