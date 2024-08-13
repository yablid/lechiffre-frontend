// src/routes/Work.tsx
import { FC } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthProvider';

const Work: FC = () => {

  const { user } = useAuth();
  const username = user?.username || '';

  return (
    <div>
      <Navbar username={username}/>
    </div>
  )
}

export default Work;