require 'slim'
require 'sass'
require 'sinatra/base'
require 'json'
require_relative 'datamapper_setup'
require_relative 'src/QuestionService'
require_relative 'src/PeopleRepository'

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
    @form_data = params.to_json
    @peopleRepository = PeopleRepository.new
    @peopleRepository.insert(@form_data)
    redirect '/confirmation'
  end

  get '/confirmation' do
    slim :confirmation
  end

  run! if app_file == $0

end
