import React, { useState } from 'react';
import './ResetPassword.scss';
import Navbar from '../../components/navbar/NavBar';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isFormValid, setIsFormValid] = useState(true);

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const handlePasswordValidation = () => {
        if (!newPassword || !confirmPassword) {
            setPasswordError('Both password fields are required');
            setIsFormValid(false);
        } else if (!validatePassword(newPassword)) {
            setPasswordError('Password must contain at least 8 characters, including uppercase, lowercase, number, and special character');
            setIsFormValid(false);
        } else if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match');
            setIsFormValid(false);
        } else {
            setPasswordError('');
            setIsFormValid(true);
        }
    };

    const handleNewPassword = (e) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handlePasswordValidation();  // Trigger validation before form submission
        if (isFormValid) {
            console.log('New Password:', newPassword);
            console.log('Confirm Password:', confirmPassword);
        }
    };

    return (
        <>
            <Navbar />
            <div className='reset-password'>
                <div className='reset-password_container'>
                    <h1>Reset Password</h1>
                    <form onSubmit={handleSubmit}>
                        <label>New Password</label>
                        <input
                            type='password'
                            placeholder='New Password'
                            value={newPassword}
                            onChange={handleNewPassword}
                        />
                        <label>Confirm Password</label>
                        <input
                            type='password'
                            placeholder='Confirm Password'
                            value={confirmPassword}
                            onChange={handleConfirmPassword}
                        />
                        {passwordError && <p className="error-message">{passwordError}</p>}
                        <button type='submit'>Reset Password</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
