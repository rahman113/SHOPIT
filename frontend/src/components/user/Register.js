import React, { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import MetaData from '../layout/MetaData'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { register, clearErrors } from '../../actions/userActions'

const Register = ({ history }) => {

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
    })

    const { name, email, password } = user;

    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg')
    const [showPassword, setShowPassword] = useState(false)

    const alert = useAlert();
    const dispatch = useDispatch();

    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    useEffect(() => {

        if (isAuthenticated) {
            history.push('/')
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

    }, [dispatch, alert, isAuthenticated, error, history])

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('password', password);
        formData.set('avatar', avatar);

        dispatch(register(formData))
    }

    const onChange = e => {
        if (e.target.name === 'avatar') {

            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result)
                }
            }

            reader.readAsDataURL(file)

        } else {
            setUser({ ...user, [e.target.name]: e.target.value })
        }
    }

    return (
        <Fragment>

            <MetaData title={'Register User'} />

            <div className="row wrapper login-wrapper">
                <div className="col-11 col-sm-8 col-md-6 col-lg-4">
                    <form
                        className="shadow-lg login-card p-4 p-md-5"
                        onSubmit={submitHandler}
                        encType='multipart/form-data'
                    >
                        <h1 className="mb-1 text-center login-title">Create Account</h1>
                        <p className="text-center text-muted mb-4">
                            Join us — it only takes a minute
                        </p>

                        <div className="form-group mb-3">
                            <label htmlFor="name_field">Name</label>
                            <div className="input-icon-wrap">
                                <i className="fa fa-user input-icon" />
                                <input
                                    type="text"
                                    id="name_field"
                                    className="form-control login-input"
                                    placeholder="Your full name"
                                    name='name'
                                    value={name}
                                    required
                                    onChange={onChange}
                                />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="email_field">Email</label>
                            <div className="input-icon-wrap">
                                <i className="fa fa-envelope input-icon" />
                                <input
                                    type="email"
                                    id="email_field"
                                    className="form-control login-input"
                                    placeholder="you@example.com"
                                    name='email'
                                    value={email}
                                    required
                                    onChange={onChange}
                                />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="password_field">Password</label>
                            <div className="input-icon-wrap">
                                <i className="fa fa-lock input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password_field"
                                    className="form-control login-input"
                                    placeholder="At least 8 characters"
                                    name='password'
                                    value={password}
                                    required
                                    minLength={8}
                                    onChange={onChange}
                                />
                                <i
                                    className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password-icon`}
                                    onClick={() => setShowPassword(!showPassword)}
                                    role="button"
                                    aria-label="Toggle password visibility"
                                />
                            </div>
                        </div>

                        <div className='form-group mb-4'>
                            <label htmlFor='customFile'>Avatar</label>
                            <div className='d-flex align-items-center avatar-upload-row'>
                                <figure className='avatar mr-3 mb-0'>
                                    <img
                                        src={avatarPreview}
                                        className='rounded-circle avatar-preview-img'
                                        alt='Avatar Preview'
                                    />
                                </figure>
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='avatar'
                                        className='custom-file-input'
                                        id='customFile'
                                        accept="image/*"
                                        onChange={onChange}
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Avatar
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            id="register_button"
                            type="submit"
                            className="btn btn-block py-3 login-btn"
                            disabled={loading ? true : false}
                        >
                            {loading ? 'Creating account...' : 'REGISTER'}
                        </button>

                        <p className="text-center mt-4 mb-0">
                            Already have an account? <Link to="/login" className="register-link">Sign in</Link>
                        </p>
                    </form>
                </div>
            </div>

        </Fragment>
    )
}

export default Register