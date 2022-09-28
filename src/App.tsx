import React, {useEffect, useState} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import NavigationBar from './components/Navigation Bar/NavigationBar'
import Home from './pages/Home/Home';
import Nieuws from './pages/Nieuws/Nieuws';
import Spike from './pages/Spike/Spike';
import Vereniging from './pages/Vereniging/Vereniging';
import Trainingen from './pages/Trainingen/Trainingen';
import WordLid from './pages/Word lid/WordLid';
import Contact from './pages/Contact/Contact';
import ContactBar from "./components/Contact Bar/ContactBar";
import Commissies from "./pages/Commissies/Commissies";
import Bestuur from "./pages/Bestuur/Bestuur";
import Sponsors from "./pages/Sponsors/Sponsors";
import Wedstrijden from "./pages/Wedstrijden/Wedstrijden";
import WedstrijdText from "./content/Wedstrijden.json";
import Wedstrijd from "./pages/Eigen wedstrijden/Wedstrijd";
import Arnold from "./pages/Arnold/Arnold";
import Records from "./pages/Records/Records";
import "./App.scss";

import AuthRedirect from "./pages/Auth/AuthRedirect";
import AuthCallback from "./pages/Auth/AuthCallback";
import {AuthProvider, AuthState, defaultAuthState, newAuthState, useAuth} from "./pages/Auth/AuthContext";
import Protected from "./pages/Auth/Protected";
import Login from "./components/Login/Login";
import Admin from "./pages/Admin/Admin";
import Registered from "./pages/Auth/Registered";
import ChangeEmail from "./pages/Account/Email/ChangeEmail";

function App() {
  const [authState, setAuthState] = useState(newAuthState());
  const contextValue = { authState, setAuthState }
  const [authLoad, setAuthLoad] = useState(false)

  const authLoader = async () => {
    let loadedState = await useAuth()
    setAuthState(loadedState)
  }

  useEffect(() => {
    if (!authLoad) {
      authLoader().then(() => setAuthLoad(true))
    }
  }, [])

  return (
      <AuthProvider value={contextValue}>
        <Router>
          <div id="app_screen">
            <div id="app_container">
              <NavigationBar />
              <div id="app_flex">
                <Routes>
                  <Route path="/nieuws/spike" element={
                    <Spike />
                  }/>
                  <Route path="/nieuws" element={
                    <Nieuws />
                  }/>
                  <Route path="/vereniging" element={<Vereniging />} />
                  <Route path="/vereniging/commissies" element={<Commissies />} />
                  <Route path="/vereniging/bestuur" element={<Bestuur />} />
                  <Route path="/vereniging/arnold" element={<Arnold />} />
                  <Route path="/trainingen" element={
                    <Trainingen />
                  }/>
                  {WedstrijdText.wedstrijden.map((item) =>
                      (item.path === "" ? "" :
                              <Route path={"/wedstrijden" + item.path} key={"wdstr" + item.naam + item.datum} element={
                                <Wedstrijd wedstrijd={item}/>
                            }/>
                      )
                  )}
                  <Route path="/wedstrijden" element={
                    <Wedstrijden />
                  }/>
                  <Route path="/wedstrijden/records" element={
                    <Records />
                  }/>
                  <Route path="/word_lid" element={
                    <WordLid />
                  }/>
                  <Route path="/contact/sponsors" element={
                    <Sponsors />
                  }/>
                  <Route path="/contact" element={
                    <Contact />
                  }/>
                  <Route path="/"
                    element={<Home />}
                  />
                  <Route path="/lg" element={<AuthRedirect />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/profile" element={<Protected />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/registered" element={<Registered />}/>
                  <Route path="/account/email" element={<ChangeEmail />}/>
                </Routes>
                <div id="app_flex_grow"/>
                <ContactBar />
              </div>
            </div>
          </div>
        </Router>
      </AuthProvider>
  );
}

export default App;