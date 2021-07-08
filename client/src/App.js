import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext'
import Login from './components/Login'
import SignUp from './components/Signup'
import Lobby from './components/Lobby'
import Admin from './components/Admin'


import UpdateProfile from './components/UpdateProfile'
import ForgotPassword from './components/ForgotPassword'
import Room from './components/Room'
import PrivateRoute from './routes/PrivateRoute'
import { useSelector, useDispatch } from 'react-redux'
import backgroundSfx from './sfx/background.mp3'
import { SET_ERROR } from './redux/actionsRedux/errorActions'
import { Howl } from 'howler';
import './App.css';
import './global.css';

function App() {
  const ERRORS = useSelector(state => state.ERRORS)
  const SOUNDS = useSelector(state => state.SOUNDS)
  const dispatch = useDispatch()
  const [music, setMusic] = useState()


  useEffect(() => {

    const time = setTimeout(() => {
      dispatch(SET_ERROR({ type: null, msg: '' }))
    }, 4000);
    return () => {
      clearTimeout(time)
    }

  }, [ERRORS.msg])

  useEffect(() => {
    if (SOUNDS.active) {
      soundBgToggle(backgroundSfx, 'play')
    } else {
      soundBgToggle(backgroundSfx, 'pause')
    }
    return () => {
    }
  }, [SOUNDS.active])

  useEffect(() => {
    if (music) {
      music.play();
    }
  }, [music])

  const soundBgToggle = (src, type) => {
    if (!music) {
      const sound = new Howl({
        src,
        volume: 0.02,
        loop: true,
      });
      if (type === 'play') {
        setMusic(sound)
      } else {
        if (music) {
          music.stop();
        }
        setMusic(null)
      }
    } else {
      if (music) {
        music.stop();
      }
      setMusic(null)
    }
  }

  return (
    <div className='mainDiv'>
      {ERRORS.msg !== '' ? <div className='error-box'>
        <span className='error'>{ERRORS.msg}</span>
      </div> : null}

      <BrowserRouter>
        <AuthProvider>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <PrivateRoute path="/" exact component={Login} />
            <PrivateRoute path="/lobby" exact component={Lobby} />
            <PrivateRoute path="/update-profile" component={UpdateProfile} />
            <Route path="/forget-password" component={ForgotPassword} />
            <Route path="/admin" component={Admin} />

            <PrivateRoute path="/room/:roomID" component={Room} />
            <Redirect from="*" to="/" />
          </Switch>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
