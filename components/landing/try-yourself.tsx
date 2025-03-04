'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Pickaxe,
  ArrowRight,
  Check,
  Copy,
  Eye,
  EyeOff,
  Mail,
  Play,
  Plus,
  Trash,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface Webhook {
  id: string;
  name: string;
  url: string;
  secretKey: string;
  isActive: boolean;
  notificationServices: {
    email: boolean;
    slack: boolean;
  };
}

const App = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-purple-950 to-slate-950 overflow-x-hidden'>
      <TryYourself />
    </div>
  );
};

export default App;

function TryYourself() {
  const [currentStep, setCurrentStep] = useState(1);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <section className='w-full py-24 relative overflow-hidden bg-zinc-900/60 rounded-xl p-6 border border-zinc-800 transition-all duration-500 hover:border-purple-400/30 hover:shadow-[0_0_15px_rgba(167,139,250,0.15)]'>
      {/* Background elements */}

      <div className='container max-w-6xl mx-auto px-4 relative z-10'>
        <div className='flex flex-col items-center mb-16'>
          <div className='inline-flex items-center justify-center rounded-full bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-300 ring-1 ring-inset ring-purple-500/20 mb-4'>
            <div
              className={`inline-flex items-center gap-2transition-all duration-700 opacity-100 translate-y-0`}
            >
              <Pickaxe className='w-4 h-4 mr-2' />
              <span className='text-sm font-medium'>Interactive Demo</span>
            </div>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className='text-4xl md:text-5xl font-bold text-center tracking-tight mb-4 text-white'
          >
            Try It yourself
          </motion.h2>
          <p className='text-purple-200/80 text-center max-w-2xl mx-auto text-lg'>
            Experience the power of our notification webhook infrastructure
            system with this interactive demo. Follow the steps below to create,
            manage, and test webhooks.
          </p>
        </div>

        {/* Step progress indicator */}
        <div className='flex justify-center mb-10'>
          <div className='flex items-center max-w-3xl w-full'>
            {[1, 2, 3, 4].map(step => (
              <div key={step} className='flex-1 flex items-center'>
                <motion.div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step === currentStep
                      ? 'bg-purple-500/30 border border-white/30 text-white shadow-lg shadow-purple-600/30'
                      : step < currentStep
                        ? 'bg-purple-500/60 border-white/30 text-white'
                        : 'bg-slate-800/10 border border-white/20 text-purple-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  {step < currentStep ? <Check className='h-5 w-5' /> : step}
                </motion.div>
                {step < 4 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      step < currentStep ? 'bg-purple-400' : 'bg-slate-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content container */}
        <div className='backdrop-blur-sm rounded-2xl p-6 md:p-8 max-w-5xl mx-auto border border-purple-500/20 shadow-xl '>
          <AnimatePresence mode='wait'>
            {currentStep === 1 && (
              <Step1WebhookCreation
                key='step1'
                webhooks={webhooks}
                setWebhooks={setWebhooks}
                goToNextStep={goToNextStep}
              />
            )}
            {currentStep === 2 && (
              <Step2WebhookManagement
                key='step2'
                webhooks={webhooks}
                setWebhooks={setWebhooks}
                goToNextStep={goToNextStep}
                goToPreviousStep={goToPreviousStep}
                setSelectedWebhook={setSelectedWebhook}
                setCurrentStep={setCurrentStep}
              />
            )}
            {currentStep === 3 && (
              <Step3ApplicationIntegration
                key='step3'
                webhooks={webhooks}
                selectedWebhook={selectedWebhook}
                setSelectedWebhook={setSelectedWebhook}
                selectedApp={selectedApp}
                setSelectedApp={setSelectedApp}
                selectedEvents={selectedEvents}
                setSelectedEvents={setSelectedEvents}
                goToNextStep={goToNextStep}
                goToPreviousStep={goToPreviousStep}
              />
            )}
            {currentStep === 4 && (
              <Step4WebhookTesting
                key='step4'
                webhooks={webhooks}
                selectedWebhook={selectedWebhook}
                selectedApp={selectedApp}
                selectedEvents={selectedEvents}
                goToPreviousStep={goToPreviousStep}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

interface Step1Props {
  webhooks: Webhook[];
  setWebhooks: React.Dispatch<React.SetStateAction<Webhook[]>>;
  goToNextStep: () => void;
}

function Step1WebhookCreation({
  webhooks,
  setWebhooks,
  goToNextStep,
}: Step1Props) {
  const [webhookName, setWebhookName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const generateWebhookUrl = () => {
    return `https://api.yourwebhookservice.com/webhook/${crypto.randomUUID()}`;
  };

  const generateSecretKey = () => {
    const array = new Uint32Array(4);
    crypto.getRandomValues(array);
    return Array.from(array, dec => dec.toString(36)).join('');
  };

  const handleCreateWebhook = () => {
    if (!webhookName.trim()) {
      setError('Please enter a webhook name');
      toast.error('Error', {
        description: 'Please enter a webhook name',
      });
      return;
    }

    if (webhooks.length >= 5) {
      setError('You can create a maximum of 5 webhooks');
      toast.error('Error', {
        description: 'You can create a maximum of 5 webhooks',
      });
      return;
    }

    const newWebhook: Webhook = {
      id: crypto.randomUUID(),
      name: webhookName,
      url: generateWebhookUrl(),
      secretKey: generateSecretKey(),
      isActive: true,
      notificationServices: {
        email: true,
        slack: true,
      },
    };

    setWebhooks([...webhooks, newWebhook]);
    setWebhookName('');
    setError(null);

    toast.success('Webhhok Created', {
      description: `${webhookName} has been created successfully.`,
    });

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleNext = () => {
    if (webhooks.length === 0) {
      setError('Please create at least one webhook before proceeding');
      toast.error('Error', {
        description: 'Please create at least one webhook before proceeding',
      });
      return;
    }
    goToNextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div className='text-center'>
        <h3 className='text-base md:text-2xl font-bold text-white mb-2'>
          Step 1: Create Your Webhook
        </h3>
        <p className='text-purple-200/70 mb-6'>Start by creating a webhook.</p>
      </div>

      <div className='p-6 max-w-lg mx-auto'>
        <div className='flex flex-col md:flex-row gap-4'>
          <Input
            ref={inputRef}
            placeholder='Enter webhook name'
            value={webhookName}
            onChange={e => setWebhookName(e.target.value)}
            className=' text-white h-10 bg-zinc-900/60 border border-zinc/30 placeholder:text-slate-400'
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleCreateWebhook();
              }
            }}
          />
          <Button
            onClick={handleCreateWebhook}
            className='bg-purple-500 hover:bg-purple-600 text-white transition-all duration-200'
          >
            <Plus className='mr-2 h-4 w-4' /> Create Webhook
          </Button>
        </div>

        {webhooks.length > 0 && (
          <div className='mt-8'>
            <h4 className='text-lg font-medium text-white mb-3'>
              Created Webhooks:
            </h4>
            <div className='space-y-3'>
              {webhooks.map((webhook, index) => (
                <motion.div
                  key={webhook.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className='border bg-zinc-900/60  rounded-lg p-4 flex justify-between items-center shadow-sm hover:shadow-md hover:border-purple-500/30 transition-all duration-200'
                >
                  <span className='text-white font-medium'>{webhook.name}</span>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20'>
                      Created
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className='flex justify-end mt-6'>
        <Button
          onClick={handleNext}
          className='bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200'
        >
          Next Step <ArrowRight className='ml-2 h-4 w-4' />
        </Button>
      </div>
    </motion.div>
  );
}

interface Step2Props {
  webhooks: Webhook[];
  setWebhooks: React.Dispatch<React.SetStateAction<Webhook[]>>;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  setSelectedWebhook: React.Dispatch<React.SetStateAction<Webhook | null>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

function Step2WebhookManagement({
  webhooks,
  setWebhooks,
  goToNextStep,
  goToPreviousStep,
  setSelectedWebhook,
  setCurrentStep,
}: Step2Props) {
  const [viewWebhook, setViewWebhook] = useState<Webhook | null>(null);
  const [deleteWebhook, setDeleteWebhook] = useState<Webhook | null>(null);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showCreateWebhook, setShowCreateWebhook] = useState(false);
  const [webhookName, setWebhookName] = useState('');

  const handleToggleStatus = (id: string) => {
    setWebhooks(
      webhooks.map(webhook =>
        webhook.id === id
          ? { ...webhook, isActive: !webhook.isActive }
          : webhook,
      ),
    );
  };

  const handleToggleNotification = (id: string, service: 'email' | 'slack') => {
    setWebhooks(
      webhooks.map(webhook =>
        webhook.id === id
          ? {
              ...webhook,
              notificationServices: {
                ...webhook.notificationServices,
                [service]: !webhook.notificationServices[service],
              },
            }
          : webhook,
      ),
    );
  };

  const generateWebhookUrl = () => {
    return `https://api.yourwebhookservice.com/webhook/${crypto.randomUUID()}`;
  };

  const generateSecretKey = () => {
    const array = new Uint32Array(4);
    crypto.getRandomValues(array);
    return Array.from(array, dec => dec.toString(36)).join('');
  };

  const handleCreateWebhook = () => {
    if (!webhookName.trim()) {
      toast.error('Please enter a webhook name');
      return;
    }

    const newWebhook: Webhook = {
      id: crypto.randomUUID(),
      name: webhookName,
      url: generateWebhookUrl(),
      secretKey: generateSecretKey(),
      isActive: true,
      notificationServices: {
        email: true,
        slack: true,
      },
    };

    setWebhooks([...webhooks, newWebhook]);
    setWebhookName('');
    setShowCreateWebhook(false);

    toast.success('Webhook Created', {
      description: `${webhookName} has been created successfully.`,
    });
  };

  const handleDeleteWebhook = () => {
    if (deleteWebhook) {
      const updatedWebhooks = webhooks.filter(
        webhook => webhook.id !== deleteWebhook.id,
      );
      setWebhooks(updatedWebhooks);
      setDeleteWebhook(null);
      if (viewWebhook?.id === deleteWebhook.id) {
        setViewWebhook(null);
      }

      toast('Webhook Deleted', {
        description: `${deleteWebhook.name} has been deleted.`,
      });

      // If no webhooks left, show the create webhook dialog or go back to step 1
      if (updatedWebhooks.length === 0) {
        setCurrentStep(1);
        toast.info('All webhooks deleted', {
          description: 'Create a new webhook to continue',
        });
      }
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);

    toast('Copied to clipboard', {
      description: type === 'url' ? 'Webhook URL copied' : 'Secret key copied',
    });
  };

  const handleNext = () => {
    if (webhooks.length > 0) {
      setSelectedWebhook(webhooks[0]);
      goToNextStep();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div className='text-center'>
        <h3 className='text-2xl font-bold text-white mb-2'>
          Step 2: Manage Your Webhooks
        </h3>
        <p className='text-purple-200/70 mb-6'>
          Configure and manage the webhooks you've created. Toggle status, set
          notification preferences, and more.
        </p>
      </div>

      {webhooks.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12 space-y-4'>
          <div className='text-purple-200/70 text-center'>
            <p className='mb-4'>You haven't created any webhooks yet.</p>
          </div>
          <Button
            onClick={() => setCurrentStep(1)}
            className='bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200'
          >
            <Plus className='mr-2 h-4 w-4' /> Go Back and Create a Webhook
          </Button>
        </div>
      ) : (
        <div className='space-y-4'>
          <div className='flex justify-end mb-4'>
            <Button
              onClick={() => setShowCreateWebhook(true)}
              variant='outline'
              className='border-purple-700/30 text-white bg-purple-900/10 hover:bg-purple-600/20 hover:text-purple-300 hover:border-purple-500/30 transition-colors duration-200'
            >
              <Plus className='mr-2 h-4 w-4' /> Add Webhook
            </Button>
          </div>
          {webhooks.map((webhook, index) => (
            <motion.div
              key={webhook.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className='bg-zinc-900/20 rounded-xl border border-purple-500/20 p-5 shadow-sm hover:shadow-md hover:border-purple-500/30 transition-all duration-200'
            >
              <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                <div className='flex items-center justify-between gap-4'>
                  <div className='flex-1'>
                    <h4 className='text-lg font-medium text-white'>
                      {webhook.name}
                    </h4>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Switch
                      checked={webhook.isActive}
                      onCheckedChange={() => handleToggleStatus(webhook.id)}
                      className='data-[state=checked]:bg-purple-600'
                    />
                    <span className='text-sm text-purple-200/70'>
                      {webhook.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className='flex flex-wrap md:flex-nowrap items-center gap-3'>
                  <div className='flex items-center space-x-4 border-slate-700 '>
                    <div className='flex items-center gap-2'>
                      <Mail
                        className={`h-4 w-4 ${webhook.notificationServices.email ? 'text-white' : 'text-slate-500'}`}
                      />
                      Email
                      <Switch
                        checked={webhook.notificationServices.email}
                        onCheckedChange={() =>
                          handleToggleNotification(webhook.id, 'email')
                        }
                        className='data-[state=checked]:bg-purple-600'
                      />
                    </div>

                    <div className='flex items-center gap-2'>
                      <svg
                        className={`h-4 w-4 ${webhook.notificationServices.slack ? 'text-white' : 'text-slate-500'}`}
                        viewBox='0 0 24 24'
                        fill='currentColor'
                      >
                        <path d='M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z' />
                      </svg>
                      Slack
                      <Switch
                        checked={webhook.notificationServices.slack}
                        onCheckedChange={() =>
                          handleToggleNotification(webhook.id, 'slack')
                        }
                        className='data-[state=checked]:bg-purple-600'
                      />
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <Button
                      variant='default'
                      size='sm'
                      onClick={() => setViewWebhook(webhook)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setDeleteWebhook(webhook)}
                    >
                      <Trash className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* View Webhook Modal */}
      <Dialog
        open={!!viewWebhook}
        onOpenChange={open => !open && setViewWebhook(null)}
      >
        <DialogContent className='bg-zinc-900/70 border-zinc-700 backdrop-blur-md border  text-white max-w-md mx-auto'>
          <DialogHeader>
            <DialogTitle className='text-xl text-white'>
              Webhook Details
            </DialogTitle>
          </DialogHeader>

          {viewWebhook && (
            <div className='space-y-5 py-4 max-h-[70vh] overflow-y-auto px-1'>
              <div className='space-y-2'>
                <Label className='text-purple-200/70'>Webhook Name</Label>
                <div className='p-3 rounded-md text-white border '>
                  {viewWebhook.name}
                </div>
              </div>

              <div className='space-y-2'>
                <Label className='text-purple-200/70'>Webhook URL</Label>
                <div className='p-3 rounded-md text-white border  flex justify-between items-center'>
                  <span className='truncate mr-2 font-mono text-sm'>
                    {viewWebhook.url}
                  </span>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => copyToClipboard(viewWebhook.url, 'url')}
                    className='text-purple-400 hover:text-purple-300 hover:bg-purple-600/20'
                  >
                    <Copy className='h-4 w-4' />
                    {copiedText === 'url' && (
                      <span className='ml-2 text-xs'>Copied!</span>
                    )}
                  </Button>
                </div>
              </div>

              <div className='space-y-2'>
                <Label className='text-purple-200/70'>Secret Key</Label>
                <div className=' p-3 rounded-md text-white border  flex justify-between items-center'>
                  <span className='truncate mr-2 font-mono text-sm'>
                    {showSecretKey
                      ? viewWebhook.secretKey
                      : '••••••••••••••••••••••'}
                  </span>
                  <div className='flex gap-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setShowSecretKey(!showSecretKey)}
                      className='text-purple-400 hover:text-purple-300 hover:bg-purple-600/20'
                    >
                      {showSecretKey ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() =>
                        copyToClipboard(viewWebhook.secretKey, 'key')
                      }
                      className='text-purple-400 hover:text-purple-300 hover:bg-purple-600/20'
                    >
                      <Copy className='h-4 w-4' />
                      {copiedText === 'key' && (
                        <span className='ml-2 text-xs'>Copied!</span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant='destructive'
              onClick={() => {
                setDeleteWebhook(viewWebhook);
                setViewWebhook(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Webhook Dialog */}
      <Dialog open={showCreateWebhook} onOpenChange={setShowCreateWebhook}>
        <DialogContent className='bg-zinc-900/70 border-zinc-700 backdrop-blur-md border  text-white max-w-md mx-auto'>
          <DialogHeader>
            <DialogTitle className='text-xl text-white'>
              Create New Webhook
            </DialogTitle>
            <DialogDescription className='text-purple-200/70'>
              Add a new webhook to your collection.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label className='text-purple-200/70'>Webhook Name</Label>
              <Input
                placeholder='Enter webhook name'
                value={webhookName}
                onChange={e => setWebhookName(e.target.value)}
                className='bg-zinc-900/70 border-zinc-700 backdrop-blur-md border  text-white  placeholder:text-slate-400'
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleCreateWebhook();
                  }
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowCreateWebhook(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateWebhook}
              className='bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200'
              disabled={!webhookName.trim()}
            >
              Create Webhook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteWebhook}
        onOpenChange={open => !open && setDeleteWebhook(null)}
      >
        <DialogContent className='bg-zinc-900/70 border backdrop-blur-md text-white max-w-md mx-auto'>
          <DialogHeader>
            <DialogTitle className='text-xl text-white'>
              Delete Webhook
            </DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            <p className='text-purple-200/70'>
              Are you sure you want to delete "{deleteWebhook?.name}"? This
              action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant='destructive' onClick={handleDeleteWebhook}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className='flex justify-between mt-6'>
        <Button onClick={goToPreviousStep}>
          <ArrowLeft className='mr-2 h-4 w-4' /> Previous
        </Button>
        <Button
          onClick={handleNext}
          className='bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200'
        >
          Next <ArrowRight className='ml-2 h-4 w-4' />
        </Button>
      </div>
    </motion.div>
  );
}

interface Step3Props {
  webhooks: Webhook[];
  selectedWebhook: Webhook | null;
  setSelectedWebhook: React.Dispatch<React.SetStateAction<Webhook | null>>;
  selectedApp: string | null;
  setSelectedApp: React.Dispatch<React.SetStateAction<string | null>>;
  selectedEvents: string[];
  setSelectedEvents: React.Dispatch<React.SetStateAction<string[]>>;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

// Application event options
const applicationEvents: Record<string, string[]> = {
  supabase: ['insert', 'update', 'delete', 'authentication', 'storage'],
  github: ['push', 'pull_request', 'fork', 'star', 'issue', 'release'],
  stripe: [
    'payment_succeeded',
    'payment_failed',
    'subscription_created',
    'subscription_updated',
    'refund_processed',
  ],
};

function Step3ApplicationIntegration({
  webhooks,
  selectedWebhook,
  setSelectedWebhook,
  selectedApp,
  setSelectedApp,
  selectedEvents,
  setSelectedEvents,
  goToNextStep,
  goToPreviousStep,
}: Step3Props) {
  const [error, setError] = useState<string | null>(null);

  const handleSelectWebhook = (webhookId: string) => {
    const webhook = webhooks.find(w => w.id === webhookId);
    if (webhook) {
      setSelectedWebhook(webhook);
    }
  };

  const handleSelectApp = (app: string) => {
    setSelectedApp(app);
    setSelectedEvents([]);
  };

  const handleToggleEvent = (event: string) => {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter(e => e !== event));
    } else {
      setSelectedEvents([...selectedEvents, event]);
    }
  };

  const handleNext = () => {
    if (!selectedApp) {
      setError('Please select an application');
      toast.error('Error', {
        description: 'Please select an application',
      });

      return;
    }

    if (selectedEvents.length === 0) {
      setError('Please select at least one event');
      toast.error('Error', {
        description: 'Please select at least one event',
      });

      return;
    }

    setError(null);
    goToNextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div className='text-center'>
        <h3 className='text-2xl font-bold text-white mb-2'>
          Step 3: Integrate with Applications
        </h3>
        <p className='text-purple-200/70 mb-6'>
          Connect your webhook to applications and select the events you want to
          trigger.
        </p>
      </div>

      <div className='space-y-6'>
        {/* Application Selection */}
        <div className='bg-purple-900/10 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 shadow-lg'>
          <h4 className='text-lg font-medium text-white mb-4'>
            1. Select an Application
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {['supabase', 'github', 'stripe'].map(app => (
              <motion.div
                key={app}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectApp(app)}
                className={`cursor-pointer p-4 rounded-lg border ${
                  selectedApp === app
                    ? 'bg-purple-600/20 border-purple-500 shadow-sm'
                    : 'bg-zinc-900/70 border-zinc-700 hover:border-purple-500/50'
                } flex items-center justify-between transition-all duration-200`}
              >
                <div className='flex items-center'>
                  <div className='w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mr-3 shadow-sm'>
                    {app === 'supabase' && (
                      <svg
                        viewBox='0 0 24 24'
                        className='w-6 h-6 text-emerald-500'
                        fill='currentColor'
                      >
                        <path d='M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66z' />
                      </svg>
                    )}
                    {app === 'github' && (
                      <svg
                        viewBox='0 0 24 24'
                        className='w-6 h-6 text-white'
                        fill='currentColor'
                      >
                        <path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' />
                      </svg>
                    )}
                    {app === 'stripe' && (
                      <svg
                        viewBox='0 0 24 24'
                        className='w-6 h-6 text-blue-500'
                        fill='currentColor'
                      >
                        <path d='M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z' />
                      </svg>
                    )}
                  </div>
                  <span className='text-white capitalize'>{app}</span>
                </div>
                {selectedApp === app && (
                  <Check className='h-5 w-5 text-purple-400' />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Webhook Selection */}
        <div className='bg-purple-900/10 backdrop-blur-md rounded-xl border border-purple-500/20 p-6 shadow-lg'>
          <h4 className='text-lg font-medium text-white mb-4'>
            2. Select a Webhook
          </h4>
          <Select
            value={selectedWebhook?.id}
            onValueChange={handleSelectWebhook}
            disabled={!selectedApp}
          >
            <SelectTrigger className='bg-zinc-900/70 border-zinc-700 hover:border-purple-500/50 text-white focus:ring-purple-500'>
              <SelectValue placeholder='Select a webhook' />
            </SelectTrigger>
            <SelectContent className='bg-zinc-900 border-slate-700 text-white'>
              {webhooks.map(webhook => (
                <SelectItem key={webhook.id} value={webhook.id}>
                  {webhook.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedWebhook && (
            <div className='mt-4 space-y-3'>
              <div className='bg-zinc-900/70 border-zinc-700 hover:border-purple-500/50 p-3 rounded-md border '>
                <Label className='text-purple-200/70 text-sm'>
                  Webhook URL
                </Label>
                <div className='text-white mt-1 font-mono text-sm truncate'>
                  {selectedWebhook.url}
                </div>
              </div>
              <div className='bg-zinc-900/70 border-zinc-700 hover:border-purple-500/50 p-3 rounded-md border '>
                <Label className='text-purple-200/70 text-sm'>Secret Key</Label>
                <div className='text-white mt-1 font-mono text-sm'>
                  ••••••••••••••••••••••
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Event Selection */}
        {selectedApp && (
          <div className='bg-zinc-900/70 border-zinc-700 hover:border-purple-500/50 rounded-xl border border-purple-500/20 p-6 shadow-lg'>
            <h4 className='text-lg font-medium text-white mb-4'>
              3. Select Events
            </h4>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
              {applicationEvents[selectedApp].map(event => (
                <div key={event} className='flex items-center space-x-2'>
                  <Checkbox
                    id={event}
                    checked={selectedEvents.includes(event)}
                    onCheckedChange={() => handleToggleEvent(event)}
                    className='data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600'
                  />
                  <label
                    htmlFor={event}
                    className='text-white cursor-pointer capitalize'
                  >
                    {event.replace(/_/g, ' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className='bg-red-900/30 border border-red-800/50 text-red-300 p-3 rounded-md'>
            {error}
          </div>
        )}
      </div>

      <div className='flex justify-between mt-6'>
        <Button onClick={goToPreviousStep}>
          <ArrowLeft className='mr-2 h-4 w-4' /> Previous
        </Button>
        <Button
          onClick={handleNext}
          className='bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200'
          disabled={
            !selectedApp || !selectedWebhook || selectedEvents.length === 0
          }
        >
          Create Integration <ArrowRight className='ml-2 h-4 w-4' />
        </Button>
      </div>
    </motion.div>
  );
}

interface Step4Props {
  webhooks: Webhook[];
  selectedWebhook: Webhook | null;
  selectedApp: string | null;
  selectedEvents: string[];
  goToPreviousStep: () => void;
}

function SlackIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='currentColor'
    >
      <path d='M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z' />
    </svg>
  );
}

function Step4WebhookTesting({
  webhooks,
  selectedWebhook,
  selectedApp,
  selectedEvents,
  goToPreviousStep,
}: Step4Props) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState<
    'email' | 'slack' | null
  >(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTriggerEvent = (event: string) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentEvent(event);

    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Show notification after a delay
    timeoutRef.current = setTimeout(() => {
      if (selectedWebhook?.notificationServices.email) {
        showGmailNotification(event);

        // Show slack notification after email if both are enabled
        if (selectedWebhook?.notificationServices.slack) {
          timeoutRef.current = setTimeout(() => {
            showSlackNotification(event);

            // Reset everything after animations
            timeoutRef.current = setTimeout(() => {
              setShowNotification(null);
              setIsAnimating(false);
              setCurrentEvent(null);
            }, 3000);
          }, 3000);
        } else {
          // Reset if only email is enabled
          timeoutRef.current = setTimeout(() => {
            setShowNotification(null);
            setIsAnimating(false);
            setCurrentEvent(null);
          }, 3000);
        }
      } else if (selectedWebhook?.notificationServices.slack) {
        // Show only slack notification
        showSlackNotification(event);

        // Reset after animation
        timeoutRef.current = setTimeout(() => {
          setShowNotification(null);
          setIsAnimating(false);
          setCurrentEvent(null);
        }, 3000);
      } else {
        // No notifications enabled
        setIsAnimating(false);
        setCurrentEvent(null);
      }
    }, 2000);
  };

  const showGmailNotification = (event: string) => {
    setShowNotification('email');

    toast.custom(
      () => (
        <div className='flex items-start gap-3 p-4 bg-white light:bg-zinc-900 rounded-lg shadow-md w-full'>
          <div className='flex-shrink-0'>
            <div className='h-10 w-10 bg-red-50 light:bg-white flex items-center justify-center p-2 rounded-full'>
              <Mail className='text-red-600 light:text-red-500 h-5 w-5' />
            </div>
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='font-medium text-gray-900 light:text-white'>
                  New Email from Webhook Service
                </p>
                <p className='text-gray-600 light:text-gray-300 text-sm mt-1'>
                  {selectedApp} {event.replace(/_/g, ' ')} event triggered
                </p>
                <p className='text-gray-500 light:text-gray-400 text-xs mt-2'>
                  Just now
                </p>
              </div>
            </div>
          </div>
          <button className='rounded-full p-1 hover:bg-gray-100 light:hover:bg-gray-800 transition-colors'>
            <X className='h-4 w-4 text-gray-500 light:text-gray-400' />
          </button>
        </div>
      ),
      {
        id: 'gmail-notification',
        duration: 5000,
        className:
          'p-0 bg-transparent border-none rounded-lg shadow-md max-w-sm',
        closeButton: true,
      },
    );
  };

  const showSlackNotification = (event: string) => {
    setShowNotification('slack');
    toast.custom(
      () => (
        <div className='flex items-start gap-3 p-4 bg-white light:bg-zinc-900 rounded-lg shadow-md w-full'>
          <div className='flex-shrink-0'>
            <div className='h-10 w-10 rounded bg-[#4A154B] light:bg-[#4A154B] flex items-center justify-center'>
              <SlackIcon className='text-white h-6 w-6' />
            </div>
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='font-medium text-gray-900 light:text-white'>
                  Slack Notification
                </p>
                <p className='text-gray-600 light:text-gray-300 text-sm mt-1'>
                  New {selectedApp} event: {event.replace(/_/g, ' ')}
                </p>
                <div className='flex items-center mt-2'>
                  <span className='inline-block h-2 w-2 rounded-full bg-green-500 mr-2'></span>
                  <p className='text-gray-500 light:text-gray-400 text-xs'>
                    Webhook Service • Just now
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button className='rounded-full p-1 hover:bg-gray-100 light:hover:bg-gray-800 transition-colors'>
            <X className='h-4 w-4 text-gray-500 light:text-gray-400' />
          </button>
        </div>
      ),
      {
        id: 'slack-notification',
        duration: 5000,
        className:
          'p-0 bg-transparent border-none rounded-lg shadow-md max-w-sm',
        closeButton: true,
      },
    );
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div className='text-center'>
        <h3 className='text-2xl font-bold text-white mb-2'>
          Step 4: Test Your Webhook
        </h3>
        <p className='text-purple-200/70 mb-6'>
          Trigger events and see your webhook in action with real-time
          notifications.
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Event Triggers */}
        <div className='bg-zinc-900/70 border-zinc-700 hover:border-purple-500/50 rounded-xl border  p-6 shadow-lg'>
          <h4 className='text-lg font-medium text-white mb-4'>
            Trigger Events
          </h4>

          {selectedApp && (
            <div className='space-y-3'>
              <div className=' p-3 rounded-md border bg-zinc-900/70 border-zinc-700 hover:border-purple-500/50'>
                <span className='text-purple-200/70 text-sm'>
                  Selected Application
                </span>
                <div className='text-white mt-1 font-medium capitalize'>
                  {selectedApp}
                </div>
              </div>

              <div className=' p-3 rounded-md border bg-zinc-900/70 border-zinc-700 hover:border-purple-500/50'>
                <span className='text-purple-200/70 text-sm'>
                  Selected Webhook
                </span>
                <div className='text-white mt-1 font-medium'>
                  {selectedWebhook?.name}
                </div>
              </div>

              <div className='space-y-3 mt-6'>
                <h5 className='text-white font-medium'>Available Events</h5>
                <div className='grid grid-cols-1 gap-3'>
                  {selectedEvents.map((event, index) => (
                    <motion.button
                      key={event}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTriggerEvent(event)}
                      disabled={isAnimating}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                        type: 'spring',
                        stiffness: 500,
                        damping: 25,
                      }}
                      className={`flex justify-between items-center px-4 py-3 rounded-lg border ${
                        currentEvent === event
                          ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                          : 'bg-zinc-900/70 border-zinc-700 hover:border-purple-500/50 text-white hover:bg-purple-600/10'
                      } transition-all duration-200`}
                    >
                      <span className='capitalize font-medium'>
                        {event.replace(/_/g, ' ')}
                      </span>
                      <div
                        className={`p-1.5 rounded-full ${currentEvent === event ? 'bg-purple-600/30' : 'bg-zinc-800'}`}
                      >
                        <Play
                          className={`h-3.5 w-3.5 ${currentEvent === event ? 'text-purple-300' : 'text-zinc-200/50'}`}
                        />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Animation Preview */}
        <div className='bg-zinc-900/70 border-zinc-700 hover:border-purple-500/50 rounded-xl border  p-6 relative overflow-hidden shadow-lg'>
          <h4 className='text-lg font-medium text-white mb-4'>Live Preview</h4>

          <div className='aspect-square bg-zinc-900/70 border-zinc-700 hover:border-purple-500/50 rounded-lg relative border shadow-inner'>
            {/* Application animation area */}
            <div className='absolute inset-0 flex items-center justify-center'>
              {!currentEvent ? (
                <div className='text-purple-200/70 text-center'>
                  <p>Trigger an event to see it in action</p>
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                  }}
                  className='w-full h-full flex items-center justify-center'
                >
                  {selectedApp === 'supabase' && (
                    <div className='relative w-4/5 max-w-md'>
                      <div className='bg-emerald-900/70 rounded-t-lg p-3'>
                        <div className='flex items-center'>
                          <div className='w-8 h-8 rounded-full bg-emerald-950 flex items-center justify-center mr-3'>
                            <svg
                              viewBox='0 0 24 24'
                              className='w-5 h-5 text-emerald-500'
                              fill='currentColor'
                            >
                              <path d='M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66z' />
                            </svg>
                          </div>
                          <span className='text-white font-medium'>
                            Supabase Database
                          </span>
                        </div>
                      </div>
                      <div className='bg-slate-900 p-4 rounded-b-lg border border-slate-700 border-t-0 shadow-lg'>
                        <div className='space-y-3'>
                          <div className='flex justify-between items-center'>
                            <span className='text-purple-200/70'>Event:</span>
                            <span className='text-purple-400 font-medium capitalize'>
                              {currentEvent}
                            </span>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-purple-200/70'>Table:</span>
                            <span className='text-white'>users</span>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-purple-200/70'>Status:</span>
                            <span className='text-emerald-500'>Success</span>
                          </div>
                          <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.5 }}
                            className='h-1 bg-purple-600 rounded-full mt-2'
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedApp === 'github' && (
                    <div className='relative w-4/5 max-w-md'>
                      <div className='bg-gray-900 rounded-t-lg p-3'>
                        <div className='flex items-center'>
                          <div className='w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-3'>
                            <svg
                              viewBox='0 0 24 24'
                              className='w-5 h-5 text-white'
                              fill='currentColor'
                            >
                              <path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' />
                            </svg>
                          </div>
                          <span className='text-white font-medium'>
                            GitHub Repository
                          </span>
                        </div>
                      </div>
                      <div className='bg-slate-900 p-4 rounded-b-lg border border-slate-700 border-t-0 shadow-lg'>
                        <div className='space-y-3'>
                          <div className='flex justify-between items-center'>
                            <span className='text-purple-200/70'>Event:</span>
                            <span className='text-purple-400 font-medium capitalize'>
                              {currentEvent?.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-purple-200/70'>
                              Repository:
                            </span>
                            <span className='text-white'>user/project</span>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-purple-200/70'>Status:</span>
                            <span className='text-emerald-500'>Triggered</span>
                          </div>
                          <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.5 }}
                            className='h-1 bg-purple-600 rounded-full mt-2'
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedApp === 'stripe' && (
                    <div className='relative w-4/5 max-w-md'>
                      <div className='bg-blue-900/80 rounded-t-lg p-3'>
                        <div className='flex items-center'>
                          <div className='w-8 h-8 rounded-full bg-blue-950 flex items-center justify-center mr-3'>
                            <svg
                              viewBox='0 0 24 24'
                              className='w-5 h-5 text-blue-500'
                              fill='currentColor'
                            >
                              <path d='M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z' />
                            </svg>
                          </div>
                          <span className='text-white font-medium'>
                            Stripe Payment
                          </span>
                        </div>
                      </div>
                      <div className='bg-slate-900 p-4 rounded-b-lg border border-slate-700 border-t-0 shadow-lg'>
                        <div className='space-y-3'>
                          <div className='flex justify-between items-center'>
                            <span className='text-purple-200/70'>Event:</span>
                            <span className='text-purple-400 font-medium capitalize'>
                              {currentEvent?.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-purple-200/70'>
                              Customer:
                            </span>
                            <span className='text-white'>cus_1234567890</span>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-purple-200/70'>Status:</span>
                            <span className='text-emerald-500'>Processed</span>
                          </div>
                          <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.5 }}
                            className='h-1 bg-purple-600 rounded-full mt-2'
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='flex justify-between mt-6'>
        <Button onClick={goToPreviousStep}>
          <ArrowLeft className='mr-2 h-4 w-4' /> Previous
        </Button>
        <Button
          className='bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200'
          onClick={() => window.location.reload()}
        >
          Start Over
        </Button>
      </div>
    </motion.div>
  );
}
