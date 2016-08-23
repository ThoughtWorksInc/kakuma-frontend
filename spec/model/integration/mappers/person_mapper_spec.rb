require 'spec_helper'
require './app/src/model/Person.rb'

describe Person do

  it "should save a new person to the database" do
    data = 'lucy'
    lucy = Person.new(:details => data)
    lucy.save
    people = Person.all
    expect(people[0].details).to eq data
  end

  context "saving and retrieving JSON data" do

    before(:each) do
      @details = {"name":"lucy","gender":"female","age":"23","village":"melbourne","country":"australia","phoneNumber":"+61422885870","nameToFind":"chris","relation":"brother","villageToFind":"london","countryToFind":"UK"}
      lucy = Person.new(:details => @details)
      lucy.save
      @people = Person.all
    end

    it "should save the full JSON map string to the database" do
      expect(@people[0].details).to eq @details
    end

    it "should retrieve name from a record in the database" do
      expect(@people[0].details[:name]).to eq "lucy"
    end
  end

end
