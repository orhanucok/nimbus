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
    expect(screen.getByText('Nimbus')).toBeInTheDocument();
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

  it('shows a search input when there is at least one chat', () => {
    const chats: ChatSession[] = [
      { id: '1', title: 'Hello', updatedAt: Date.now(), messages: [] },
    ];
    render(<Sidebar {...baseProps} chats={chats} />);
    expect(screen.getByPlaceholderText(/ara/i)).toBeInTheDocument();
  });

  it('filters the list by the search query', () => {
    const chats: ChatSession[] = [
      { id: '1', title: 'Python fibonacci', updatedAt: Date.now(), messages: [] },
      { id: '2', title: 'TypeScript generics', updatedAt: Date.now(), messages: [] },
    ];
    render(<Sidebar {...baseProps} chats={chats} />);
    fireEvent.change(screen.getByPlaceholderText(/ara/i), {
      target: { value: 'python' },
    });
    expect(screen.getByText('Python fibonacci')).toBeInTheDocument();
    expect(screen.queryByText('TypeScript generics')).toBeNull();
  });

  it('shows a "no match" message when the search has no results', () => {
    const chats: ChatSession[] = [
      { id: '1', title: 'Hello', updatedAt: Date.now(), messages: [] },
    ];
    render(<Sidebar {...baseProps} chats={chats} />);
    fireEvent.change(screen.getByPlaceholderText(/ara/i), {
      target: { value: 'zzz' },
    });
    expect(screen.getByText(/eşleşme yok/i)).toBeInTheDocument();
  });

  it('removes a chat when the delete button is clicked', () => {
    const onChatsChange = vi.fn();
    const chats: ChatSession[] = [
      { id: '1', title: 'Doomed chat', updatedAt: Date.now(), messages: [] },
    ];
    render(<Sidebar {...baseProps} chats={chats} onChatsChange={onChatsChange} />);
    fireEvent.click(screen.getByRole('button', { name: /sohbeti sil/i }));
    expect(onChatsChange).toHaveBeenCalledWith([]);
  });
});
