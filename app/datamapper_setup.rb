require 'data_mapper'
require './app/src/model/Person'


puts "****************TGIF************************"
puts ENV['RDS_DB_URL']

host = ENV['RDS_HOSTNAME'] || "localhost"
dbName = ENV['RDS_DB_NAME'] || "kakuma_dev"
userName = ENV['RDS_USERNAME'] || "kakuma_user"
password = ENV['RDS_PASSWORD'] || "sausage"
url = "postgres://#{userName}:#{password}@#{host}/#{dbName}"

puts "****************TGIF2************************"
puts url

DataMapper.setup(:default, ENV['RDS_DB_URL'])

DataMapper::Property::String.length(255)

DataMapper.finalize

DataMapper.auto_migrate!
