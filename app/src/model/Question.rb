class Question

  attr_reader :id, :field, :questionText, :helperText, :preWrapResponseText, :postWrapResponseText

  def initialize(id, field, questionText, helperText, preWrapResponseText, postWrapResponseText)
    @id = id
    @field = field
    @questionText = questionText
    @helperText = helperText
    @preWrapResponseText = preWrapResponseText
    @postWrapResponseText = postWrapResponseText
  end

end
