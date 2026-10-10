import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../app/App.jsx';

describe('App shell', () => {
  it('renders the landing page', () => {
    window.history.pushState({}, '', '/');
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open the playground/i })).toHaveAttribute(
      'href',
      '/playground/accordion',
    );
  });

  it('renders the components index at /components', () => {
    window.history.pushState({}, '', '/components');
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Components' })).toBeInTheDocument();
    expect(screen.getAllByText('Accordion').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Button').length).toBeGreaterThan(0);
  });

  it('renders component docs at /components/accordion', () => {
    window.history.pushState({}, '', '/components/accordion');
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Accordion' })).toBeInTheDocument();
    expect(screen.getByText('Props')).toBeInTheDocument();
    expect(screen.getByText('Usage')).toBeInTheDocument();
  });

  it('renders the theme page at /theme', () => {
    window.history.pushState({}, '', '/theme');
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Tokens')).toBeInTheDocument();
  });
});
