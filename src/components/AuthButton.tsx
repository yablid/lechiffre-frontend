/* src/components/AuthButton.tsx */
import React from 'react';
import Button from '@mui/material/Button';

interface AuthButtonProps {
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  label: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({ onClick = () => {}, label }) => {
  return (
    <Button variant="contained" color="primary" onClick={onClick}>
      {label}
    </Button>
  );
};

export default AuthButton;
