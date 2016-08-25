require './app/src/model/Person.rb'
require 'securerandom'

class PeopleRepository

  def insert(data)
    @person = Person.new(:id => SecureRandom.uuid, :details => data)
    @person.save
  end

end
