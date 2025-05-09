import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders app with navigation', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  // Check if the app renders without crashing
  expect(document.querySelector('.App')).toBeInTheDocument();
});

test('renders home page by default', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  // Check if the home page content is rendered
  expect(document.querySelector('.home-container')).toBeInTheDocument();
});
