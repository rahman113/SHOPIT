import React, { Fragment } from 'react'
import { Route, Link } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { logout } from '../../actions/userActions'

import Search from './Search'

import '../../App.css'

const Header = () => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const { user, loading } = useSelector(state => state.auth)
    const { cartItems } = useSelector(state => state.cart)

    const logoutHandler = () => {
        dispatch(logout());
        alert.success('Logged out successfully.')
    }
    return (
        <>
            <nav className="navbar row sticky-top">
                <div className="col-12 col-md-3">
                    <div className="navbar-brand">
                        <Link to="/">
                            <img src="/images/shopit_logo.png" alt='Shop It Logo' />
                        </Link>
                    </div>
                </div>

                <div className="col-12 col-md-6 mt-2 mt-md-0">
                    <Route render={({ history }) => <Search history={history} />} />
                </div>

                <div className="col-12 col-md-3 mt-4 mt-md-0 d-flex align-items-center justify-content-end">

                    <Link to="/cart" style={{ textDecoration: 'none' }} className="d-flex align-items-center mr-4">
                        <div className="cart-icon-wrapper position-relative">
                            <i className="fa fa-shopping-cart text-white" aria-hidden="true"></i>
                            <span id="cart_count">{cartItems.length}</span>
                        </div>
                        <span id="cart" className="ml-2">Cart</span>
                    </Link>
                    {user ? (
                        <div className="dropdown d-inline">
                            <Link to="#!" className="btn dropdown-toggle text-white d-flex align-items-center p-0" type="button" id="dropDownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

                                <figure className="avatar avatar-nav mb-0">
                                    <img
                                        src={user.avatar && user.avatar.url}
                                        alt={user && user.name}
                                        className="rounded-circle"
                                    />
                                </figure>
                                <span className="ml-2">{user && user.name}</span>
                            </Link>

                            <div className="dropdown-menu" aria-labelledby="dropDownMenuButton">
                                {user && user.role === 'admin' && (
                                    <Link className="dropdown-item" to="/dashboard">Dashboard</Link>
                                )}
                                <Link className="dropdown-item" to="/orders/me">Orders</Link>
                                <Link className="dropdown-item" to="/me">Profile</Link>
                                <Link className="dropdown-item text-danger" to="/" onClick={logoutHandler}>
                                    Logout
                                </Link>
                            </div>
                        </div>
                    ) : !loading && <Link to="/login" className="btn" id="login_btn">Login</Link>}
                </div>
            </nav>
        </>
    )
}

export default Header
