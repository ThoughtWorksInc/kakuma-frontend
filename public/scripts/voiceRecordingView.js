var isRecording = false;
var messageCompleted = false;
var isPlaying = false;
var interval;
var playTimer;
var recordingTimer;

function displayStopButton (){
    document.getElementById("stop-btn").classList.remove("hidden");
    document.getElementById("mic").classList.add("hidden");
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
  document.getElementById("form-button-container").classList.remove("hidden");
  document.getElementById("bin-btn").classList.remove("hidden");
}

function startTimer() {
    console.log("start timer");
    var seconds = 60;
    interval = setInterval(function() {
        seconds--;
        document.getElementById("timer").innerHTML = seconds;
        if(seconds == 0) {
            clearInterval(interval);
        }
    }, 1000);
}

function stopTimer(timeOut) {
    clearTimeout(timeOut);
    clearInterval(interval);
}

function toggleTimerDisplay(){
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

    clearInterval(interval);
    toggleTimerDisplay();
    startTimer();
    displayStopButton();

    document.getElementById("recording-question-container").classList.add("hidden");
    document.getElementById("recording-instructions").classList.remove("hidden");

    moveSlider();
    recordingTimer = setTimeout(stopRecording, 60000);;
}

function stopRecording() {
    messageCompleted = true;
    isRecording = false;

    stopTimer(recordingTimer);
    stopSlider();
    console.log("stop recording");
    displayPlayControls();
    toggleTimerDisplay();
}

function playMessage() {
    messageCompleted = true;
    isPlaying = true;

    clearInterval(interval);
    document.getElementById("bin-btn").classList.remove("hidden");
    moveSlider();
    console.log("play message");
    playTimer = setTimeout(stopPlaying, 60000);
}

function stopPlaying() {
    messageCompleted = true;
    isPlaying = false;

    stopTimer(playTimer);
    stopSlider();
    clearInterval(interval);
    displayPlayControls();
    console.log("stop playing");
}

function voiceMessage() {
    if(!messageCompleted && !isRecording){
        recordMessage();
    } else if(!messageCompleted && isRecording) {
        stopRecording();
    } else if (messageCompleted && !isPlaying) {
        playMessage();
    } else if(messageCompleted && isPlaying) {
        stopPlaying();
    }
}

function resetVoiceMessage() {
    stopTimer();
    messageCompleted = false;
    isPlaying = false;
    stopSlider();
    toggleTimerDisplay();

    document.getElementById("bin-btn").classList.add("hidden");
    document.getElementById("play-btn").classList.add("hidden");
    document.getElementById("mic").classList.remove("hidden");
    document.getElementById("form-button-container").classList.add("hidden");

    document.getElementById("recording-question-container").classList.remove("hidden");
    document.getElementById("recording-response-container").classList.add("hidden");
}
