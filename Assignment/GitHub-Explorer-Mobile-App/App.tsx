import React from 'react';
import Navigation from './src/navigation/Navigation';
import NoInternetConnection from './src/components/NoInternetConnection';

const App = () => {
  return (
    <>
      <NoInternetConnection />
      <Navigation />
    </>
  );
};

export default App;
