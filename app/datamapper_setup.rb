require 'data_mapper'
require './app/src/model/Person'

# DataMapper::Logger.new($stdout, :debug)
puts '************************************************************************************************'
puts ENV['RDS_HOSTNAME']
puts ENV['RDS_DB_NAME']
puts ENV['RDS_USERNAME']
puts ENV['RDS_PASSWORD']


host = ENV['RDS_HOSTNAME'] || "localhost"
dbName = ENV['RDS_DB_NAME'] || "kakuma_dev"
userName = ENV['RDS_USERNAME'] || "kakuma_user"
password = ENV['RDS_PASSWORD'] || "sausage"
# port = ENV['RDS_PORT'] || "5432"
url = "postgres://#{userName}:#{password}@#{host}/#{dbName}"
puts url
# RDS_HOSTNAME – The hostname of the DB instance.
# RDS_DB_NAME – The database name, ebdb.
# RDS_USERNAME – The username that you configured for your database.
# RDS_PASSWORD – The password that you configured for your database.
# RDS_PORT – The port on which the DB instance accepts connections. The default value varies between DB engines.
# postgres://kakumaDbUser:bRcOtLvmFP6g@aa1ry1o23s2mm7y.c9eswbufhaxy.eu-west-1.rds.amazonaws.com/ebdb

DataMapper.setup(:default, ENV['RDS_DB_URL'] || "postgres://kakuma_user:sausage@localhost/kakuma_dev")

DataMapper::Property::String.length(255)

DataMapper.finalize

DataMapper.auto_migrate!
