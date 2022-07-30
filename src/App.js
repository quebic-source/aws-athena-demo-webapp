import './App.css';
import { connect } from 'react-redux';
import { AppContext, getDefaultContext } from './context/app-context';
import MainRouter from './pages/main-router';
import Amplify, { Auth, Hub } from "aws-amplify";
import awsExports from './aws-exports';
import { loadAuthUserInfo } from './services/auth/auth-service';
import { useEffect, useState } from 'react';

Amplify.configure(awsExports);
Auth.configure({
  // storage: window.sessionStorage
});

const mapsStateToProps = (state, ownProps) => {
  return {
  };
}

const mapDispatchToProps = dispatch => {
  return {
  };
}

function App({}) {
  const [authUserInfo, setAuthUserInfo] = useState();
  const [appInfo, setAppInfo] = useState();

  async function loadContext() {
    const authUser = await loadAuthUserInfo();
    if (authUser) {
      setAuthUserInfo(authUser);
    }
  }

  async function init() {
    // How listens
    Hub.listen('auth', async (data) => {
      const event = data.payload.event;
      if (event === "signIn") {
        await loadContext();
      } else if (event === "signOut") {
        // TODO
      }
    });
    await loadContext();
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <AppContext.Provider value={{ ...getDefaultContext(), authUserInfo, appInfo }}>
      <MainRouter/>
    </AppContext.Provider>
  );
}

export default connect(mapsStateToProps, mapDispatchToProps)(App);
