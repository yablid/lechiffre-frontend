/* src/components/UserRegistrationForm.tsx */
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Button from '@mui/material/Button';

interface UserRegistrationFormProps {}

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState(50); // default to engineer

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      username,
      role_id: role,
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/register`,
        userData
      );
      console.log('User registered:', response.data);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Username"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal" variant="outlined">
        <InputLabel>Role</InputLabel>
        <Select
          value={role}
          onChange={(e) => setRole(e.target.value as number)}
          label="Role"
        >
          <MenuItem value={30}>Supervisor</MenuItem>
          <MenuItem value={40}>Manager</MenuItem>
          <MenuItem value={50}>Engineer</MenuItem>
          <MenuItem value={90}>Guest</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" type="submit">Submit</Button>
    </form>
  );
};

export default UserRegistrationForm;
