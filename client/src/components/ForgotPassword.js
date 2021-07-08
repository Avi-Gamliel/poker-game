import React, { useRef, useState } from 'react'
import { Button, Alert } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
    const emailRef = useRef()
    const { resetPassword } = useAuth();
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setMessage('')
            setError('')
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage('check your inbox for further instructions')
        } catch {
            setError('Faild torest password')
        }
        setLoading(false)
    }

    return (
        <>
            <div className="main-signUp">
                <div className="container-reset p-25">
                    <h2 className="text-center text-white mb-4">Password Rest</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="success">{message}</Alert>}
                    <form onSubmit={handleSubmit} type='submit' className='form-reset'>
                        <input type="email" placeholder='Email' ref={emailRef} className='input' required />
                        <Button disabled={loading} type="submit" className="w-100 br-25">
                            Reset Password
                        </Button>
                    </form>
                    <div className="w-100 text-center mt-3 ">
                        <Link to='/login'>Login</Link>
                    </div>
                </div>

            </div>
            <div className="w-100 text-center mt-2 text-white">
                Need an account? <Link to='/signup'> Sign up</Link>
            </div>
        </>
    )
}
