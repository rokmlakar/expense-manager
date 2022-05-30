import { BsPencil, BsPerson, BsWallet2 } from 'react-icons/bs';
import styles from '../../styles/homeComponents/HomeProfile.module.scss';
import { IoSettingsOutline } from 'react-icons/io5';

import { Link } from 'react-router-dom';

const HomeProfile = () => {
    return (
        <div className={styles.container}>
            <div className={styles.iconContainer}>
                <BsPerson />
            </div>
            <div className={styles.info}>
                <span className={styles.welcome}>Yo</span>
                <div className={styles.options}>
                    <Link to='profile'>
                        <span>Profile</span>
                        <BsPencil />
                    </Link>
                    <Link to='settings'>
                        <span>Settings</span>
                        <IoSettingsOutline />
                    </Link>
                    <Link to='wallet'>
                        <span>Wallet</span>
                        <BsWallet2/>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default HomeProfile