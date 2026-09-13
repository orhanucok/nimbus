import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar, type ChatSession } from '@/components/Sidebar';

const noop = () => {};

const baseProps = {
  open: true,
  onClose: noop,
  onNewChat: noop,
  onSelectChat: noop,
  chats: [] as ChatSession[],
  onChatsChange: noop,
};

describe('Sidebar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the Nimbus brand and new-chat button', () => {
    render(<Sidebar {...baseProps} />);
    expect(screen.getByText('Fisna')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /yeni sohbet/i })).toBeInTheDocument();
  });

  it('shows the empty state when there are no chats', () => {
    render(<Sidebar {...baseProps} />);
    expect(screen.getByText(/henüz sohbet yok/i)).toBeInTheDocument();
  });

  it('renders a list item for each chat', () => {
    const chats: ChatSession[] = [
      { id: '1', title: 'Python fibonacci', updatedAt: Date.now(), messages: [] },
      { id: '2', title: 'TypeScript generics', updatedAt: Date.now(), messages: [] },
    ];
    render(<Sidebar {...baseProps} chats={chats} />);
    expect(screen.getByText('Python fibonacci')).toBeInTheDocument();
    expect(screen.getByText('TypeScript generics')).toBeInTheDocument();
  });

  it('calls onNewChat when the new-chat button is clicked', () => {
    const onNewChat = vi.fn();
    render(<Sidebar {...baseProps} onNewChat={onNewChat} />);
    fireEvent.click(screen.getByRole('button', { name: /yeni sohbet/i }));
    expect(onNewChat).toHaveBeenCalledTimes(1);
  });

  it('calls onSelectChat when a chat row is clicked', () => {
    const onSelectChat = vi.fn();
    const chats: ChatSession[] = [
      { id: 'xyz', title: 'Test chat', updatedAt: Date.now(), messages: [] },
    ];
    render(<Sidebar {...baseProps} chats={chats} onSelectChat={onSelectChat} />);
    fireEvent.click(screen.getByText('Test chat'));
    expect(onSelectChat).toHaveBeenCalledWith('xyz');
  });
});
