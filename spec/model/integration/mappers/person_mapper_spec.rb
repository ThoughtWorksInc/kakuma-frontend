require 'spec_helper'
require './app/src/model/Person.rb'
require 'json'

describe Person do

  context "saving and retrieving JSON data" do

    before(:each) do

      @details = {"name":"lucy","gender":"female","age":"23","village":"melbourne","country":"australia","phoneNumber":"+61422885870","nameToFind":"chris","relation":"brother","villageToFind":"london","countryToFind":"UK"}
      lucy = Person.new(:details => @details.to_json)
      lucy.save
      @people = Person.all
    end

    it "should save the full JSON map string to the database" do
      expect(@people[0].details).to eq @details.to_json
    end

    it "should retrieve name from a record in the database" do
      person = JSON.parse(@people[0].details)
      expect(person["name"]).to eq "lucy"
    end
  end

end
