'use client';

import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '../../components/ToastContext';

export default function LeaderboardPage() {
  const { isConnected } = useAccount();
  const { addToast } = useToast();
  const { data: leaderboard, isLoading, isError } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => fetch('/api/tasks?userAddress=all').then((res) => res.json()),
  });

  if (!isConnected) {
    return (
      <p className="p-4 text-gray-700 dark:text-gray-300">
        Please connect your wallet to view the leaderboard.
      </p>
    );
  }

  if (isError) {
    return <p className="p-4 text-red-600">Error loading leaderboard.</p>;
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-2">
        <h1 className="text-2xl font-bold mb-2">Leaderboard</h1>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-8 bg-gray-200 rounded animate-pulse dark:bg-gray-700"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1">Rank</th>
              <th className="border px-2 py-1">User Address</th>
              <th className="border px-2 py-1">Tasks Completed</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard?.map((entry: any, idx: number) => (
              <tr
                key={entry.userAddress}
                className="even:bg-gray-100 transition-colors hover:bg-gray-200 dark:even:bg-gray-800 dark:hover:bg-gray-700"
              >
                <td className="border px-2 py-1 text-center">{idx + 1}</td>
                <td className="border px-2 py-1">{entry.userAddress}</td>
                <td className="border px-2 py-1 text-center">{entry.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}