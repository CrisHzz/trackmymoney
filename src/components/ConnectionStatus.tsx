'use client';

import { useOnlineStatus } from '@/lib/useOnlineStatus';
import { Cloud, Database, Wifi, WifiOff } from 'lucide-react';

export const ConnectionStatus = () => {
  const { isOnline, pendingCount } = useOnlineStatus();

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 transition-all duration-300">
      {isOnline ? (
        <>
          <Cloud className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-green-700 dark:text-green-400">
            Status: Live
          </span>
          <Wifi className="w-3 h-3 text-green-500" />
        </>
      ) : (
        <>
          <Database className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
            Status: Local
          </span>
          <WifiOff className="w-3 h-3 text-orange-500" />
          {pendingCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
              {pendingCount}
            </span>
          )}
        </>
      )}
    </div>
  );
}; 