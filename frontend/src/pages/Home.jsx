import heroImage from '../assets/images/hero-image.svg';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa6';

const Home = () => {
  return (
    <>
      <div className="hero min-h-screen bg-base-300">
        <div className="hero-content text-center">
          <div className="max-w-xl">
            <img src={heroImage} alt="" className="size-[80%] mx-auto mb-8" />
            <h1 className="text-5xl font-bold">
              Your AI Powered Study Partner
            </h1>
            <p className="font-semibold pt-4 pb-6 px-16">
              Instantly convert your documents to quizzes or have a chat with
              our AI buddy using <strong>Quizzy Plus</strong>.<br /> Effortless,
              accurate and engaging.
            </p>
            <Link to="/login">
              <button className="btn btn-primary text-md font-semibold">
                Get Started
                <FaArrowRight />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
