import React, { useRef, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import socialMediaAuth from '../service/auth';
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { Loading } from './subComponents/Loading'
import { SET_ERROR } from '../redux/actionsRedux/errorActions'
import { useDispatch } from 'react-redux'
import firebase from 'firebase'
import { FiArrowRight } from "react-icons/fi";
export const facebookProvider = new firebase.auth.FacebookAuthProvider();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

function Login() {

    const { login, currentUser } = useAuth();
    const emailRef = useRef()
    const passwordRef = useRef()
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    const [signInUi, setSignIn] = useState(false)
    const [loadingPage, setLoadingPage] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        let cleanup = true;
        if (cleanup) {
            if (currentUser) {
                setLoadingPage(true)
                setTimeout(() => {
                    history.push('/lobby')
                    setLoadingPage(false)
                }, 4000)
            }
        }
        return () => {
            cleanup = false
        }
    }, [currentUser])


    const handleOnClick = async (provider) => {
        try {
            setLoading(true)
            await socialMediaAuth(provider)
            history.push('/lobby')

        } catch (err) {
            dispatch(SET_ERROR({ type: null, msg: 'Faild to create acount' }))
        }
        setLoading(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const err = await login(emailRef.current.value, passwordRef.current.value)
            if (err) {
                if (err.code === 'auth/user-not-found') {
                    dispatch(SET_ERROR({ type: null, msg: 'This is email is not exist' }))
                } else if (err.code === 'auth/wrong-password') {
                    dispatch(SET_ERROR({ type: null, msg: 'Wrong password' }))
                } else {
                    dispatch(SET_ERROR({ type: null, msg: err.message }))
                }
            } else {

            }
        } catch {
            dispatch(SET_ERROR({ type: null, msg: 'Faild to sign in' }))
        }
        setLoading(false)
    }

    const openEmailAndPassword = () => {
        setSignIn(!signInUi);
    }

    return (
        <>
            {loadingPage ?
                <Loading />
                :
                <>
                    <div className="loginPage">
                        <div className='box-img-game'>
                            <span className='game-img'></span>
                        </div>
                        <div className='box login'>
                            <h2 className="text-center mb-4 text-white">POKER WITH FRIENDS</h2>
                            <div className='box-sign-in'>
                                {!signInUi ?
                                    <>
                                        <button onClick={() => openEmailAndPassword()} className="w-100 my-1 text-center btn-email">
                                            <MdEmail className="provider-icon" />
                                            <span>Sign in with Email</span>
                                        </button>

                                        <div className="d-flex justify-content-center m-2 text-center text-white">
                                            <span>or</span>
                                        </div>

                                        <button onClick={() => handleOnClick(googleProvider)} className="w-100 my-1 text-center btn-google">
                                            <FcGoogle className="provider-icon" />
                                            <span>Sign in with Google</span>
                                        </button>

                                        <div className="w-100 text-center mt-2 text-white need-acount">
                                            Need an account? <Link to='/signup' className=' link-login'> Sign up</Link>
                                        </div>
                                    </>
                                    : <div className="">
                                        <div>
                                            <div className="line">
                                                <h6 className="title-line">Login</h6>
                                                <FiArrowRight color="white" className="arrow-right-login" onClick={() => setSignIn(false)} />
                                            </div>
                                            <form onSubmit={handleSubmit}>
                                                <div>
                                                    <input type="email" placeholder='email' ref={emailRef} className='input' required />
                                                </div>
                                                <div>
                                                    <input type="password" placeholder='password' ref={passwordRef} className='input' required />
                                                </div>
                                                <div type="submit" className="btn-sign-in" onClick={handleSubmit}>
                                                    Log in
                                                </div>
                                                <div className="w-100 text-center mt-1 need-acount">
                                                    <Link to='/forget-password' className='link-forget'>Forget Password</Link>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default Login

