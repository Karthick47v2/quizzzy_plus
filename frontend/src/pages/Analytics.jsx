import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import CorrectAnswerElement from '../components/CorrectAnswerElement.jsx';
import { testquizanswers } from '../../testquizanswers.js';

const COLORS = ['#3cc91f', ' #ff0000'];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Analytics = () => {
  let { quizId, mergedList: quizlistWithCorrectAnswer } = useLocation();

  // temp setting for testing
  // quizId = 10;
  // quizlistWithCorrectAnswer = testquizanswers;

  const [chartData, setChartData] = useState([]);
  const [suggestions, setSuggetions] = useState('example suggestions');
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    const countCorrectAnswers = () => {
      let correct = 0;
      let incorrect = 0;
      quizlistWithCorrectAnswer?.forEach((quiz) => {
        if (quiz.correctAnswer == quiz.userAnswer) {
          correct++;
        } else {
          incorrect++;
        }
      });

      setChartData([
        { name: 'Correct', value: correct },
        { name: 'Incorrect', value: incorrect },
      ]);
    };

    const fetchAllTimeAnalytics = async () => {
      try {
        const response = await fetch('http://quizzzy.com/get-analytics'); //api call for all time analytics

        if (response.ok) {
          const stats = response.text();
          setChartData([
            { name: 'Correct', value: stats.correct },
            { name: 'Incorrect', value: stats.incorrect },
          ]);
          return;
        } else {
          // setError(response.statusText);
          return;
        }
      } catch (error) {
        // setError(error.message);
        return;
      }
    };

    if (
      quizId &&
      quizlistWithCorrectAnswer &&
      quizlistWithCorrectAnswer.length > 0
    ) {
      countCorrectAnswers();
    } else {
      fetchAllTimeAnalytics();
    }
  }, []);

  const handleShowAnswers = async () => {
    if (!suggestions) {
      try {
        const response = await fetch('http://quizzzy.com/get-suggestions'); //api call for suggestions text

        if (response.ok) {
          const suggestions = response.text();
          setSuggetions(suggestions);
        } else {
          // setError(response.statusText);
        }
      } catch (error) {
        // setError(error.message);
      }
    }

    setShowAnswers(!showAnswers);
  };

  return (
    <div className="bg-white border-x max-w-5xl mx-auto h-full overflow-y-scroll">
      <div className="font-bold text-xl text-center  mt-[10%] ">
        Your {!quizId && <span>All Time </span>}Analytics
      </div>
      <div className="w-[400px] h-[300px] mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width="100%" height="100%">
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      {quizId && quizlistWithCorrectAnswer && (
        <div className="flex justify-center items-center ">
          <button
            className="btn btn-link hover:text-blue-500"
            onClick={handleShowAnswers}
          >
            {showAnswers ? 'Hide Answers' : 'Show Answers'}
          </button>
        </div>
      )}

      {showAnswers && quizId && quizlistWithCorrectAnswer && (
        <div className="py-15 px-10">
          <div className="font-bold text-lg text-center">
            Here are the correct answers for all the quizzes
          </div>
          {quizlistWithCorrectAnswer.map((quiz, index) => {
            return (
              <div key={index}>
                <CorrectAnswerElement quNum={index + 1} quiz={quiz} />
              </div>
            );
          })}
          <div className="p-6 my-4 border-2 rounded-md">
            <div className="text-lg text-blue-500">
              Here are some suggestions for better next time...
            </div>
            {suggestions}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
