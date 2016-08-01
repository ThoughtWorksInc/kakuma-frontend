require 'sinatra'
require 'slim'


set :views, File.expand_path(File.join(__FILE__, '../app/views'))

get '/' do
  slim :'index'
end
