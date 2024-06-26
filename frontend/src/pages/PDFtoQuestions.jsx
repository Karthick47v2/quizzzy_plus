import { useEffect, useState } from 'react';
import QuizElement from '../components/QuizElement';
import { quizzes } from '../../testquiz.js';

const PDFtoQuestions = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false); //file uploading
  const [fileUploaded, setFileUploaded] = useState(false);
  const [quizlist, setQuizlist] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);

  // console.log(userAnswers);

  useEffect(() => {
    //call api for generating questions
    setFileUploaded(true);
    setQuizlist(quizzes);
  }, []);

  return (
    <>
      <div className="bg-white border-x max-w-5xl mx-auto h-full overflow-y-scroll">
        {!fileUploaded && (
          <div className="h-full flex justify-center items-center">
            <div className="flex-col justify-center items-center border p-5 rounded-md shodow-lg">
              <div className="w-full text-center text-sm mb-3 rounded-sm py-2">
                Please upload a file to generate quizzes
              </div>
              <div className="join">
                <input
                  type="file"
                  className="file-input file-input-sm file-input-bordered w-full max-w-xs join-item"
                  accept=".pdf"
                />
                <div className="indicator">
                  <button
                    className="btn btn-sm btn-primary text-white fon join-item font-semibold"
                    disabled={!file && uploading}
                  >
                    Generate
                  </button>
                </div>
              </div>
              {uploading && (
                <div className="flex items-center justify-center mt-3">
                  <span className="">File is uploading</span>
                  <span className="loading loading-bars loading-sm ml-2 "></span>
                </div>
              )}
            </div>
          </div>
        )}

        {fileUploaded && quizlist && (
          <div className="h-full w-full mt-[10%] px-10">
            <div className="font-bold text-lg">
              Here are the quizzes. Please read carefully and select the
              answers. Good luck!
            </div>
            {quizlist.map((quiz, index) => {
              return (
                <QuizElement
                  quiz={quiz}
                  quNum={index + 1}
                  key={index}
                  userAnswers={userAnswers}
                  setUserAnswers={setUserAnswers}
                />
              );
            })}
            <div className="flex justify-end items-center my-4">
              {userAnswers.length !== quizlist.length && (
                <span className="text-red-400 mr-4">
                  Please answer all the questions
                </span>
              )}
              <button
                className="btn btn-neutral text-white"
                disabled={userAnswers.length !== quizlist.length}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default PDFtoQuestions;
