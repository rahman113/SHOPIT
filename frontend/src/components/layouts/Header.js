import React, { Fragment } from 'react'
import "../../App.css"


export default function Header() {
  return (
    <Fragment>
      <nav className="navbar row">
        <div className="col-12 col-md-3">
          <div className="navbar-brand">
            <img src='/images/logo.png' alt='shopit-logo'></img>
          </div>
        </div>

        <div className="col-12 col-md-6 mt-2 mt-md-0">
          <div className="input-group">
            <input
              type="text"
              id="search_field"
              className="form-control"
              placeholder="Search for products, brands and more ..."
            />
            <div className="input-group-append">
              <button id="search_btn" className="btn">
                <i className="fa fa-search" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          <button className="btn" id="login_btn">Login</button>

          <span id="cart" className="ml-3">Cart</span>
          <span className="ml-1" id="cart_count">1</span>
        </div>
      </nav>
    </Fragment>
  )
}

