import React, { useState } from 'react'
import './ChangePassword.scss'
import Navbar from '../../components/navbar/NavBar'

const ChangePassword = () => {

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    



    const handleChangePassword = () => {
        if(oldPassword === '' || newPassword === '' || confirmPassword === ''){
            alert('Please fill all the fields')
        }
        else if(newPassword !== confirmPassword){
            alert('New password and confirm password do not match')
        }
        else{
            console.log(oldPassword, newPassword, confirmPassword)
        }
    }



  return (
    <>
     <Navbar/>
     <div className='change-password'>
        <div className='change-password_cont'>
         <h1>Change Password</h1>
         <div className='change-password_cont_form'>
            <form>
                <label>Old Password</label>
                <input type='password' placeholder='Old Password' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                <label>New Password</label>
                <input type='password' placeholder='New Password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <label>Confirm Password</label>
                <input type='password' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <button type='submit' onClick={handleChangePassword}>Change Password</button>
            </form>
         </div>
        </div>
     </div>

    </>

        


  )
}

export default ChangePassword