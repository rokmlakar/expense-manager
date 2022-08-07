import MainContainer from '../components/Containers/MainContainer';
import { Title } from '../components/Titles/Titles';
import { useUser, useUserUpdate } from '../queries/user';
import styles from '../styles/profileComponents/Profile.module.scss';
import { useState, useEffect } from 'react';

const Profile = () => {
    const { data: user, isSuccess } = useUser();
    const {
        mutate: userUpdate,
        isSuccess: userUpdated,
        isError: userNotUpdated,
    } = useUserUpdate();

    //STATE
    const [username, setUsername] = useState('');

    useEffect(() => {
        if (isSuccess) {
            try {
                setUsername(user.data.username);
            } catch { }
        }
    }, [isSuccess, user]);

    const body = {
        username: username
    };

    return <MainContainer>
        <Title>Profile</Title>
        <form action="submit" onSubmit={(e) => e.preventDefault()}>
            <div className={styles.container}>
                {/* FIRSTNAME */}
                <div className={styles.firstName}>
                    <label htmlFor="firstName">Username :</label>
                    <input type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                {/* BUTTON */}
                <button onClick={() => userUpdate(body)}>Update Info</button>
                {userUpdated && (
                    <div style={{margiTop: '1rem', color: 'green'}}>Success</div>
                )}
                {userNotUpdated && (
                    <div style={{marginTop: '1rem', color: 'red'}}>Error</div>
                )}
            </div>
        </form>
    </MainContainer>;
}

export default Profile