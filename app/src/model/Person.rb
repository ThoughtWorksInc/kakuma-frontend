require 'json'

class Person

  attr_reader :details

  def initialize(input)
    @details = JSON.parse(input)
  end

  def details_as_json
    return @details.to_json
  end
end
