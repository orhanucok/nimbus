import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BotAvatar } from '@/components/BotAvatar';

describe('BotAvatar', () => {
  it('renders emoji glyph when one is provided', () => {
    render(<BotAvatar glyph="🤖" name="Robo" />);
    expect(screen.getByLabelText('Robo avatar')).toBeInTheDocument();
    expect(screen.getByText('🤖')).toBeInTheDocument();
  });

  it('falls back to initials when glyph is not an emoji', () => {
    render(<BotAvatar glyph="X" name="Xavier" />);
    expect(screen.getByText('X')).toBeInTheDocument();
  });

  it('falls back to first letters of the name when glyph is empty', () => {
    render(<BotAvatar glyph="" name="Captain Hook" />);
    expect(screen.getByText('CA')).toBeInTheDocument();
  });
});
