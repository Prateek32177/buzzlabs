import { useWebhook } from './WebhookContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EmailConfig } from './EmailConfig';

export function EmailConfigDialog() {
  const {
    webhooks,
    showEmailConfig,
    setShowEmailConfig,
    updateWebhookConfig,
    isLoadingId,
  } = useWebhook();
  const webhook = showEmailConfig
    ? webhooks.find(w => w.id === showEmailConfig)
    : null;

  return (
    <Dialog
      open={showEmailConfig !== null}
      onOpenChange={open => {
        if (!open) setShowEmailConfig(null);
      }}
    >
      <DialogContent className='max-w-md max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Email Configuration</DialogTitle>
        </DialogHeader>
        {webhook && (
          <EmailConfig
            webhook={webhook}
            onUpdate={async config => {
              await updateWebhookConfig(showEmailConfig!, {
                notify_email: true,
                email_config: config.email_config,
              });
              setShowEmailConfig(null);
            }}
            onCancel={() => setShowEmailConfig(null)}
            isLoading={isLoadingId === showEmailConfig}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
