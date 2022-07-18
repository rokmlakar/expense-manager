//STYLES
import styles from "../styles/settingsComponents/Settings.module.scss";

//COMPONENTS
import { Title } from "../components/Titles/Titles";
import MainContainer from "../components/Containers/MainContainer";

//UTILS
import { useUserUpdatePassword } from "../queries/user";
import { useState, useEffect } from "react";
import { queryClient } from "../constants/config";

const Settings = () => {
    const {
        mutate: UpdatePassword,
        isError,
        error,
        isLoading,
    } = useUserUpdatePassword();

    const [oldPw, setOldPw] = useState("");
    const [oldPwConfirm, setOldPwConfirm] = useState("");
    const [newPw, setNewPw] = useState("");
    const [errPass, setErrPass] = useState(false);

    useEffect(() => {
        if (oldPw !== oldPwConfirm) {
            setErrPass(true)
        } else setErrPass(false);
    }, [oldPwConfirm])


    let body = {
        oldPassword: oldPw,
        password: newPw,
    };

    return (
        <MainContainer>
            <Title>Settings</Title>
            <form action="submit" onSubmit={(e) => e.preventDefault()}>
                <div className={styles.container}>
                    {/* OLD PW */}
                    <div className={styles.password}>
                        <label htmlFor="oldPassword">Current Password : </label>
                        <input
                            type="password"
                            name="oldPassword"
                            value={oldPw}
                            autoComplete="current-password"
                            onChange={(e) => setOldPw(e.target.value)}
                        />
                    </div>
                    {/* CONFIRM OLD PW */}
                    <div className={styles.password}>
                        <label htmlFor="oldPassword">Confirm Current Password : </label>
                        <input
                            type="password"
                            name="oldConfirmPassword"
                            value={oldPwConfirm}
                            autoComplete="current-confirm-password"
                            onChange={(e) => setOldPwConfirm(e.target.value)}
                        />
                    </div>
                    {errPass && oldPwConfirm &&
                        <span style={{ color: 'red', fontSize: '20px', fontWeight: '600', border: '1px solid red', background: '#e3e3e3', padding: '5px', borderRadius: '10px', marginBottom: '1rem' }}>Passwords must Match!</span>
                    }
                    <div className={styles.password}>
                        {/* NEW PW */}
                        <label htmlFor="newPassword">New Password : </label>
                        <input
                            type="password"
                            name="newPassword"
                            autoComplete="new-password"
                            value={newPw}
                            onChange={(e) => setNewPw(e.target.value)}
                        />
                    </div>
                    <button
                        disabled={!errPass ? false : true}
                        onClick={() =>
                            UpdatePassword(body, {
                                onSuccess: () => {
                                    queryClient.invalidateQueries("user");
                                    queryClient.removeQueries();
                                },
                            })
                        }
                    >
                        {isLoading ? "Loading" : "Change Password"}
                    </button>
                </div>
                {isError && (
                    <div style={{ marginTop: "1rem", color: "red" }}>
                        {error.response.data}
                    </div>
                )}
            </form>
        </MainContainer>
    );
};

export default Settings;