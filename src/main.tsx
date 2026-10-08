import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import * as maplibregl from 'maplibre-gl';
import App from './App.tsx';
import './index.css';

// Ensure MapLibre Web Worker loads correctly in Vite dev and preview builds
if (typeof window !== 'undefined' && typeof maplibregl.setWorkerUrl === 'function') {
  maplibregl.setWorkerUrl('/maplibre/maplibre-gl-worker.mjs');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
