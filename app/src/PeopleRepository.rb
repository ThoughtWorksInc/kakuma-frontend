require './app/src/model/Person.rb'

class PeopleRepository

  def insert(data)
    @person = Person.new(:details => data)
    @person.save
  end

end
