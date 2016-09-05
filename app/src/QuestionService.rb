# Copyright 2016 ThoughtWorks, Inc

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at

#     http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

require_relative 'model/Question'

class QuestionService

  @questionList

  def initialize
    setQuestionList
  end

  def getQuestionList
    return @questionList
  end

  def setQuestionList
    q1 = Question.new(1, "text", "name", "Your Name", "Hi, let us start. What is your full name?", "Just type in your first name, father's name and grandfather's name.", "Hi ", ", nice to meet you.")
    q2 = Question.new(2, "radio", "gender", "Your gender",  "What is your gender?", "Just tap to select your gender.", "Ok, so you are ", ".")
    q3 = Question.new(3, "number", "age", "Your age", "How old are you?", "", "So, you are ", " years old.")
    q4 = Question.new(4, "text", "village", "Your village", "Which village are you from?", "", "OK, you live in ", ".")
    q5 = Question.new(5, "text", "country", "Your country", "Which country do you come from?", "", "OK, you are from ", ".")
    q6 = Question.new(6, "tel", "phoneNumber", "Your phone number", "Please tell us your phone number.", "", "Your phone number is ", ".")
    q7 = Question.new(7, "text", "nameToFind","Person you are looking for", "What is the name of the person you are looking for?", "", "We will help you find ", ".")
    q8 = Question.new(8, "text", "relation", "Relation to you", "What is their relation to you?", "For example, you can type \"mother\", \"father\", \"uncle\", \"auntie\", \"friend\", or \"other\".", "We will help you find your ", ".")
    q9 = Question.new(9, "text", "villageToFind", "Their village", "Which village do they come from?", "Just type \"none\" if you don't know.", "Ok, they are from ", " village.")
    q10 = Question.new(10, "text", "countryToFind", "Their country", "Which country are they from?", "Just type \"none\" if you don't know.", "Ok, they are from ", ".")

    questionList = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10]
    @questionList = questionList
  end
end
