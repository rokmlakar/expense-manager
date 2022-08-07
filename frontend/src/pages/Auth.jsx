import styles from '../styles/authComponents/Auth.module.scss';
import img from '../imgs/expenseLanding.png'

import MainContainer from '../components/Containers/MainContainer';
import { Title } from '../components/Titles/Titles';

import { useState, useEffect, useContext } from 'react';

import { useLoginUser, useRegisterUser } from '../queries/user';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import { BsFileX } from 'react-icons/bs';

const Auth = () => {
    //LOGIN VNOS EMAIL, GESLA
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [logErr, setLogError] = useState();
    const [logVerErr, setLogVerErr] = useState();
    //REGISTER 
    const [regUsername, setRegUsername] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPw, setRegPw] = useState('');
    const [regPwConf, setRegPwConf] = useState('');
    const [errPassMatch, setErrPassMatch] = useState(false);
    const [errPass, setErrPass] = useState(false);
    const [serverErr, setServerErr] = useState();

    const [errEmail, setErrEmail] = useState(false);
    const [verificationSent, setVerificationSent ] = useState(false);

    //CONTEXT
    const { auth, setAuth } = useContext(AuthContext);

    //NAVIGATE
    const navigate = useNavigate();

    const Validation = () => {

        const regExEmail = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
        const emailTest = regExEmail.test(regEmail);
        const passTest = /\d/.test(regPw) && regPw.length > 5;
        const passMatchTest = regPw === regPwConf
        console.log('TST', emailTest, passTest, passMatchTest)

        if (!emailTest || !passTest || !passMatchTest) {
            !emailTest &&
                setErrEmail(true);
            !passTest &&
                setErrPass(true);
            !passMatchTest &&
                setErrPassMatch(true);

        }
        else {
            setVerificationSent(true)

            if (emailTest === true) {
                console.log('tRUUU')
                registerHandler(regBody, {
                    //ON SUCCESS USE LOGINHANDLER
                    onSuccess: () => {
                        loginHandler(regBody, {
                            onSuccess: () =>{
                            },
                            onError: () => {
                                console.log(loginErr);
                                setServerErr(loginErr)
                            },
                        });
                    },
                })
            }
        }


    }


    let body = {
        email: email,
        password: pw,
    }

    let regBody = {
        username: regUsername,
        email: regEmail,
        password: regPw,
    }


    useEffect(() => {
        errEmail &&
            setErrEmail(false);
    }, [regEmail])

    useEffect(() => {
        errPass &&
            setErrPass(false);
        errPassMatch &&
            setErrPassMatch(false);
    }, [regPwConf])

    //  useEffect(() => {
    //      setLogError();
    //  },[email, pw])
    // console.log(logErr)

    //useLoginUser => useMutation('loginUser', loginUser)
    //loginUser => async klic z (body) parametrom => Ax.post('auth',body)
    const {
        mutate: loginHandler,
        isError: loginError,
        error: loginErr,
    } = useLoginUser();

    console.log(loginErr, loginError, verificationSent)

    const {
        mutateAsync: registerHandler,
        isSuccess: registerSucc,
        isError: registerError,
        error: registerErr,
        message
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
                        <img src={require('../imgs/expenseLanding.png')} alt="" />
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
                                console.log(loginErr.response.data)
                                setLogError(loginErr.response.data)
                                logVerErr(true)

                            },
                            onSuccess: () => setAuth(true)
                        })}>Login Now</button>
                        {/* {logErr && */}
                        {logErr &&
                            <span style={{ color: 'red', fontSize: '20px', fontWeight: '600', border: '1px solid red', background: '#e3e3e3', padding: '5px', borderRadius: '10px', marginBottom: '1rem' }}>{logErr}</span>
                        }
                        {logVerErr &&
                            <span style={{ color: 'red', fontSize: '20px', fontWeight: '600', border: '1px solid red', background: '#e3e3e3', padding: '5px', borderRadius: '10px', marginBottom: '1rem' }}>Pease verify your Email!</span>
                        }
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
                        <span>Username :</span>
                        <input type="text"
                            onChange={(e) => setRegUsername(e.target.value)}
                            value={regUsername}
                        />
                        <span>Email :</span>
                        <input type="email"
                            onChange={(e) => setRegEmail(e.target.value)}
                            value={regEmail}
                        />
                        {errEmail && regEmail &&
                            <span style={{ color: 'red', fontSize: '20px', fontWeight: '600', border: '1px solid red', background: '#e3e3e3', padding: '5px', borderRadius: '10px', marginBottom: '1rem' }}>Enter a valid Email</span>
                        }
                        <span>Password :</span>
                        <input type="password"
                            onChange={(e) => setRegPw(e.target.value)}
                            value={regPw}
                        />
                        <span>Confirm Password :</span>
                        <input type="password"
                            onChange={(e) => setRegPwConf(e.target.value)}
                            value={regPwConf}
                        />
                        {errPassMatch && regPwConf &&
                            <span style={{ color: 'red', fontSize: '20px', fontWeight: '600', border: '1px solid red', background: '#e3e3e3', padding: '5px', borderRadius: '10px', marginBottom: '1rem' }}>Passwords must Match!</span>
                        }
                        {errPass &&
                            <span style={{ color: 'red', fontSize: '17px', border: '1px solid red', background: '#e3e3e3', padding: '10px', borderRadius: '10px', marginBottom: '1rem' }}>
                                <p style={{ fontSize: '20px', fontWeight: '600' }}>Passwords Must Contain:</p>
                                <ul>
                                    <li>-More than 6 characters</li>
                                    <li>-At least one number</li>
                                </ul>
                            </span>
                        }
                        {/* REGISTER BTN */}
                        <button
                            disabled={!errPassMatch && !errEmail && regEmail && regPwConf ? false : true}
                            onClick={Validation}
                        >
                            Register Now
                        </button>
                        {verificationSent &&
                         <span style={{ color: 'green', fontSize: '20px', fontWeight: '600', border: '1px solid green', background: '#e3e3e3', padding: '5px', borderRadius: '10px', marginBottom: '1rem', marginTop: '5px' }}>Verification email has been sent to your accout!</span>
                        }
                    </div>
                </form>

            </div>

        </div>
    );
};

export default Auth