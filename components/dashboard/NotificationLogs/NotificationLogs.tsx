'use client';

import { useEffect, useState, useCallback } from 'react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

type NotificationLog = {
  id: string;
  webhook_id: string;
  webhook_name: string;
  payload: any;
  status: 'processing' | 'success' | 'partial' | 'failed';
  error?: string;
  created_at: string;
  completed_at?: string;
  destination: string;
};

const statusColors = {
  processing: 'bg-yellow-100 text-yellow-800 ',
  success: 'bg-green-100 text-green-800',
  partial: 'bg-blue-100 text-blue-800',
  failed: 'bg-red-100 text-red-800',
};

const dummyData: NotificationLog[] = [
  {
    id: '1',
    webhook_id: 'wh_123',
    webhook_name: 'New User Registration',
    payload: { user_id: 'u_456', email: 'john@example.com' },
    status: 'success',
    created_at: '2023-05-15T10:30:00Z',
    completed_at: '2023-05-15T10:30:02Z',
    destination: 'https://api.example.com/webhooks/user',
  },
  {
    id: '2',
    webhook_id: 'wh_124',
    webhook_name: 'Order Confirmation',
    payload: { order_id: 'o_789', total: 99.99 },
    status: 'processing',
    created_at: '2023-05-15T11:45:00Z',
    destination: 'https://api.example.com/webhooks/order',
  },
  {
    id: '3',
    webhook_id: 'wh_125',
    webhook_name: 'Payment Failed',
    payload: { transaction_id: 't_101', amount: 50.0 },
    status: 'failed',
    error: 'Invalid card details',
    created_at: '2023-05-15T12:15:00Z',
    completed_at: '2023-05-15T12:15:05Z',
    destination: 'https://api.example.com/webhooks/payment',
  },
  {
    id: '4',
    webhook_id: 'wh_126',
    webhook_name: 'Subscription Renewal',
    payload: { subscription_id: 's_202', plan: 'premium' },
    status: 'partial',
    created_at: '2023-05-15T14:00:00Z',
    completed_at: '2023-05-15T14:00:10Z',
    destination: 'https://api.example.com/webhooks/subscription',
  },
  {
    id: '5',
    webhook_id: 'wh_123',
    webhook_name: 'New User Registration',
    payload: { user_id: 'u_456', email: 'john@example.com' },
    status: 'success',
    created_at: '2023-05-15T10:30:00Z',
    completed_at: '2023-05-15T10:30:02Z',
    destination: 'https://api.example.com/webhooks/user',
  },
  {
    id: '6',
    webhook_id: 'wh_124',
    webhook_name: 'Order Confirmation',
    payload: { order_id: 'o_789', total: 99.99 },
    status: 'processing',
    created_at: '2023-05-15T11:45:00Z',
    destination: 'https://api.example.com/webhooks/order',
  },
  {
    id: '7',
    webhook_id: 'wh_123',
    webhook_name: 'New User Registration',
    payload: { user_id: 'u_456', email: 'john@example.com' },
    status: 'success',
    created_at: '2023-05-15T10:30:00Z',
    completed_at: '2023-05-15T10:30:02Z',
    destination: 'https://api.example.com/webhooks/user',
  },
  {
    id: '8',
    webhook_id: 'wh_124',
    webhook_name: 'Order Confirmation',
    payload: { order_id: 'o_789', total: 99.99 },
    status: 'processing',
    created_at: '2023-05-15T11:45:00Z',
    destination: 'https://api.example.com/webhooks/order',
  },
  {
    id: '9',
    webhook_id: 'wh_123',
    webhook_name: 'New User Registration',
    payload: { user_id: 'u_456', email: 'john@example.com' },
    status: 'success',
    created_at: '2023-05-15T10:30:00Z',
    completed_at: '2023-05-15T10:30:02Z',
    destination: 'https://api.example.com/webhooks/user',
  },
  {
    id: '10',
    webhook_id: 'wh_124',
    webhook_name: 'Order Confirmation',
    payload: { order_id: 'o_789', total: 99.99 },
    status: 'processing',
    created_at: '2023-05-15T11:45:00Z',
    destination: 'https://api.example.com/webhooks/order',
  },
];

export function NotificationLogs() {
  const [logs, setLogs] = useState<NotificationLog[]>(dummyData);
  const [filteredLogs, setFilteredLogs] =
    useState<NotificationLog[]>(dummyData);
  const [timeFilter, setTimeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filterLogs = useCallback(() => {
    let filtered = [...logs];

    if (timeFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date(
        now.getTime() - Number.parseInt(timeFilter) * 24 * 60 * 60 * 1000,
      );
      filtered = filtered.filter(log => new Date(log.created_at) >= filterDate);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => log.status === statusFilter);
    }

    if (search) {
      filtered = filtered.filter(
        log =>
          log.webhook_name.toLowerCase().includes(search.toLowerCase()) ||
          log.destination.toLowerCase().includes(search.toLowerCase()),
      );
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  }, [timeFilter, statusFilter, search, logs]);

  useEffect(() => {
    filterLogs();
  }, [filterLogs]);

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const totalPages = Math.ceil(filteredLogs.length / rowsPerPage);

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Notification Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 mb-4'>
          <div className='flex-1'>
            <Input
              placeholder='Search webhook name or destination...'
              value={search}
              onChange={e => setSearch(e.target.value)}
              className='w-full'
            />
          </div>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className='w-full md:w-[180px]'>
              <SelectValue placeholder='Time period' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All time</SelectItem>
              <SelectItem value='1'>Last 24 hours</SelectItem>
              <SelectItem value='7'>Last 7 days</SelectItem>
              <SelectItem value='30'>Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='w-full md:w-[180px]'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All statuses</SelectItem>
              <SelectItem value='processing'>Processing</SelectItem>
              <SelectItem value='success'>Success</SelectItem>
              <SelectItem value='partial'>Partial</SelectItem>
              <SelectItem value='failed'>Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Webhook</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell>
                    {new Date(log.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>{log.webhook_name}</TableCell>
                  <TableCell className='max-w-xs truncate'>
                    {log.destination}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant='outline'
                      className={`capitalize ${statusColors[log.status]} `}
                    >
                      {log.status === 'failed' ? (
                        <AlertCircle className='w-4 h-4 mr-2' />
                      ) : (
                        <CheckCircle2 className='w-4 h-4 mr-2' />
                      )}
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className='flex space-x-2'>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant='outline' size='sm'>
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className='sm:max-w-[425px]'>
                          <DialogHeader>
                            <DialogTitle>
                              {log.webhook_name} Details
                            </DialogTitle>
                          </DialogHeader>
                          {log.error && (
                            <>
                              <p>Error</p>
                              <ScrollArea className='h-[200px] w-full rounded-md border p-4'>
                                <p className='text-sm text-red-600'>
                                  {log.error}
                                </p>
                              </ScrollArea>
                            </>
                          )}
                          <p>Payload</p>
                          <ScrollArea className='h-[200px] w-full rounded-md border p-4'>
                            <pre className='text-sm'>
                              {JSON.stringify(log.payload, null, 2)}
                            </pre>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className='flex items-center justify-between mt-4'>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={value => setRowsPerPage(Number(value))}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Rows per page' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='5'>5 rows</SelectItem>
              <SelectItem value='10'>10 rows</SelectItem>
              <SelectItem value='20'>20 rows</SelectItem>
              <SelectItem value='50'>50 rows</SelectItem>
            </SelectContent>
          </Select>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className='hover:cursor-default'
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  className='hover:cursor-default'
                  onClick={() =>
                    setCurrentPage(prev => Math.min(prev + 1, totalPages))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
}
