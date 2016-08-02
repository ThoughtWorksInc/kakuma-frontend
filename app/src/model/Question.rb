class Question

  attr_reader :questionText, :helperText, :responseText

  def initialize(questionText, helperText, responseText)
    @questionText = questionText
    @helperText = helperText
    @responseText = responseText
  end

end
