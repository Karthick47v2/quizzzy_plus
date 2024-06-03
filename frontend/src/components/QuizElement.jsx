import React from 'react';

const QuizElement = ({ quNum, quiz, userAnswers, setUserAnswers }) => {
  const handleChange = (e) => {
    const exists =
      userAnswers.find((element) => element.id === quiz.id) !== undefined;
    if (exists) {
      const filtered = userAnswers.filter((answer) => answer.id !== quiz.id);
      setUserAnswers([
        ...filtered,
        { id: quiz.id, usersAnswer: e.target.value },
      ]);
    } else {
      setUserAnswers([
        ...userAnswers,
        { id: quiz.id, usersAnswer: e.target.value },
      ]);
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
            <div className="border rounded-md px-2 border-neutral-300 mb-2 bg-base-300">
              <label className="label cursor-pointer space-x-8">
                <span className="label-text">True</span>
                <input
                  type="radio"
                  name={`q${quNum}`}
                  className="radio checked:bg-neutral"
                  value="true"
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="border rounded-md px-2 border-neutral-300 mb-2 bg-base-300">
              <label className="label cursor-pointer space-x-8">
                <span className="label-text">False</span>
                <input
                  type="radio"
                  name={`q${quNum}`}
                  className="radio checked:bg-neutral"
                  value="false"
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>
        )}
        {quiz.type === 'mcq' && (
          <div className="form-control w-full">
            {quiz.options.map((option, index) => {
              return (
                <div
                  className="border rounded-md px-2 border-neutral-300 mb-2 bg-base-300"
                  key={index}
                >
                  <label className="label cursor-pointer space-x-8">
                    <span className="label-text">{option}</span>
                    <input
                      type="radio"
                      name={`q${quNum}`}
                      className="radio checked:bg-neutral"
                      value={option}
                      onChange={handleChange}
                    />
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizElement;
