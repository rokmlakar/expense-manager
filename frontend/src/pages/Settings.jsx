import styles from '../styles/settingsComponents/Settings.module.scss';

import { Title } from '../components/Titles/Titles';
import MainContainer from '../components/Containers/MainContainer';

import { useUserUpdatePassword } from '../queries/user';
import { useState } from 'react';
import { queryClient } from '../constants/config';

const Settings = () => {
    const {
        mutate: UpdatePassword,
        isError,
        error,
        isLoading,
    } = useUserUpdatePassword();

    const [oldPw, setOldPw] = useState('');
    const [newPw, setNewPw] = useState('');

    let body = {
        oldPassword: oldPw,
        password: newPw
    };

    return (
        <MainContainer>
            <form action="submit" onSubmit={(e) => e.preventDefault()}>
                <div className={styles.container}>
                    {/* OLD PW */}
                    <div className={styles.password}>
                        <label htmlFor="oldPassword">Current Password : </label>
                        <input
                            type="password"
                            name='oldPassword'
                            autoComplete='current password'
                            onChange={(e) => setOldPw(e.target.value)}
                        />
                    </div>
                    {/* NEW PW */}
                    <div className={styles.password}>
                        <label htmlFor="newPassword">New Password : </label>
                        <input type="password"
                            name='newPassword'
                            autoComplete='new-password'
                            value={newPw}
                            onChange={(e) => setNewPw(e.target.value)}
                        />
                    </div>
                </div>
            </form>
        </MainContainer>
    )
}

export default Settings