import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

import './index.css';

const container = document.querySelector('#app')!;
const root = createRoot(container);

root.render(
  <StrictMode>
    <App></App>
  </StrictMode>,
);
