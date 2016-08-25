require 'json'
require 'dm-postgres-types'

class Person
  include DataMapper::Resource

  property :id, String, :key => true
  property :details, PgJSON, load_raw_value: true

end
