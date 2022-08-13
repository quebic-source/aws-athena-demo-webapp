import { Fragment, useEffect, useRef, useState, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Button from '../../../components/button/button';
import { create } from '../../../services/access-key';
import Message from "../../../components/message/message-comp";
import Loader from "../../../components/form-loader/form-loader";

export default function Index({ open, onCompletion, onCancel, appCreateNotifyHandle }) {
    const [isOpen, setIsOpen] = useState(open);
    const cancelButtonRef = useRef(null);

    const [formData, setFormData] = useState({
        customerId: ''
    });

    const [error, setError] = useState({
        customerId: false
    });

    const [formState, setFormState] = useState({
        processing: false,
        success: false,
        failed: false,
        errorMessage: ''
    });

    const [accessKey, setAccessKey] = useState();
    const [copySuccess, setCopySuccess] = useState();

    useEffect(() => {
        if (copySuccess) {
            setTimeout(()=>{
                setCopySuccess(false);
            }, 1000)
        }
    }, [copySuccess]);

    const handleChange = useCallback(event => {
        const targetName = event.target.name;
        const targetValue = event.target.value;

        if (targetName === 'customerId') {
            formData.customerId = targetValue;
        }

        setFormData(Object.assign({}, formData));
    });

    const validateForm = () => {
        let valid = true;
        if (formData.customerId) {
            error.customerId = false;
        } else {
            error.customerId = true;
            valid = false;
        }

        setError(Object.assign({}, error))
        return valid;
    }

    const updateFormState = (processing, success, failed, errorMessage) => {
        setFormState(Object.assign({}, { processing, success, failed, errorMessage}))
    }

    const handleOnSubmit = async (event) => {
        event.preventDefault();
        if (!formState.processing && validateForm()) {
            updateFormState(true, false, false);
            const { response, status } = await create(formData);
            if (status === 200) {
                updateFormState(false, true, false);
                setAccessKey(response.accessKey);
            } else {
                updateFormState(false, false, true, response);
            }
        }
    };

    const handleOnCancel = useCallback(() => {
        setIsOpen(false);
        if (onCancel) {
            onCancel();
        } else {
            onCompletion();
        }
    });

    const copyToClipboard = async e => {
        if ('clipboard' in navigator) {
            console.log("copyToClipboard navigator");
            await navigator.clipboard.writeText(accessKey);
        } else {
            console.log("copyToClipboard execCommand")
            document.execCommand('copy', true, accessKey);
        }
        setCopySuccess(true);
    };
    

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed z-10 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRef}
                onClose={handleOnCancel}
            >
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <form onSubmit={handleOnSubmit} className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex items-start justify-center">
                                    <div className="w-full">
                                        <Dialog.Title as="h3" className="text-center text-2xl text-gray-600 font-bold">
                                            New Access Key
                                        </Dialog.Title>
                                        <div>
                                            
                                            {formState.processing && <div className="p-4"><Loader/></div>}
                                            
                                            {formState.failed && <Message text={formState.errorMessage} type="error"/>}

                                            <div>
                                                <label className="text-gray-800 font-semibold block my-3 text-md" for="name">Customer Id</label>
                                                <input 
                                                    className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none" 
                                                    type="text" 
                                                    name="customerId"
                                                    id="customerId"
                                                    placeholder="Key Identifier"  
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            {accessKey &&
                                                <div>
                                                    <div className="flex gap-2 items-center">
                                                        <label className="text-gray-800 font-semibold block my-3 text-md" for="name">Access Key</label>
                                                        {copySuccess &&
                                                            <div className="text-base font-normal bg-green-100 text-green-700 rounded-md py-1 px-2">
                                                                Copied
                                                            </div>
                                                        }
                                                    </div>
                                                    
                                                    <div className="flex gap-2 items-center">
                                                        <input 
                                                            className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none" 
                                                            type="text" 
                                                            value={accessKey}
                                                            readOnly
                                                        />
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="span-btn" onClick={copyToClipboard} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            }

                                            {formState.success && <Message text="The access key will be shown only once. Please copy and save it" type="success"/>}
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="gap-2 bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                {formState.success &&
                                    <Button variant="button" text="Done" onClick={()=>{onCompletion()}} />
                                }

                                {!formState.success &&
                                    <>
                                        <Button variant="button" type="submit" text="Create" />
                                        <Button variant="button" color="default" text="Cancel" onClick={handleOnCancel} />
                                    </>
                                }
                            </div>
                        </form>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}