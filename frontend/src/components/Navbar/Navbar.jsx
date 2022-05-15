import styles from '../../styles/navbarComponents/Navbar.module.scss';
import ListItemlink from './ListItemlink';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className={styles.container}>
        
        <div className={styles.logo}>
            <Link to='/'></Link>
        </div>
    </div>
  )
}

export default Navbar