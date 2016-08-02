require 'slim'
require 'sass'
require 'sinatra/base'

class MyApp < Sinatra::Base

  set :views, File.dirname(__FILE__) + '/app/views'

  get '/' do
      slim :index
  end
end

if __FILE__ == $0
  MyApp.run! :port => 4567
end
