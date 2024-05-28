import { useState } from 'react';
import { Link, redirect, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email | !password) {
      setError('All the fields are required!');
      return;
    }

    return navigate('/chatbot');

    // try {
    //   const response = await fetch(process.env.REACT_APP_API_URL, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ email, password }),
    //   });

    //   console.log(response);
    //   if (response.ok) {
    //     // Login successful, handle accordingly
    //   } else {
    //     // Login failed, handle accordingly
    //     const data = await response.json();
    //     setError(data.error);
    //     // console.error('Login failed:', data.error);
    //   }
    // } catch (error) {
    //   // console.error('Error Logging in:', error);
    //   setError(data.error);
    // }
  };
  return (
    <div className="flex items-center justify-center h-screen bg-base-300">
      <div className="card glass shadow-xl w-96 bg-neutral text-neutral-content">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-2xl pb-3">Login</h2>

          {error && (
            <div className="mb-2 bg-red-500 text-white p-2 w-full rounded font-thin">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <label className="input input-md input-primary w-full text-neutral input-bordered flex items-center gap-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                type="text"
                className="grow"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="input input-md input-primary w-full text-neutral input-bordered flex items-center gap-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="password"
                className="grow"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <div className="card-actions justify-center mt-3">
              <button type="submit" className="btn btn-sm w-full btn-primary">
                Login
              </button>
            </div>
          </form>
          <div>
            Don't have an account?
            <Link to="/register">
              <button className="btn btn-active btn-link">Sign Up</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
