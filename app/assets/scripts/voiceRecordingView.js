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

function stopTimer() {
    clearTimeout(setTimeout);
    clearInterval(interval);
}

function setRecordingToFinished() {
    messageCompleted = true;
    isRecording = false;
    isPlaying = false;

    stopTimer();
    stopSlider();

    document.getElementById("play-btn").classList.remove("hidden");
    document.getElementById("mic-gif").classList.add("hidden");
    document.getElementById("recording-instructions").classList.add("hidden");
    toggleTimerDisplay();

    document.getElementById("recording-response-container").classList.remove("hidden");
    document.getElementById("form-button-container").classList.remove("hidden");
    document.getElementById("bin-btn").classList.remove("hidden");
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
    isPlaying = false;

    toggleTimerDisplay();

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
        setRecordingToFinished();
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