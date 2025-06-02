'use client';

import { useAccount } from 'wagmi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../components/ToastContext';

const TASKS = [
  { id: 'plant-tree', title: 'Plant a virtual tree' },
  { id: 'recycle-pass', title: 'Complete recycling challenge' },
  { id: 'protect-species', title: 'Protect an endangered species' },
];

export default function ChallengesPage() {
  const { address, isConnected } = useAccount();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const { data: completions, isLoading, isError } = useQuery({
    queryKey: ['tasks', address],
    queryFn: () => fetch(`/api/tasks?userAddress=${address}`).then((res) => res.json()),
    enabled: isConnected,
  });
  const mutation = useMutation({
    mutationFn: (taskId: string) =>
      fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress: address, taskId }),
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', address] });
      addToast('Challenge completed', 'success');
    },
    onError: (error: any) => {
      addToast(error?.message || 'Failed to complete challenge', 'error');
    },
  });

  if (!isConnected) {
    return (
      <p className="p-4 text-gray-700 dark:text-gray-300">
        Please connect your wallet to view challenges.
      </p>
    );
  }

  if (isError) {
    return <p className="p-4 text-red-600">Error loading challenges.</p>;
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-2">
        <h1 className="text-2xl font-bold mb-2">Daily Challenges</h1>
        {TASKS.map((_, i) => (
          <div
            key={i}
            className="h-16 bg-gray-200 rounded-lg animate-pulse dark:bg-gray-700"
          />
        ))}
      </div>
    );
  }

  const completedIds = completions?.map((c: any) => c.taskId) || [];

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Daily Challenges</h1>
      {TASKS.map((task) => (
        <div
          key={task.id}
          className="p-4 border rounded-lg flex items-center justify-between"
        >
          <span>{task.title}</span>
          <button
            disabled={completedIds.includes(task.id) || mutation.isPending}
            onClick={() => mutation.mutate(task.id)}
            className="px-3 py-1 bg-green-600 text-white rounded transition-colors duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            {completedIds.includes(task.id) ? 'Completed' : 'Complete'}
          </button>
        </div>
      ))}
    </div>
  );
}