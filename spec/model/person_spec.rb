require 'spec_helper'
require_relative '../../app/src/model/Person.rb'

describe Person do

  data = {
   "name":          "lucy",
   "gender":        "female",
   "age":           "23",
   "village":       "melbourne",
   "country":       "australia",
   "phoneNumber":   "+610422885870",
   "nameToFind":    "chris",
   "relation":      "brother",
   "villageToFind": "london",
   "countryToFind": "UK"
  }

  it "should create a Person given valid json input data" do
    lucy = Person.new(data)
    expect(lucy.input).to eq data
  end

end
