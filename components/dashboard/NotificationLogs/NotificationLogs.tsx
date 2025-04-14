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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
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
  DialogFooter,
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
import {
  AlertCircle,
  CheckCircle2,
  Loader,
  Search,
  CalendarDays,
  FilterX,
  RefreshCw,
  Mail,
  MessageSquare,
  Clock,
  Inbox,
  FileJson,
  ArrowUpRight,
  SlackIcon,
} from 'lucide-react';
import Link from 'next/link';

type WebhookLogData = {
  id: string;
  webhook_id: string;
  webhook_name: string;
  platform: string;
  channel: string;
  status: 'success' | 'pending' | 'failed';
  payload: any;
  email_sent?: boolean;
  email_recipient?: string;
  slack_sent?: boolean;
  slack_channel?: string;
  error_message?: string;
  processed_at: Date;
};

const statusColors = {
  pending: 'bg-yellow-900/30 text-yellow-400 border-none ',
  success: 'text-green-400 bg-green-900/30 border-none',
  failed: 'bg-red-900/30 text-red-400 border-none',
};

const statusIcons = {
  pending: <Clock className='w-3.5 h-3.5 mr-1.5' />,
  success: <CheckCircle2 className='w-3.5 h-3.5 mr-1.5' />,
  failed: <AlertCircle className='w-3.5 h-3.5 mr-1.5' />,
};

export function NotificationLogs() {
  const [logs, setLogs] = useState<WebhookLogData[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<WebhookLogData[]>([]);
  const [timeFilter, setTimeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<WebhookLogData | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/logs`);
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      const data = await response.json();
      setLogs(data.logs);
      setFilteredLogs(data.logs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filterLogs = useCallback(() => {
    let filtered = [...logs];

    if (timeFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date(
        now.getTime() - Number.parseInt(timeFilter) * 24 * 60 * 60 * 1000,
      );
      filtered = filtered.filter(
        log => new Date(log.processed_at) >= filterDate,
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => log.status === statusFilter);
    }

    if (search) {
      filtered = filtered.filter(
        log =>
          log.webhook_name.toLowerCase().includes(search.toLowerCase()) ||
          log.webhook_id.toLowerCase().includes(search.toLowerCase()),
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

  const resetFilters = () => {
    setTimeFilter('all');
    setStatusFilter('all');
    setSearch('');
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d);
  };

  const openLogDetails = (log: WebhookLogData) => {
    setSelectedLog(log);
  };

  if (loading) {
    return (
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>
            Notification Logs
          </CardTitle>
          <CardDescription>
            View and manage your notification delivery history
          </CardDescription>
        </CardHeader>
        <CardContent className='flex items-center justify-center h-64'>
          <div className='flex flex-col items-center gap-4'>
            <Loader className='w-10 h-10 text-center animate-spin' />

            <p className=''>Loading notification logs...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>
            Notification Logs
          </CardTitle>
          <CardDescription>
            View and manage your notification delivery history
          </CardDescription>
        </CardHeader>
        <CardContent className='flex items-center justify-center h-64'>
          <div className='flex flex-col items-center gap-4'>
            <AlertCircle className='h-10 w-10 text-zinc-300' />
            <div className='text-center align-middle flex flex-col items-center'>
              <p className='text-zinc-300 font-medium mb-4'>{error}</p>
              <Button
                size={'sm'}
                onClick={fetchLogs}
                className='flex items-center gap-2'
              >
                <RefreshCw className='h-4 w-4' />
                Try again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <div className='flex justify-between items-start'>
          <div>
            <CardTitle className='text-2xl font-bold text-white'>
              Notification Logs
            </CardTitle>
            <CardDescription className=''>
              View and manage your notification delivery history
            </CardDescription>
          </div>
          <Button
            onClick={fetchLogs}
            variant='outline'
            size='sm'
            className='flex items-center gap-2 border-gray-700 hover:bg-gray-800 '
          >
            <RefreshCw className='h-4 w-4' />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          <div className='flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0'>
            <div className='flex-1 relative'>
              <Input
                placeholder='Search webhook name or ID...'
                value={search}
                onChange={e => setSearch(e.target.value)}
                className='w-full '
              />
            </div>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className='w-full md:w-[180px] '>
                <div className='flex items-center gap-2'>
                  <CalendarDays className='h-4 w-4 ' />
                  <SelectValue placeholder='Time period' />
                </div>
              </SelectTrigger>
              <SelectContent className=''>
                <SelectItem value='all' className=''>
                  All time
                </SelectItem>
                <SelectItem value='1' className=''>
                  Last 24 hours
                </SelectItem>
                <SelectItem value='7' className=''>
                  Last 7 days
                </SelectItem>
                <SelectItem value='30' className=''>
                  Last 30 days
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-full md:w-[180px]  '>
                <div className='flex items-center gap-2'>
                  <AlertCircle className='h-4 w-4 ' />
                  <SelectValue placeholder='Status' />
                </div>
              </SelectTrigger>
              <SelectContent className=''>
                <SelectItem value='all' className=''>
                  All statuses
                </SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='success'>Success</SelectItem>
                <SelectItem value='failed'>Failed</SelectItem>
              </SelectContent>
            </Select>
            {(search || timeFilter !== 'all' || statusFilter !== 'all') && (
              <Button
                variant='outline'
                onClick={resetFilters}
                className='flex items-center gap-2 '
              >
                <FilterX className='h-4 w-4' />
                Clear filters
              </Button>
            )}
          </div>

          {filteredLogs.length === 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Webhook</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
              <div className='flex flex-col items-center justify-center py-16 px-4 border-t border-gray-700'>
                <Inbox className='h-12 w-12 text-gray-600 mb-4' />
                <h3 className='text-lg font-medium  mb-1'>
                  No notification logs found
                </h3>
                <p className=' text-center max-w-md mb-6'>
                  {search || timeFilter !== 'all' || statusFilter !== 'all'
                    ? "Try adjusting your filters or search criteria to find what you're looking for."
                    : 'There are no notification logs recorded in the system yet.'}
                </p>
                {(search || timeFilter !== 'all' || statusFilter !== 'all') && (
                  <Button
                    variant='outline'
                    onClick={resetFilters}
                    className='flex items-center gap-2 '
                  >
                    <FilterX className='h-4 w-4' />
                    Clear all filters
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Webhook</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className='text-sm'>
                  {paginatedLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell className='  whitespace-nowrap'>
                        <div className='flex items-center gap-1.5'>
                          <span>{formatDate(log.processed_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/dashboard/webhooks/${log.webhook_id}`}
                          className='text-gray-300 hover:text-gray-100 hover:underline flex items-center gap-1.5 opacity-100 hover:opacity-80 transition-all'
                        >
                          {log.webhook_name}
                          <ArrowUpRight className='h-3.5 w-3.5' />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant='default' className='px-2 py-1 '>
                          {log.platform}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className='flex gap-2'>
                          {log.channel &&
                            log.channel.split(',').map((channel, index) => (
                              <Badge
                                key={index}
                                variant='secondary'
                                className='text-xs'
                              >
                                {channel.trim()}
                              </Badge>
                            ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={`capitalize flex items-center text-xs justify-center align-middle text-gray-300 ${statusColors[log.status]}`}
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-col gap-2'>
                          {log.email_sent && log.email_recipient && (
                            <Badge
                              variant='outline'
                              className='text-xs px-2.5 py-1.5 flex text-gray-300 items-center gap-1.5 bg-gray-500/20  border-gray-700 justify-center align-middle'
                            >
                              <Mail className='h-3.5 w-3.5' />
                              <span
                                className='truncate'
                                title={log.email_recipient}
                              >
                                {log.email_recipient}
                              </span>
                            </Badge>
                          )}
                          {log.slack_sent && log.slack_channel && (
                            <Badge
                              variant='outline'
                              className='text-xs px-2.5 py-1.5 flex text-gray-300 items-center gap-1.5 bg-gray-500/20  border-gray-700 justify-center align-middle'
                            >
                              <SlackIcon className='h-3.5 w-3.5' />
                              <span>{log.slack_channel}</span>
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex space-x-2'>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => openLogDetails(log)}
                              >
                                Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className='sm:max-w-[550px]'>
                              <ScrollArea className='h-[500px] w-full  overflow-auto'>
                                <DialogHeader>
                                  <DialogTitle className='text-xl font-semibold text-white flex items-center gap-2'>
                                    <Badge
                                      variant='outline'
                                      className={`capitalize ${
                                        log.status === 'success'
                                          ? 'bg-green-900/50 text-green-300 border-green-700'
                                          : log.status === 'failed'
                                            ? 'bg-red-900/50 text-red-300 border-red-700'
                                            : 'bg-yellow-900/50 text-yellow-300 border-yellow-700'
                                      }`}
                                    >
                                      {statusIcons[log.status]}
                                      {log.status}
                                    </Badge>
                                    {log.webhook_name}
                                  </DialogTitle>
                                </DialogHeader>

                                <div className='mt-4 space-y-6'>
                                  {/* Info Grid */}
                                  <div className='grid grid-cols gap-4'>
                                    <div className='min-w-0'>
                                      <p className='text-sm text-gray-400 mb-1'>
                                        Webhook ID
                                      </p>
                                      <p className='font-medium break-all'>
                                        {log.webhook_id}
                                      </p>
                                    </div>
                                    <div className='min-w-0'>
                                      <p className='text-sm text-gray-400 mb-1'>
                                        Processed At
                                      </p>
                                      <p className='font-medium'>
                                        {formatDate(log.processed_at)}
                                      </p>
                                    </div>
                                    <div className='grid grid-cols-2 gap-4'>
                                      <div className='min-w-0'>
                                        <p className='text-sm text-gray-400 mb-1'>
                                          Platform
                                        </p>
                                        <Badge
                                          variant='outline'
                                          className='bg-purple-900/50 text-purple-300 border-purple-700'
                                        >
                                          {log.platform}
                                        </Badge>
                                      </div>
                                      <div className='min-w-0'>
                                        <p className='text-sm text-gray-400 mb-1'>
                                          Channel
                                        </p>
                                        <Badge
                                          variant='secondary'
                                          className='bg-blue-900/50 text-blue-300 border-blue-700'
                                        >
                                          {log.channel}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Notification Details */}
                                  <div className='space-y-3'>
                                    <h4 className='font-medium text-white flex items-center gap-2'>
                                      <Mail className='h-4 w-4' />
                                      Notification Details
                                    </h4>
                                    <div className='space-y-2 bg-gray-800/30 p-4 rounded-md overflow-x-auto break-words'>
                                      {log.email_sent && (
                                        <div className='flex items-center text-sm text-gray-300'>
                                          <Mail className='h-4 w-4 mr-2 text-blue-400' />
                                          <span className='font-medium break-all'>
                                            Email sent to:{' '}
                                            <span className='font-medium'>
                                              {log.email_recipient}
                                            </span>
                                          </span>
                                        </div>
                                      )}
                                      {log.slack_sent && (
                                        <div className='flex items-center text-sm text-gray-300'>
                                          <svg
                                            className='h-4 w-4 mr-2 text-pink-400'
                                            viewBox='0 0 24 24'
                                            fill='currentColor'
                                          >
                                            <path d='...' />{' '}
                                            {/* You already have the path */}
                                          </svg>
                                          <span className='font-medium break-all'>
                                            Slack message sent to:{' '}
                                            <span className='font-medium'>
                                              {log.slack_channel}
                                            </span>
                                          </span>
                                        </div>
                                      )}
                                      {!log.email_sent && !log.slack_sent && (
                                        <p className='text-gray-400'>
                                          No notifications were delivered.
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Error Message */}
                                  {log.error_message && (
                                    <div className='space-y-3'>
                                      <h4 className='font-medium text-white flex items-center gap-2'>
                                        <AlertCircle className='h-4 w-4 text-red-400' />
                                        Error Details
                                      </h4>
                                      <ScrollArea className='h-[100px] w-full rounded-md border border-gray-700 bg-red-900/20 p-4'>
                                        <p className='text-red-300 font-medium'>
                                          {log.error_message}
                                        </p>
                                      </ScrollArea>
                                    </div>
                                  )}

                                  {/* Payload */}
                                  <div className='space-y-3 w-full'>
                                    <h4 className='font-medium text-white flex items-center gap-2'>
                                      <FileJson className='h-4 w-4' />
                                      Payload
                                    </h4>
                                    <ScrollArea className='h-[200px] w-full rounded-md border border-gray-700 p-4 bg-gray-800/20 overflow-auto'>
                                      <pre className='text-sm font-mono text-gray-200 whitespace-pre-wrap break-words'>
                                        {JSON.stringify(log.payload, null, 2)}
                                      </pre>
                                    </ScrollArea>
                                  </div>
                                </div>
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}

          {filteredLogs.length > 0 && (
            <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
              <div className='flex items-center gap-4  '>
                <div className='text-xs text-gray-400 whitespace-nowrap'>
                  Showing {(currentPage - 1) * rowsPerPage + 1}-
                  {Math.min(currentPage * rowsPerPage, filteredLogs.length)} of{' '}
                  {filteredLogs.length} logs
                </div>
                <Select
                  value={rowsPerPage.toString()}
                  onValueChange={value => setRowsPerPage(Number(value))}
                >
                  <SelectTrigger className='w-[110px] h-8'>
                    <SelectValue placeholder='Rows per page' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='5'>5 rows</SelectItem>
                    <SelectItem value='10'>10 rows</SelectItem>
                    <SelectItem value='20'>20 rows</SelectItem>
                    <SelectItem value='50'>50 rows</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        className={`hover:cursor-pointer  ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                        onClick={() =>
                          setCurrentPage(prev => Math.max(prev - 1, 1))
                        }
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageToShow = i + 1;
                      if (totalPages > 5) {
                        if (currentPage > 3) {
                          pageToShow = currentPage - 2 + i;
                        }
                        if (currentPage > totalPages - 2) {
                          pageToShow = totalPages - 4 + i;
                        }
                      }

                      if (pageToShow > 0 && pageToShow <= totalPages) {
                        return (
                          <PaginationItem key={pageToShow}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageToShow)}
                              isActive={currentPage === pageToShow}
                              className={
                                currentPage === pageToShow ? ' text-white' : ''
                              }
                            >
                              {pageToShow}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    <PaginationItem>
                      <PaginationNext
                        className={`hover:cursor-pointer  ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                        onClick={() =>
                          setCurrentPage(prev => Math.min(prev + 1, totalPages))
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
