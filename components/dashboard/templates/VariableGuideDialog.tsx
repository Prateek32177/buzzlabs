import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

interface VariableGuide {
  name: string;
  description: string;
}

interface VariablesGuideDialogProps {
  variables?: VariableGuide[];
  example?: string;
}

export function VariablesGuideDialog({
  variables = [
    { name: 'eventName', description: 'Name of the triggered event' },
    { name: 'tableName', description: 'Database table name' },
    { name: 'recordId', description: 'ID of the affected record' },
    { name: 'timestamp', description: 'When the event occurred' },
    { name: 'userId', description: 'User ID of the new signup' },
    { name: 'email', description: 'Email of the new user' },
  ],
  example = `New Event: {{type}}
A new user (ID: {{record.id}}) has signed up with email {{record.email}}
Record table: {{table}}`,
  platform = 'email',
}: VariablesGuideDialogProps & { platform?: 'email' | 'slack' }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='flex items-center gap-2 text-xs sm:text-sm'
          size={'sm'}
        >
          <HelpCircle className='h-4 w-4' />
          Variables Guide
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-sm rounded-md'>
        <DialogHeader>
          <DialogTitle>How to Use Dynamic Variables</DialogTitle>
          <DialogDescription>
            Use variables to personalize your {platform} templates
          </DialogDescription>
        </DialogHeader>
        <div className='py-4 text-sm'>
          <h3 className='font-medium mb-2'>Variable Format</h3>
          <p className='mb-4'>
            Insert variables using double curly braces:{' '}
            <code>{'{{variableName}}'}</code>
          </p>

          <h3 className='font-medium mb-2'>Common Variables</h3>
          <ul className='space-y-2 list-disc pl-5'>
            {variables.map(variable => (
              <li key={variable.name}>
                <code>{`{{${variable.name}}}`}</code> - {variable.description}
              </li>
            ))}
          </ul>

          <h3 className='font-medium mt-4 mb-2'>Example</h3>
          <pre className='bg-green-900/30 border border-green-900/80 p-4 rounded text-xs text-wrap'>
            {example}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}
