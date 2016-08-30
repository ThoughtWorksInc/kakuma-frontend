require 'data_mapper'
require './app/src/model/Person'

DataMapper.setup(:default, ENV['RDS_DB_URL'] || "postgres://kakuma_user:sausage@localhost/kakuma_dev")

DataMapper::Property::String.length(255)

DataMapper.finalize

DataMapper.auto_upgrade!
