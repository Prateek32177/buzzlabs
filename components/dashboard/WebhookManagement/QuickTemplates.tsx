import {
  Database,
  CreditCard,
  Users,
  Github,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';

interface Template {
  id: string;
  title: string;
  icon: React.ReactNode;
  webhookName: string;
}

const templates: Template[] = [
  {
    id: 'supabase-signup',
    title: 'Supabase User Signup',
    icon: <Database className='h-4 w-4 stroke-[2px]' />,
    webhookName: 'Supabase New User Signup',
  },
  {
    id: 'clerk-signup',
    title: 'Clerk User Signup',
    icon: <Users className='h-4 w-4 stroke-[2px]' />,
    webhookName: 'Clerk New User Signup',
  },
  {
    id: 'stripe-subscribe',
    title: 'Stripe Subscription',
    icon: <CreditCard className='h-4 w-4 stroke-[2px]' />,
    webhookName: 'Stripe Subscription Created',
  },
  {
    id: 'github-slack',
    title: 'GitHub to Slack',
    icon: <Github className='h-4 w-4 stroke-[2px]' />,
    webhookName: 'GitHub to Slack Notifications',
  },
];

interface QuickTemplatesProps {
  onTemplateSelect: (webhookName: string) => void;
}
export function QuickTemplates({ onTemplateSelect }: QuickTemplatesProps) {
  return (
    <div className='flex flex-wrap gap-3 py-2 justify-start'>
      {templates.map(template => (
        <button
          key={template.id}
          onClick={() => onTemplateSelect(template.webhookName)}
          className='group flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/40 px-3.5 py-2 text-sm text-zinc-300 transition-all hover:border-zinc-600 hover:bg-zinc-700/40 hover:text-white shadow-sm backdrop-blur-sm'
        >
          <span className='text-zinc-400 group-hover:text-white'>
            {template.icon}
          </span>
          <span className='text-xs font-medium'>{template.title}</span>
          <ArrowUpRight className='w-4 h-4 stroke-[1.5px] text-zinc-500 group-hover:text-white' />
        </button>
      ))}
    </div>
  );
}
