import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NimbusLogo } from '@/components/NimbusLogo';

describe('NimbusLogo', () => {
  it('renders an SVG with the Nimbus aria-label', () => {
    render(<NimbusLogo />);
    expect(screen.getByLabelText('Nimbus logo')).toBeInTheDocument();
  });

  it('applies a custom className', () => {
    render(<NimbusLogo className="w-12 h-12" />);
    const svg = screen.getByLabelText('Nimbus logo');
    expect(svg.getAttribute('class')).toContain('w-12 h-12');
  });

  it('defaults to w-8 h-8 when no className given', () => {
    render(<NimbusLogo />);
    const svg = screen.getByLabelText('Nimbus logo');
    expect(svg.getAttribute('class')).toContain('w-8 h-8');
  });

  it('has the role="img" attribute for accessibility', () => {
    render(<NimbusLogo />);
    expect(screen.getByRole('img', { name: /nimbus/i })).toBeInTheDocument();
  });
});
