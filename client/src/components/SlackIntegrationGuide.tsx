import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Check, AlertCircle, CheckCircle2, Slack, Settings, Bell } from "lucide-react";
import { toast } from "sonner";

/**
 * Slack Integration Guide Component
 * 
 * Comprehensive guide for connecting OAAS to Slack workspace:
 * - Bot creation and setup
 * - Channel configuration
 * - Notification customization
 * - Troubleshooting
 * 
 * Design: Dark theme with code examples and step-by-step instructions
 */

interface CodeBlockProps {
  code: string;
  language: string;
}

function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-black rounded-lg overflow-hidden border border-accent/20">
      <div className="flex items-center justify-between px-4 py-2 bg-black/50 border-b border-accent/10">
        <span className="text-xs text-muted-foreground">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1 rounded bg-accent/10 hover:bg-accent/20 text-accent text-sm transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-foreground font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
  children,
}: {
  number: number;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm">
          {number}
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-foreground mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children && <div className="ml-12 space-y-4">{children}</div>}
    </div>
  );
}

export function SlackIntegrationGuide() {
  const [selectedNotificationType, setSelectedNotificationType] = useState("critical");

  const botSetupCode = `# Using OAAS CLI to create Slack bot
oaas slack-bot create \\
  --workspace-name "My Company" \\
  --channel "#alerts" \\
  --token xoxb-YOUR-BOT-TOKEN`;

  const webhookCode = `# Slack Webhook URL format
https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Test webhook with curl
curl -X POST -H 'Content-type: application/json' \\
  --data '{"text":"Test alert from OAAS"}' \\
  https://hooks.slack.com/services/YOUR/WEBHOOK/URL`;

  const notificationConfigCode = `{
  "notifications": {
    "critical": {
      "enabled": true,
      "channel": "#critical-alerts",
      "mention": "@critical-team",
      "throttle_minutes": 5
    },
    "warning": {
      "enabled": true,
      "channel": "#warnings",
      "mention": null,
      "throttle_minutes": 15
    },
    "info": {
      "enabled": false,
      "channel": "#info",
      "mention": null,
      "throttle_minutes": 60
    }
  }
}`;

  const customRuleCode = `# Create custom notification rule
oaas notification-rule create \\
  --name "High Error Rate Alert" \\
  --condition "error_rate > 5%" \\
  --channels "#alerts,#devops" \\
  --mention "@devops-team" \\
  --severity critical`;

  return (
    <div className="space-y-8">
      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card border border-border">
          <TabsTrigger value="setup" className="flex items-center gap-2">
            <Slack className="w-4 h-4" />
            <span className="hidden sm:inline">Bot Setup</span>
          </TabsTrigger>
          <TabsTrigger value="channels" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Channels</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>

        {/* Bot Setup Tab */}
        <TabsContent value="setup" className="space-y-6 mt-6">
          <Card className="bg-card border-border p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Create Slack Bot</h3>

            <div className="space-y-8">
              <StepCard
                number={1}
                title="Create a New Slack App"
                description="Go to api.slack.com and create a new app for your workspace"
              >
                <div className="bg-background/50 border border-border/50 rounded-lg p-4">
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li>1. Visit <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">api.slack.com/apps</a></li>
                    <li>2. Click "Create New App" → "From scratch"</li>
                    <li>3. Name: "OpsNexAI OAAS" (or your preferred name)</li>
                    <li>4. Select your Slack workspace</li>
                    <li>5. Click "Create App"</li>
                  </ol>
                </div>
              </StepCard>

              <StepCard
                number={2}
                title="Configure Bot Permissions"
                description="Add required scopes for the bot to send messages and manage channels"
              >
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Navigate to <span className="font-mono bg-background/50 px-2 py-1 rounded">OAuth & Permissions</span> and add these scopes:
                  </p>
                  <div className="bg-background/50 border border-border/50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm font-mono text-foreground">chat:write</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm font-mono text-foreground">channels:read</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm font-mono text-foreground">channels:manage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm font-mono text-foreground">users:read</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm font-mono text-foreground">incoming-webhook</span>
                    </div>
                  </div>
                </div>
              </StepCard>

              <StepCard
                number={3}
                title="Generate Bot Token"
                description="Copy your bot token from the OAuth & Permissions page"
              >
                <div className="bg-background/50 border border-border/50 rounded-lg p-4 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Look for <span className="font-semibold text-foreground">Bot User OAuth Token</span> (starts with <span className="font-mono">xoxb-</span>)
                  </p>
                  <div className="p-3 bg-black/50 rounded border border-accent/20 text-xs text-yellow-500 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Keep this token secret! Never commit it to version control.</span>
                  </div>
                </div>
              </StepCard>

              <StepCard
                number={4}
                title="Install Bot to Your Workspace"
                description="Authorize the bot to access your Slack workspace"
              >
                <div className="bg-background/50 border border-border/50 rounded-lg p-4">
                  <Button className="bg-accent text-accent-foreground hover:opacity-90">
                    Install to Workspace
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3">
                    You'll be redirected to Slack to authorize the bot permissions.
                  </p>
                </div>
              </StepCard>

              <StepCard
                number={5}
                title="Connect to OAAS"
                description="Add your bot token to OAAS settings"
              >
                <CodeBlock code={botSetupCode} language="bash" />
                <p className="text-xs text-muted-foreground">
                  Or paste your bot token in the OAAS dashboard under Settings → Integrations → Slack
                </p>
              </StepCard>
            </div>
          </Card>
        </TabsContent>

        {/* Channel Configuration Tab */}
        <TabsContent value="channels" className="space-y-6 mt-6">
          <Card className="bg-card border-border p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Configure Channels</h3>

            <div className="space-y-8">
              <StepCard
                number={1}
                title="Create Alert Channels"
                description="Set up dedicated Slack channels for different alert types"
              >
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-4">
                    We recommend creating separate channels for different alert severities:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-background/50 border border-red-500/20">
                      <p className="font-mono text-sm text-red-400">#critical-alerts</p>
                      <p className="text-xs text-muted-foreground mt-1">Production issues requiring immediate attention</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50 border border-yellow-500/20">
                      <p className="font-mono text-sm text-yellow-400">#warnings</p>
                      <p className="text-xs text-muted-foreground mt-1">Non-critical issues and warnings</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50 border border-blue-500/20">
                      <p className="font-mono text-sm text-blue-400">#info</p>
                      <p className="text-xs text-muted-foreground mt-1">Informational messages and summaries</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50 border border-accent/20">
                      <p className="font-mono text-sm text-accent">#oaas-logs</p>
                      <p className="text-xs text-muted-foreground mt-1">OAAS system logs and status updates</p>
                    </div>
                  </div>
                </div>
              </StepCard>

              <StepCard
                number={2}
                title="Invite Bot to Channels"
                description="Add the OAAS bot to each channel you want to receive alerts"
              >
                <div className="bg-background/50 border border-border/50 rounded-lg p-4 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    For each channel:
                  </p>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li>1. Open the channel in Slack</li>
                    <li>2. Click the channel name at the top</li>
                    <li>3. Go to "Members" tab</li>
                    <li>4. Click "Add members"</li>
                    <li>5. Search for "OpsNexAI OAAS" and add it</li>
                  </ol>
                </div>
              </StepCard>

              <StepCard
                number={3}
                title="Configure Channel Permissions"
                description="Set channel privacy and member access"
              >
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <p className="text-sm font-semibold text-foreground mb-2">For Critical Alerts Channel:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Make it private for sensitive information</li>
                      <li>• Limit to DevOps and on-call team members</li>
                      <li>• Enable notifications for all messages</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <p className="text-sm font-semibold text-foreground mb-2">For Info Channel:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Can be public for team visibility</li>
                      <li>• Allow read-only access for broader team</li>
                      <li>• Disable notifications to reduce noise</li>
                    </ul>
                  </div>
                </div>
              </StepCard>

              <StepCard
                number={4}
                title="Set Channel Topics"
                description="Add channel descriptions for clarity"
              >
                <div className="bg-background/50 border border-border/50 rounded-lg p-4 space-y-3">
                  <p className="text-sm text-muted-foreground mb-3">Example channel topics:</p>
                  <div className="space-y-2">
                    <div className="p-2 bg-black/50 rounded border border-accent/10 text-xs font-mono text-foreground">
                      Critical production alerts from OAAS. Requires immediate action.
                    </div>
                    <div className="p-2 bg-black/50 rounded border border-accent/10 text-xs font-mono text-foreground">
                      Non-critical alerts and warnings. Review during business hours.
                    </div>
                  </div>
                </div>
              </StepCard>
            </div>
          </Card>
        </TabsContent>

        {/* Notification Customization Tab */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card className="bg-card border-border p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Customize Notifications</h3>

            <div className="space-y-8">
              <StepCard
                number={1}
                title="Configure Alert Levels"
                description="Set up notification rules for different alert severities"
              >
                <CodeBlock code={notificationConfigCode} language="json" />
              </StepCard>

              <StepCard
                number={2}
                title="Set Throttling Rules"
                description="Prevent alert fatigue by throttling repeated alerts"
              >
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                    <p className="text-sm font-semibold text-foreground mb-3">Throttling Strategy for SMBs:</p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-accent">Critical:</span>
                        <span>5 minute throttle (immediate notification for new issues)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-accent">Warning:</span>
                        <span>15 minute throttle (batch similar warnings)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-accent">Info:</span>
                        <span>60 minute throttle (daily summary)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </StepCard>

              <StepCard
                number={3}
                title="Create Custom Rules"
                description="Define specific alert conditions and routing"
              >
                <CodeBlock code={customRuleCode} language="bash" />
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20 mt-4">
                  <p className="text-sm text-foreground font-semibold mb-2">Common Custom Rules for SMBs:</p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• High error rate (&gt;5%) → #critical-alerts + @devops-team</li>
                    <li>• Database connection failures → #critical-alerts + @database-team</li>
                    <li>• Memory usage &gt;80% → #warnings</li>
                    <li>• Slow API responses (&gt;2s) → #warnings</li>
                  </ul>
                </div>
              </StepCard>

              <StepCard
                number={4}
                title="Configure User Mentions"
                description="Set up automatic mentions for on-call team members"
              >
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                    <p className="text-sm text-muted-foreground mb-3">
                      Create Slack user groups for different teams:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="font-mono text-foreground">@critical-team</span>
                        <span className="text-muted-foreground">- On-call engineers</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="font-mono text-foreground">@devops-team</span>
                        <span className="text-muted-foreground">- Infrastructure team</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="font-mono text-foreground">@database-team</span>
                        <span className="text-muted-foreground">- Database specialists</span>
                      </div>
                    </div>
                  </div>
                </div>
              </StepCard>

              <StepCard
                number={5}
                title="Test Notifications"
                description="Verify your Slack integration is working correctly"
              >
                <div className="space-y-3">
                  <Button className="bg-accent text-accent-foreground hover:opacity-90">
                    Send Test Alert
                  </Button>
                  <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                    <p className="text-sm text-muted-foreground">
                      You should receive a test message in your configured alert channel within 30 seconds.
                    </p>
                  </div>
                </div>
              </StepCard>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Troubleshooting Section */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-xl font-bold text-foreground mb-6">Troubleshooting</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-background/50 border border-border/50">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              Bot not sending messages
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Verify bot token is correct in OAAS settings</li>
              <li>• Ensure bot is added to the target channel</li>
              <li>• Check channel permissions allow bot to post</li>
              <li>• Review bot scopes include chat:write</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-background/50 border border-border/50">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              Too many alerts (alert fatigue)
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Increase throttle times for warning/info levels</li>
              <li>• Create more specific alert rules</li>
              <li>• Use separate channels for different severity levels</li>
              <li>• Enable quiet hours to mute alerts during off-hours</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-background/50 border border-border/50">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              Missing alerts
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Check alert rules are enabled in OAAS</li>
              <li>• Verify notification channels are configured</li>
              <li>• Review alert conditions match your data</li>
              <li>• Check Slack workspace notification settings</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Best Practices Section */}
      <Card className="bg-accent/10 border-accent/20 p-6">
        <h3 className="text-xl font-bold text-foreground mb-6">Best Practices for SMBs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Start Simple
            </h4>
            <p className="text-sm text-muted-foreground">
              Begin with 2-3 critical alert channels, then expand as needed.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Use User Groups
            </h4>
            <p className="text-sm text-muted-foreground">
              Create Slack user groups for different teams and on-call rotations.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Monitor Metrics
            </h4>
            <p className="text-sm text-muted-foreground">
              Track alert volume and adjust rules to prevent fatigue.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Regular Reviews
            </h4>
            <p className="text-sm text-muted-foreground">
              Review and refine alert rules monthly with your team.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
