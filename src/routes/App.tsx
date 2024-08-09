/* src/App.tsx */
import React from 'react';
import AuthButton from '../components/AuthButton';
import '../index.css';
import '../App.css';

const App: React.FC = () => {
  return (
    <div className="dark dark:bg-slate-800">
      <AuthButton onClick={() => console.log('clicked')} label="Login"/>
    </div>
  )
}

export default App;
