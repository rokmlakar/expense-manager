import styles from '../styles/authComponents/Auth.module.scss';
import img from'../imgs/expenseLanding.png'

import MainContainer from '../components/Containers/MainContainer';
import { Title } from '../components/Titles/Titles';

import { useState, useEffect, useContext } from 'react';

import { useLoginUser, useRegisterUser } from '../queries/user';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import { BsFileX } from 'react-icons/bs';

const Auth = () => {
    console.log(img)
    //LOGIN VNOS EMAIL, GESLA
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    //REGISTER 
    const [regEmail, setRegEmail] = useState('');
    const [regPw, setRegPw] = useState('');

    //CONTEXT
    const { auth, setAuth } = useContext(AuthContext);

    //NAVIGATE
    const navigate = useNavigate();

    let body = {
        email: email,
        password: pw,
    }

    let regBody = {
        email: regEmail,
        password: regPw,
    }

    const {
        mutate: loginHandler,
        isError: loginError,
        error: loginErr,
    } = useLoginUser();

    const {
        mutateAsync: registerHandler,
        isSuccess: registerSucc,
        isError: registerError,
        error: registerErr,
    } = useRegisterUser();

    useEffect(() => {
        if (auth) navigate('/')
    });

    return (

            <div className={styles.flexContainer}>
                <div className={styles.mainContent}>
                    <Title>Easily keep track of all your expenses</Title>
                    <div className={styles.container}>
                        <div className={styles.img}>
                            <img src={require('../imgs/expenseLanding.png')}  alt="" />
                        </div>
                    </div>
                </div>

                <div className={styles.sideContent}>
                    {/* LOGIN */}
                    <form action="submit" onSubmit={(e) => e.preventDefault()}>
                        <div className={styles.container}>
                            <Title>Login</Title>
                            <span>Email :</span>
                            <input
                                type="email"
                                autoComplete='username'
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                            <span>Password :</span>
                            <input type="password"
                                onChange={(e) => setPw(e.target.value)}
                                value={pw}
                                autoComplete='password'
                            />

                            {/* LOGIN BTN */}
                            <button onClick={() => loginHandler(body, {
                                onError: () => {
                                    console.log(loginErr)
                                },
                                onSuccess: () => setAuth(true)
                            })}>Login Now</button>
                        </div>
                    </form>
                    {/* REGISTER FORM */}
                    <form
                        action='submit'
                        onSubmit={e => e.preventDefault()}
                        className={styles.registerForm}
                    >
                        <div className={styles.container}>
                            <Title>Register</Title>
                            <span>Email :</span>
                            <input type="email"
                                onChange={(e) => setRegEmail(e.target.value)}
                                value={regEmail}
                                autoComplete='email'
                            />
                            <span>Password :</span>
                            <input type="password"
                                onChange={(e) => setRegPw(e.target.value)}
                                value={regPw}
                                autoComplete='new-password'
                            />
                            {/* REGISTER BTN */}
                            <button
                                onClick={() => registerHandler(regBody, {
                                    //ON SUCCESS USE LOGINHANDLER
                                    onSuccess: () => {
                                        loginHandler(regBody, {
                                            onSuccess: () => setAuth(true),
                                            onError: () => {
                                                console.log(loginErr);
                                            },
                                        });
                                    },
                                })
                                }
                            >
                                Register Now
                            </button>
                        </div>
                    </form>

                </div>

            </div>
    );
};

export default Auth