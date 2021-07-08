import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert, Container } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

function UpdateProfile() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const secPasswordRef = useRef()
    const { currentUser, updatePassword, updateEmail } = useAuth();
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== secPasswordRef.current.value) {
            return setError('Password do not match')
        }

        const promises = []
        setError('')
        setLoading(true)

        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value))
        }
        if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value))
        }
        Promise.all(promises).then(() => {
            history.push('/')
        }).catch(() => {
            setError('Faild to update an acount')
        }).finally(() => {
            setLoading(false)
        })

    }

    return (
        <>
            <Container className="d-flex justify-content-center flex-column">
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Update Profile</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required
                                    defaultValue={currentUser.email}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" ref={passwordRef}
                                    placeholder='Leave blank to keep the same'
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Password Confirm</Form.Label>
                                <Form.Control type="password" ref={secPasswordRef}
                                    placeholder='Leave blank to keep the same'
                                />
                            </Form.Group>
                            <Button disabled={loading} type="submit" className="w-100">
                                Update
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>

                <div className="w-100 text-center mt-2">
                    <Link to='/lobby'>Cancel</Link>
                </div>

            </Container>
        </>
    )
}

export default UpdateProfile