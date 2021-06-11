import React from 'react';
import Providers from './src/AppNavigator';
import {store} from './src/redux';
import {Provider} from 'react-redux';

const App = () => {
  return (
    <Provider store={store}>
      <Providers />
    </Provider>
  );
};

export default App;
