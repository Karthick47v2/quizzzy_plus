import heroImage from "../assets/images/hero-image.svg";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";

const Home = () => {
  return (
    <>
      <div className="hero min-h-screen bg-base-300">
        <div className="hero-content text-center">
          <div className="max-w-lg">
            <img src={heroImage} alt="" className="size-[80%] mx-auto mb-8" />
            <h1 className="text-5xl font-bold">
              Ultimate AI-Powered Quiz Generator
            </h1>
            <p className="pt-4 pb-6 px-16">
              Instantly convert PDFs to quizzes with{" "}
              <strong>Quizzy Plus</strong>. Effortless, accurate and engaging.
            </p>
            <Link to="/chatbot">
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
