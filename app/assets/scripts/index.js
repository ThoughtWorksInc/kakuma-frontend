var answerArray = [];
var progress = null;
var selectedQuestion = null;

function updateQuestionWithResponse(questionContainer, answer){
  var responseContainer = questionContainer.getElementsByClassName('response-container')[0];

  var questionQuestionContainer = questionContainer.getElementsByClassName("question-container")[0]
    .classList.add("hidden");

    var thing = document.getElementsByClassName("input-container");
  var inputContainer = Array.prototype.map.call(thing, function(element) {
    element.classList.add("hidden");
  })

  var answerThing =responseContainer.getElementsByClassName("response-text")[0].innerHTML = answer;

  responseContainer.classList.remove("hidden");
}

function updateResponse() {

}

function displayQuestion(questionNumber) {
  var questionNode = document.getElementById("question-" + questionNumber);
  questionNode.classList.remove("hidden");
  questionNode.getElementsByClassName("input-container")[0].classList.remove("hidden");
}

function answerSubmit(questionNumber) {
  var questionContainerId = "question-" + questionNumber;
  var questionNode = document.getElementById(questionContainerId);

  var answer = questionNode.getElementsByClassName("answer")[0].value;
  answerArray[questionNumber-1] = answer;
  console.log(answerArray[questionNumber]);

  updateQuestionWithResponse(questionNode, answer);

  var totalNumberOfQuestions = document.getElementsByClassName("question").length;
  if (questionNumber < totalNumberOfQuestions)
  {
    displayQuestion(questionNumber + 1);
  }
  //show the next question?


  //update progress variable
}
