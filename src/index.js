import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import './18n'

const queryClient = new QueryClient()
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  </QueryClientProvider>
);
