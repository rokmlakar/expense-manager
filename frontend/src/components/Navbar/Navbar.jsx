import styles from '../../styles/Navbar/Navbar.module.scss';
import ListItemLink from './ListItemLink';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { useLogoutUser } from '../../queries/user';

import { queryclient } from '../../constants/config';

const Navbar = () => {
  const { setAuth, auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { mutate: logoutHandler, isSuccess } = useLogoutUser();
  return (
    <div className={styles.container}>

      <div className={styles.logo}>
        <Link to='/'>
          <div>Tracker</div>
        </Link>
      </div>

      <nav>
        <ul>
          {/* HOME */}
          <ListItemLink url="">
            <h3>Home</h3>
          </ListItemLink>

          {/* CATEGORIES */}
          <ListItemLink url="categories">
            <h3>Categories</h3>
          </ListItemLink>

          {/* TRANSACTIONS */}
          <ListItemLink url="transactions">
            <h3>Transactions</h3>
          </ListItemLink>

          {/* WALLET */}
          <ListItemLink url="wallet">
            <h3>Wallet</h3>
          </ListItemLink>

          {/* PROFILE */}
          <div className={styles.mobileMenuLinks}>
            <ListItemLink url="profile">
              <h3>Profile</h3>
            </ListItemLink>
          </div>

          {/* SETTINGS */}
          <div className={styles.mobileMenuLinks}>
            <ListItemLink url="settings">
              <h3>Settings</h3>
            </ListItemLink>
          </div>

          {/* LOGOUT */}
          <ListItemLink url="logout" clickHandler={logoutHandler}>
            <h3>Logout</h3>
          </ListItemLink>
        </ul>
      </nav>
    </div>

  )
}

export default Navbar