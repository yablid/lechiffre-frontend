/* src/App.tsx */
import React from 'react';
import '../index.css';
import '../App.css';
import LoginForm from '../components/auth/LoginForm';

const App: React.FC = () => {
  return (
    <div className="dark dark:bg-slate-800">
      <LoginForm />
    </div>
  );
};

export default App;
