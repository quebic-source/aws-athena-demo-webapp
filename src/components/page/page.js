import { useEffect } from 'react';
import { connect } from 'react-redux';
import { appInfoSet } from '../../redux/app/app-actions';
import { useAppInfo } from '../../helpers/hooks/common-hook';

const mapsStateToProps = (state, ownProps) => {
    return {
    };
}

const mapDispatchToProps = dispatch => {
    return {
        appInfoSetHandle: ({appId, version}) => {
            dispatch(appInfoSet({appId, version}));
        },
    };
}
function Page({ title, content, headerAction, appInfoSetHandle }) {
    const { appId, version } = useAppInfo();

    useEffect(() => {
        if (appId && version) {
            appInfoSetHandle({ appId, version });
        }
    }, [appId, version]);

    return (
        <>
            <header className="bg-white shadow">
                <div className="container mx-auto flex flex-row py-6 px-0">
                    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                    <div className="flex flex-auto justify-end items-center">
                        {headerAction}
                    </div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto py-4 px-0">
                    <div className="px-4 sm:px-0">
                        <div className="">
                            {content}
                        </div>
                    </div>
                </div>
            </main>
            <div className=""></div>
        </>
    );
}
export default connect(mapsStateToProps, mapDispatchToProps)(Page)