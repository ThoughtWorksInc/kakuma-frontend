require 'data_mapper'
require './app/src/model/Person'

# DataMapper.setup(:default, 'postgres://kakuma_user:sausage@localhost/kakuma_dev')

DataMapper.setup(:default, "postgres://ENV['RDS_DB_NAME']:ENV['RDS_PASSWORD']@kakumadev-db.c9eswbufhaxy.eu-west-1.rds.amazonaws.com:ENV['RDS_PORT']")

DataMapper::Property::String.length(255)

DataMapper.finalize

DataMapper.auto_migrate!
git
