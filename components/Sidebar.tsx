'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, MessageSquare, X, Menu } from 'lucide-react';
import FisnaLogo from './FisnaLogo';

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: number;
  messages: unknown[];
}

const STORAGE_KEY = 'fisna-chats';

export function loadChats(): ChatSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChatSession[]) : [];
  } catch {
    return [];
  }
}

export function saveChats(chats: ChatSession[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch {
    // quota / private mode — silently skip
  }
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  currentChatId?: string;
  chats: ChatSession[];
  onChatsChange: (chats: ChatSession[]) => void;
}

export function Sidebar({
  open,
  onClose,
  onNewChat,
  onSelectChat,
  currentChatId,
  chats,
  onChatsChange,
}: SidebarProps) {
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = chats.filter((c) => c.id !== id);
    onChatsChange(updated);
    saveChats(updated);
  };

  const handleSelect = (id: string) => {
    onSelectChat(id);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed md:sticky md:top-0 inset-y-0 left-0 z-50 w-72 bg-card border-r border-border
          flex flex-col h-screen transform transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${open ? '' : 'md:hidden'}`}
        aria-label="Sohbet geçmişi"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <FisnaLogo className="w-7 h-7" />
            <span className="font-semibold text-base">Fisna</span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="Menüyü kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New chat button */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="flex items-center gap-2 w-full px-3 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600
              hover:opacity-90 text-white rounded-lg transition-opacity font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Sohbet</span>
          </button>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto px-2">
          {chats.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">
                Henüz sohbet yok.
                <br />
                Bir mesaj yazınca otomatik kaydedilir.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {chats.map((chat) => {
                const isActive = currentChatId === chat.id;
                return (
                  <div
                    key={chat.id}
                    onClick={() => handleSelect(chat.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelect(chat.id);
                      }
                    }}
                    className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
                      transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring
                      ${isActive ? 'bg-accent' : 'hover:bg-accent/50'}`}
                  >
                    <MessageSquare className="w-4 h-4 shrink-0 text-muted-foreground" />
                    <span className="flex-1 truncate text-sm">{chat.title}</span>
                    <button
                      onClick={(e) => handleDelete(chat.id, e)}
                      className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100
                        p-1 hover:bg-destructive/20 rounded transition-opacity"
                      aria-label={`Sohbeti sil: ${chat.title}`}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border text-xs text-muted-foreground space-y-1">
          <p>Fisna · MIT licensed</p>
          <p className="opacity-70">100% unaffiliated with xAI</p>
        </div>
      </aside>
    </>
  );
}

// Floating menu button used in the chat header to open the sidebar on mobile.
export function SidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="md:hidden p-2 hover:bg-card rounded-lg transition-colors"
      aria-label="Menüyü aç"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}

export default Sidebar;
