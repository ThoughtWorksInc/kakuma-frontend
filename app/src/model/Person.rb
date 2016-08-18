require 'json'

class Person
  include DataMapper::Resource

  property :id, Serial
  property :details, Object

end
