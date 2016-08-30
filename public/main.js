(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var questionView = require('./questionView.js');
var summaryView = require('./summaryView.js');
var voiceRecordingView = require('./voiceRecordingView.js');

window.addEventListener('load', function () {
    validateAllQuestions();
    showNextScreen();
}, false);

getFirstUnansweredQuestion = function() {
    var isUnanswered = function (question) {
        return !question.hasAnswer();
    };
    var allQuestionsArray = questionView.getAllQuestionsArray();
    var thing = allQuestionsArray.find(isUnanswered);
    return thing;
};

showNextScreen = function() {
    hideAllQuestions();
    var nextQuestion = getFirstUnansweredQuestion();
    var nextScreen = nextQuestion ? nextQuestion : summaryView.getSummaryView();

    return nextScreen.show();
};

hideAllQuestions = function() {
    questionView.getAllQuestionsArray()
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
    questionView.getAllQuestionsArray()
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
    questionView.getAllQuestionsArray().map(function (question) {
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

  finishEditing: finishEditing
};

},{"./questionView.js":3,"./summaryView.js":4,"./voiceRecordingView.js":5}],2:[function(require,module,exports){
require('./appViewController.js');

},{"./appViewController.js":1}],3:[function(require,module,exports){

function getAllQuestionsArray() {
  var allQuestionViews = [];
  var allQuestionNodes = document.getElementsByClassName("question");
  for (i = 1; i <= allQuestionNodes.length; i++) {
    allQuestionViews[i - 1] = getQuestionView(i);
  }
  return allQuestionViews;
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

module.exports = {
  getQuestionView: getQuestionView,
  getAllQuestionsArray: getAllQuestionsArray
};

},{}],4:[function(require,module,exports){
module.exports = {
  getSummaryView: getSummaryView
};


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

},{"./questionView":3}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFwcC9qYXZhc2NyaXB0cy9hcHBWaWV3Q29udHJvbGxlci5qcyIsImFwcC9qYXZhc2NyaXB0cy9tYWluLmpzIiwiYXBwL2phdmFzY3JpcHRzL3F1ZXN0aW9uVmlldy5qcyIsImFwcC9qYXZhc2NyaXB0cy9zdW1tYXJ5Vmlldy5qcyIsImFwcC9qYXZhc2NyaXB0cy92b2ljZVJlY29yZGluZ1ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVIQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHF1ZXN0aW9uVmlldyA9IHJlcXVpcmUoJy4vcXVlc3Rpb25WaWV3LmpzJyk7XG52YXIgc3VtbWFyeVZpZXcgPSByZXF1aXJlKCcuL3N1bW1hcnlWaWV3LmpzJyk7XG52YXIgdm9pY2VSZWNvcmRpbmdWaWV3ID0gcmVxdWlyZSgnLi92b2ljZVJlY29yZGluZ1ZpZXcuanMnKTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFsaWRhdGVBbGxRdWVzdGlvbnMoKTtcbiAgICBzaG93TmV4dFNjcmVlbigpO1xufSwgZmFsc2UpO1xuXG5nZXRGaXJzdFVuYW5zd2VyZWRRdWVzdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpc1VuYW5zd2VyZWQgPSBmdW5jdGlvbiAocXVlc3Rpb24pIHtcbiAgICAgICAgcmV0dXJuICFxdWVzdGlvbi5oYXNBbnN3ZXIoKTtcbiAgICB9O1xuICAgIHZhciBhbGxRdWVzdGlvbnNBcnJheSA9IHF1ZXN0aW9uVmlldy5nZXRBbGxRdWVzdGlvbnNBcnJheSgpO1xuICAgIHZhciB0aGluZyA9IGFsbFF1ZXN0aW9uc0FycmF5LmZpbmQoaXNVbmFuc3dlcmVkKTtcbiAgICByZXR1cm4gdGhpbmc7XG59O1xuXG5zaG93TmV4dFNjcmVlbiA9IGZ1bmN0aW9uKCkge1xuICAgIGhpZGVBbGxRdWVzdGlvbnMoKTtcbiAgICB2YXIgbmV4dFF1ZXN0aW9uID0gZ2V0Rmlyc3RVbmFuc3dlcmVkUXVlc3Rpb24oKTtcbiAgICB2YXIgbmV4dFNjcmVlbiA9IG5leHRRdWVzdGlvbiA/IG5leHRRdWVzdGlvbiA6IHN1bW1hcnlWaWV3LmdldFN1bW1hcnlWaWV3KCk7XG5cbiAgICByZXR1cm4gbmV4dFNjcmVlbi5zaG93KCk7XG59O1xuXG5oaWRlQWxsUXVlc3Rpb25zID0gZnVuY3Rpb24oKSB7XG4gICAgcXVlc3Rpb25WaWV3LmdldEFsbFF1ZXN0aW9uc0FycmF5KClcbiAgICAgICAgLm1hcChmdW5jdGlvbiAocXVlc3Rpb24pIHtcbiAgICAgICAgICAgIHF1ZXN0aW9uLmhpZGUoKTtcbiAgICAgICAgfSk7XG59O1xuXG5nb1RvUXVlc3Rpb24gPSBmdW5jdGlvbihxdWVzdGlvbklEKSB7XG4gICAgaGlkZUFsbFF1ZXN0aW9ucygpO1xuICAgIHF1ZXN0aW9uVmlldy5nZXRRdWVzdGlvblZpZXcocXVlc3Rpb25JRCkuc2hvdygpO1xufTtcblxudmFsaWRhdGVBbnN3ZXIgPSBmdW5jdGlvbihxdWVzdGlvbklEKSB7XG4gICAgdmFyIHF1ZXN0aW9uID0gcXVlc3Rpb25WaWV3LmdldFF1ZXN0aW9uVmlldyhxdWVzdGlvbklEKTtcbiAgICBxdWVzdGlvbi52YWxpZGF0ZUZvcm1JbnB1dCgpO1xufTtcblxudmFsaWRhdGVBbGxRdWVzdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcXVlc3Rpb25WaWV3LmdldEFsbFF1ZXN0aW9uc0FycmF5KClcbiAgICAgICAgLm1hcChmdW5jdGlvbiAocXVlc3Rpb24pIHtcbiAgICAgICAgICAgIHF1ZXN0aW9uLnZhbGlkYXRlRm9ybUlucHV0KCk7XG4gICAgICAgIH0pO1xufTtcblxuc2hvd1N1bW1hcnkgPSBmdW5jdGlvbigpIHtcbiAgICBoaWRlQWxsUXVlc3Rpb25zKCk7XG4gICAgc3VtbWFyeVZpZXcuZ2V0U3VtbWFyeVZpZXcoKS5zaG93KCk7XG59O1xuXG51cGRhdGVTdW1tYXJ5RmllbGQgPSBmdW5jdGlvbihxdWVzdGlvbklEKSB7XG4gICAgdmFyIGFuc3dlciA9IHF1ZXN0aW9uVmlldy5nZXRRdWVzdGlvblZpZXcocXVlc3Rpb25JRCkuZ2V0QW5zd2VyKCk7XG5cbiAgICB2YXIgc3VtbWFyeSA9IHN1bW1hcnlWaWV3LmdldFN1bW1hcnlWaWV3KCk7XG4gICAgc3VtbWFyeS51cGRhdGVRdWVzdGlvblJlc3BvbnNlV2l0aChhbnN3ZXIsIHF1ZXN0aW9uSUQpO1xufTtcblxudXBkYXRlUXVlc3Rpb25GaWVsZEZyb21TdW1tYXJ5ID0gZnVuY3Rpb24ocXVlc3Rpb25JRCkge1xuICAgIHZhciBhbnN3ZXIgPSBzdW1tYXJ5Vmlldy5nZXRTdW1tYXJ5VmlldygpLmdldEFuc3dlcihxdWVzdGlvbklEKTtcblxuICAgIHZhciBxdWVzdGlvbiA9IHF1ZXN0aW9uVmlldy5nZXRRdWVzdGlvblZpZXcocXVlc3Rpb25JRCk7XG4gICAgcXVlc3Rpb24udXBkYXRlKGFuc3dlcik7XG59O1xuXG5jbGlja0J1dHRvbk9uRW50ZXJQcmVzcyA9IGZ1bmN0aW9uKGV2ZW50LCBjYWxsYmFjaywgcXVlc3Rpb25JRCkge1xuICAgIGlmIChldmVudC5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNhbGxiYWNrKHF1ZXN0aW9uSUQpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufTtcblxuY29uZmlybWF0aW9uTWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICAgIHF1ZXN0aW9uVmlldy5nZXRBbGxRdWVzdGlvbnNBcnJheSgpLm1hcChmdW5jdGlvbiAocXVlc3Rpb24pIHtcbiAgICAgICAgcXVlc3Rpb24ucmVzZXQoKTtcbiAgICB9KTtcblxuICAgIHN1bW1hcnlWaWV3LmdldFN1bW1hcnlWaWV3KCkuaGlkZSgpO1xuICAgIHZvaWNlUmVjb3JkaW5nVmlldy5yZXNldFZvaWNlTWVzc2FnZSgpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29uZmlybWF0aW9uXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG59O1xuXG5cbnN0YXJ0RWRpdGluZyA9IGZ1bmN0aW9uKHF1ZXN0aW9uSUQpIHtcbiAgICBzdW1tYXJ5Vmlldy5nZXRTdW1tYXJ5VmlldygpLmVuYWJsZUVkaXQocXVlc3Rpb25JRCk7XG59O1xuXG5maW5pc2hFZGl0aW5nID0gZnVuY3Rpb24ocXVlc3Rpb25JRCkge1xuICAgIHVwZGF0ZVF1ZXN0aW9uRmllbGRGcm9tU3VtbWFyeShxdWVzdGlvbklEKTtcbiAgICBzdW1tYXJ5Vmlldy5nZXRTdW1tYXJ5VmlldygpLmRpc2FibGVFZGl0KHF1ZXN0aW9uSUQpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldEZpcnN0VW5hbnN3ZXJlZFF1ZXN0aW9uOiBnZXRGaXJzdFVuYW5zd2VyZWRRdWVzdGlvbixcblxuICBzaG93TmV4dFNjcmVlbjogc2hvd05leHRTY3JlZW4sXG5cbiAgaGlkZUFsbFF1ZXN0aW9uczogaGlkZUFsbFF1ZXN0aW9ucyxcblxuICBnb1RvUXVlc3Rpb246IGdvVG9RdWVzdGlvbixcblxuICB2YWxpZGF0ZUFuc3dlcjogdmFsaWRhdGVBbnN3ZXIsXG5cbiAgdmFsaWRhdGVBbGxRdWVzdGlvbnM6IHZhbGlkYXRlQWxsUXVlc3Rpb25zLFxuXG4gIHNob3dTdW1tYXJ5OiBzaG93U3VtbWFyeSxcblxuICB1cGRhdGVTdW1tYXJ5RmllbGQ6IHVwZGF0ZVN1bW1hcnlGaWVsZCxcblxuICB1cGRhdGVRdWVzdGlvbkZpZWxkRnJvbVN1bW1hcnk6IHVwZGF0ZVF1ZXN0aW9uRmllbGRGcm9tU3VtbWFyeSxcblxuICBjbGlja0J1dHRvbk9uRW50ZXJQcmVzczogY2xpY2tCdXR0b25PbkVudGVyUHJlc3MsXG5cbiAgY29uZmlybWF0aW9uTWVzc2FnZTogY29uZmlybWF0aW9uTWVzc2FnZSxcblxuICBzdGFydEVkaXRpbmc6IHN0YXJ0RWRpdGluZyxcblxuICBmaW5pc2hFZGl0aW5nOiBmaW5pc2hFZGl0aW5nXG59O1xuIiwicmVxdWlyZSgnLi9hcHBWaWV3Q29udHJvbGxlci5qcycpO1xuIiwiXG5mdW5jdGlvbiBnZXRBbGxRdWVzdGlvbnNBcnJheSgpIHtcbiAgdmFyIGFsbFF1ZXN0aW9uVmlld3MgPSBbXTtcbiAgdmFyIGFsbFF1ZXN0aW9uTm9kZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicXVlc3Rpb25cIik7XG4gIGZvciAoaSA9IDE7IGkgPD0gYWxsUXVlc3Rpb25Ob2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIGFsbFF1ZXN0aW9uVmlld3NbaSAtIDFdID0gZ2V0UXVlc3Rpb25WaWV3KGkpO1xuICB9XG4gIHJldHVybiBhbGxRdWVzdGlvblZpZXdzO1xufVxuXG5mdW5jdGlvbiBnZXRRdWVzdGlvbk5vZGUgKHF1ZXN0aW9uSUQpIHtcbiAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicXVlc3Rpb24tXCIgKyBxdWVzdGlvbklEKTtcbn1cblxuZnVuY3Rpb24gZ2V0UXVlc3Rpb25WaWV3KHF1ZXN0aW9uSUQpIHtcbiAgdmFyIHF1ZXN0aW9uVmlldyA9IHtcbiAgICBxdWVzdGlvbk5vZGU6IGdldFF1ZXN0aW9uTm9kZShxdWVzdGlvbklEKSxcbiAgICBzaG93OiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMucXVlc3Rpb25Ob2RlLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgICB0aGlzLmZvY3VzSW5wdXQoKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnF1ZXN0aW9uTm9kZS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBmb2N1c0lucHV0OiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMucXVlc3Rpb25Ob2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJxdWVzdGlvbi1pbnB1dFwiKVswXS5mb2N1cygpO1xuICAgIH0sXG4gICAgZ2V0UmFkaW9zOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByYWRpb3MgPSAgdGhpcy5xdWVzdGlvbk5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInJhZGlvXCIpO1xuICAgICAgcmV0dXJuIHJhZGlvcy5sZW5ndGggPiAwID8gcmFkaW9zIDogbnVsbDtcbiAgICB9LFxuICAgIGdldENoZWNrZWRSYWRpb0J1dHRvbjogZnVuY3Rpb24ocmFkaW9zKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJhZGlvcy5sZW5ndGg7IGkrKykge1xuICAgICAgICByYWRpbyA9IHJhZGlvc1tpXTtcbiAgICAgICAgaWYocmFkaW8uY2hlY2tlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHJldHVybiByYWRpbztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBzZXRSYWRpb1ZhbHVlOiBmdW5jdGlvbihyYWRpb3MsIHZhbHVlKXtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmFkaW9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJhZGlvID0gcmFkaW9zW2ldO1xuICAgICAgICBpZihyYWRpby52YWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gcmFkaW8uY2hlY2tlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuXG4gICAgfSxcbiAgICBnZXRBbnN3ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFuc3dlcklucHV0O1xuXG4gICAgICB2YXIgcmFkaW9zID0gdGhpcy5nZXRSYWRpb3MoKTtcbiAgICAgIGlmKHJhZGlvcykge1xuICAgICAgICB2YXIgY2hlY2tlZFJhZGlvQnV0dG9uID0gdGhpcy5nZXRDaGVja2VkUmFkaW9CdXR0b24ocmFkaW9zKTtcbiAgICAgICAgaWYoY2hlY2tlZFJhZGlvQnV0dG9uKSB7XG4gICAgICAgICAgYW5zd2VySW5wdXQgPSBjaGVja2VkUmFkaW9CdXR0b247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFuc3dlcklucHV0ID0gdGhpcy5xdWVzdGlvbk5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInF1ZXN0aW9uLWlucHV0XCIpWzBdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFuc3dlcklucHV0LnZhbHVlO1xuICAgIH0sXG4gICAgaGFzQW5zd2VyOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLmdldEFuc3dlcigpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbihhbnN3ZXIpIHtcbiAgICAgIHZhciByYWRpb3MgPSB0aGlzLmdldFJhZGlvcygpO1xuICAgICAgcmV0dXJuIHJhZGlvcyA/IHRoaXMuc2V0UmFkaW9WYWx1ZShyYWRpb3MsYW5zd2VyKSA6IHRoaXMucXVlc3Rpb25Ob2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJxdWVzdGlvbi1pbnB1dFwiKVswXS52YWx1ZSA9IGFuc3dlcjtcblxuICAgIH0sXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJhZGlvcyA9IHRoaXMuZ2V0UmFkaW9zKCk7XG4gICAgICBpZihyYWRpb3Mpe1xuICAgICAgICB2YXIgY2hlY2tlZFJhZGlvQnV0dG9uID0gdGhpcy5nZXRDaGVja2VkUmFkaW9CdXR0b24ocmFkaW9zKTtcbiAgICAgICAgY2hlY2tlZFJhZGlvQnV0dG9uLmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnF1ZXN0aW9uTm9kZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicXVlc3Rpb24taW5wdXRcIilbMF0udmFsdWUgPSBcIlwiO1xuICAgICAgfVxuICAgIH0sXG4gICAgdmFsaWRhdGVGb3JtSW5wdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYodGhpcy5oYXNBbnN3ZXIoKSl7XG4gICAgICAgIHRoaXMuZW5hYmxlU3VibWl0QnV0dG9uKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRpc2FibGVTdWJtaXRCdXR0b24oKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgZW5hYmxlU3VibWl0QnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMucXVlc3Rpb25Ob2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJuZXh0XCIpWzBdLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfSxcbiAgICBkaXNhYmxlU3VibWl0QnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMucXVlc3Rpb25Ob2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJuZXh0XCIpWzBdLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBxdWVzdGlvblZpZXc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRRdWVzdGlvblZpZXc6IGdldFF1ZXN0aW9uVmlldyxcbiAgZ2V0QWxsUXVlc3Rpb25zQXJyYXk6IGdldEFsbFF1ZXN0aW9uc0FycmF5XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldFN1bW1hcnlWaWV3OiBnZXRTdW1tYXJ5Vmlld1xufTtcblxuXG5mdW5jdGlvbiBnZXRTdW1tYXJ5Vmlldygpe1xuICB2YXIgc3VtbWFyeVZpZXcgPSB7XG4gICAgbm9kZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmb3JtLXN1bW1hcnlcIiksXG4gICAgdXBkYXRlUXVlc3Rpb25SZXNwb25zZVdpdGg6IGZ1bmN0aW9uKGFuc3dlciwgcXVlc3Rpb25JRCkge1xuICAgICAgdmFyIHJlc3BvbnNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdW1tYXJ5LXJlc3BvbnNlLVwiKyBxdWVzdGlvbklEKTtcbiAgICAgIHJlc3BvbnNlLnZhbHVlID0gYW5zd2VyO1xuICAgIH0sXG4gICAgc2hvdzogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLm5vZGUuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLm5vZGUuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgZW5hYmxlRWRpdDogZnVuY3Rpb24ocXVlc3Rpb25JRCkge1xuICAgICAgdmFyIHJlc3BvbnNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdW1tYXJ5LXJlc3BvbnNlLVwiKyBxdWVzdGlvbklEKTtcbiAgICAgIHJlc3BvbnNlLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICByZXNwb25zZS5jbGFzc0xpc3QuYWRkKFwiZWRpdGluZ1wiKTtcbiAgICAgIHJlc3BvbnNlLm5leHRTaWJsaW5nLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICByZXNwb25zZS5mb2N1cygpO1xuICAgIH0sXG4gICAgZGlzYWJsZUVkaXQ6IGZ1bmN0aW9uKHF1ZXN0aW9uSUQpIHtcbiAgICAgIHZhciByZXNwb25zZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3VtbWFyeS1yZXNwb25zZS1cIisgcXVlc3Rpb25JRCk7XG4gICAgICByZXNwb25zZS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICByZXNwb25zZS5jbGFzc0xpc3QucmVtb3ZlKFwiZWRpdGluZ1wiKTtcbiAgICAgIHJlc3BvbnNlLm5leHRTaWJsaW5nLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgfSxcbiAgICBnZXRBbnN3ZXI6IGZ1bmN0aW9uKHF1ZXN0aW9uSUQpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1bW1hcnktcmVzcG9uc2UtXCIrIHF1ZXN0aW9uSUQpLnZhbHVlO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHN1bW1hcnlWaWV3O1xufVxuIiwidmFyIHF1ZXN0aW9uVmlldyA9IHJlcXVpcmUoJy4vcXVlc3Rpb25WaWV3Jyk7XG5cbnZhciBpc1JlY29yZGluZyA9IGZhbHNlO1xudmFyIG1lc3NhZ2VDb21wbGV0ZWQgPSBmYWxzZTtcbnZhciBpc1BsYXlpbmcgPSBmYWxzZTtcbnZhciBpbnRlcnZhbDtcbnZhciBwbGF5VGltZXI7XG52YXIgcmVjb3JkaW5nVGltZXI7XG5cbmZ1bmN0aW9uIGRpc3BsYXlTdG9wQnV0dG9uKCkge1xuICAgIHZhciBzdG9wQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdG9wLWJ0blwiKTtcbiAgICBzdG9wQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG5cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1pY1wiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIGlmIChzdG9wQnV0dG9uLmNsYXNzTGlzdC5jb250YWlucyhcImZpbGwtZ3JlZW5cIikpIHtcbiAgICAgICAgc3RvcEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiZmlsbC1ncmVlblwiKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG1vdmVTbGlkZXIoKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzbGlkZXItc3RhdHVzLW1hcmtcIikuY2xhc3NMaXN0LmFkZChcImFuaW1hdGVcIik7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzbGlkZXItc3RhdHVzLWZpbGxcIikuY2xhc3NMaXN0LmFkZChcImFuaW1hdGVcIik7XG59XG5cbmZ1bmN0aW9uIHN0b3BTbGlkZXIoKSB7XG4gICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzbGlkZXItc3RhdHVzLW1hcmtcIikuY2xhc3NMaXN0LnJlbW92ZShcImFuaW1hdGVcIik7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzbGlkZXItc3RhdHVzLWZpbGxcIikuY2xhc3NMaXN0LnJlbW92ZShcImFuaW1hdGVcIik7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzbGlkZXItYmFyXCIpLmNsYXNzTGlzdC5hZGQoXCJmaW5pc2hlZFwiKTtcbn1cblxuZnVuY3Rpb24gZGlzcGxheVBsYXlDb250cm9scygpIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktYnRuXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdG9wLWJ0blwiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZWNvcmRpbmctaW5zdHJ1Y3Rpb25zXCIpLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZWNvcmRpbmctcmVzcG9uc2UtY29udGFpbmVyXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmb3JtLWJ1dHRvbi1jb250YWluZXJcIikuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpbi1idG5cIikuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbn1cbmZ1bmN0aW9uIHN0YXJ0VGltZXIoKSB7XG4gICAgdmFyIHNlY29uZHMgPSA2MDtcbiAgICBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2Vjb25kcy0tO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRpbWVyXCIpLmlubmVySFRNTCA9IHNlY29uZHM7XG4gICAgICAgIGlmIChzZWNvbmRzID09IDApIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICB9XG4gICAgfSwgMTAwMCk7XG59XG5cblxuXG5mdW5jdGlvbiBzdG9wVGltZXIodGltZU91dCkge1xuICAgIGNsZWFyVGltZW91dCh0aW1lT3V0KTtcbiAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlVGltZXJEaXNwbGF5KCkge1xuICAgIHZhciB0aW1lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGltZXJcIik7XG4gICAgdGltZXIuaW5uZXJIVE1MID0gNjA7XG5cbiAgICBpZiAoIW1lc3NhZ2VDb21wbGV0ZWQgJiYgIWlzUmVjb3JkaW5nKSB7XG4gICAgICAgIHRpbWVyLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZS1ibG9ja1wiO1xuICAgIH0gZWxzZSBpZiAoIWlzUmVjb3JkaW5nKSB7XG4gICAgICAgIHRpbWVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZVN0b3BCdXR0b25EaXNwbGF5KCkge1xuICAgIHZhciBzdG9wQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdG9wLWJ0blwiKTtcbiAgICBpZiAoaXNQbGF5aW5nKSB7XG4gICAgICAgIHN0b3BCdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgICAgc3RvcEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiZmlsbC1ncmVlblwiKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWJ0blwiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1idG5cIikuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdG9wLWJ0blwiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcmVjb3JkTWVzc2FnZSgpIHtcbiAgICBpc1JlY29yZGluZyA9IHRydWU7XG5cbiAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICB0b2dnbGVUaW1lckRpc3BsYXkoKTtcbiAgICBzdGFydFRpbWVyKCk7XG4gICAgZGlzcGxheVN0b3BCdXR0b24oKTtcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVjb3JkaW5nLXF1ZXN0aW9uLWNvbnRhaW5lclwiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVjb3JkaW5nLWluc3RydWN0aW9uc1wiKS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuXG4gICAgbW92ZVNsaWRlcigpO1xuICAgIHJlY29yZGluZ1RpbWVyID0gc2V0VGltZW91dChzdG9wUmVjb3JkaW5nLCA2MDAwMCk7XG59XG5cbmZ1bmN0aW9uIHNldFF1ZXN0aW9uVG9Eb25lKCkge1xuICB2aWV3ID0gcXVlc3Rpb25WaWV3LmdldFF1ZXN0aW9uVmlldygxMSk7XG4gIHZpZXcuZW5hYmxlU3VibWl0QnV0dG9uKCk7XG4gIHZpZXcucXVlc3Rpb25Ob2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJxdWVzdGlvbi1pbnB1dFwiKVswXS52YWx1ZSA9IFwiZG9uZVwiO1xufVxuXG5mdW5jdGlvbiBzZXRRdWVzdGlvblRvTm90RG9uZSgpIHtcbiAgdmlldyA9IHF1ZXN0aW9uVmlldy5nZXRRdWVzdGlvblZpZXcoMTEpO1xuICB2aWV3LmRpc2FibGVTdWJtaXRCdXR0b24oKTtcbiAgdmlldy5xdWVzdGlvbk5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInF1ZXN0aW9uLWlucHV0XCIpWzBdLnZhbHVlID0gXCJcIjtcbn1cblxuZnVuY3Rpb24gc3RvcFJlY29yZGluZygpIHtcbiAgICBtZXNzYWdlQ29tcGxldGVkID0gdHJ1ZTtcbiAgICBpc1JlY29yZGluZyA9IGZhbHNlO1xuICAgIGlzUGxheWluZyA9IGZhbHNlO1xuXG4gICAgc3RvcFRpbWVyKHJlY29yZGluZ1RpbWVyKTtcbiAgICBzdG9wU2xpZGVyKCk7XG4gICAgZGlzcGxheVBsYXlDb250cm9scygpO1xuICAgIHRvZ2dsZVRpbWVyRGlzcGxheSgpO1xuXG4gICAgc2V0UXVlc3Rpb25Ub0RvbmUoKTtcbn1cblxuZnVuY3Rpb24gcGxheU1lc3NhZ2UoKSB7XG4gICAgbWVzc2FnZUNvbXBsZXRlZCA9IHRydWU7XG4gICAgaXNQbGF5aW5nID0gdHJ1ZTtcblxuICAgIHRvZ2dsZVN0b3BCdXR0b25EaXNwbGF5KCk7XG4gICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaW4tYnRuXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgbW92ZVNsaWRlcigpO1xuICAgIHBsYXlUaW1lciA9IHNldFRpbWVvdXQoc3RvcFBsYXlpbmcsIDYwMDAwKTtcbn1cblxuZnVuY3Rpb24gc3RvcFBsYXlpbmcoKSB7XG4gICAgbWVzc2FnZUNvbXBsZXRlZCA9IHRydWU7XG4gICAgaXNQbGF5aW5nID0gZmFsc2U7XG5cbiAgICBzdG9wVGltZXIocGxheVRpbWVyKTtcbiAgICBzdG9wU2xpZGVyKCk7XG4gICAgLy9jbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICBkaXNwbGF5UGxheUNvbnRyb2xzKCk7XG59XG5cbnZvaWNlTWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghbWVzc2FnZUNvbXBsZXRlZCAmJiAhaXNSZWNvcmRpbmcpIHtcbiAgICAgICAgcmVjb3JkTWVzc2FnZSgpO1xuICAgIH0gZWxzZSBpZiAoIW1lc3NhZ2VDb21wbGV0ZWQgJiYgaXNSZWNvcmRpbmcpIHtcbiAgICAgICAgc3RvcFJlY29yZGluZygpO1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZUNvbXBsZXRlZCAmJiAhaXNQbGF5aW5nKSB7XG4gICAgICAgIHBsYXlNZXNzYWdlKCk7XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlQ29tcGxldGVkICYmIGlzUGxheWluZykge1xuICAgICAgICBzdG9wUGxheWluZygpO1xuICAgIH1cbn07XG5cbnJlc2V0Vm9pY2VNZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgbWVzc2FnZUNvbXBsZXRlZCA9IGZhbHNlO1xuICAgIGlzUGxheWluZyA9IGZhbHNlO1xuXG4gICAgc3RvcFRpbWVyKHBsYXlUaW1lcik7XG4gICAgc3RvcFNsaWRlcigpO1xuICAgIHRvZ2dsZVRpbWVyRGlzcGxheSgpO1xuICAgIHRvZ2dsZVN0b3BCdXR0b25EaXNwbGF5KCk7XG5cbiAgICBzZXRRdWVzdGlvblRvTm90RG9uZSgpO1xuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaW4tYnRuXCIpLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWJ0blwiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWljXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmb3JtLWJ1dHRvbi1jb250YWluZXJcIikuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVjb3JkaW5nLXF1ZXN0aW9uLWNvbnRhaW5lclwiKS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVjb3JkaW5nLXJlc3BvbnNlLWNvbnRhaW5lclwiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdm9pY2VNZXNzYWdlOiB2b2ljZU1lc3NhZ2UsXG4gIHJlc2V0Vm9pY2VNZXNzYWdlOiByZXNldFZvaWNlTWVzc2FnZSxcbn07XG4iXX0=
