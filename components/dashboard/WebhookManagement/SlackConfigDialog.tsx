import { useWebhook } from './WebhookContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SlackConfig } from './SlackConfig';

export function SlackConfigDialog() {
  const {
    webhooks,
    showSlackConfig,
    setShowSlackConfig,
    toggleWebhook,
    updateWebhookConfig,
    isLoadingId,
  } = useWebhook();

  if (!showSlackConfig) return null;

  const webhook = webhooks.find(w => w.id === showSlackConfig);
  if (!webhook) return null;

  return (
    <Dialog
      open={showSlackConfig !== null}
      onOpenChange={open => {
        if (!open) {
          if (!webhook.slack_config) {
            toggleWebhook(webhook.id, 'notifySlack');
          }
          setShowSlackConfig(null);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Slack Configuration</DialogTitle>
        </DialogHeader>
        <SlackConfig
          webhook={webhook}
          onUpdate={async config => {
            await updateWebhookConfig(showSlackConfig, {
              notify_slack: true,
              slack_config: config.slack_config,
            });
            setShowSlackConfig(null);
          }}
          onCancel={() => {
            if (!webhook.slack_config) {
              toggleWebhook(webhook.id, 'notifySlack');
            }
            setShowSlackConfig(null);
          }}
          isLoading={isLoadingId === showSlackConfig}
        />
      </DialogContent>
    </Dialog>
  );
}
