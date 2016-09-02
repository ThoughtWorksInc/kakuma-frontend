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
