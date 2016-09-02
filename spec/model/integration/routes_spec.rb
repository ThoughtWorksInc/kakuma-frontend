require 'spec_helper'
require './app/app.rb'

describe "getting home page" do
  it "should return 200 when getting the home page" do
    get "/"
    expect(last_response.status).to eq 200
  end
end

describe "posting form submission" do
  it "should redirect to the confirmation page on form submission" do
    post '/',
    expect(last_response.status).to eq 302
  end

end
