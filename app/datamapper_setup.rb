require 'data_mapper'
require './app/src/model/Person'

DataMapper::Logger.new($stdout, :debug)

# DataMapper.setup(:default, 'postgres://kakuma_user:sausage@localhost/kakuma_dev')

# db_name = ENV['RDS_DB_NAME']
# rds_password = ENV['RDS_PASSWORD']
# rds_port = ENV['RDS_PORT']


DataMapper.setup(:default, "postgres://kakumadev:sausages@kakumadev-db.c9eswbufhaxy.eu-west-1.rds.amazonaws.com:5432")

DataMapper::Property::String.length(255)

DataMapper.finalize

DataMapper.auto_migrate!
