require 'data_mapper'
require './app/src/model/Person'

DataMapper::Logger.new($stdout, :debug)

# DataMapper.setup(:default, 'postgres://kakuma_user:sausage@localhost/kakuma_dev')

dbName = ENV['RDS_DB_NAME']
puts "**** dbName ****"
puts dbName

DataMapper.setup(:default, "postgres://kakumaDbUser:sausages@aa1ry1o23s2mm7y.c9eswbufhaxy.eu-west-1.rds.amazonaws.com/#{dbName}")

DataMapper::Property::String.length(255)

DataMapper.finalize

DataMapper.auto_migrate!
