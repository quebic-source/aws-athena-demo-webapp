import { useEffect, useState } from 'react';
import Button from '../../../components/button/button';
import Message from "../../../components/message/message-comp";
import Loader from "../../../components/form-loader/form-loader";
import ConfirmDialog from "../../../components/confirm-dialog/confirm-dialog";
import { list, delKey } from '../../../services/access-key';
import { DATE_FORMAT } from '../../../consts/common-consts';
import { parseAndFormat } from '../../../helpers/utils/date-util';
import AppAccessKeyCreateDialog from '../create';

export default function Index() {
    const [accessKeys, setAccessKeys] = useState([]);
    const [formState, setFormState] = useState({
        processing: false,
        success: false,
        failed: false,
        errorMessage: ''
    });

    const [revokeKeyId, setRevokeKeyId] = useState();
    const [openRevokeConfirmDialog, setOpenRevokeConfirmDialog] = useState();

    async function fetchAccessKeys() {
        updateFormState(true, false, false);
        const { data } = await list();
        setAccessKeys(data);
        updateFormState(false, true, false);
    }

    useEffect(() => {
        fetchAccessKeys();
    }, []);

    const updateFormState = (processing, success, failed, errorMessage) => {
        setFormState(Object.assign({}, { processing, success, failed, errorMessage }))
    }

    // access-key create dialog
    const [openCreateAccessKey, setOpenCreateAccessKey] = useState(false);

    const handleOpenCreateAccessKey = () => {
        setOpenCreateAccessKey(true);
    }

    const handleOnSuccessCreateAccessKey = async () => {
        await fetchAccessKeys();
        handleOnCancelCreateAccessKey();
    }

    const handleOnCancelCreateAccessKey = () => {
        setOpenCreateAccessKey(false);
    }

    const handleSelectRevoke = keyId => {
        setRevokeKeyId(keyId);
        setOpenRevokeConfirmDialog(true);
    }

    const handleConfirmRevoke = async confirmed => {
        setOpenRevokeConfirmDialog(false);
        if (confirmed) {
            await delKey(revokeKeyId);
            setRevokeKeyId();
            await fetchAccessKeys();
        }
    }

    return (
        <div className="py-6 px-40">
            {openCreateAccessKey &&
                <AppAccessKeyCreateDialog
                    open={openCreateAccessKey}
                    onCompletion={handleOnSuccessCreateAccessKey}
                    onCancel={handleOnCancelCreateAccessKey}
                />
            }

            {openRevokeConfirmDialog &&
                <ConfirmDialog
                    open={openRevokeConfirmDialog}
                    onCompletion={handleConfirmRevoke}
                    message="Are you sure ? Do you want to revoke this Access"
                />
            }

            <div className="flex justify-between">
                <div className="px-4 pb-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Access Keys</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Access keys for customers</p>
                </div>
                <div>
                    <Button onClick={handleOpenCreateAccessKey} text="Create Access Key" />
                </div>
            </div>

            {formState.processing && <div className="py-6"><Loader /></div>}

            {(!formState.processing && accessKeys.length === 0) &&
                <Message text="Don't have any Access Keys" timeout={-1} />
            }

            {(!formState.processing && accessKeys.length > 0) &&
                <div className="border-t border-gray-200 flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Key Id
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Created At
                                        </th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Revoke</span>
                                        </th>
                                    </tr>
                                    </thead>

                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {accessKeys.map((accessKey) => (
                                        <tr key={accessKey.customerId}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{accessKey.customerId}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parseAndFormat(accessKey.createdAt, DATE_FORMAT)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={()=>handleSelectRevoke(accessKey.customerId)}
                                                    className="text-indigo-600 hover:text-indigo-900">
                                                    Revoke
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </div>)
}