import react, { useState, useEffect, useRef } from 'react'
import './signin.css'
import Timer from './timer'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const serverUrl = import.meta.env.VITE_SERVER_URL

function adminSign() {
  
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [loginMethod, setLoginMethod] = useState(sessionStorage.getItem('loginMethod') || 'password')
  const [otpSend, setOtpSend] = useState(sessionStorage.getItem('isOtpSend') || false)
  const [btnStart, setBtnStart] = useState(sessionStorage.getItem('btnStart') || false)
  const [disableResendBtn, setDisableResendbtn] = useState(true)
  const [errMsg, setErrMsg] = useState('')
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);



  const handleFormDataOnchange = (e) => {
    e.preventDefault()
    setErrMsg('')
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${serverUrl}/api/auth/signin`,{
        email:formData.email,
        password:formData.password
      },{
        withCredentials:true
      })
      if(response.status === 200){
        console.log(response.data.message);
        sessionStorage.removeItem('loginMethod')
        sessionStorage.removeItem('isOtpSend')
        sessionStorage.removeItem('otpStartTime')
        sessionStorage.removeItem('btnStart')
        navigate('/admin/dashboard')
      }
    } catch (error) {
      console.log('error from handleLogin', error || error.message)
    }

  }

  const handleOTPLogin = async (e) => {
    e.preventDefault()
    if (otp.join('').length < 6) {
      console.log('Invalid OTP or Missing digits');
      setErrMsg('Invalid OTP or Missing digits')
      return
    }

    try {
      const response = await axios.post(`${serverUrl}/api/auth/signin`,{
        email: formData.email,
        otp: otp.join(''),
      },{
        withCredentials:true
      })

      if(response.status === 200){
        console.log('Login Successfull')
        setErrMsg('')
        setDisableResendbtn(true)
        sessionStorage.removeItem('loginMethod')
        sessionStorage.removeItem('isOtpSend')
        sessionStorage.removeItem('otpStartTime')
        sessionStorage.removeItem('btnStart')
        navigate('/admin/dashboard')
      }
    } catch (error) {
      console.log('error while handleOTPLogin');
      setErrMsg('Invalid OTP or Missing digits')
      setOtp(["", "", "", "", "", ""])
    }

  }

  const handleCheckDoExist = async (e) => {
    e.preventDefault()
    sessionStorage.setItem('btnStart', true)
    sessionStorage.removeItem('otpStartTime')
    setBtnStart(true)
    try {
      const response = await axios.post(`${serverUrl}/api/auth/doExist`, {
        email: formData.email
      }, {
        withCredentials: true
      })
      if (response.status === 200) {
        console.log(response.data.message)
        sessionStorage.setItem('isOtpSend', true)
        setOtpSend(true)
        setDisableResendbtn(true)
        setErrMsg('')
      }


    } catch (error) {
      console.log('error while handleCheckDoExist', error || error.message)
      setErrMsg('Invalid email or you are not admin')
    }
  }

  const handleOTPResend = async () => {
    try {
      console.log(formData.email);

      const otpResend = await axios.post(`${serverUrl}/api/auth/generateOTP`, {
        email: formData.email
      }, {
        withCredentials: true
      })
      if (otpResend.status === 200) {
        console.log(otpResend.data.message)
        sessionStorage.setItem('isOtpSend', true)
        setOtpSend(true)
        setDisableResendbtn(true)
      }
    } catch (error) {
      console.log('error from handleotpResend', error || error.message);
    }
    finally {
      setErrMsg('')
      setOtpSend(false)
    }
  }


  function showPassword() {
    const passwordInput = document.getElementById('password')
    const checkbox = document.getElementById('showpassword');

    passwordInput.type = checkbox.checked ? "text" : "password"
  }



  const handleChange = (index, e) => {
    const value = e.target.value;
    if(index === 0 && value === '') setErrMsg('')
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
    sessionStorage.setItem('btnStart', false)
    setBtnStart(false)
  }


  return (

    <div className='loginpage-body'>
      <div className='login-floating'>
        <div className="login-leftside">
          {/* <img className='svg1' src="/assets/svg1.png" alt="illustration" /> */}
          <img className='svg1' src="/assets/bg.png" alt="illustration" />
        </div>
        <div className="login-rightside">
          <div className="login-container">
            <div className="login-header">
              <img className='login-logo' src="/assets/logo.png" alt="buy247" />
              <h1>
                Admin Login
              </h1>
              <p>
                Enter your credentials to login.
              </p>
            </div>
            <form className='login-form'>
              <div className="form-group">
                {otpSend ? <></> : <div className="form-icon">
                  <i >
                    <svg className='input-box-svg' xmlns="http://www.w3.org/2000/svg" xml:space="preserve" id="email" width="512" height="512" x="0" y="0" version="1.1" viewBox="0 0 512 512">
                      <path d="M448 384V141.8l-131.1 99.8L385 319l-2 2-78.9-69.6L256 288l-48.1-36.6L129 321l-2-2 68-77.4L64 142v242z"></path>
                      <path d="M439.7 128H72l184 139.9z"></path>
                    </svg>
                  </i>
                  <input
                    className="form-control email-box"
                    name="email"
                    placeholder="Email Address*"
                    required
                    type="email"
                    value={formData.email}
                    onChange={handleFormDataOnchange}
                  />
                  {errMsg && <p className='err-text'><svg className='err-svg' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                    <path d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#fff" d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"></path><path fill="#fff" d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"></path>
                  </svg>{errMsg}</p>}
                </div>}
              </div>
              <div className="form-group">
                {loginMethod === 'otp' ? <></> : <div className="form-icon">
                  <i>
                    <svg className='input-box-svg' xmlns="http://www.w3.org/2000/svg" xml:space="preserve" id="lock" width="512" height="512" x="0" y="0" version="1.1" viewBox="0 0 512 512">
                      <path d="M376 186h-20v-40c0-55-45-100-100-100S156 91 156 146v40h-20c-22.002 0-40 17.998-40 40v200c0 22.002 17.998 40 40 40h240c22.002 0 40-17.998 40-40V226c0-22.002-17.998-40-40-40zM256 368c-22.002 0-40-17.998-40-40s17.998-40 40-40 40 17.998 40 40-17.998 40-40 40zm62.002-182H193.998v-40c0-34.004 28.003-62.002 62.002-62.002 34.004 0 62.002 27.998 62.002 62.002v40z"></path>
                    </svg>
                  </i>
                  <input
                    id='password'
                    className="form-control password-box"
                    placeholder="Password"
                    required
                    type="password"
                    name='password'
                    value={formData.password}
                    onChange={handleFormDataOnchange}
                  />
                </div>}
              </div>
              <div className="form-group">
                {otpSend && <div className='otp-box'>
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
                }
                
                { errMsg && <p className='err-text err-text-otp'><svg className='err-svg' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                    <path d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#fff" d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"></path><path fill="#fff" d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"></path>
                  </svg>{errMsg}</p>}


                <div className="otp-timer">
                  {otpSend && <div className="timer">
                    <button onClick={() => {
                      handleOTPResend()
                      sessionStorage.setItem('btnStart', true)
                      sessionStorage.removeItem('otpStartTime')
                      setBtnStart(true)
                    }}
                      disabled={disableResendBtn}
                      className='resend-btn'
                      style={{
                        cursor: disableResendBtn ? "not-allowed" : "pointer",
                        opacity: disableResendBtn ? 0.6 : 1,
                      }}>
                      Resend OTP
                    </button>
                    <Timer btnStart={btnStart} onExpire={handleTimerExpiry} />
                  </div>}
                </div>
              </div>
              {loginMethod === 'otp' ? <></> : <div className="remember-forgot">
                <div className="checkbox-group" >
                  <input
                    onClick={showPassword}
                    id="showpassword"
                    type="checkbox"

                  />
                  <label htmlFor="showpassword">
                    Show Password
                  </label>
                </div>
                <a
                  className="forgot-link"
                  href="#"
                >
                  Forgot Password?
                </a>
              </div>}
              {otpSend && <button onClick={handleOTPLogin}
                className="login-btn"
                type="submit"
              >Submit
              </button>}
              {loginMethod === 'otp' ? <>
                {!otpSend && <button onClick={handleCheckDoExist}
                  className="login-btn"
                >Send OTP
                </button>}
              </> : <>
                <button onClick={handleLogin}
                  className="login-btn"
                >Continue
                </button>
              </>}
            </form>
            <p className='line-break'></p>
            <div className="otp-login">
              <button onClick={() => {
                if (loginMethod === 'otp') {
                  sessionStorage.setItem('loginMethod', 'password')
                  sessionStorage.setItem('isOtpSend', false)
                  sessionStorage.removeItem('otpStartTime')
                  setLoginMethod('password')
                  setOtpSend(false)
                  setErrMsg("")
                } else {
                  sessionStorage.setItem('loginMethod', 'otp')
                  sessionStorage.setItem('isOtpSend', false)
                  setLoginMethod('otp')
                  setErrMsg("")
                }
              }} className='otp-login-btn'>
                {loginMethod === 'otp' ? <>
                  <svg className='pass-svg' xmlns="http://www.w3.org/2000/svg" xml:space="preserve" id="lock" width="512" height="512" x="0" y="0" version="1.1" viewBox="0 0 512 512">
                    <path d="M376 186h-20v-40c0-55-45-100-100-100S156 91 156 146v40h-20c-22.002 0-40 17.998-40 40v200c0 22.002 17.998 40 40 40h240c22.002 0 40-17.998 40-40V226c0-22.002-17.998-40-40-40zM256 368c-22.002 0-40-17.998-40-40s17.998-40 40-40 40 17.998 40 40-17.998 40-40 40zm62.002-182H193.998v-40c0-34.004 28.003-62.002 62.002-62.002 34.004 0 62.002 27.998 62.002 62.002v40z"></path>
                  </svg>
                  <p>Password Login</p></> : <>
                  <svg className='mail-svg' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                    <path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"></path><path fill="#1e88e5" d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"></path><polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"></polygon><path fill="#c62828" d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"></path><path fill="#fbc02d" d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z"></path>
                  </svg>
                  <p>Gmail OTP Login</p></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>


  )
}

export default adminSign