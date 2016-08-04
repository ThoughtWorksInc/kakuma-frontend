class Question

  attr_reader :id, :inputType, :field, :fieldLabel, :questionText, :helperText, :preWrapResponseText, :postWrapResponseText

  def initialize(id, inputType, field, fieldLabel, questionText, helperText, preWrapResponseText, postWrapResponseText)
    @id = id
    @inputType = inputType
    @field = field
    @fieldLabel = fieldLabel
    @questionText = questionText
    @helperText = helperText
    @preWrapResponseText = preWrapResponseText
    @postWrapResponseText = postWrapResponseText
  end

end
