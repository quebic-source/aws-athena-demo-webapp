import {useState, useCallback} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {LockClosedIcon} from '@heroicons/react/solid';
import {Auth} from "aws-amplify";
import Message from "../../components/message/message-comp";

function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [athenaRequest, setAuth] = useState({
        username: '',
        verifyCode: '',
        password: '',
    });

    const [resetState, setResetState] = useState();

    const [error, setError] = useState({
        username: false,
        verifyCode: false,
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

        if (targetName === 'verifyCode')
            athenaRequest.verifyCode = targetValue;

        if (targetName === 'password')
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

        setError(Object.assign({}, error))
        return valid;
    }

    const validateVerifyForm = () => {
        let valid = true;
        if (athenaRequest.verifyCode === '') {
            error.verifyCode = true;
            valid = false;
        } else {
            error.verifyCode = false;
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
        setFormState(Object.assign({}, {processing, success, failed, message}))
    }

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        if (!formState.processing && validateForm()) {
            updateFormState(true, false, false);
            setResetState(null)
            try {
                const resp = await Auth.forgotPassword(athenaRequest.username);
                updateFormState(false, true, false);
                setResetState(resp);
            } catch (err) {
                console.error("reset pwd failed cause", err);
                updateFormState(false, false, true, err.message);
            }
        }
    });

    const handleSetNewPassword = useCallback(async (event) => {
      event.preventDefault();
      if (!formState.processing && validateVerifyForm()) {
        updateFormState(true, false, false);
        try {
          await Auth.forgotPasswordSubmit(athenaRequest.username, athenaRequest.verifyCode, athenaRequest.password);
          updateFormState(false, true, false);
          navigate('/signin');
        } catch (err) {
          console.error("reset pwd failed cause", err);
          updateFormState(false, false, true);
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
                                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                                alt="Workflow"
                            />
                        </Link>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset your password</h2>
                    </div>

                  {resetState &&
                      <div className="flex justify-center items-center">
                        <Message text={`We have sent verify code to your ${resetState.CodeDeliveryDetails.Destination} email`} type="success"/>
                      </div>
                  }

                    {formState.failed &&
                        <div className="flex justify-center items-center">
                            <Message
                                text={formState.message? formState.message: 'Reset password failed. Please check your details'}
                                type="error"/>
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
                        <input type="hidden" name="remember" defaultValue="true"/>
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
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                />
                            </div>

                            {resetState &&
                                <div>
                                    <label htmlFor="email-address" className="sr-only">
                                        Verify Code
                                    </label>
                                    <input
                                        id="verifyCode"
                                        name="verifyCode"
                                        value={athenaRequest.verifyCode}
                                        onChange={handleChange}
                                        type="text"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Verify Code"
                                    />
                                </div>
                            }

                            {resetState &&
                                <div>
                                  <label htmlFor="password" className="sr-only">
                                    New Password
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
                                      placeholder="New Password"
                                  />
                                </div>
                            }

                        </div>

                        {!resetState &&
                            <div>
                                <button
                                    type="submit"
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true"/>
                                  </span>
                                    Reset password
                                </button>
                            </div>
                        }

                      {resetState &&
                          <div>
                            <button
                                onClick={handleSetNewPassword}
                                type="button"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true"/>
                                  </span>
                              Set new password
                            </button>
                          </div>
                      }

                      {resetState &&
                          <div>
                            <button
                                onClick={handleSubmit}
                                type="button"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-color hover:text-hover-primary-color bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Resend Verification Code
                            </button>
                          </div>
                      }

                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign in to my account
                          </Link>
                        </div>
                        <div className="text-sm">
                          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Create new account
                          </a>
                        </div>
                      </div>

                    </form>
                </div>
            </div>
        </>
    );
}

export default ForgotPasswordPage;
