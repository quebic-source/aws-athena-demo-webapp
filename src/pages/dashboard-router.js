import { Routes, Route } from 'react-router-dom';
import AthenaDemoPage from "./athena-demo/athena-demo-page";

const DashboardRouter = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<AthenaDemoPage />} />
                <Route path='/athena' element={<AthenaDemoPage />} />
            </Routes>
        </>
    )
};

export default DashboardRouter;
