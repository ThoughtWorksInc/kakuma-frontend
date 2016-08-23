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
require('./appViewController.js');

},{"./appViewController.js":1}],3:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFwcC9qYXZhc2NyaXB0cy9hcHBWaWV3Q29udHJvbGxlci5qcyIsImFwcC9qYXZhc2NyaXB0cy9tYWluLmpzIiwiYXBwL2phdmFzY3JpcHRzL3F1ZXN0aW9uVmlldy5qcyIsImFwcC9qYXZhc2NyaXB0cy9zdW1tYXJ5Vmlldy5qcyIsImFwcC9qYXZhc2NyaXB0cy92b2ljZVJlY29yZGluZ1ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JJQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBxdWVzdGlvblZpZXcgPSByZXF1aXJlKCcuL3F1ZXN0aW9uVmlldy5qcycpO1xudmFyIHN1bW1hcnlWaWV3ID0gcmVxdWlyZSgnLi9zdW1tYXJ5Vmlldy5qcycpO1xudmFyIHZvaWNlUmVjb3JkaW5nVmlldyA9IHJlcXVpcmUoJy4vdm9pY2VSZWNvcmRpbmdWaWV3LmpzJyk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuICAgIHZhbGlkYXRlQWxsUXVlc3Rpb25zKCk7XG4gICAgc2hvd05leHRTY3JlZW4oKTtcbn0sIGZhbHNlKTtcblxuIGdldEFsbFF1ZXN0aW9uc0FycmF5ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFsbFF1ZXN0aW9uVmlld3MgPSBbXTtcbiAgICB2YXIgYWxsUXVlc3Rpb25Ob2RlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJxdWVzdGlvblwiKTtcbiAgICBmb3IgKGkgPSAxOyBpIDw9IGFsbFF1ZXN0aW9uTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYWxsUXVlc3Rpb25WaWV3c1tpIC0gMV0gPSBxdWVzdGlvblZpZXcuZ2V0UXVlc3Rpb25WaWV3KGkpO1xuICAgIH1cbiAgICByZXR1cm4gYWxsUXVlc3Rpb25WaWV3cztcbn07XG5cbmdldEZpcnN0VW5hbnN3ZXJlZFF1ZXN0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGlzVW5hbnN3ZXJlZCA9IGZ1bmN0aW9uIChxdWVzdGlvbikge1xuICAgICAgICByZXR1cm4gIXF1ZXN0aW9uLmhhc0Fuc3dlcigpO1xuICAgIH07XG4gICAgcmV0dXJuIGdldEFsbFF1ZXN0aW9uc0FycmF5KCkuZmluZChpc1VuYW5zd2VyZWQpO1xufTtcblxuc2hvd05leHRTY3JlZW4gPSBmdW5jdGlvbigpIHtcbiAgICBoaWRlQWxsUXVlc3Rpb25zKCk7XG4gICAgdmFyIG5leHRRdWVzdGlvbiA9IGdldEZpcnN0VW5hbnN3ZXJlZFF1ZXN0aW9uKCk7XG4gICAgdmFyIG5leHRTY3JlZW4gPSBuZXh0UXVlc3Rpb24gPyBuZXh0UXVlc3Rpb24gOiBzdW1tYXJ5Vmlldy5nZXRTdW1tYXJ5VmlldygpO1xuXG4gICAgcmV0dXJuIG5leHRTY3JlZW4uc2hvdygpO1xufTtcblxuaGlkZUFsbFF1ZXN0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICAgIGdldEFsbFF1ZXN0aW9uc0FycmF5KClcbiAgICAgICAgLm1hcChmdW5jdGlvbiAocXVlc3Rpb24pIHtcbiAgICAgICAgICAgIHF1ZXN0aW9uLmhpZGUoKTtcbiAgICAgICAgfSk7XG59O1xuXG5nb1RvUXVlc3Rpb24gPSBmdW5jdGlvbihxdWVzdGlvbklEKSB7XG4gICAgaGlkZUFsbFF1ZXN0aW9ucygpO1xuICAgIHF1ZXN0aW9uVmlldy5nZXRRdWVzdGlvblZpZXcocXVlc3Rpb25JRCkuc2hvdygpO1xufTtcblxudmFsaWRhdGVBbnN3ZXIgPSBmdW5jdGlvbihxdWVzdGlvbklEKSB7XG4gICAgdmFyIHF1ZXN0aW9uID0gcXVlc3Rpb25WaWV3LmdldFF1ZXN0aW9uVmlldyhxdWVzdGlvbklEKTtcbiAgICBxdWVzdGlvbi52YWxpZGF0ZUZvcm1JbnB1dCgpO1xufTtcblxudmFsaWRhdGVBbGxRdWVzdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgZ2V0QWxsUXVlc3Rpb25zQXJyYXkoKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChxdWVzdGlvbikge1xuICAgICAgICAgICAgcXVlc3Rpb24udmFsaWRhdGVGb3JtSW5wdXQoKTtcbiAgICAgICAgfSk7XG59O1xuXG5zaG93U3VtbWFyeSA9IGZ1bmN0aW9uKCkge1xuICAgIGhpZGVBbGxRdWVzdGlvbnMoKTtcbiAgICBzdW1tYXJ5Vmlldy5nZXRTdW1tYXJ5VmlldygpLnNob3coKTtcbn07XG5cbnVwZGF0ZVN1bW1hcnlGaWVsZCA9IGZ1bmN0aW9uKHF1ZXN0aW9uSUQpIHtcbiAgICB2YXIgYW5zd2VyID0gcXVlc3Rpb25WaWV3LmdldFF1ZXN0aW9uVmlldyhxdWVzdGlvbklEKS5nZXRBbnN3ZXIoKTtcblxuICAgIHZhciBzdW1tYXJ5ID0gc3VtbWFyeVZpZXcuZ2V0U3VtbWFyeVZpZXcoKTtcbiAgICBzdW1tYXJ5LnVwZGF0ZVF1ZXN0aW9uUmVzcG9uc2VXaXRoKGFuc3dlciwgcXVlc3Rpb25JRCk7XG59O1xuXG51cGRhdGVRdWVzdGlvbkZpZWxkRnJvbVN1bW1hcnkgPSBmdW5jdGlvbihxdWVzdGlvbklEKSB7XG4gICAgdmFyIGFuc3dlciA9IHN1bW1hcnlWaWV3LmdldFN1bW1hcnlWaWV3KCkuZ2V0QW5zd2VyKHF1ZXN0aW9uSUQpO1xuXG4gICAgdmFyIHF1ZXN0aW9uID0gcXVlc3Rpb25WaWV3LmdldFF1ZXN0aW9uVmlldyhxdWVzdGlvbklEKTtcbiAgICBxdWVzdGlvbi51cGRhdGUoYW5zd2VyKTtcbn07XG5cbmNsaWNrQnV0dG9uT25FbnRlclByZXNzID0gZnVuY3Rpb24oZXZlbnQsIGNhbGxiYWNrLCBxdWVzdGlvbklEKSB7XG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY2FsbGJhY2socXVlc3Rpb25JRCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59O1xuXG5jb25maXJtYXRpb25NZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgZ2V0QWxsUXVlc3Rpb25zQXJyYXkoKS5tYXAoZnVuY3Rpb24gKHF1ZXN0aW9uKSB7XG4gICAgICAgIHF1ZXN0aW9uLnJlc2V0KCk7XG4gICAgfSk7XG5cbiAgICBzdW1tYXJ5Vmlldy5nZXRTdW1tYXJ5VmlldygpLmhpZGUoKTtcbiAgICB2b2ljZVJlY29yZGluZ1ZpZXcucmVzZXRWb2ljZU1lc3NhZ2UoKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbmZpcm1hdGlvblwiKS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xufTtcblxuXG5zdGFydEVkaXRpbmcgPSBmdW5jdGlvbihxdWVzdGlvbklEKSB7XG4gICAgc3VtbWFyeVZpZXcuZ2V0U3VtbWFyeVZpZXcoKS5lbmFibGVFZGl0KHF1ZXN0aW9uSUQpO1xufTtcblxuZmluaXNoRWRpdGluZyA9IGZ1bmN0aW9uKHF1ZXN0aW9uSUQpIHtcbiAgICB1cGRhdGVRdWVzdGlvbkZpZWxkRnJvbVN1bW1hcnkocXVlc3Rpb25JRCk7XG4gICAgc3VtbWFyeVZpZXcuZ2V0U3VtbWFyeVZpZXcoKS5kaXNhYmxlRWRpdChxdWVzdGlvbklEKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRBbGxRdWVzdGlvbnNBcnJheTogZ2V0QWxsUXVlc3Rpb25zQXJyYXksXG5cbiAgZ2V0Rmlyc3RVbmFuc3dlcmVkUXVlc3Rpb246IGdldEZpcnN0VW5hbnN3ZXJlZFF1ZXN0aW9uLFxuXG4gIHNob3dOZXh0U2NyZWVuOiBzaG93TmV4dFNjcmVlbixcblxuICBoaWRlQWxsUXVlc3Rpb25zOiBoaWRlQWxsUXVlc3Rpb25zLFxuXG4gIGdvVG9RdWVzdGlvbjogZ29Ub1F1ZXN0aW9uLFxuXG4gIHZhbGlkYXRlQW5zd2VyOiB2YWxpZGF0ZUFuc3dlcixcblxuICB2YWxpZGF0ZUFsbFF1ZXN0aW9uczogdmFsaWRhdGVBbGxRdWVzdGlvbnMsXG5cbiAgc2hvd1N1bW1hcnk6IHNob3dTdW1tYXJ5LFxuXG4gIHVwZGF0ZVN1bW1hcnlGaWVsZDogdXBkYXRlU3VtbWFyeUZpZWxkLFxuXG4gIHVwZGF0ZVF1ZXN0aW9uRmllbGRGcm9tU3VtbWFyeTogdXBkYXRlUXVlc3Rpb25GaWVsZEZyb21TdW1tYXJ5LFxuXG4gIGNsaWNrQnV0dG9uT25FbnRlclByZXNzOiBjbGlja0J1dHRvbk9uRW50ZXJQcmVzcyxcblxuICBjb25maXJtYXRpb25NZXNzYWdlOiBjb25maXJtYXRpb25NZXNzYWdlLFxuXG4gIHN0YXJ0RWRpdGluZzogc3RhcnRFZGl0aW5nLFxuXG4gIGZpbmlzaEVkaXRpbmc6IGZpbmlzaEVkaXRpbmcsXG59O1xuIiwicmVxdWlyZSgnLi9hcHBWaWV3Q29udHJvbGxlci5qcycpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldFF1ZXN0aW9uVmlldzogZ2V0UXVlc3Rpb25WaWV3LFxufVxuXG5mdW5jdGlvbiBnZXRRdWVzdGlvbk5vZGUgKHF1ZXN0aW9uSUQpIHtcbiAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicXVlc3Rpb24tXCIgKyBxdWVzdGlvbklEKTtcbn1cblxuZnVuY3Rpb24gZ2V0UXVlc3Rpb25WaWV3KHF1ZXN0aW9uSUQpIHtcbiAgdmFyIHF1ZXN0aW9uVmlldyA9IHtcbiAgICBxdWVzdGlvbk5vZGU6IGdldFF1ZXN0aW9uTm9kZShxdWVzdGlvbklEKSxcbiAgICBzaG93OiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMucXVlc3Rpb25Ob2RlLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgICB0aGlzLmZvY3VzSW5wdXQoKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnF1ZXN0aW9uTm9kZS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBmb2N1c0lucHV0OiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMucXVlc3Rpb25Ob2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJxdWVzdGlvbi1pbnB1dFwiKVswXS5mb2N1cygpO1xuICAgIH0sXG4gICAgZ2V0UmFkaW9zOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByYWRpb3MgPSAgdGhpcy5xdWVzdGlvbk5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInJhZGlvXCIpO1xuICAgICAgcmV0dXJuIHJhZGlvcy5sZW5ndGggPiAwID8gcmFkaW9zIDogbnVsbDtcbiAgICB9LFxuICAgIGdldENoZWNrZWRSYWRpb0J1dHRvbjogZnVuY3Rpb24ocmFkaW9zKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJhZGlvcy5sZW5ndGg7IGkrKykge1xuICAgICAgICByYWRpbyA9IHJhZGlvc1tpXTtcbiAgICAgICAgaWYocmFkaW8uY2hlY2tlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHJldHVybiByYWRpbztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBzZXRSYWRpb1ZhbHVlOiBmdW5jdGlvbihyYWRpb3MsIHZhbHVlKXtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmFkaW9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJhZGlvID0gcmFkaW9zW2ldO1xuICAgICAgICBpZihyYWRpby52YWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gcmFkaW8uY2hlY2tlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuXG4gICAgfSxcbiAgICBnZXRBbnN3ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFuc3dlcklucHV0O1xuXG4gICAgICB2YXIgcmFkaW9zID0gdGhpcy5nZXRSYWRpb3MoKTtcbiAgICAgIGlmKHJhZGlvcykge1xuICAgICAgICB2YXIgY2hlY2tlZFJhZGlvQnV0dG9uID0gdGhpcy5nZXRDaGVja2VkUmFkaW9CdXR0b24ocmFkaW9zKTtcbiAgICAgICAgaWYoY2hlY2tlZFJhZGlvQnV0dG9uKSB7XG4gICAgICAgICAgYW5zd2VySW5wdXQgPSBjaGVja2VkUmFkaW9CdXR0b247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFuc3dlcklucHV0ID0gdGhpcy5xdWVzdGlvbk5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInF1ZXN0aW9uLWlucHV0XCIpWzBdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFuc3dlcklucHV0LnZhbHVlO1xuICAgIH0sXG4gICAgaGFzQW5zd2VyOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLmdldEFuc3dlcigpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbihhbnN3ZXIpIHtcbiAgICAgIHZhciByYWRpb3MgPSB0aGlzLmdldFJhZGlvcygpO1xuICAgICAgcmV0dXJuIHJhZGlvcyA/IHRoaXMuc2V0UmFkaW9WYWx1ZShyYWRpb3MsYW5zd2VyKSA6IHRoaXMucXVlc3Rpb25Ob2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJxdWVzdGlvbi1pbnB1dFwiKVswXS52YWx1ZSA9IGFuc3dlcjtcblxuICAgIH0sXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJhZGlvcyA9IHRoaXMuZ2V0UmFkaW9zKCk7XG4gICAgICBpZihyYWRpb3Mpe1xuICAgICAgICB2YXIgY2hlY2tlZFJhZGlvQnV0dG9uID0gdGhpcy5nZXRDaGVja2VkUmFkaW9CdXR0b24ocmFkaW9zKTtcbiAgICAgICAgY2hlY2tlZFJhZGlvQnV0dG9uLmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnF1ZXN0aW9uTm9kZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicXVlc3Rpb24taW5wdXRcIilbMF0udmFsdWUgPSBcIlwiO1xuICAgICAgfVxuICAgIH0sXG4gICAgdmFsaWRhdGVGb3JtSW5wdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYodGhpcy5oYXNBbnN3ZXIoKSl7XG4gICAgICAgIHRoaXMuZW5hYmxlU3VibWl0QnV0dG9uKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRpc2FibGVTdWJtaXRCdXR0b24oKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgZW5hYmxlU3VibWl0QnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMucXVlc3Rpb25Ob2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJuZXh0XCIpWzBdLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfSxcbiAgICBkaXNhYmxlU3VibWl0QnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMucXVlc3Rpb25Ob2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJuZXh0XCIpWzBdLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBxdWVzdGlvblZpZXc7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0U3VtbWFyeVZpZXc6IGdldFN1bW1hcnlWaWV3XG59XG5cblxuZnVuY3Rpb24gZ2V0U3VtbWFyeVZpZXcoKXtcbiAgdmFyIHN1bW1hcnlWaWV3ID0ge1xuICAgIG5vZGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZm9ybS1zdW1tYXJ5XCIpLFxuICAgIHVwZGF0ZVF1ZXN0aW9uUmVzcG9uc2VXaXRoOiBmdW5jdGlvbihhbnN3ZXIsIHF1ZXN0aW9uSUQpIHtcbiAgICAgIHZhciByZXNwb25zZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3VtbWFyeS1yZXNwb25zZS1cIisgcXVlc3Rpb25JRCk7XG4gICAgICByZXNwb25zZS52YWx1ZSA9IGFuc3dlcjtcbiAgICB9LFxuICAgIHNob3c6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5ub2RlLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5ub2RlLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGVuYWJsZUVkaXQ6IGZ1bmN0aW9uKHF1ZXN0aW9uSUQpIHtcbiAgICAgIHZhciByZXNwb25zZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3VtbWFyeS1yZXNwb25zZS1cIisgcXVlc3Rpb25JRCk7XG4gICAgICByZXNwb25zZS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgcmVzcG9uc2UuY2xhc3NMaXN0LmFkZChcImVkaXRpbmdcIik7XG4gICAgICByZXNwb25zZS5uZXh0U2libGluZy5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgcmVzcG9uc2UuZm9jdXMoKTtcbiAgICB9LFxuICAgIGRpc2FibGVFZGl0OiBmdW5jdGlvbihxdWVzdGlvbklEKSB7XG4gICAgICB2YXIgcmVzcG9uc2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1bW1hcnktcmVzcG9uc2UtXCIrIHF1ZXN0aW9uSUQpO1xuICAgICAgcmVzcG9uc2UuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgcmVzcG9uc2UuY2xhc3NMaXN0LnJlbW92ZShcImVkaXRpbmdcIik7XG4gICAgICByZXNwb25zZS5uZXh0U2libGluZy5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgIH0sXG4gICAgZ2V0QW5zd2VyOiBmdW5jdGlvbihxdWVzdGlvbklEKSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdW1tYXJ5LXJlc3BvbnNlLVwiKyBxdWVzdGlvbklEKS52YWx1ZTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBzdW1tYXJ5Vmlldztcbn1cbiIsInZhciBxdWVzdGlvblZpZXcgPSByZXF1aXJlKCcuL3F1ZXN0aW9uVmlldycpO1xuXG52YXIgaXNSZWNvcmRpbmcgPSBmYWxzZTtcbnZhciBtZXNzYWdlQ29tcGxldGVkID0gZmFsc2U7XG52YXIgaXNQbGF5aW5nID0gZmFsc2U7XG52YXIgaW50ZXJ2YWw7XG52YXIgcGxheVRpbWVyO1xudmFyIHJlY29yZGluZ1RpbWVyO1xuXG5mdW5jdGlvbiBkaXNwbGF5U3RvcEJ1dHRvbigpIHtcbiAgICB2YXIgc3RvcEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RvcC1idG5cIik7XG4gICAgc3RvcEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtaWNcIikuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICBpZiAoc3RvcEJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoXCJmaWxsLWdyZWVuXCIpKSB7XG4gICAgICAgIHN0b3BCdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImZpbGwtZ3JlZW5cIik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBtb3ZlU2xpZGVyKCkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2xpZGVyLXN0YXR1cy1tYXJrXCIpLmNsYXNzTGlzdC5hZGQoXCJhbmltYXRlXCIpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2xpZGVyLXN0YXR1cy1maWxsXCIpLmNsYXNzTGlzdC5hZGQoXCJhbmltYXRlXCIpO1xufVxuXG5mdW5jdGlvbiBzdG9wU2xpZGVyKCkge1xuICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2xpZGVyLXN0YXR1cy1tYXJrXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJhbmltYXRlXCIpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2xpZGVyLXN0YXR1cy1maWxsXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJhbmltYXRlXCIpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2xpZGVyLWJhclwiKS5jbGFzc0xpc3QuYWRkKFwiZmluaXNoZWRcIik7XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlQbGF5Q29udHJvbHMoKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWJ0blwiKS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RvcC1idG5cIikuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVjb3JkaW5nLWluc3RydWN0aW9uc1wiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVjb3JkaW5nLXJlc3BvbnNlLWNvbnRhaW5lclwiKS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZm9ybS1idXR0b24tY29udGFpbmVyXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiaW4tYnRuXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG59XG5mdW5jdGlvbiBzdGFydFRpbWVyKCkge1xuICAgIHZhciBzZWNvbmRzID0gNjA7XG4gICAgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlY29uZHMtLTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0aW1lclwiKS5pbm5lckhUTUwgPSBzZWNvbmRzO1xuICAgICAgICBpZiAoc2Vjb25kcyA9PSAwKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgfVxuICAgIH0sIDEwMDApO1xufVxuXG5cblxuZnVuY3Rpb24gc3RvcFRpbWVyKHRpbWVPdXQpIHtcbiAgICBjbGVhclRpbWVvdXQodGltZU91dCk7XG4gICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZVRpbWVyRGlzcGxheSgpIHtcbiAgICB2YXIgdGltZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRpbWVyXCIpO1xuICAgIHRpbWVyLmlubmVySFRNTCA9IDYwO1xuXG4gICAgaWYgKCFtZXNzYWdlQ29tcGxldGVkICYmICFpc1JlY29yZGluZykge1xuICAgICAgICB0aW1lci5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmUtYmxvY2tcIjtcbiAgICB9IGVsc2UgaWYgKCFpc1JlY29yZGluZykge1xuICAgICAgICB0aW1lci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxufVxuXG5mdW5jdGlvbiB0b2dnbGVTdG9wQnV0dG9uRGlzcGxheSgpIHtcbiAgICB2YXIgc3RvcEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RvcC1idG5cIik7XG4gICAgaWYgKGlzUGxheWluZykge1xuICAgICAgICBzdG9wQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgICAgIHN0b3BCdXR0b24uY2xhc3NMaXN0LmFkZChcImZpbGwtZ3JlZW5cIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1idG5cIikuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXktYnRuXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RvcC1idG5cIikuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlY29yZE1lc3NhZ2UoKSB7XG4gICAgaXNSZWNvcmRpbmcgPSB0cnVlO1xuXG4gICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgdG9nZ2xlVGltZXJEaXNwbGF5KCk7XG4gICAgc3RhcnRUaW1lcigpO1xuICAgIGRpc3BsYXlTdG9wQnV0dG9uKCk7XG5cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlY29yZGluZy1xdWVzdGlvbi1jb250YWluZXJcIikuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlY29yZGluZy1pbnN0cnVjdGlvbnNcIikuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcblxuICAgIG1vdmVTbGlkZXIoKTtcbiAgICByZWNvcmRpbmdUaW1lciA9IHNldFRpbWVvdXQoc3RvcFJlY29yZGluZywgNjAwMDApO1xuICAgIDtcbn1cblxuZnVuY3Rpb24gc2V0UXVlc3Rpb25Ub0RvbmUoKSB7XG4gIHZpZXcgPSBxdWVzdGlvblZpZXcuZ2V0UXVlc3Rpb25WaWV3KDExKTtcbiAgdmlldy5lbmFibGVTdWJtaXRCdXR0b24oKTtcbiAgdmlldy5xdWVzdGlvbk5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInF1ZXN0aW9uLWlucHV0XCIpWzBdLnZhbHVlID0gXCJkb25lXCI7XG59XG5cbmZ1bmN0aW9uIHNldFF1ZXN0aW9uVG9Ob3REb25lKCkge1xuICB2aWV3ID0gcXVlc3Rpb25WaWV3LmdldFF1ZXN0aW9uVmlldygxMSk7XG4gIHZpZXcuZGlzYWJsZVN1Ym1pdEJ1dHRvbigpO1xuICB2aWV3LnF1ZXN0aW9uTm9kZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicXVlc3Rpb24taW5wdXRcIilbMF0udmFsdWUgPSBcIlwiO1xufVxuXG5mdW5jdGlvbiBzdG9wUmVjb3JkaW5nKCkge1xuICAgIG1lc3NhZ2VDb21wbGV0ZWQgPSB0cnVlO1xuICAgIGlzUmVjb3JkaW5nID0gZmFsc2U7XG4gICAgaXNQbGF5aW5nID0gZmFsc2U7XG5cbiAgICBzdG9wVGltZXIocmVjb3JkaW5nVGltZXIpO1xuICAgIHN0b3BTbGlkZXIoKTtcbiAgICBkaXNwbGF5UGxheUNvbnRyb2xzKCk7XG4gICAgdG9nZ2xlVGltZXJEaXNwbGF5KCk7XG5cbiAgICBzZXRRdWVzdGlvblRvRG9uZSgpO1xufVxuXG5mdW5jdGlvbiBwbGF5TWVzc2FnZSgpIHtcbiAgICBtZXNzYWdlQ29tcGxldGVkID0gdHJ1ZTtcbiAgICBpc1BsYXlpbmcgPSB0cnVlO1xuXG4gICAgdG9nZ2xlU3RvcEJ1dHRvbkRpc3BsYXkoKTtcbiAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJpbi1idG5cIikuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICBtb3ZlU2xpZGVyKCk7XG4gICAgcGxheVRpbWVyID0gc2V0VGltZW91dChzdG9wUGxheWluZywgNjAwMDApO1xufVxuXG5mdW5jdGlvbiBzdG9wUGxheWluZygpIHtcbiAgICBtZXNzYWdlQ29tcGxldGVkID0gdHJ1ZTtcbiAgICBpc1BsYXlpbmcgPSBmYWxzZTtcblxuICAgIHN0b3BUaW1lcihwbGF5VGltZXIpO1xuICAgIHN0b3BTbGlkZXIoKTtcbiAgICAvL2NsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgIGRpc3BsYXlQbGF5Q29udHJvbHMoKTtcbn1cblxudm9pY2VNZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFtZXNzYWdlQ29tcGxldGVkICYmICFpc1JlY29yZGluZykge1xuICAgICAgICByZWNvcmRNZXNzYWdlKCk7XG4gICAgfSBlbHNlIGlmICghbWVzc2FnZUNvbXBsZXRlZCAmJiBpc1JlY29yZGluZykge1xuICAgICAgICBzdG9wUmVjb3JkaW5nKCk7XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlQ29tcGxldGVkICYmICFpc1BsYXlpbmcpIHtcbiAgICAgICAgcGxheU1lc3NhZ2UoKTtcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2VDb21wbGV0ZWQgJiYgaXNQbGF5aW5nKSB7XG4gICAgICAgIHN0b3BQbGF5aW5nKCk7XG4gICAgfVxufVxuXG5yZXNldFZvaWNlTWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICAgIG1lc3NhZ2VDb21wbGV0ZWQgPSBmYWxzZTtcbiAgICBpc1BsYXlpbmcgPSBmYWxzZTtcblxuICAgIHN0b3BUaW1lcihwbGF5VGltZXIpO1xuICAgIHN0b3BTbGlkZXIoKTtcbiAgICB0b2dnbGVUaW1lckRpc3BsYXkoKTtcbiAgICB0b2dnbGVTdG9wQnV0dG9uRGlzcGxheSgpO1xuXG4gICAgc2V0UXVlc3Rpb25Ub05vdERvbmUoKTtcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmluLWJ0blwiKS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1idG5cIikuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1pY1wiKS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZm9ybS1idXR0b24tY29udGFpbmVyXCIpLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG5cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlY29yZGluZy1xdWVzdGlvbi1jb250YWluZXJcIikuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlY29yZGluZy1yZXNwb25zZS1jb250YWluZXJcIikuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHZvaWNlTWVzc2FnZTogdm9pY2VNZXNzYWdlLFxuICByZXNldFZvaWNlTWVzc2FnZTogcmVzZXRWb2ljZU1lc3NhZ2UsXG59XG4iXX0=
