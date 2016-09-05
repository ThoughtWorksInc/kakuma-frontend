   # Copyright 2016 ThoughtWorks, Inc

   # Licensed under the Apache License, Version 2.0 (the "License");
   # you may not use this file except in compliance with the License.
   # You may obtain a copy of the License at

   #     http://www.apache.org/licenses/LICENSE-2.0

   # Unless required by applicable law or agreed to in writing, software
   # distributed under the License is distributed on an "AS IS" BASIS,
   # WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   # See the License for the specific language governing permissions and
   # limitations under the License.

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
    post '/'
    expect(last_response.status).to eq 302
  end
end
