class Question

  attr_reader :questionText, :helperText, :preWrapResponseText, :postWrapResponseText

  def initialize(questionText, helperText, preWrapResponseText, postWrapResponseText)
    @questionText = questionText
    @helperText = helperText
    @preWrapResponseText = preWrapResponseText
    @postWrapResponseText = postWrapResponseText
  end

end
