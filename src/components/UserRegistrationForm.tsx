import React, { useState } from 'react';
import api from '../api/default';
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

interface UserRegistrationFormProps {}

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState(50); // default to engineer

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      username,
      role_id: role,
    };
    try {
      const response = await api.post(
        `/users/register`,
        userData
      );
      console.log('User registered:', response.data);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem', marginBottom: '1rem' }}>
          <FormControl fullWidth variant="outlined">
            <TextField
              variant="outlined"
              label='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />
          </FormControl>
          <FormControl fullWidth variant="outlined">
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
        </Box>
      </form>
    </Box>
  );
};

export default UserRegistrationForm;
