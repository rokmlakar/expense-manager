import styles from '../../styles/homeComponents/HomeProfile.module.scss';
import { BsPencil, BsPerson, BsWallet2 } from 'react-icons/bs';
import { IoSettingsOutline } from 'react-icons/io5';

import { Link } from 'react-router-dom';

import { useUser } from '../../queries/user';

const HomeProfile = () => {
    //V konst data se zapisejo podatki userja (email, firstName, lastName, userId)
    const {data} = useUser();
    return (
        <div className={styles.container}>
            <div className={styles.iconContainer}>
                <BsPerson />
            </div>
            <div className={styles.info}>
                <span className={styles.welcome}>
                    {data && `Hi ${data?.data.username}!`}
                </span>
                <div className={styles.options}>
                    {/* NAS PREUSMERI NA PROFILE */}
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