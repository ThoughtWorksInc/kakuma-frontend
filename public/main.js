(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var questionView = require('./questionView.js');
var summaryView = require('./summaryView.js');
var voiceRecordingView = require('./voiceRecordingView.js');

window.addEventListener('load', function () {
    validateAllQuestions();
    showNextScreen();
}, false);

 getAllQuestionsArray = function() {
    var allQuestionViews = [];
    var allQuestionNodes = document.getElementsByClassName("question");
    for (i = 1; i <= allQuestionNodes.length; i++) {
        allQuestionViews[i - 1] = questionView.getQuestionView(i);
    }
    return allQuestionViews;
};

getFirstUnansweredQuestion = function() {
    var isUnanswered = function (question) {
        return !question.hasAnswer();
    };
    return getAllQuestionsArray().find(isUnanswered);
};

showNextScreen = function() {
    hideAllQuestions();
    var nextQuestion = getFirstUnansweredQuestion();
    var nextScreen = nextQuestion ? nextQuestion : summaryView.getSummaryView();

    return nextScreen.show();
};

hideAllQuestions = function() {
    getAllQuestionsArray()
        .map(function (question) {
            question.hide();
        });
};

goToQuestion = function(questionID) {
    hideAllQuestions();
    questionView.getQuestionView(questionID).show();
};

validateAnswer = function(questionID) {
    var question = questionView.getQuestionView(questionID);
    question.validateFormInput();
};

validateAllQuestions = function () {
    getAllQuestionsArray()
        .map(function (question) {
            question.validateFormInput();
        });
};

showSummary = function() {
    hideAllQuestions();
    summaryView.getSummaryView().show();
};

updateSummaryField = function(questionID) {
    var answer = questionView.getQuestionView(questionID).getAnswer();

    var summary = summaryView.getSummaryView();
    summary.updateQuestionResponseWith(answer, questionID);
};

updateQuestionFieldFromSummary = function(questionID) {
    var answer = summaryView.getSummaryView().getAnswer(questionID);

    var question = questionView.getQuestionView(questionID);
    question.update(answer);
};

clickButtonOnEnterPress = function(event, callback, questionID) {
    if (event.keyCode == 13) {
        event.preventDefault();
        callback(questionID);
        return false;
    }
};

confirmationMessage = function() {
    getAllQuestionsArray().map(function (question) {
        question.reset();
    });

    summaryView.getSummaryView().hide();
    voiceRecordingView.resetVoiceMessage();
    document.getElementById("confirmation").classList.remove("hidden");
};


startEditing = function(questionID) {
    summaryView.getSummaryView().enableEdit(questionID);
};

finishEditing = function(questionID) {
    updateQuestionFieldFromSummary(questionID);
    summaryView.getSummaryView().disableEdit(questionID);
};

module.exports = {
  getAllQuestionsArray: getAllQuestionsArray,

  getFirstUnansweredQuestion: getFirstUnansweredQuestion,

  showNextScreen: showNextScreen,

  hideAllQuestions: hideAllQuestions,

  goToQuestion: goToQuestion,

  validateAnswer: validateAnswer,

  validateAllQuestions: validateAllQuestions,

  showSummary: showSummary,

  updateSummaryField: updateSummaryField,

  updateQuestionFieldFromSummary: updateQuestionFieldFromSummary,

  clickButtonOnEnterPress: clickButtonOnEnterPress,

  confirmationMessage: confirmationMessage,

  startEditing: startEditing,

  finishEditing: finishEditing,
};

},{"./questionView.js":3,"./summaryView.js":4,"./voiceRecordingView.js":5}],2:[function(require,module,exports){
require('./voiceRecordingView.js');
require('./appViewController.js');
require('./summaryView.js');
require('./questionView.js');

},{"./appViewController.js":1,"./questionView.js":3,"./summaryView.js":4,"./voiceRecordingView.js":5}],3:[function(require,module,exports){
module.exports = {
  getQuestionView: getQuestionView,
}

function getQuestionNode (questionID) {
  return document.getElementById("question-" + questionID);
}

function getQuestionView(questionID) {
  var questionView = {
    questionNode: getQuestionNode(questionID),
    show: function() {
      this.questionNode.classList.remove("hidden");
      this.focusInput();
      return this;
    },
    hide: function() {
      this.questionNode.classList.add("hidden");
      return this;
    },
    focusInput: function() {
      this.questionNode.getElementsByClassName("question-input")[0].focus();
    },
    getRadios: function() {
      var radios =  this.questionNode.getElementsByClassName("radio");
      return radios.length > 0 ? radios : null;
    },
    getCheckedRadioButton: function(radios) {
      for (var i = 0; i < radios.length; i++) {
        radio = radios[i];
        if(radio.checked === true) {
          return radio;
        }
      }
      return null;
    },
    setRadioValue: function(radios, value){
      for (var i = 0; i < radios.length; i++) {
        radio = radios[i];
        if(radio.value === value) {
          return radio.checked = true;
        }
      }
      return null;

    },
    getAnswer: function() {
      var answerInput;

      var radios = this.getRadios();
      if(radios) {
        var checkedRadioButton = this.getCheckedRadioButton(radios);
        if(checkedRadioButton) {
          answerInput = checkedRadioButton;
        } else {
          return null;
        }
      } else {
        answerInput = this.questionNode.getElementsByClassName("question-input")[0];
      }
      return answerInput.value;
    },
    hasAnswer: function() {
      if (this.getAnswer()) {
        return true;
      }
      return false;
    },
    update: function(answer) {
      var radios = this.getRadios();
      return radios ? this.setRadioValue(radios,answer) : this.questionNode.getElementsByClassName("question-input")[0].value = answer;

    },
    reset: function() {
      var radios = this.getRadios();
      if(radios){
        var checkedRadioButton = this.getCheckedRadioButton(radios);
        checkedRadioButton.checked = false;
      } else {
      this.questionNode.getElementsByClassName("question-input")[0].value = "";
      }
    },
    validateFormInput: function() {
      if(this.hasAnswer()){
        this.enableSubmitButton();
      } else {
        this.disableSubmitButton();
      }
      return this;
    },
    enableSubmitButton: function() {
      this.questionNode.getElementsByClassName("next")[0].disabled = false;
    },
    disableSubmitButton: function() {
      this.questionNode.getElementsByClassName("next")[0].disabled = true;
    }
  };
  return questionView;
}

},{}],4:[function(require,module,exports){
module.exports = {
  getSummaryView: getSummaryView
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
      return this;
    },
    hide: function() {
      this.node.classList.add("hidden");
      return this;
    },
    enableEdit: function(questionID) {
      var response = document.getElementById("summary-response-"+ questionID);
      response.disabled = false;
      response.classList.add("editing");
      response.nextSibling.classList.add("hidden");
      response.focus();
    },
    disableEdit: function(questionID) {
      var response = document.getElementById("summary-response-"+ questionID);
      response.disabled = true;
      response.classList.remove("editing");
      response.nextSibling.classList.remove("hidden");
    },
    getAnswer: function(questionID) {
      return document.getElementById("summary-response-"+ questionID).value;
    }
  };
  return summaryView;
}

},{}],5:[function(require,module,exports){
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
    ;
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
}

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
}

},{"./questionView":3}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFwcC9qYXZhc2NyaXB0cy9hcHBWaWV3Q29udHJvbGxlci5qcyIsImFwcC9qYXZhc2NyaXB0cy9tYWluLmpzIiwiYXBwL2phdmFzY3JpcHRzL3F1ZXN0aW9uVmlldy5qcyIsImFwcC9qYXZhc2NyaXB0cy9zdW1tYXJ5Vmlldy5qcyIsImFwcC9qYXZhc2NyaXB0cy92b2ljZVJlY29yZGluZ1ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBxdWVzdGlvblZpZXcgPSByZXF1aXJlKCcuL3F1ZXN0aW9uVmlldy5qcycpO1xudmFyIHN1bW1hcnlWaWV3ID0gcmVxdWlyZSgnLi9zdW1tYXJ5Vmlldy5qcycpO1xudmFyIHZvaWNlUmVjb3JkaW5nVmlldyA9IHJlcXVpcmUoJy4vdm9pY2VSZWNvcmRpbmdWaWV3LmpzJyk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuICAgIHZhbGlkYXRlQWxsUXVlc3Rpb25zKCk7XG4gICAgc2hvd05leHRTY3JlZW4oKTtcbn0sIGZhbHNlKTtcblxuIGdldEFsbFF1ZXN0aW9uc0FycmF5ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFsbFF1ZXN0aW9uVmlld3MgPSBbXTtcbiAgICB2YXIgYWxsUXVlc3Rpb25Ob2RlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJxdWVzdGlvblwiKTtcbiAgICBmb3IgKGkgPSAxOyBpIDw9IGFsbFF1ZXN0aW9uTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYWxsUXVlc3Rpb25WaWV3c1tpIC0gMV0gPSBxdWVzdGlvblZpZXcuZ2V0UXVlc3Rpb25WaWV3KGkpO1xuICAgIH1cbiAgICByZXR1cm4gYWxsUXVlc3Rpb25WaWV3cztcbn07XG5cbmdldEZpcnN0VW5hbnN3ZXJlZFF1ZXN0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGlzVW5hbnN3ZXJlZCA9IGZ1bmN0aW9uIChxdWVzdGlvbikge1xuICAgICAgICByZXR1cm4gIXF1ZXN0aW9uLmhhc0Fuc3dlcigpO1xuICAgIH07XG4gICAgcmV0dXJuIGdldEFsbFF1ZXN0aW9uc0FycmF5KCkuZmluZChpc1VuYW5zd2VyZWQpO1xufTtcblxuc2hvd05leHRTY3JlZW4gPSBmdW5jdGlvbigpIHtcbiAgICBoaWRlQWxsUXVlc3Rpb25zKCk7XG4gICAgdmFyIG5leHRRdWVzdGlvbiA9IGdldEZpcnN0VW5hbnN3ZXJlZFF1ZXN0aW9uKCk7XG4gICAgdmFyIG5leHRTY3JlZW4gPSBuZXh0UXVlc3Rpb24gPyBuZXh0UXVlc3Rpb24gOiBzdW1tYXJ5Vmlldy5nZXRTdW1tYXJ5VmlldygpO1xuXG4gICAgcmV0dXJuIG5leHRTY3JlZW4uc2hvdygpO1xufTtcblxuaGlkZUFsbFF1ZXN0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICAgIGdldEFsbFF1ZXN0aW9uc0FycmF5KClcbiAgICAgICAgLm1hcChmdW5jdGlvbiAocXVlc3Rpb24pIHtcbiAgICAgICAgICAgIHF1ZXN0aW9uLmhpZGUoKTtcbiAgICAgICAgfSk7XG59O1xuXG5nb1RvUXVlc3Rpb24gPSBmdW5jdGlvbihxdWVzdGlvbklEKSB7XG4gICAgaGlkZUFsbFF1ZXN0aW9ucygpO1xuICAgIHF1ZXN0aW9uVmlldy5nZXRRdWVzdGlvblZpZXcocXVlc3Rpb25JRCkuc2hvdygpO1xufTtcblxudmFsaWRhdGVBbnN3ZXIgPSBmdW5jdGlvbihxdWVzdGlvbklEKSB7XG4gICAgdmFyIHF1ZXN0aW9uID0gcXVlc3Rpb25WaWV3LmdldFF1ZXN0aW9uVmlldyhxdWVzdGlvbklEKTtcbiAgICBxdWVzdGlvbi52YWxpZGF0ZUZvcm1JbnB1dCgpO1xufTtcblxudmFsaWRhdGVBbGxRdWVzdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgZ2V0QWxsUXVlc3Rpb25zQXJyYXkoKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChxdWVzdGlvbikge1xuICAgICAgICAgICAgcXVlc3Rpb24udmFsaWRhdGVGb3JtSW5wdXQoKTtcbiAgICAgICAgfSk7XG59O1xuXG5zaG93U3VtbWFyeSA9IGZ1bmN0aW9uKCkge1xuICAgIGhpZGVBbGxRdWVzdGlvbnMoKTtcbiAgICBzdW1tYXJ5Vmlldy5nZXRTdW1tYXJ5VmlldygpLnNob3coKTtcbn07XG5cbnVwZGF0ZVN1bW1hcnlGaWVsZCA9IGZ1bmN0aW9uKHF1ZXN0aW9uSUQpIHtcbiAgICB2YXIgYW5zd2VyID0gcXVlc3Rpb25WaWV3LmdldFF1ZXN0aW9uVmlldyhxdWVzdGlvbklEKS5nZXRBbnN3ZXIoKTtcblxuICAgIHZhciBzdW1tYXJ5ID0gc3VtbWFyeVZpZXcuZ2V0U3VtbWFyeVZpZXcoKTtcbiAgICBzdW1tYXJ5LnVwZGF0ZVF1ZXN0aW9uUmVzcG9uc2VXaXRoKGFuc3dlciwgcXVlc3Rpb25JRCk7XG59O1xuXG51cGRhdGVRdWVzdGlvbkZpZWxkRnJvbVN1bW1hcnkgPSBmdW5jdGlvbihxdWVzdGlvbklEKSB7XG4gICAgdmFyIGFuc3dlciA9IHN1bW1hcnlWaWV3LmdldFN1bW1hcnlWaWV3KCkuZ2V0QW5zd2VyKHF1ZXN0aW9uSUQpO1xuXG4gICAgdmFyIHF1ZXN0aW9uID0gcXVlc3Rpb25WaWV3LmdldFF1ZXN0aW9uVmlldyhxdWVzdGlvbklEKTtcbiAgICBxdWVzdGlvbi51cGRhdGUoYW5zd2VyKTtcbn07XG5cbmNsaWNrQnV0dG9uT25FbnRlclByZXNzID0gZnVuY3Rpb24oZXZlbnQsIGNhbGxiYWNrLCBxdWVzdGlvbklEKSB7XG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY2FsbGJhY2socXVlc3Rpb25JRCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59O1xuXG5jb25maXJtYXRpb25NZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgZ2V0QWxsUXVlc3Rpb25zQXJyYXkoKS5tYXAoZnVuY3Rpb24gKHF1ZXN0aW9uKSB7XG4gICAgICAgIHF1ZXN0aW9uLnJlc2V0KCk7XG4gICAgfSk7XG5cbiAgICBzdW1tYXJ5Vmlldy5nZXRTdW1tYXJ5VmlldygpLmhpZGUoKTtcbiAgICB2b2ljZVJlY29yZGluZ1ZpZXcucmVzZXRWb2ljZU1lc3NhZ2UoKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbmZpcm1hdGlvblwiKS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xufTtcblxuXG5zdGFydEVkaXRpbmcgPSBmdW5jdGlvbihxdWVzdGlvbklEKSB7XG4gICAgc3VtbWFyeVZpZXcuZ2V0U3VtbWFyeVZpZXcoKS5lbmFibGVFZGl0KHF1ZXN0aW9uSUQpO1xufTtcblxuZmluaXNoRWRpdGluZyA9IGZ1bmN0aW9uKHF1ZXN0aW9uSUQpIHtcbiAgICB1cGRhdGVRdWVzdGlvbkZpZWxkRnJvbVN1bW1hcnkocXVlc3Rpb25JRCk7XG4gICAgc3VtbWFyeVZpZXcuZ2V0U3VtbWFyeVZpZXcoKS5kaXNhYmxlRWRpdChxdWVzdGlvbklEKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRBbGxRdWVzdGlvbnNBcnJheTogZ2V0QWxsUXVlc3Rpb25zQXJyYXksXG5cbiAgZ2V0Rmlyc3RVbmFuc3dlcmVkUXVlc3Rpb246IGdldEZpcnN0VW5hbnN3ZXJlZFF1ZXN0aW9uLFxuXG4gIHNob3dOZXh0U2NyZWVuOiBzaG93TmV4dFNjcmVlbixcblxuICBoaWRlQWxsUXVlc3Rpb25zOiBoaWRlQWxsUXVlc3Rpb25zLFxuXG4gIGdvVG9RdWVzdGlvbjogZ29Ub1F1ZXN0aW9uLFxuXG4gIHZhbGlkYXRlQW5zd2VyOiB2YWxpZGF0ZUFuc3dlcixcblxuICB2YWxpZGF0ZUFsbFF1ZXN0aW9uczogdmFsaWRhdGVBbGxRdWVzdGlvbnMsXG5cbiAgc2hvd1N1bW1hcnk6IHNob3dTdW1tYXJ5LFxuXG4gIHVwZGF0ZVN1bW1hcnlGaWVsZDogdXBkYXRlU3VtbWFyeUZpZWxkLFxuXG4gIHVwZGF0ZVF1ZXN0aW9uRmllbGRGcm9tU3VtbWFyeTogdXBkYXRlUXVlc3Rpb25GaWVsZEZyb21TdW1tYXJ5LFxuXG4gIGNsaWNrQnV0dG9uT25FbnRlclByZXNzOiBjbGlja0J1dHRvbk9uRW50ZXJQcmVzcyxcblxuICBjb25maXJtYXRpb25NZXNzYWdlOiBjb25maXJtYXRpb25NZXNzYWdlLFxuXG4gIHN0YXJ0RWRpdGluZzogc3RhcnRFZGl0aW5nLFxuXG4gIGZpbmlzaEVkaXRpbmc6IGZpbmlzaEVkaXRpbmcsXG59O1xuIiwicmVxdWlyZSgnLi92b2ljZVJlY29yZGluZ1ZpZXcuanMnKTtcbnJlcXVpcmUoJy4vYXBwVmlld0NvbnRyb2xsZXIuanMnKTtcbnJlcXVpcmUoJy4vc3VtbWFyeVZpZXcuanMnKTtcbnJlcXVpcmUoJy4vcXVlc3Rpb25WaWV3LmpzJyk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0UXVlc3Rpb25WaWV3OiBnZXRRdWVzdGlvblZpZXcsXG59XG5cbmZ1bmN0aW9uIGdldFF1ZXN0aW9uTm9kZSAocXVlc3Rpb25JRCkge1xuICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJxdWVzdGlvbi1cIiArIHF1ZXN0aW9uSUQpO1xufVxuXG5mdW5jdGlvbiBnZXRRdWVzdGlvblZpZXcocXVlc3Rpb25JRCkge1xuICB2YXIgcXVlc3Rpb25WaWV3ID0ge1xuICAgIHF1ZXN0aW9uTm9kZTogZ2V0UXVlc3Rpb25Ob2RlKHF1ZXN0aW9uSUQpLFxuICAgIHNob3c6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5xdWVzdGlvbk5vZGUuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgIHRoaXMuZm9jdXNJbnB1dCgpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBoaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMucXVlc3Rpb25Ob2RlLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGZvY3VzSW5wdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5xdWVzdGlvbk5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInF1ZXN0aW9uLWlucHV0XCIpWzBdLmZvY3VzKCk7XG4gICAgfSxcbiAgICBnZXRSYWRpb3M6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJhZGlvcyA9ICB0aGlzLnF1ZXN0aW9uTm9kZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicmFkaW9cIik7XG4gICAgICByZXR1cm4gcmFkaW9zLmxlbmd0aCA+IDAgPyByYWRpb3MgOiBudWxsO1xuICAgIH0sXG4gICAgZ2V0Q2hlY2tlZFJhZGlvQnV0dG9uOiBmdW5jdGlvbihyYWRpb3MpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmFkaW9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJhZGlvID0gcmFkaW9zW2ldO1xuICAgICAgICBpZihyYWRpby5jaGVja2VkID09PSB0cnVlKSB7XG4gICAgICAgICAgcmV0dXJuIHJhZGlvO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIHNldFJhZGlvVmFsdWU6IGZ1bmN0aW9uKHJhZGlvcywgdmFsdWUpe1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYWRpb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmFkaW8gPSByYWRpb3NbaV07XG4gICAgICAgIGlmKHJhZGlvLnZhbHVlID09PSB2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiByYWRpby5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICB9LFxuICAgIGdldEFuc3dlcjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYW5zd2VySW5wdXQ7XG5cbiAgICAgIHZhciByYWRpb3MgPSB0aGlzLmdldFJhZGlvcygpO1xuICAgICAgaWYocmFkaW9zKSB7XG4gICAgICAgIHZhciBjaGVja2VkUmFkaW9CdXR0b24gPSB0aGlzLmdldENoZWNrZWRSYWRpb0J1dHRvbihyYWRpb3MpO1xuICAgICAgICBpZihjaGVja2VkUmFkaW9CdXR0b24pIHtcbiAgICAgICAgICBhbnN3ZXJJbnB1dCA9IGNoZWNrZWRSYWRpb0J1dHRvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYW5zd2VySW5wdXQgPSB0aGlzLnF1ZXN0aW9uTm9kZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicXVlc3Rpb24taW5wdXRcIilbMF07XG4gICAgICB9XG4gICAgICByZXR1cm4gYW5zd2VySW5wdXQudmFsdWU7XG4gICAgfSxcbiAgICBoYXNBbnN3ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuZ2V0QW5zd2VyKCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKGFuc3dlcikge1xuICAgICAgdmFyIHJhZGlvcyA9IHRoaXMuZ2V0UmFkaW9zKCk7XG4gICAgICByZXR1cm4gcmFkaW9zID8gdGhpcy5zZXRSYWRpb1ZhbHVlKHJhZGlvcyxhbnN3ZXIpIDogdGhpcy5xdWVzdGlvbk5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInF1ZXN0aW9uLWlucHV0XCIpWzBdLnZhbHVlID0gYW5zd2VyO1xuXG4gICAgfSxcbiAgICByZXNldDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmFkaW9zID0gdGhpcy5nZXRSYWRpb3MoKTtcbiAgICAgIGlmKHJhZGlvcyl7XG4gICAgICAgIHZhciBjaGVja2VkUmFkaW9CdXR0b24gPSB0aGlzLmdldENoZWNrZWRSYWRpb0J1dHRvbihyYWRpb3MpO1xuICAgICAgICBjaGVja2VkUmFkaW9CdXR0b24uY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucXVlc3Rpb25Ob2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJxdWVzdGlvbi1pbnB1dFwiKVswXS52YWx1ZSA9IFwiXCI7XG4gICAgICB9XG4gICAgfSxcbiAgICB2YWxpZGF0ZUZvcm1JbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgICBpZih0aGlzLmhhc0Fuc3dlcigpKXtcbiAgICAgICAgdGhpcy5lbmFibGVTdWJtaXRCdXR0b24oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZVN1Ym1pdEJ1dHRvbigpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBlbmFibGVTdWJtaXRCdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5xdWVzdGlvbk5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIm5leHRcIilbMF0uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9LFxuICAgIGRpc2FibGVTdWJtaXRCdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5xdWVzdGlvbk5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIm5leHRcIilbMF0uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHF1ZXN0aW9uVmlldztcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRTdW1tYXJ5VmlldzogZ2V0U3VtbWFyeVZpZXdcbn1cblxuXG5mdW5jdGlvbiBnZXRTdW1tYXJ5Vmlldygpe1xuICB2YXIgc3VtbWFyeVZpZXcgPSB7XG4gICAgbm9kZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmb3JtLXN1bW1hcnlcIiksXG4gICAgdXBkYXRlUXVlc3Rpb25SZXNwb25zZVdpdGg6IGZ1bmN0aW9uKGFuc3dlciwgcXVlc3Rpb25JRCkge1xuICAgICAgdmFyIHJlc3BvbnNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdW1tYXJ5LXJlc3BvbnNlLVwiKyBxdWVzdGlvbklEKTtcbiAgICAgIHJlc3BvbnNlLnZhbHVlID0gYW5zd2VyO1xuICAgIH0sXG4gICAgc2hvdzogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLm5vZGUuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLm5vZGUuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgZW5hYmxlRWRpdDogZnVuY3Rpb24ocXVlc3Rpb25JRCkge1xuICAgICAgdmFyIHJlc3BvbnNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdW1tYXJ5LXJlc3BvbnNlLVwiKyBxdWVzdGlvbklEKTtcbiAgICAgIHJlc3BvbnNlLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICByZXNwb25zZS5jbGFzc0xpc3QuYWRkKFwiZWRpdGluZ1wiKTtcbiAgICAgIHJlc3BvbnNlLm5leHRTaWJsaW5nLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICByZXNwb25zZS5mb2N1cygpO1xuICAgIH0sXG4gICAgZGlzYWJsZUVkaXQ6IGZ1bmN0aW9uKHF1ZXN0aW9uSUQpIHtcbiAgICAgIHZhciByZXNwb25zZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3VtbWFyeS1yZXNwb25zZS1cIisgcXVlc3Rpb25JRCk7XG4gICAgICByZXNwb25zZS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICByZXNwb25zZS5jbGFzc0xpc3QucmVtb3ZlKFwiZWRpdGluZ1wiKTtcbiAgICAgIHJlc3BvbnNlLm5leHRTaWJsaW5nLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgfSxcbiAgICBnZXRBbnN3ZXI6IGZ1bmN0aW9uKHF1ZXN0aW9uSUQpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1bW1hcnktcmVzcG9uc2UtXCIrIHF1ZXN0aW9uSUQpLnZhbHVlO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHN1bW1hcnlWaWV3O1xufVxuIiwidmFyIHF1ZXN0aW9uVmlldyA9IHJlcXVpcmUoJy4vcXVlc3Rpb25WaWV3Jyk7XG5cbnZhciBpc1JlY29yZGluZyA9IGZhbHNlO1xudmFyIG1lc3NhZ2VDb21wbGV0ZWQgPSBmYWxzZTtcbnZhciBpc1BsYXlpbmcgPSBmYWxzZTtcbnZhciBpbnRlcnZhbDtcbnZhciBwbGF5VGltZXI7XG52YXIgcmVjb3JkaW5nVGltZXI7XG5cbmZ1bmN0aW9uIGRpc3BsYXlTdG9wQnV0dG9uKCkge1xuICAgIHZhciBzdG9wQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdG9wLWJ0blwiKTtcbiAgICBzdG9wQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG5cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1pY1wiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIGlmIChzdG9wQnV0dG9uLmNsYXNzTGlzdC5jb250YWlucyhcImZpbGwtZ3JlZW5cIikpIHtcbiAgICAgICAgc3RvcEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiZmlsbC1ncmVlblwiKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG1vdmVTbGlkZXIoKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzbGlkZXItc3RhdHVzLW1hcmtcIikuY2xhc3NMaXN0LmFkZChcImFuaW1hdGVcIik7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzbGlkZXItc3RhdHVzLWZpbGxcIikuY2xhc3NMaXN0LmFkZChcImFuaW1hdGVcIik7XG59XG5cbmZ1bmN0aW9uIHN0b3BTbGlkZXIoKSB7XG4gICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzbGlkZXItc3RhdHVzLW1hcmtcIikuY2xhc3NMaXN0LnJlbW92ZShcImFuaW1hdGVcIik7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzbGlkZXItc3RhdHVzLWZpbGxcIikuY2xhc3NMaXN0LnJlbW92ZShcImFuaW1hdGVcIik7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzbGlkZXItYmFyXCIpLmNsYXNzTGlzdC5hZGQoXCJmaW5pc2hlZFwiKTtcbn1cblxuZnVuY3Rpb24gZGlzcGxheVBsYXlDb250cm9scygpIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktYnRuXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdG9wLWJ0blwiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZWNvcmRpbmctaW5zdHJ1Y3Rpb25zXCIpLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZWNvcmRpbmctcmVzcG9uc2UtY29udGFpbmVyXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmb3JtLWJ1dHRvbi1jb250YWluZXJcIikuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpbi1idG5cIikuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbn1cbmZ1bmN0aW9uIHN0YXJ0VGltZXIoKSB7XG4gICAgdmFyIHNlY29uZHMgPSA2MDtcbiAgICBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2Vjb25kcy0tO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRpbWVyXCIpLmlubmVySFRNTCA9IHNlY29uZHM7XG4gICAgICAgIGlmIChzZWNvbmRzID09IDApIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICB9XG4gICAgfSwgMTAwMCk7XG59XG5cblxuXG5mdW5jdGlvbiBzdG9wVGltZXIodGltZU91dCkge1xuICAgIGNsZWFyVGltZW91dCh0aW1lT3V0KTtcbiAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlVGltZXJEaXNwbGF5KCkge1xuICAgIHZhciB0aW1lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGltZXJcIik7XG4gICAgdGltZXIuaW5uZXJIVE1MID0gNjA7XG5cbiAgICBpZiAoIW1lc3NhZ2VDb21wbGV0ZWQgJiYgIWlzUmVjb3JkaW5nKSB7XG4gICAgICAgIHRpbWVyLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZS1ibG9ja1wiO1xuICAgIH0gZWxzZSBpZiAoIWlzUmVjb3JkaW5nKSB7XG4gICAgICAgIHRpbWVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZVN0b3BCdXR0b25EaXNwbGF5KCkge1xuICAgIHZhciBzdG9wQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdG9wLWJ0blwiKTtcbiAgICBpZiAoaXNQbGF5aW5nKSB7XG4gICAgICAgIHN0b3BCdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgICAgc3RvcEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiZmlsbC1ncmVlblwiKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWJ0blwiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1idG5cIikuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdG9wLWJ0blwiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcmVjb3JkTWVzc2FnZSgpIHtcbiAgICBpc1JlY29yZGluZyA9IHRydWU7XG5cbiAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICB0b2dnbGVUaW1lckRpc3BsYXkoKTtcbiAgICBzdGFydFRpbWVyKCk7XG4gICAgZGlzcGxheVN0b3BCdXR0b24oKTtcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVjb3JkaW5nLXF1ZXN0aW9uLWNvbnRhaW5lclwiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVjb3JkaW5nLWluc3RydWN0aW9uc1wiKS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuXG4gICAgbW92ZVNsaWRlcigpO1xuICAgIHJlY29yZGluZ1RpbWVyID0gc2V0VGltZW91dChzdG9wUmVjb3JkaW5nLCA2MDAwMCk7XG4gICAgO1xufVxuXG5mdW5jdGlvbiBzZXRRdWVzdGlvblRvRG9uZSgpIHtcbiAgdmlldyA9IHF1ZXN0aW9uVmlldy5nZXRRdWVzdGlvblZpZXcoMTEpO1xuICB2aWV3LmVuYWJsZVN1Ym1pdEJ1dHRvbigpO1xuICB2aWV3LnF1ZXN0aW9uTm9kZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicXVlc3Rpb24taW5wdXRcIilbMF0udmFsdWUgPSBcImRvbmVcIjtcbn1cblxuZnVuY3Rpb24gc2V0UXVlc3Rpb25Ub05vdERvbmUoKSB7XG4gIHZpZXcgPSBxdWVzdGlvblZpZXcuZ2V0UXVlc3Rpb25WaWV3KDExKTtcbiAgdmlldy5kaXNhYmxlU3VibWl0QnV0dG9uKCk7XG4gIHZpZXcucXVlc3Rpb25Ob2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJxdWVzdGlvbi1pbnB1dFwiKVswXS52YWx1ZSA9IFwiXCI7XG59XG5cbmZ1bmN0aW9uIHN0b3BSZWNvcmRpbmcoKSB7XG4gICAgbWVzc2FnZUNvbXBsZXRlZCA9IHRydWU7XG4gICAgaXNSZWNvcmRpbmcgPSBmYWxzZTtcbiAgICBpc1BsYXlpbmcgPSBmYWxzZTtcblxuICAgIHN0b3BUaW1lcihyZWNvcmRpbmdUaW1lcik7XG4gICAgc3RvcFNsaWRlcigpO1xuICAgIGRpc3BsYXlQbGF5Q29udHJvbHMoKTtcbiAgICB0b2dnbGVUaW1lckRpc3BsYXkoKTtcblxuICAgIHNldFF1ZXN0aW9uVG9Eb25lKCk7XG59XG5cbmZ1bmN0aW9uIHBsYXlNZXNzYWdlKCkge1xuICAgIG1lc3NhZ2VDb21wbGV0ZWQgPSB0cnVlO1xuICAgIGlzUGxheWluZyA9IHRydWU7XG5cbiAgICB0b2dnbGVTdG9wQnV0dG9uRGlzcGxheSgpO1xuICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmluLWJ0blwiKS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgIG1vdmVTbGlkZXIoKTtcbiAgICBwbGF5VGltZXIgPSBzZXRUaW1lb3V0KHN0b3BQbGF5aW5nLCA2MDAwMCk7XG59XG5cbmZ1bmN0aW9uIHN0b3BQbGF5aW5nKCkge1xuICAgIG1lc3NhZ2VDb21wbGV0ZWQgPSB0cnVlO1xuICAgIGlzUGxheWluZyA9IGZhbHNlO1xuXG4gICAgc3RvcFRpbWVyKHBsYXlUaW1lcik7XG4gICAgc3RvcFNsaWRlcigpO1xuICAgIC8vY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgZGlzcGxheVBsYXlDb250cm9scygpO1xufVxuXG52b2ljZU1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIW1lc3NhZ2VDb21wbGV0ZWQgJiYgIWlzUmVjb3JkaW5nKSB7XG4gICAgICAgIHJlY29yZE1lc3NhZ2UoKTtcbiAgICB9IGVsc2UgaWYgKCFtZXNzYWdlQ29tcGxldGVkICYmIGlzUmVjb3JkaW5nKSB7XG4gICAgICAgIHN0b3BSZWNvcmRpbmcoKTtcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2VDb21wbGV0ZWQgJiYgIWlzUGxheWluZykge1xuICAgICAgICBwbGF5TWVzc2FnZSgpO1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZUNvbXBsZXRlZCAmJiBpc1BsYXlpbmcpIHtcbiAgICAgICAgc3RvcFBsYXlpbmcoKTtcbiAgICB9XG59XG5cbnJlc2V0Vm9pY2VNZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgbWVzc2FnZUNvbXBsZXRlZCA9IGZhbHNlO1xuICAgIGlzUGxheWluZyA9IGZhbHNlO1xuXG4gICAgc3RvcFRpbWVyKHBsYXlUaW1lcik7XG4gICAgc3RvcFNsaWRlcigpO1xuICAgIHRvZ2dsZVRpbWVyRGlzcGxheSgpO1xuICAgIHRvZ2dsZVN0b3BCdXR0b25EaXNwbGF5KCk7XG5cbiAgICBzZXRRdWVzdGlvblRvTm90RG9uZSgpO1xuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaW4tYnRuXCIpLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWJ0blwiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWljXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmb3JtLWJ1dHRvbi1jb250YWluZXJcIikuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVjb3JkaW5nLXF1ZXN0aW9uLWNvbnRhaW5lclwiKS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVjb3JkaW5nLXJlc3BvbnNlLWNvbnRhaW5lclwiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdm9pY2VNZXNzYWdlOiB2b2ljZU1lc3NhZ2UsXG4gIHJlc2V0Vm9pY2VNZXNzYWdlOiByZXNldFZvaWNlTWVzc2FnZSxcbn1cbiJdfQ==
