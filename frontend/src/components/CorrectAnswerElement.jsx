const CorrectAnswerElement = ({ quNum, quiz }) => {
  const isCorrect = quiz.userAnswer === quiz.correctAnswer;

  const getOptionClass = (option) => {
    if (option === quiz.correctAnswer) {
      return 'bg-green-200 border-green-500'; // Green for correct answer
    } else if (option === quiz.userAnswer) {
      return 'bg-red-200 border-red-500'; // Red for incorrect answer
    } else {
      return 'bg-base-300 border-neutral-300';
    }
  };

  const getIcon = (option) => {
    if (option === quiz.correctAnswer) {
      return '✓'; // Tick for correct answer
    } else if (option === quiz.userAnswer) {
      return '✗'; // Cross for incorrect answer
    } else {
      return null;
    }
  };

  return (
    <div className="bg-base-200 p-4 my-6 rounded-md shadow-md">
      <div className="font-semibold ml-2">
        <span className="text-primary font-bold mr-2">{quNum}.</span>{' '}
        {quiz.question}
      </div>
      <div className="flex items-center justify-start font-mono mt-2 ml-8">
        {quiz.type === 'tf' && (
          <div className="form-control w-full">
            {['true', 'false'].map((option) => {
              const optionText = option === 'true' ? 'True' : 'False';
              return (
                <div
                  className={`border rounded-md px-2 mb-2 ${getOptionClass(
                    option === 'true'
                  )}`}
                  key={option}
                >
                  <label className="label cursor-pointer space-x-8">
                    <span className="label-text">{optionText}</span>
                    <span>{getIcon(option === 'true')}</span>
                  </label>
                </div>
              );
            })}
          </div>
        )}
        {quiz.type === 'mcq' && (
          <div className="form-control w-full">
            {quiz.options.map((option, index) => (
              <div
                className={`border rounded-md px-2 mb-2 ${getOptionClass(
                  option
                )}`}
                key={index}
              >
                <label className="label cursor-pointer space-x-8">
                  <span className="label-text">{option}</span>
                  <span>{getIcon(option)}</span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CorrectAnswerElement;
