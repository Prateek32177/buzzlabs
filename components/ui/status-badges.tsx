import { FC } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, Send, XCircle, LucideIcon } from 'lucide-react';

interface StatusBadgeProps {
  status: 'success' | 'pending' | 'delivered' | 'failed' | 'info';
  text?: string;
  icon?: LucideIcon;
  className?: string;
}

const statusConfig: Record<
  StatusBadgeProps['status'],
  {
    label: string;
    icon: LucideIcon;
    textColor: string;
    bgColor: string;
  }
> = {
  success: {
    label: 'Success',
    icon: CheckCircle,
    textColor: 'text-green-300',
    bgColor: 'bg-green-900/30 border border-green-600',
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    textColor: 'text-yellow-300',
    bgColor: 'bg-yellow-900/30 border border-yellow-600',
  },
  delivered: {
    label: 'Delivered',
    icon: Send,
    textColor: 'text-green-300',
    bgColor: 'bg-green-900/30 border border-green-600',
  },
  failed: {
    label: 'Failed',
    icon: XCircle,
    textColor: 'text-pink-300',
    bgColor: 'bg-pink-900/30 border border-pink-600',
  },
  info: {
    label: 'Info',
    icon: Send,
    textColor: 'text-indigo-300',
    bgColor: 'bg-indigo-900/30 border border-indigo-600',
  },
};

const StatusBadge: FC<StatusBadgeProps> = ({
  status,
  text,
  icon: CustomIcon,
  className,
}) => {
  const { label, icon: DefaultIcon, textColor, bgColor } = statusConfig[status];
  const Icon = CustomIcon || DefaultIcon;

  return (
    <div
      className={cn(
        'flex items-center gap-1 rounded-full px-3 py-1 shadow-sm backdrop-blur-sm capitalize text-xs justify-center align-middle ',
        textColor,
        bgColor,
        className,
      )}
    >
      <Icon className='w-3 h-3' />
      <span>{text || label}</span>
    </div>
  );
};

export default StatusBadge;
