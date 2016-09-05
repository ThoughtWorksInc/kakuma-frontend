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


require 'slim'
require 'sass'
require 'sinatra/base'
require_relative 'src/QuestionService'

class MyApp < Sinatra::Base

  set :public_folder, File.dirname(__FILE__) + '/../public'
  set :views, File.dirname(__FILE__) + '/views'

  def initialize
    super()
    questionService = QuestionService.new
    @questionList = questionService.getQuestionList
  end

  get '/' do
    slim :index
  end

  post '/' do
    redirect '/confirmation'
  end

  get '/confirmation' do
    slim :confirmation
  end

  run! if app_file == $0

end
