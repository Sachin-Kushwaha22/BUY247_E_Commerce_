import { useState, useRef, useEffect } from 'react';
import './auth.css'
import UserTimer from './UserTimer';
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom';
const serverUrl = import.meta.env.VITE_SERVER_URL

function Signup({signUp}) {
    const [switchSignin, setSwitchSignin] = useState(sessionStorage.getItem('userSwitch') || 'signin')
    const [otpSend, setOtpSend] = useState(sessionStorage.getItem('userSignupOtpSend') || false)
    const [signinOtpSend, setSigninOtpSend] = useState(sessionStorage.getItem('userSigninOtpSend') || false)
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [userBtnStart, setuserBtnStart] = useState(sessionStorage.getItem('useruserBtnStart') || false)
    const [disableResendBtn, setDisableResendbtn] = useState(true)
    const [errMsg, setErrMsg] = useState('')
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        password: ''
    })
    const [signinFormData, setSigninFormData] = useState({
        email: '',
        password: ''
    })
    const [signinMethod, setSigninMethod] = useState(sessionStorage.getItem('signinMethod') || 'password')
    const [signUpBtn, setSignUpBtn] = useState(false)
    const inputRefs = useRef([]);
    const navigate = useNavigate()

    useEffect(()=>{
        if(signUp){
            sessionStorage.setItem('userSwitch', 'signup')
            setSwitchSignin('signup')
        }
    },[signUp])

    const handleFormDataChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }
    const handleSigninFormDataChange = (e) => {
        const { name, value } = e.target
        setSigninFormData({ ...signinFormData, [name]: value })
    }

    const handleUserSignin = async (e) => {
        e.preventDefault()
        try {
            
            const response = await axios.post(`${serverUrl}/api/auth/signin`, {
                email: signinFormData.email,
                password: signinFormData.password
            }, {
                withCredentials: true
            })
            if (response.status === 200) {
                sessionStorage.removeItem('userSwitch')
                sessionStorage.removeItem('signinMethod')
                sessionStorage.removeItem('userBtnStart')
                sessionStorage.removeItem('userOtpStartTime')
                sessionStorage.removeItem('userSigninOtpSend')
                setOtp(["","","","","",""])
                setSigninFormData({
                    email:'',
                    password:''
                })
                setErrMsg('')
                setDisableResendbtn(true)
                setSigninOtpSend(false)
                navigate('/user/profile')
            }
        } catch (error) {
            console.log('error from handleUserSignin', error);
        }
    }

    const handleUserSigninOTP = async(e) => {
        e.preventDefault()

        if(otp.join('').length < 6){
            setErrMsg('Please enter a valid OTP')
            return
        }
        try {
            
            const response = await axios.post(`${serverUrl}/api/auth/signin`, {
                email: signinFormData.email,
                otp: otp.join('')
            }, {
                withCredentials: true
            })
            if (response.status === 200) {
                sessionStorage.removeItem('userSwitch')
                sessionStorage.removeItem('signinMethod')
                sessionStorage.removeItem('userBtnStart')
                sessionStorage.removeItem('userOtpStartTime')
                sessionStorage.removeItem('userSigninOtpSend')
                setOtp(["","","","","",""])
                setSigninFormData({
                    email:'',
                    password:''
                })
                setErrMsg('')
                setDisableResendbtn(true)
                setSigninOtpSend(false)
                navigate('/user/profile')
            }
        } catch (error) {
            console.log('error from handleUserSigninOTP', error);
        }
    }

    const handleUserCheckExist = async (e) => {
        e.preventDefault()
        sessionStorage.setItem('userBtnStart', true)
        sessionStorage.removeItem('userOtpStartTime')
        setuserBtnStart(true)
        try {
            console.log(signinFormData.email);
            
            const response = await axios.post(`${serverUrl}/api/auth/doExist`, {
                email: signinFormData.email
            }, {
                withCredentials: true
            })
            if (response.status === 200) {
                sessionStorage.setItem('userSigninOtpSend', true);
                setSigninOtpSend(true);
                setErrMsg('');
            }
        } catch (error) {
            setErrMsg('Invalid email or account already exist')
                setSignUpBtn(true)
        }
    }
    const handleCheckExist = async (e) => {
        e.preventDefault()
        sessionStorage.setItem('userBtnStart', true)
        sessionStorage.removeItem('userOtpStartTime')
        setuserBtnStart(true)
        try {
            const response = await axios.post(`${serverUrl}/api/auth/signup/doExist`, {
                email: formData.email
            }, {
                withCredentials: true
            })
            if (response.status === 200) {
                console.log(response.data.message)
                setErrMsg('Invalid email or account already exist')
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('User does not exist, proceeding with signup');
                sessionStorage.setItem('userSignupOtpSend', true);
                setOtpSend(true);
                setErrMsg('');
            } else {
                console.error('Error during handleCheckExist:', error.message);
                setErrMsg('Something went wrong. Please try again later.');
            }
        }
    }

    const handleSignupButton = async () => {
        if (otp.join('').length < 6) {
            setErrMsg('Invalid or incomplete OTP ')
        }
        try {
            const response = await axios.post(`${serverUrl}/api/auth/signup`, {
                fname: formData.fname,
                lname: formData.lname,
                email: formData.email,
                password: formData.password,
                otp: otp.join('')
            }, {
                withCredentials: true
            })
            if (response.status === 200) {
                setuserBtnStart(false)
                setErrMsg('')
                setDisableResendbtn(true)
                sessionStorage.removeItem('userSignupOtpSend')
                sessionStorage.removeItem('userOtpStartTime')
                sessionStorage.removeItem('userBtnStart')
                setOtpSend(false)
                setFormData({
                    fname: '',
                    lname: '',
                    email: '',
                    password: ''
                })
                window.alert('Registration Successful !!')
            }
        } catch (error) {
            console.error('Error during handleSignupButton:', error.message);
            if (error.response && error.response.status === 404) {
                setErrMsg('Invalid OTP ')
            }
            else if (error.response && error.response.status === 500) {
                window.alert('Server error during otp generation')
                setOtpSend(false)
            }
        }
    }


    const handleSigninOTPResend = async () => {
        try {
            const otpResend = await axios.post(`${serverUrl}/api/auth/generateOTP`, {
                email: signinFormData.email
            }, {
                withCredentials: true
            })
            if (otpResend.status === 200) {
                console.log(otpResend.data.message)
                sessionStorage.setItem('userSigninOtpSend', true)
                setSigninOtpSend(true)
                setDisableResendbtn(true)
            }
        } catch (error) {
            console.log('error from handlesiginotpResend', error || error.message);
        }
        finally {
            setErrMsg('')
        }
    }
    const handleOTPResend = async () => {
        try {
            const otpResend = await axios.post(`${serverUrl}/api/auth/generateOTP`, {
                email: formData.email
            }, {
                withCredentials: true
            })
            if (otpResend.status === 200) {
                console.log(otpResend.data.message)
                sessionStorage.setItem('userSignupOtpSend', true)
                setOtpSend(true)
                setDisableResendbtn(true)
            }
        } catch (error) {
            console.log('error from handleotpResend', error || error.message);
        }
        finally {
            setErrMsg('')
        }
    }

    const handleChange = (index, e) => {
        const value = e.target.value;
        if (index === 0 && value === '') setErrMsg('')
        if (isNaN(value)) return; // Only allow numbers

        let newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Allow only 1 digit per box
        setOtp(newOtp);

        // Move to the next input field automatically
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleTimerExpiry = () => {
        setDisableResendbtn(false)
        sessionStorage.setItem('userBtnStart', false)
        setuserBtnStart(false)
    }

    function showPassword() {
        const passwordInput = document.getElementById('userPassword')
        const checkbox = document.getElementById('showUserPassword');

        passwordInput.type = checkbox.checked ? "text" : "password"
    }

    return (
            <div className="user-signup">
                <div style={{ borderRadius: switchSignin === 'signin' ? '20px 5px 5px 20px' : '5px 20px 20px 5px' }} className={`left-section ${switchSignin === 'signin' ? 'move-right' : ''}`}>
                    <img className='signup-leftside-img' src="/assets/svg1.png" alt="" />
                </div>
                <div className={`right-section ${switchSignin === 'signin' ? 'move-left' : ''}`}>
                    {switchSignin === 'signup' && <div className="signup-container">
                        <h1 className="signup-heading">Sign up to <img className='logo logo-signup' src="/assets/logo.png" alt="" /></h1>

                        {!otpSend && <form className='user-signup-form'>
                            <div className="name-group">
                                <div className="form-group">
                                    <label className="form-label">First Name</label>
                                    <input required className="form-input" type="text" name='fname' value={formData.fname} onChange={handleFormDataChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Last Name</label>
                                    <input required className="form-input" type="text" name='lname' value={formData.lname} onChange={handleFormDataChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input required className="form-input" type="email" name='email' value={formData.email} onChange={handleFormDataChange} />
                                {errMsg && <p className='err-text'><svg className='err-svg' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                                    <path d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#fff" d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"></path><path fill="#fff" d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"></path>
                                </svg>{errMsg}</p>}
                            </div>

                            <div className="form-group userPassword">
                                <label className="form-label">Password</label>
                                <input id='userPassword' required className="form-input" type="password" name='password' value={formData.password} onChange={handleFormDataChange} />
                            </div>
                            <div className="form-group-show-pass">
                                <input onClick={showPassword} id='showUserPassword' type='checkbox' />
                                <label htmlFor='showUserPassword' className="form-label-show-pass">Show Password</label>
                            </div>
                            <div className="signin-link">
                                Already a member? <a onClick={() => {
                                    sessionStorage.setItem('userSwitch', 'signin')
                                    setSwitchSignin('signin')
                                }}>Sign in</a>
                            </div>
                            <div className="terms">
                                <input required id="terms" type="checkbox" />
                                <label htmlFor="terms">
                                    Creating an account means you are okay with our{" "}
                                    <a href="#">Terms of service</a>, <a href="#">Privacy Policy</a> and
                                    our default <a href="#">Notification Settings</a>
                                </label>
                            </div>
                            <button className="create-btn" type="submit" onClick={handleCheckExist}>
                                Submit
                            </button>
                        </form>}
                        {otpSend && <div className="otp-sigun-page">

                            <p className="otp-send-text">
                                OTP has been sent to your email address {signinFormData.email}. Please check your email and enter the OTP below.
                            </p>
                            <div className="form-group">
                                <div className='otp-box'>
                                    {otp.map((digit, index) => (
                                        <input
                                            className='otp-input-box'
                                            key={index}
                                            type="text"
                                            value={digit}
                                            maxLength="1"
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            onChange={(e) => handleChange(index, e)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                        />
                                    ))}
                                </div>


                                {errMsg && <p className='err-text err-text-otp'><svg className='err-svg' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                                    <path d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#fff" d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"></path><path fill="#fff" d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"></path>
                                </svg>{errMsg}</p>}


                                <div className="otp-timer">
                                    <div className="timer">
                                        <button onClick={() => {
                                            handleOTPResend()
                                            sessionStorage.setItem('userBtnStart', true)
                                            sessionStorage.removeItem('userOtpStartTime')
                                            setuserBtnStart(true)
                                        }}
                                            disabled={disableResendBtn}
                                            className='resend-btn'
                                            style={{
                                                cursor: disableResendBtn ? "not-allowed" : "pointer",
                                                opacity: disableResendBtn ? 0.6 : 1,
                                            }}>
                                            Resend OTP
                                        </button>
                                        <UserTimer userBtnStart={userBtnStart} onExpire={handleTimerExpiry} />
                                    </div>
                                </div>
                            </div>
                            <button className="create-btn" type="submit" onClick={handleSignupButton}>
                                Create Account
                            </button>

                            <svg className="back-btn" onClick={() => {
                                setuserBtnStart(false)
                                setErrMsg('')
                                setDisableResendbtn(true)
                                sessionStorage.removeItem('userSignupOtpSend')
                                sessionStorage.removeItem('userOtpStartTime')
                                sessionStorage.removeItem('userBtnStart')
                                setOtpSend(false)
                                setOtp(["","","","","",""])
                            }} xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 219.151 219.151" xml:space="preserve">
                                <g>
                                    <path d="M109.576,219.151c60.419,0,109.573-49.156,109.573-109.576C219.149,49.156,169.995,0,109.576,0S0.002,49.156,0.002,109.575   C0.002,169.995,49.157,219.151,109.576,219.151z M109.576,15c52.148,0,94.573,42.426,94.574,94.575   c0,52.149-42.425,94.575-94.574,94.576c-52.148-0.001-94.573-42.427-94.573-94.577C15.003,57.427,57.428,15,109.576,15z" />
                                    <path d="M94.861,156.507c2.929,2.928,7.678,2.927,10.606,0c2.93-2.93,2.93-7.678-0.001-10.608l-28.82-28.819l83.457-0.008   c4.142-0.001,7.499-3.358,7.499-7.502c-0.001-4.142-3.358-7.498-7.5-7.498l-83.46,0.008l28.827-28.825   c2.929-2.929,2.929-7.679,0-10.607c-1.465-1.464-3.384-2.197-5.304-2.197c-1.919,0-3.838,0.733-5.303,2.196l-41.629,41.628   c-1.407,1.406-2.197,3.313-2.197,5.303c0.001,1.99,0.791,3.896,2.198,5.305L94.861,156.507z" />
                                </g>
                            </svg>

                        </div>}
                    </div>}
                    
                    {switchSignin === 'signin' && <div className="signup-container">
                        <h1 className="signup-heading extra-margin">Sign In to <img className='logo logo-signup' src="/assets/logo.png" alt="" /></h1>

                        {signinMethod === 'password' && <form onSubmit={handleUserSignin} className='user-signup-form'>

                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input className="form-input" type="email" name='email' value={signinFormData.email} onChange={handleSigninFormDataChange} required />
                                {errMsg && <p className='err-text'><svg className='err-svg' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                                    <path d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#fff" d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"></path><path fill="#fff" d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"></path>
                                </svg>{errMsg}</p>}
                            </div>


                            <div className="form-group userPassword">
                                <label className="form-label">Password</label>
                                <input id='userPassword' className="form-input" type="password" name='password' value={signinFormData.password} onChange={handleSigninFormDataChange} required />
                            </div>
                            <div className="form-group-show-pass">
                                <input onClick={showPassword} id='showUserPassword' type='checkbox' />
                                <label htmlFor='showUserPassword' className="form-label-show-pass">Show Password</label>
                            </div>

                            <div className="signin-link">
                                new member? <a onClick={() => {
                                    sessionStorage.setItem('userSwitch', 'signup')
                                    setSwitchSignin('signup')
                                }}>Sign Up</a>
                            </div>

                            <button className="create-btn" type="submit">
                                Sign In
                            </button>
                        </form>}
                        { !signinOtpSend && <>
                        {signinMethod === 'otp' && <form onSubmit={handleUserCheckExist} className='user-signup-form'>

                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input className="form-input" type="email" name='email' value={signinFormData.email} onChange={handleSigninFormDataChange} required />
                                {errMsg && <p className='err-text'><svg className='err-svg' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                                    <path d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#fff" d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"></path><path fill="#fff" d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"></path>
                                </svg>{errMsg}</p>}
                            </div>
                            { signUpBtn && <div className="signin-link">
                                new member? <a onClick={() => {
                                    sessionStorage.setItem('userSwitch', 'signup')
                                    setSwitchSignin('signup')
                                    setSignUpBtn(false)
                                }}>Sign Up</a>
                            </div>}

                            <button className="create-btn" type="submit">
                                Send OTP
                            </button>
                        </form>}

                        <p className="or"><p className="line"></p>OR<p className="line"></p></p>

                        {signinMethod === 'password' ? <button onClick={() => {
                            setSigninFormData({
                                email:'',
                                password:''
                            })
                            sessionStorage.setItem('signinMethod', 'otp')
                            setSigninMethod('otp')
                        }} className='otp-signin-btn'><svg class="mail-svg-signin" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48"><path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"></path><path fill="#1e88e5" d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"></path><polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"></polygon><path fill="#c62828" d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"></path><path fill="#fbc02d" d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z"></path></svg>Gmail OTP Sign In</button> : <button onClick={() => {
                            setSigninFormData({
                                email:'',
                                password:''
                            })
                            sessionStorage.setItem('signinMethod', 'password')
                            setSigninMethod('password')
                        }} className='otp-signin-btn'><svg class="pass-svg" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="512" height="512" viewBox="0 0 512 512" xml:space="preserve" id="lock" version="1.1"><path d="M376 186h-20v-40c0-55-45-100-100-100S156 91 156 146v40h-20c-22.002 0-40 17.998-40 40v200c0 22.002 17.998 40 40 40h240c22.002 0 40-17.998 40-40V226c0-22.002-17.998-40-40-40zM256 368c-22.002 0-40-17.998-40-40s17.998-40 40-40 40 17.998 40 40-17.998 40-40 40zm62.002-182H193.998v-40c0-34.004 28.003-62.002 62.002-62.002 34.004 0 62.002 27.998 62.002 62.002v40z"></path></svg>Sign In Using Password</button>}
                        </>}
                        

                        {signinOtpSend && <div className="otp-sigun-page">

                            <p className="otp-send-text">
                                OTP has been sent to your email address {signinFormData.email}. Please check your email and enter the OTP below.
                            </p>
                            <div className="form-group">
                                <div className='otp-box'>
                                    {otp.map((digit, index) => (
                                        <input
                                            className='otp-input-box'
                                            key={index}
                                            type="text"
                                            value={digit}
                                            maxLength="1"
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            onChange={(e) => handleChange(index, e)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                        />
                                    ))}
                                </div>


                                {errMsg && <p className='err-text err-text-otp'><svg className='err-svg' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                                    <path d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#fff" d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"></path><path fill="#fff" d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"></path>
                                </svg>{errMsg}</p>}


                                <div className="otp-timer">
                                    <div className="timer">
                                        <button onClick={() => {
                                            handleSigninOTPResend()
                                            sessionStorage.setItem('userBtnStart', true)
                                            sessionStorage.removeItem('userOtpStartTime')
                                            setuserBtnStart(true)
                                        }}
                                            disabled={disableResendBtn}
                                            className='resend-btn'
                                            style={{
                                                cursor: disableResendBtn ? "not-allowed" : "pointer",
                                                opacity: disableResendBtn ? 0.6 : 1,
                                            }}>
                                            Resend OTP
                                        </button>
                                        <UserTimer userBtnStart={userBtnStart} onExpire={handleTimerExpiry} />
                                    </div>
                                </div>
                            </div>
                            <button className="create-btn" type="submit" onClick={handleUserSigninOTP}>
                                Sign In
                            </button>

                            <svg className="back-btn" onClick={() => {
                                setuserBtnStart(false)
                                setErrMsg('')
                                setDisableResendbtn(true)
                                sessionStorage.removeItem('userSigninOtpSend')
                                sessionStorage.removeItem('userOtpStartTime')
                                sessionStorage.removeItem('userBtnStart')
                                setSigninOtpSend(false)
                                setOtp(["","","","","",""])
                            }} xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 219.151 219.151" xml:space="preserve">
                                <g>
                                    <path d="M109.576,219.151c60.419,0,109.573-49.156,109.573-109.576C219.149,49.156,169.995,0,109.576,0S0.002,49.156,0.002,109.575   C0.002,169.995,49.157,219.151,109.576,219.151z M109.576,15c52.148,0,94.573,42.426,94.574,94.575   c0,52.149-42.425,94.575-94.574,94.576c-52.148-0.001-94.573-42.427-94.573-94.577C15.003,57.427,57.428,15,109.576,15z" />
                                    <path d="M94.861,156.507c2.929,2.928,7.678,2.927,10.606,0c2.93-2.93,2.93-7.678-0.001-10.608l-28.82-28.819l83.457-0.008   c4.142-0.001,7.499-3.358,7.499-7.502c-0.001-4.142-3.358-7.498-7.5-7.498l-83.46,0.008l28.827-28.825   c2.929-2.929,2.929-7.679,0-10.607c-1.465-1.464-3.384-2.197-5.304-2.197c-1.919,0-3.838,0.733-5.303,2.196l-41.629,41.628   c-1.407,1.406-2.197,3.313-2.197,5.303c0.001,1.99,0.791,3.896,2.198,5.305L94.861,156.507z" />
                                </g>
                            </svg>

                        </div>}
                    </div>}
                </div>
            </div>
    )
}

export default Signup;