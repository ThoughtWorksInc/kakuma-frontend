class Question

  attr_reader :id, :inputType, :field, :questionText, :helperText, :preWrapResponseText, :postWrapResponseText

  def initialize(id, inputType, field, questionText, helperText, preWrapResponseText, postWrapResponseText)
    @id = id
    @inputType = inputType
    @field = field
    @questionText = questionText
    @helperText = helperText
    @preWrapResponseText = preWrapResponseText
    @postWrapResponseText = postWrapResponseText
  end

end
