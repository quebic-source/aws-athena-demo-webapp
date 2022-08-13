import { Routes, Route } from 'react-router-dom';
import AthenaDemoPage from "./athena-demo/athena-demo-page";
import AccessKeyListPage from "./access-key/list";

const DashboardRouter = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<AthenaDemoPage />} />
                <Route path='/athena' element={<AthenaDemoPage />} />
                <Route path='/access-keys' element={<AccessKeyListPage />} />
            </Routes>
        </>
    )
};

export default DashboardRouter;
