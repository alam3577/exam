import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Link, Navigate } from 'react-router-dom'
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../firbase/auth'
import { useAuth } from '../../store/authContext'

const Login = () => {
    const { userLoggedIn } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!isSigningIn) {
            setIsSigningIn(true)
            await doSignInWithEmailAndPassword(email, password)
            // doSendEmailVerification()
        }
    }

    const onGoogleSignIn = (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true)
            doSignInWithGoogle().catch(err => {
                setIsSigningIn(false)
            })
        }
    }

    return (
        <div className='login-main-container'>
            <div>Login</div>
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}
            <Form style={{ width: '100%'}}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control onChange={(e) => setEmail(e.target.value)} type="email" placeholder="name@example.com" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>password</Form.Label>
                    <Form.Control onChange={(e) => setPassword(e.target.value)} type="text" placeholder="password" />
                </Form.Group>
                <Button className='submit-btn' onClick={(e) => onSubmit(e)} variant="outline-primary">Submit</Button>
            </Form>
            <div style={{width: "100%", margin: 'auto'}} >
            <p style={{marginBottom: '0px'}} className="">Don't have an account? <Link to={'/register'} className="hover:underline font-bold">Sign up</Link></p>
            <div >
                <div style={{margin: 'auto'}}></div><div className=''>OR</div><div className=''></div>
            </div>
            <div
                disabled={isSigningIn}
                onClick={(e) => onGoogleSignIn(e)}
                className="signin-google-btn"
            >
                <svg style={{width: '25px', height: '25px'}} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_17_40)">
                        <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4" />
                        <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853" />
                        <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04" />
                        <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335" />
                    </g>
                    <defs>
                        <clipPath id="clip0_17_40">
                            <rect width="48" height="48" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
                <div>{isSigningIn ? 'Signing In...' : 'Continue with Google'}</div>
            </div>
            </div>
        </div>
    )
}

export default Login