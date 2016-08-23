require 'data_mapper'
require './app/src/model/Person'

# DataMapper::Logger.new($stdout, :debug)

dbName = ENV['RDS_DB_NAME']

DataMapper.setup(:default, "postgres://kakuma_user:sausage@localhost/kakuma_dev" || "postgres://kakumaDbUser:sausages@aa1ry1o23s2mm7y.c9eswbufhaxy.eu-west-1.rds.amazonaws.com/#{dbName}")

DataMapper::Property::String.length(255)

DataMapper.finalize

DataMapper.auto_migrate!
