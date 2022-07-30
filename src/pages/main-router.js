import { Routes, Route } from 'react-router-dom';
import { useAppContext } from '../helpers/hooks/common-hook';
import SigninPage from './signin/signin-page';
import DashboardPage from './dashboard/dashboard-page';
import ForgotPasswordPage from "./forgot-password/forgot-password-page";
import SignupPage from "./signup/signup-page";

const MainRouter = () => {
    const { authUserInfo } = useAppContext();
    if (authUserInfo) {
        // logged user
        return <DashboardPage />
    } else {
        // not logged
        return (
            <Routes>
                <Route path='/' element={<SigninPage />} />
                <Route path='/signin' element={<SigninPage />} />
                <Route path='/signup' element={<SignupPage />} />
                <Route path='/forgot-password' element={<ForgotPasswordPage />} />
            </Routes>
        );
    }
};

export default MainRouter;
