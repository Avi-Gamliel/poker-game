import React from 'react'
import { Link } from 'react-router-dom'

function FormLogin(props) {
    return (
        <div className="m-0 mb-2 w-100">
            <div>
                <form onSubmit={props.handleSubmit}>
                    <div>
                        <label>Email</label>
                        <input type="email" ref={props.emailRef} className='input-signup' required />
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" ref={props.passwordRef} className='input-signup' required />
                    </div>
                    <div type="submit" className="btn-sign-in" onClick={props.handleSubmit}>
                        Log in
                    </div>
                    <div className="w-100 text-center mt-1">
                        <Link to='/forget-password'>Forget Password</Link>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default FormLogin
