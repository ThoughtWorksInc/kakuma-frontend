require 'data_mapper'
require './app/src/model/Person'

# DataMapper::Logger.new($stdout, :debug)

# "postgres://kakuma_user:sausage@localhost/kakuma_dev"

dbName = ENV['RDS_DB_NAME']

dbUrl = ENV['RDS_DB_URL']

puts '******************************************'
puts dbUrl

DataMapper.setup(:default, dbUrl)

DataMapper::Property::String.length(255)

DataMapper.finalize

DataMapper.auto_migrate!
