import './App.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';
import userSessionStateReducer from './ReduxUtilities/userSessionSlice.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Redux store
const ReduxStore = configureStore({
  reducer: {
    userSessionState: userSessionStateReducer
  }
});
// QueryClient Instance
const queryClient = new QueryClient();
// 
createRoot(document.getElementById('root')).render(
  <>
    <Provider store={ReduxStore}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </>
);