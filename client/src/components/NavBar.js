import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ loggedIn }) => (
  <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
    <Link className='navbar-brand' to='/'>Applify</Link>
    <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
      <span className='navbar-toggler-icon'></span>
    </button>

    <div className='collapse navbar-collapse' id='navbarSupportedContent'>
      { loggedIn &&
        <ul className='navbar-nav mr-auto'>
          <li className='nav-item active'>
            <Link className='nav-link' to='/jobs'>Available Jobs <span className='sr-only'>(current)</span></Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/jobs/post'>Create Job</Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/logout'>Logout</Link>
          </li>
        </ul>
      }
      { !loggedIn &&
        <ul className='navbar-nav mr-auto'>
          <li className='nav-item active'>
            <Link className='nav-link' to='/login'>Login <span className='sr-only'>(current)</span></Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/signup'>Sign up</Link>
          </li>
        </ul>
      }
    </div>
  </nav>
);

export default NavBar;
