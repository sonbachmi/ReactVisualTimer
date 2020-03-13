import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders demo container', () => {
  const { container } = render(<App />);
  const component  = container.querySelector('.VisualTimer');
  // expect(component).toBeInTheDocument();
  expect(component).toBeVisible();
});
