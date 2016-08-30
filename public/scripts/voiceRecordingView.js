var questionView = require('./questionView');

var isRecording = false;
var messageCompleted = false;
var isPlaying = false;
var interval;
var playTimer;
var recordingTimer;

function displayStopButton() {
    var stopButton = document.getElementById("stop-btn");
    stopButton.classList.remove("hidden");

    document.getElementById("mic").classList.add("hidden");
    if (stopButton.classList.contains("fill-green")) {
        stopButton.classList.remove("fill-green");
    }
}

function moveSlider() {
    document.getElementById("slider-status-mark").classList.add("animate");
    document.getElementById("slider-status-fill").classList.add("animate");
}

function stopSlider() {
    clearInterval(interval);
    document.getElementById("slider-status-mark").classList.remove("animate");
    document.getElementById("slider-status-fill").classList.remove("animate");
    document.getElementById("slider-bar").classList.add("finished");
}

function displayPlayControls() {
    document.getElementById("play-btn").classList.remove("hidden");
    document.getElementById("stop-btn").classList.add("hidden");

    document.getElementById("recording-instructions").classList.add("hidden");
    document.getElementById("recording-response-container").classList.remove("hidden");
    // document.getElementById("form-button-container").classList.remove("hidden");
    document.getElementById("bin-btn").classList.remove("hidden");
}
function startTimer() {
    var seconds = 60;
    interval = setInterval(function () {
        seconds--;
        document.getElementById("timer").innerHTML = seconds;
        if (seconds == 0) {
            clearInterval(interval);
        }
    }, 1000);
}



function stopTimer(timeOut) {
    clearTimeout(timeOut);
    clearInterval(interval);
}

function toggleTimerDisplay() {
    var timer = document.getElementById("timer");
    timer.innerHTML = 60;

    if (!messageCompleted && !isRecording) {
        timer.style.display = "inline-block";
    } else if (!isRecording) {
        timer.style.display = "none";
    }
}

function toggleStopButtonDisplay() {
    var stopButton = document.getElementById("stop-btn");
    if (isPlaying) {
        stopButton.classList.remove("hidden");
        stopButton.classList.add("fill-green");
        document.getElementById("play-btn").classList.add("hidden");
    } else {
        document.getElementById("play-btn").classList.remove("hidden");
        document.getElementById("stop-btn").classList.add("hidden");
    }
}

function recordMessage() {
    isRecording = true;

    clearInterval(interval);
    toggleTimerDisplay();
    startTimer();
    displayStopButton();

    document.getElementById("recording-question-container").classList.add("hidden");
    document.getElementById("recording-instructions").classList.remove("hidden");

    moveSlider();
    recordingTimer = setTimeout(stopRecording, 60000);
}

function setQuestionToDone() {
  view = questionView.getQuestionView(11);
  view.enableSubmitButton();
  view.questionNode.getElementsByClassName("question-input")[0].value = "done";
}

function setQuestionToNotDone() {
  view = questionView.getQuestionView(11);
  view.disableSubmitButton();
  view.questionNode.getElementsByClassName("question-input")[0].value = "";
}

function stopRecording() {
    messageCompleted = true;
    isRecording = false;
    isPlaying = false;

    stopTimer(recordingTimer);
    stopSlider();
    displayPlayControls();
    toggleTimerDisplay();

    setQuestionToDone();
}

function playMessage() {
    messageCompleted = true;
    isPlaying = true;

    toggleStopButtonDisplay();
    clearInterval(interval);
    document.getElementById("bin-btn").classList.remove("hidden");
    moveSlider();
    playTimer = setTimeout(stopPlaying, 60000);
}

function stopPlaying() {
    messageCompleted = true;
    isPlaying = false;

    stopTimer(playTimer);
    stopSlider();
    //clearInterval(interval);
    displayPlayControls();
}

voiceMessage = function() {
    if (!messageCompleted && !isRecording) {
        recordMessage();
    } else if (!messageCompleted && isRecording) {
        stopRecording();
    } else if (messageCompleted && !isPlaying) {
        playMessage();
    } else if (messageCompleted && isPlaying) {
        stopPlaying();
    }
};

resetVoiceMessage = function() {
    messageCompleted = false;
    isPlaying = false;

    stopTimer(playTimer);
    stopSlider();
    toggleTimerDisplay();
    toggleStopButtonDisplay();

    setQuestionToNotDone();

    document.getElementById("bin-btn").classList.add("hidden");
    document.getElementById("play-btn").classList.add("hidden");
    document.getElementById("mic").classList.remove("hidden");
    // document.getElementById("form-button-container").classList.add("hidden");

    document.getElementById("recording-question-container").classList.remove("hidden");
    document.getElementById("recording-response-container").classList.add("hidden");
}

module.exports = {
  voiceMessage: voiceMessage,
  resetVoiceMessage: resetVoiceMessage,
};
