var answerArray = [];
var progress = null;
var selectedQuestion = null;

function updateQuestionWithResponse(questionContainer, answer){
  var responseContainer = questionContainer.getElementsByClassName('response-container')[0];

  var questionQuestionContainer = questionContainer.getElementsByClassName("question-container")[0]
    .classList.add("hidden");
  var inputContainer = questionContainer.getElementsByClassName("input-container")[0]
      .classList.add("hidden");

  var answerThing =responseContainer.getElementsByClassName("response-text")[0].innerHTML = answer;
  responseContainer.classList.remove("hidden");
}

function updateResponse() {

}

function answerSubmit(questionNumber) {
  var questionContainerId = "question-" + questionNumber;
  var questionNode = document.getElementById(questionContainerId);

  var answer = questionNode.getElementsByClassName("answer")[0].value;
  answerArray[questionNumber-1] = answer;
  console.log(answerArray[questionNumber]);

  updateQuestionWithResponse(questionNode, answer);
  //update currentQuestion with the answer just entered
  //Hi name, nice to meet you

  //show the next question?
  //(where do you live?)

  //update progress variable
}
