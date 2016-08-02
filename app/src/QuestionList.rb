require_relative 'models/Question'

class QuestionService

  @questionList

  def initialize
    setQuestionList
  end

  def getQuestionList
    return @questionList
  end

  def setQuestionList
    q1 = Question.new("Hi, let us start. What is your full name?", "Just type in your first name, father's name and grandfather's name.", "Hi ", ", nice to meet you.")
    q2 = Question.new("What is your gender?", "Just type \"female\" or \"male\".", "Ok, so you are ", ".")
    q3 = Question.new("How old are you?", "", "So, you are ", "years old.")
    q4 = Question.new("Which village are you from?", "", "OK, you live in ", ".")
    q5 = Question.new("Which country do you come from?", "", "OK, you are from ", ".")
    q6 = Question.new("Please tell us your phone number.", "", "Your phone number is ", ".")
    q7 = Question.new("What is the name of the person you are looking for?", "", "We will help you find ", ".")
    q8 = Question.new("What is their relation to you?", "For example, you can type \"mother\", \"father\", \"uncle\", \"auntie\", \"friend\", or \"other\".", "We will help you find your ", ".")
    q9 = Question.new("Which village do they come from?", "Just type \"none\" if you don't know.", "Ok, they are from ", "village.")
    q10 = Question.new("Which country are they from?", "Just type \"none\" if you don't know.", "Ok, they are from ", ".")

    questionList = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10]
    @questionList = questionList
  end
end
