require 'spec_helper'
require './app/src/PeopleRepository.rb'
require './app/src/model/Person.rb'

describe "people repository" do
    it "should insert data into database" do
        peopleRepository = PeopleRepository.new
        data = {"name":"lucy"}

        person = double()
        expect(Person).to receive(:new).with(:details => data) { person }
        expect(person).to receive(:save)
        peopleRepository.insert(data)
    end
end
