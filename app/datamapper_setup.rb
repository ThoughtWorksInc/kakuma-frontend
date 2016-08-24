require 'data_mapper'
require './app/src/model/Person'

# DataMapper::Logger.new($stdout, :debug)
host = ENV['RDS_HOSTNAME'] || "localhost"
dbName = ENV['RDS_DB_NAME'] || "kakuma_dev"
userName = ENV['RDS_USERNAME'] || "kakuma_user"
password = ENV['RDS_PASSWORD'] || "sausage"
url = "postgres://#{userName}:#{password}@#{host}/#{dbName}"

DataMapper.setup(:default, url)

DataMapper::Property::String.length(255)

DataMapper.finalize

DataMapper.auto_migrate!
