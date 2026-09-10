import React, { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import Loader from '../layout/Loader'
import MetaData from '../layout/MetaData'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { login, clearErrors } from '../../actions/userActions'

const Login = ({ history, location }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const alert = useAlert();
    const dispatch = useDispatch();

    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    const redirect = location.search ? location.search.split('=')[1] : '/'

    useEffect(() => {

        if (isAuthenticated) {
            history.push(redirect)
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

    }, [dispatch, alert, isAuthenticated, error, history, redirect])

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password))
    }

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={'Login'} />

                    <div className="row wrapper login-wrapper">
                        <div className="col-11 col-sm-8 col-md-6 col-lg-4">
                            <form
                                className="shadow-lg login-card p-4 p-md-5"
                                onSubmit={submitHandler}
                            >
                                <h1 className="mb-1 text-center login-title">Welcome Back</h1>
                                <p className="text-center text-muted mb-4">
                                    Sign in to continue
                                </p>

                                <div className="form-group mb-3">
                                    <label htmlFor="email_field">Email</label>
                                    <div className="input-icon-wrap">
                                        <i className="fa fa-envelope input-icon" />
                                        <input
                                            type="email"
                                            id="email_field"
                                            className="form-control login-input"
                                            placeholder="you@example.com"
                                            value={email}
                                            required
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="form-group mb-2">
                                    <label htmlFor="password_field">Password</label>
                                    <div className="input-icon-wrap">
                                        <i className="fa fa-lock input-icon" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password_field"
                                            className="form-control login-input"
                                            placeholder="Your password"
                                            value={password}
                                            required
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <i
                                            className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password-icon`}
                                            onClick={() => setShowPassword(!showPassword)}
                                            role="button"
                                            aria-label="Toggle password visibility"
                                        />
                                    </div>
                                </div>

                                <Link to="/password/forgot" className="forgot-link mb-4 d-inline-block">
                                    Forgot Password?
                                </Link>

                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3 login-btn"
                                    disabled={loading}
                                >
                                    {loading ? 'Signing in...' : 'LOGIN'}
                                </button>

                                <p className="text-center mt-4 mb-0">
                                    New here? <Link to="/register" className="register-link">Create an account</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default Login