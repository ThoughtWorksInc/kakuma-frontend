require 'spec_helper'
require './app/src/model/Person.rb'
require './app/app.rb'

describe "getting home page" do
  it "should return 200 when getting the home page" do
    get "/"
    expect(last_response.status).to eq 200
  end
end

describe "posting form submission" do

  it "should successfully store the form details in the database" do
    params = {
      :name => "firstName",
      :country => "UK"
    }

    post '/', params
    people = Person.all
    expect(people).not_to eq nil
  end

  it "should redirect to the confirmation page on form submission" do
    params = {
      :name => "firstName",
      :country => "UK"
    }

    post '/', params
    expect(last_response.status).to eq 302
  end

  # it "should respond with 404 (?) if the data isn't saved (or bad data or whatever)" do
  #
  # end
end
