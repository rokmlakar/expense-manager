import styles from '../../styles/Navbar/Navbar.module.scss';
import ListItemLink from './ListItemLink';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { useLogoutUser } from '../../queries/user';
import { SuperUserCon } from '../../context/SuperUserProvider';
import { WalletContext } from '../../context/WalletProvider';
import { queryClient, queryclient } from '../../constants/config';

const Navbar = () => {
  const { setAuth, auth } = useContext(AuthContext);
  const {superUsrCon, setSuperUsrCon} = useContext(SuperUserCon);
  const navigate = useNavigate();
  const { mutate: logoutHandler, isSuccess } = useLogoutUser();
  const {walletCon, setWalletCon} = useContext(WalletContext);
  useEffect(() => {
    if (isSuccess) {
      queryClient.removeQueries();
      setAuth(false);
      if (!auth) navigate('auth');
    }
  }, [isSuccess]);
  
  

  return (
    <div className={styles.container}>
      {auth &&
        <div className={styles.logo}>
          <Link to='/'>
            <div>Tracker</div>
          </Link>
        </div>
      }

      <nav>
        <ul>
          {/* HOME */}
          {auth &&
            <ListItemLink url="">
              <h3 onClick={ () => setWalletCon()}>Home</h3>
            </ListItemLink>
          }

          {/* CATEGORIES */}
          {auth &&
            <ListItemLink url="categories">
              <h3>Categories</h3>
            </ListItemLink>
          }
          
          {/* WALLET */}
          {auth &&
            <ListItemLink url="wallet">
              <h3>Wallet</h3>
            </ListItemLink>
          }

          {/* PROFILE */}
          {auth &&
            <div className={styles.mobileMenuLinks}>
              <ListItemLink url="profile">
                <h3>Profile</h3>
              </ListItemLink>
            </div>
          }

          {/* SETTINGS */}
          {auth &&
            <div className={styles.mobileMenuLinks}>
              <ListItemLink url="settings">
                <h3>Settings</h3>
              </ListItemLink>
            </div>
          }

           {/* ADMIN PAGE */}
           {auth && superUsrCon && 
            <ListItemLink url="admin">
              <h3>Admin Page</h3>
            </ListItemLink>
          }

          {/* LOGOUT */}
          {auth &&
            <ListItemLink url="logout" clickHandler={logoutHandler}>
              <h3>Logout</h3>
            </ListItemLink>
          }
        </ul>
      </nav>
    </div>
  );
};

export default Navbar