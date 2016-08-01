require 'slim'
require 'sass'
require 'sinatra/base'

class MyApp < Sinatra::Base

  set :views, File.dirname(__FILE__) + '/app/views'

  get '/' do
      slim :index
  end

  run! if app_file == $0

end
