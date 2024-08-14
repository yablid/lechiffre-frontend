// src/routes/Admin.tsx
import React, { FC } from 'react';
import Navbar from '../components/Navbar';
import UserRegistrationForm from "../components/UserRegistrationForm";
import BasicFormContainer from "../components/BasicFormContainer";

const Admin: FC = () => {
  return (
    <>
      <div>
        <div>
          <BasicFormContainer
            formComponent={<UserRegistrationForm />}
          />
        </div>
      </div>
    </>
  )
}

export default Admin;