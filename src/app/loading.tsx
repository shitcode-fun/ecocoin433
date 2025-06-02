export default function RootLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-2">
      <div
        className="h-8 w-8 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700"
        role="status"
        aria-label="Loading"
      />
      <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading...</p>
    </div>
  );
}