require 'slim'
require 'sass'
require 'sinatra/base'
require 'json'
require_relative 'datamapper_setup'
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
    @form_data = params.to_json
    puts @form_data
    @person = Person.new(
              :details => @form_data)
    if @person.save
      puts "Person saved"
    else
      puts "Failed to save: #{@person.errors.inspect}"
    end
    redirect '/confirmation'
  end

  get '/confirmation' do
    slim :confirmation
  end

  run! if app_file == $0

end
