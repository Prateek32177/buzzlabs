'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type NotificationLog = {
  id: string;
  webhook_id: string;
  payload: any;
  status: 'processing' | 'success' | 'partial' | 'failed';
  error?: string;
  created_at: string;
  completed_at?: string;
};

export function NotificationLogs() {
  const [logs, setLogs] = useState<NotificationLog[]>([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const response = await fetch('/api/notification-logs');
    if (response.ok) {
      const data = await response.json();
      setLogs(data);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payload</TableHead>
              <TableHead>Error</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map(log => (
              <TableRow key={log.id}>
                <TableCell>
                  {new Date(log.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      log.status === 'success'
                        ? 'default'
                        : log.status === 'partial'
                          ? 'secondary'
                          : 'destructive'
                    }
                  >
                    {log.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <pre className='text-sm'>
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                </TableCell>
                <TableCell>{log.error}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
