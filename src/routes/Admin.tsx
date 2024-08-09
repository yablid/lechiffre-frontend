// src/routes/Admin.tsx
import React, { FC, useState } from 'react';
import Navbar from '../components/Navbar';
import AuthButton from '../components/AuthButton';
import UserRegistrationForm from "../components/UserRegistrationForm";
import BasicFormContainer from "../components/BasicFormContainer";

const handleFormSubmit = (username: string, role: number) => {
    console.log('Submitting username:', username);
    console.log('Submitting role:', role);
    // Handle form submission logic here
  };

const Admin: FC = () => {
  return (
    <>
      <div>
        <Navbar/>
      </div>
      <div>
        <div>
          <BasicFormContainer
            formComponent={<UserRegistrationForm />}
            toggleButton={<AuthButton label="Register User"/>}
          />
        </div>
      </div>
    </>
  )
}

export default Admin;