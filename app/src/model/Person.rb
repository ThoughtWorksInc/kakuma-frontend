require 'json'
require 'dm-postgres-types'

class Person
  include DataMapper::Resource

  property :id, Serial
  property :details, PgJSON, load_raw_value: true

end
