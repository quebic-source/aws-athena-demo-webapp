import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/solid';
import { Auth } from "aws-amplify";
import Message from "../../components/message/message-comp";
import logo from '../../logo.png';
function SigninPage() {
  const navigate = useNavigate();
  const [athenaRequest, setAuth] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const [error, setError] = useState({
    username: false,
    password: false
  });

  const [formState, setFormState] = useState({
    processing: false,
    success: false,
    failed: false,
    message: ''
  });

  const handleChange = useCallback(event => {
    const targetName = event.target.name;
    const targetValue = event.target.value;

    if (targetName === 'username')
      athenaRequest.username = targetValue;
    else if (targetName === 'password')
      athenaRequest.password = targetValue;

    setAuth(Object.assign({}, athenaRequest));
  });

  const validateForm = () => {
    let valid = true;
    if (athenaRequest.username === '') {
      error.username = true;
      valid = false;
    } else {
      error.username = false;
    }

    if (athenaRequest.password === '') {
      error.password = true;
      valid = false;
    } else {
      error.password = false;
    }

    setError(Object.assign({}, error))
    return valid;
  }

  const updateFormState = (processing, success, failed, message) => {
    setFormState(Object.assign({}, { processing, success, failed, message }))
  }

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    if (!formState.processing && validateForm()) {
      updateFormState(true, false, false);
      try {
        await Auth.signIn(athenaRequest.username, athenaRequest.password);
        updateFormState(false, true, false);
        navigate('/');
      } catch (err) {
        console.error("signin failed cause", err);
        updateFormState(false, false, true, err.message);
      }
    }
  });

  return (
    <>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <Link to="/">
              <img
                className="mx-auto h-12 w-auto"
                src={logo}
                alt="Workflow"
              />
            </Link>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          </div>

          {formState.failed &&
            <div className="flex justify-center items-center">
              <Message text={formState.message? formState.message: 'Signin failed. Please check your credentials'} type="error" />
            </div>
          }

          {formState.processing &&
            <div class="flex justify-center items-center">
              <div
                class="animate-spin rounded-full span-btn btn-sm border-t-2 border-b-2 border-primary-color"
              >
              </div>
            </div>
          }

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="username"
                  name="username"
                  value={athenaRequest.username}
                  onChange={handleChange}
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={athenaRequest.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </Link>
              </div>
              <div className="text-sm">
                <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Create new account
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SigninPage;
