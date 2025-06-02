'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '../../components/ToastContext';

export default function ChatPage() {
  const { address, isConnected } = useAccount();
  const { addToast } = useToast();
  const { data: messages, isLoading, isError, refetch } = useQuery({
    queryKey: ['chat'],
    queryFn: () => fetch('/api/chat').then(res => res.json()),
    refetchInterval: 5000,
  });
  const [newMessage, setNewMessage] = useState('');
  const mutation = useMutation({
    mutationFn: () =>
      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress: address, message: newMessage }),
      }).then(res => res.json()),
    onSuccess: () => {
      setNewMessage('');
      refetch();
      addToast('Message sent', 'success');
    },
    onError: (error: any) => {
      addToast(error?.message || 'Failed to send message', 'error');
    },
  });

  if (!isConnected) {
    return (
      <p className="p-4 text-gray-700 dark:text-gray-300">
        Please connect your wallet to join the chat.
      </p>
    );
  }

  if (isError) {
    return <p className="p-4 text-red-600">Error loading messages.</p>;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Community Chat</h1>
      <div className="h-64 overflow-y-auto border p-2 space-y-2">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-1 p-2 border-b">
                <div className="h-4 bg-gray-200 rounded w-1/3 dark:bg-gray-700"></div>
                <div className="h-3 bg-gray-200 rounded w-full dark:bg-gray-700"></div>
              </div>
            ))
          : messages?.map((msg: any) => (
              <div key={msg._id} className="space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">{msg.userAddress}</p>
                <p>{msg.message}</p>
              </div>
            ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || !newMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {mutation.isPending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}