import {useState, useCallback, useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/solid';
import Message from "../../components/message/message-comp";
import config from "../../config";
import {makeRequest} from "../../services/athena/athena-service";
import logo from '../../logo.png';

function AthenaDemoPage() {
  const navigate = useNavigate();
  const [athenaRequest, setAuth] = useState({
    queryString: '',
    catalog: '',
    database: '',
    outputLocation: '',
  });

  const [error, setError] = useState({
    queryString: false,
    catalog: false,
    database: false,
    outputLocation: false,
  });

  const [formState, setFormState] = useState({
    processing: false,
    success: false,
    failed: false,
    message: ''
  });

  const handleChange = useCallback(event => {
    const targetName = event.target.name;
    const targetValue = event.target.value? event.target.value.trim(): '';

    if (targetName === 'queryString')
      athenaRequest.queryString = targetValue;
    else if (targetName === 'catalog')
      athenaRequest.catalog = targetValue;
    else if (targetName === 'database')
      athenaRequest.database = targetValue;
    else if (targetName === 'outputLocation')
      athenaRequest.outputLocation = targetValue;

    setAuth(Object.assign({}, athenaRequest));
  });

  const validateForm = () => {
    let valid = true;
    if (athenaRequest.queryString === '') {
      error.queryString = true;
      valid = false;
    } else {
      error.queryString = false;
    }

    if (athenaRequest.catalog === '') {
      error.catalog = true;
      valid = false;
    } else {
      error.catalog = false;
    }

    if (athenaRequest.database === '') {
      error.database = true;
      valid = false;
    } else {
      error.database = false;
    }

    if (athenaRequest.outputLocation === '') {
      error.outputLocation = true;
      valid = false;
    } else {
      error.outputLocation = false;
    }

    setError(Object.assign({}, error))
    return valid;
  }

  const updateFormState = (processing, success, failed, message) => {
    setFormState(Object.assign({}, { processing, success, failed, message }))
  }

  useEffect(() => {
    if (formState.success) {
      setTimeout(()=>{
          navigate('/');
      }, 1500)
    }
  }, [formState.success]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    if (!formState.processing && validateForm()) {
      updateFormState(true, false, false);
      try {
        const { response } = await makeRequest(athenaRequest);
        updateFormState(false, true, false,  `Execution Id: ${response.queryExecutionId}`);
      } catch (err) {
        console.error("athena call failed cause", err);
        updateFormState(false, false, true, err.message);
      }
    }
  });

  return (
    <>
      <div className="min-h-full flex items-start justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-2">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Athena Demo</h2>
          </div>

          {formState.failed &&
            <div className="flex justify-center items-center">
              <Message text={formState.message? formState.message: 'Athena invoke failed. Please check your request'} type="error" />
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

          {formState.success && <Message text={formState.message} type="success" timeout="-1" />}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>

            <div>
              <label htmlFor="email-address" className="sr-only">
                Query
              </label>
              <textarea
                  id="queryString"
                  name="queryString"
                  value={athenaRequest.queryString}
                  onChange={handleChange}
                  rows="10"
                  autoComplete="queryString"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="SQL Query"
              />
            </div>


            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="catalog" className="sr-only">
                  Data Source
                </label>
                <input
                  id="catalog"
                  name="catalog"
                  value={athenaRequest.catalog}
                  onChange={handleChange}
                  type="text"
                  autoComplete="catalog"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Data Source"
                />
              </div>

            </div>

            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="database" className="sr-only">
                  Data Base
                </label>
                <input
                    id="database"
                    name="database"
                    value={athenaRequest.database}
                    onChange={handleChange}
                    type="text"
                    autoComplete="database"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Data Base"
                />
              </div>

            </div>

            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="outputLocation" className="sr-only">
                  S3 Output location
                </label>
                <input
                    id="outputLocation"
                    name="outputLocation"
                    value={athenaRequest.outputLocation}
                    onChange={handleChange}
                    type="text"
                    autoComplete="outputLocation"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="S3 Output location"
                />
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
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AthenaDemoPage;
