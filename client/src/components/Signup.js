import React, { useRef, useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'
import { useDispatch } from 'react-redux'
import { SET_ERROR } from '../redux/actionsRedux/errorActions'

function SignUp() {

    const dispatch = useDispatch()
    const emailRef = useRef();
    const passwordRef = useRef();
    const nameRef = useRef();
    const maleRef = useRef();
    const femaleRef = useRef();
    const secPasswordRef = useRef();
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const { signup } = useAuth();

    async function handleSubmit(e) {

        e.preventDefault();
        if (passwordRef.current.value !== secPasswordRef.current.value) {
            return dispatch(SET_ERROR({ type: null, msg: 'Password do not match' }))
        }

        if (!passwordRef.current.value || !emailRef.current.value || !nameRef.current.value || !secPasswordRef) {
            return dispatch(SET_ERROR({ type: null, msg: 'Error missing detalis' }))
        }

        try {
            setLoading(true)
            let Gendered = '';
            if (femaleRef.current.checked) {
                Gendered = 'https://drive.google.com/uc?export=view&id=1_Aju0Dz-6AZDdef8j2dg-qq4RX-EElrW'
            } else if (maleRef.current.checked) {
                Gendered = 'https://drive.google.com/uc?export=view&id=1xQQ79yRC_kZCmbjpuiE7q2SZYsBdcTKr'
            } else {
                Gendered = ''
            }

            await signup(emailRef.current.value, passwordRef.current.value, Gendered, nameRef.current.value);
            history.push('/lobby')

        } catch {
            dispatch(SET_ERROR({ type: null, msg: 'Faild to create acount' }))
        }
        setLoading(false)
    }

    return (
        <>
            <h2 className="title-sign-up text-center mb-3 text-white">SignUp</h2>
            <div className="main-signUp">
                <div className="container-signUp">
                    <div className="box-signUp">
                        <form onSubmit={handleSubmit} type="submit">
                            <h5 className="titleChoose">Details</h5>
                            <input type="text" ref={nameRef} placeholder='Full Name' className='input input-signup' required />
                            <input type="email" placeholder="Email" ref={emailRef} className='input input-signup' required />
                            <input type="password" placeholder="Password" ref={passwordRef} className='input input-signup' required />
                            <input type="password" placeholder="Password Confirm" ref={secPasswordRef} className='input input-signup' required />
                            <Form.Group>
                                <Form.Label as="legend" className="titleChoose" column sm={4}>
                                    Gendered
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Check ref={femaleRef} type="radio" label="Female" name="formHorizontalRadios" id="formHorizontalRadios1" />
                                    <Form.Check ref={maleRef} type="radio" label="Male" name="formHorizontalRadios" id="formHorizontalRadios2" />
                                </Col>
                            </Form.Group>
                            <div className="box-btn-sign-up">
                                <Button disabled={loading} type="submit" className="btn-sign_up">
                                    Sign up
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="w-100 text-center mt-2 text-white need-acount">
                    Already have an account? <Link to='/login'>Log in</Link>
                </div>
            </div>
        </>
    )
}

export default SignUp

