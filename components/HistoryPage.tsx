'use client';

import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { fetchHistory } from '@/lib/history/fetchHistory';
import { log } from 'console';
import { Timestamp } from 'firebase/firestore';
import { LogIn, Trash2, Plus, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ActivityLog {
  id: string;
  type: 'login' | 'logout' | 'create' | 'delete' | 'edit';
  action: string;
  actionBy: string;
  description: string;
  createdAt: Timestamp;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'login':
      return <LogIn className="w-4 h-4 text-green-600" />;
    case 'logout':
      return <LogIn className="w-4 h-4 text-gray-600 rotate-180" />;
    case 'create':
      return <Plus className="w-4 h-4 text-blue-600" />;
    case 'delete':
      return <Trash2 className="w-4 h-4 text-red-600" />;
    case 'edit':
      return <Clock className="w-4 h-4 text-amber-600" />;
    default:
      return <Clock className="w-4 h-4 text-gray-600" />;
  }
};

const getActivityBadge = (type: string) => {
  const styles: Record<string, string> = {
    login: 'bg-green-100 text-green-800',
    logout: 'bg-gray-100 text-gray-800',
    create: 'bg-blue-100 text-blue-800',
    delete: 'bg-red-100 text-red-800',
    edit: 'bg-amber-100 text-amber-800',
  };
  return styles[type] || styles.edit;
};

type FilterType = 'today' | 'yesterday' | 'week' | 'month' | 'all';

export function HistoryPage() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('today');
  const [historyData, setHistoryData] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchHistory();
        console.log('Fetched history data:', data.data);
        setHistoryData(data?.data || []);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    }

    loadHistory();
  }, []);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getFilteredLogs = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return historyData.filter((log) => {
      const d = log.createdAt.toDate();
      const logDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      
      switch (selectedFilter) {
        case 'today':
          return logDate.getTime() === today.getTime();
        case 'yesterday':
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          return logDate.getTime() === yesterday.getTime();
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return d.getTime() >= weekAgo.getTime();
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return d.getTime() >= monthAgo.getTime();
        case 'all':
          return true;
        default:
          return true;
      }
    });
  };

  const filteredLogs = getFilteredLogs();

  const filterButtons: { label: string; value: FilterType }[] = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last Week', value: 'week' },
    { label: 'Last Month', value: 'month' },
    { label: 'All', value: 'all' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Activity History</h1>
        <p className="text-gray-600 mt-2">Track all system activities and changes</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {filterButtons.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setSelectedFilter(value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedFilter === value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <Card className="border-gray-200">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 border-b border-gray-200">
              <TableRow>
                <TableHead className="text-gray-900 font-semibold">Type</TableHead>
                <TableHead className="text-gray-900 font-semibold">Action</TableHead>
                <TableHead className="text-gray-900 font-semibold">Action By</TableHead>
                <TableHead className="text-gray-900 font-semibold">Description</TableHead>
                <TableHead className="text-gray-900 font-semibold">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                <TableRow key={log.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActivityIcon(log.type)}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getActivityBadge(log.type)}`}>
                        {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">{log.action}</TableCell>
                  <TableCell className="font-medium text-gray-900">{log.actionBy}</TableCell>
                  <TableCell className="text-gray-700">{log.description}</TableCell>
                  <TableCell className="text-gray-600 text-sm">{formatTime(log.createdAt.toDate())}</TableCell>
                </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-gray-500">
                    No activity records found for the selected period.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
