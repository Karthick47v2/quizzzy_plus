import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['green', 'red'];
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
  const { quizId } = useLocation();

  const [chartData, setChartData] = useState([
    { name: 'Correct', value: 400 },
    { name: 'Incorrect', value: 300 },
  ]);
  const [quizList, setQuizList] = useState([]);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {}, []);

  return (
    <div className="bg-white border-x max-w-5xl mx-auto h-full overflow-y-scroll">
      <div className="font-bold text-xl text-center  mt-[10%] ">
        Your {quizId && <span>All Time </span>}Analytics
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
              outerRadius={80}
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
      <div className="flex justify-center items-center ">
        <button
          className="btn btn-link hover:text-blue-500"
          onClick={() => setShowAnswers(!showAnswers)}
        >
          {showAnswers ? 'Hide Answers' : 'Show Answers'}
        </button>
      </div>

      {showAnswers && quizList && quizId && (
        <div className="py-15 px-10">
          <div className="font-bold text-lg text-center">
            Here are the correct answers for all the quizzes
          </div>
          {quizList.map((quiz, index) => {
            return <div></div>;
          })}
          <div className="flex justify-end items-center my-4"></div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
