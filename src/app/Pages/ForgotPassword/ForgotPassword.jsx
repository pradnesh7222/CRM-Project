import React from 'react'
import './ForgotPassword.scss'
import Navbar from '../../components/navbar/NavBar'
import { useState } from 'react'

const ForgotPassword = () => {


    const [email, setEmail] = useState('');
    const [OTP, setOTP] = useState('');
    
   

    const handleEmail = (e) => {
        setEmail(e.target.value);
        console.log(email);
    }

    const handleOTP = (e) => {
        setOTP(e.target.value);
        console.log(OTP);
    }
    

    
  return (
   <>
    <Navbar/>
    <div className='forgot-password'>
       <div className='forgot-password_container'>
        <h1>Forgot Something?</h1>
        <form>

            <label>Email</label>
            <div className='email-container'>
                <input type='email' placeholder='Email' value={email} onChange={handleEmail} />
                <button type='submit'>Send</button> 
            </div>

             <label>Enter the code sent to your email to reset your password</label>
             <div className='OTP-container'>
                <input type='text' placeholder='OTP' value={OTP} onChange={handleOTP} />
                <button type='submit'>Verify</button> 
             </div>
            
             {/* <button type='submit'>Reset Password</button> */}

            
        </form>
       </div>
    </div>
    </>
  )
}

export default ForgotPassword