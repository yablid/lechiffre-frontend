// src/routes/Admin.tsx
import React, { FC } from 'react';
import Navbar from '../components/Navbar';
import AuthButton from '../components/AuthButton';
import UserRegistrationForm from "../components/UserRegistrationForm";
import BasicFormContainer from "../components/BasicFormContainer";

const Admin: FC = () => {
  return (
    <>
      <div>
        <Navbar username="fixthis"/>
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