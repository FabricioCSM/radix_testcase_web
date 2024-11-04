import React, { useState, ReactNode } from 'react';
import AppContext from './AppContext';

interface ProviderProps {
  children: ReactNode;
}

const Provider: React.FC<ProviderProps> = ({ children }) => {
  const [username, setUserName] = useState<string>('');


  const contextValue = {
    username,
    setUserName,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default Provider;
