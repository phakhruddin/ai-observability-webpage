import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Copy, Check, Cloud, Boxes, Container, Slack } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

/**
 * OAAS Integration Guides
 * 
 * Comprehensive documentation for integrating OAAS with:
 * - AWS CloudWatch
 * - Kubernetes
 * - Container logs (Docker, etc.)
 * - Slack notifications
 * 
 * Design: Dark theme with teal accents, code-focused aesthetic
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
      <pre className="p-4 overflow-x-auto text-sm text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function IntegrationGuides() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="pt-32 pb-12 px-4 border-b border-accent/10">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Integration Guides</h1>
          <p className="text-xl text-muted-foreground">
            Get OAAS up and running in minutes. Choose your log source and follow the step-by-step guide.
          </p>
        </div>
      </section>

      {/* Integration Options */}
      <section className="py-12 px-4">
        <div className="container max-w-4xl mx-auto">
          <Tabs defaultValue="cloudwatch" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="cloudwatch" className="flex items-center gap-2">
                <Cloud className="w-4 h-4" />
                <span className="hidden sm:inline">CloudWatch</span>
              </TabsTrigger>
              <TabsTrigger value="kubernetes" className="flex items-center gap-2">
                <Boxes className="w-4 h-4" />
                <span className="hidden sm:inline">Kubernetes</span>
              </TabsTrigger>
              <TabsTrigger value="containers" className="flex items-center gap-2">
                <Container className="w-4 h-4" />
                <span className="hidden sm:inline">Containers</span>
              </TabsTrigger>
              <TabsTrigger value="slack" className="flex items-center gap-2">
                <Slack className="w-4 h-4" />
                <span className="hidden sm:inline">Slack</span>
              </TabsTrigger>
            </TabsList>

            {/* CloudWatch Integration */}
            <TabsContent value="cloudwatch" className="space-y-6">
              <Card className="p-6 bg-card border-accent/20">
                <h2 className="text-2xl font-bold mb-4">AWS CloudWatch Integration</h2>
                <p className="text-muted-foreground mb-6">
                  Connect your CloudWatch log groups to OAAS for AI-powered log analysis and alerting.
                </p>

                <div className="space-y-6">
                  {/* Step 1 */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-background font-bold">1</span>
                      Create IAM User
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Create an IAM user with CloudWatch Logs read permissions for OAAS to access your logs.
                    </p>
                    <CodeBlock
                      language="json"
                      code={`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams",
        "logs:GetLogEvents",
        "logs:FilterLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}`}
                    />
                  </div>

                  {/* Step 2 */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-background font-bold">2</span>
                      Add AWS Credentials to OAAS
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Go to OAAS Settings → Integrations → CloudWatch and enter your AWS credentials.
                    </p>
                    <div className="bg-black/50 p-4 rounded-lg border border-accent/20">
                      <p className="text-sm text-muted-foreground mb-3">Required fields:</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="text-accent">•</span>
                          AWS Access Key ID
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-accent">•</span>
                          AWS Secret Access Key
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-accent">•</span>
                          AWS Region (e.g., us-east-1)
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-background font-bold">3</span>
                      Select Log Groups
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Choose which CloudWatch log groups to monitor. OAAS will start analyzing logs in real-time.
                    </p>
                    <CodeBlock
                      language="bash"
                      code={`# Example log groups to monitor:
/aws/lambda/my-function
/aws/ecs/my-service
/aws/rds/my-database
/aws/api-gateway/my-api`}
                    />
                  </div>

                  {/* Step 4 */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-background font-bold">4</span>
                      Configure Slack Notifications
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Connect your Slack workspace to receive AI-powered log summaries and alerts.
                    </p>
                    <Button
                      onClick={() => setLocation("/contact")}
                      className="bg-accent hover:bg-accent/90 text-background"
                    >
                      Connect Slack <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Kubernetes Integration */}
            <TabsContent value="kubernetes" className="space-y-6">
              <Card className="p-6 bg-card border-accent/20">
                <h2 className="text-2xl font-bold mb-4">Kubernetes Integration</h2>
                <p className="text-muted-foreground mb-6">
                  Deploy OAAS agent to your Kubernetes cluster to collect and analyze container logs.
                </p>

                <div className="space-y-6">
                  {/* Step 1 */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-background font-bold">1</span>
                      Create OAAS API Token
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Generate an API token from your OAAS dashboard to authenticate the agent.
                    </p>
                    <CodeBlock
                      language="bash"
                      code={`# Get your API token from OAAS Dashboard
# Settings → API Tokens → Create New Token

export OAAS_API_TOKEN="your-api-token-here"`}
                    />
                  </div>

                  {/* Step 2 */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-background font-bold">2</span>
                      Deploy OAAS Agent
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Deploy the OAAS agent as a DaemonSet to collect logs from all nodes.
                    </p>
                    <CodeBlock
                      language="yaml"
                      code={`apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: oaas-agent
  namespace: kube-system
spec:
  selector:
    matchLabels:
      app: oaas-agent
  template:
    metadata:
      labels:
        app: oaas-agent
    spec:
      containers:
      - name: oaas-agent
        image: opsnexai/oaas-agent:latest
        env:
        - name: OAAS_API_TOKEN
          valueFrom:
            secretKeyRef:
              name: oaas-credentials
              key: api-token
        - name: OAAS_ENDPOINT
          value: "https://api.opsnexai.com"
        volumeMounts:
        - name: varlog
          mountPath: /var/log
        - name: varlibdockercontainers
          mountPath: /var/lib/docker/containers
      volumes:
      - name: varlog
        hostPath:
          path: /var/log
      - name: varlibdockercontainers
        hostPath:
          path: /var/lib/docker/containers`}
                    />
                  </div>

                  {/* Step 3 */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-background font-bold">3</span>
                      Create Secret
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Store your API token as a Kubernetes secret for secure access.
                    </p>
                    <CodeBlock
                      language="bash"
                      code={`kubectl create secret generic oaas-credentials \\
  --from-literal=api-token=YOUR_API_TOKEN \\
  -n kube-system`}
                    />
                  </div>

                  {/* Step 4 */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-background font-bold">4</span>
                      Verify Deployment
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Check that the OAAS agent is running on all nodes.
                    </p>
                    <CodeBlock
                      language="bash"
                      code={`# Check agent status
kubectl get daemonset -n kube-system oaas-agent

# View agent logs
kubectl logs -n kube-system -l app=oaas-agent --tail=50

# Expected output: Agent connected and collecting logs`}
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Container Integration */}
            <TabsContent value="containers" className="space-y-6">
              <Card className="p-6 bg-card border-accent/20">
                <h2 className="text-2xl font-bold mb-4">Container Logs Integration</h2>
                <p className="text-muted-foreground mb-6">
                  Collect logs from Docker containers, Docker Compose, or container orchestration platforms.
                </p>

                <div className="space-y-6">
                  {/* Step 1 */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-background font-bold">1</span>
                      Install OAAS Collector
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Install the OAAS log collector on your host machine or as a container.
                    </p>
                    <CodeBlock
                      language="bash"
                      code={`# Install via Docker
docker run -d \\
  --name oaas-collector \\
  -e OAAS_API_TOKEN=your-api-token \\
  -v /var/run/docker.sock:/var/run/docker.sock \\
  opsnexai/oaas-collector:latest`}
                    />
                  </div>

                  {/* Step 2 */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-background font-bold">2</span>
                      Configure Docker Logging Driver
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Update your Docker daemon configuration to send logs to OAAS.
                    </p>
                    <CodeBlock
                      language="json"
                      code={`{
  "log-driver": "json-file",
  "log-opts": {
    "labels": "service,environment",
    "max-size": "10m",
    "max-file": "3"
  }
}`}
                    />
                  </div>

                  {/* Step 3 */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-background font-bold">3</span>
                      Docker Compose Setup
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Add OAAS collector service to your Docker Compose file.
                    </p>
                    <CodeBlock
                      language="yaml"
                      code={`version: '3.8'

services:
  oaas-collector:
    image: opsnexai/oaas-collector:latest
    environment:
      OAAS_API_TOKEN: \${OAAS_API_TOKEN}
      OAAS_ENDPOINT: https://api.opsnexai.com
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    restart: always

  my-app:
    image: my-app:latest
    environment:
      SERVICE_NAME: my-app
      ENVIRONMENT: production
    depends_on:
      - oaas-collector`}
                    />
                  </div>

                  {/* Step 4 */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-background font-bold">4</span>
                      Verify Log Collection
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Check that logs are being collected and sent to OAAS.
                    </p>
                    <CodeBlock
                      language="bash"
                      code={`# Check collector status
docker logs oaas-collector

# View collected containers
docker ps --filter label=service

# Expected: Logs appearing in OAAS dashboard within 1-2 minutes`}
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Slack Integration */}
            <TabsContent value="slack" className="space-y-6">
              <Card className="p-6 bg-card border-accent/20">
                <h2 className="text-2xl font-bold mb-4">Slack Integration</h2>
                <p className="text-muted-foreground mb-6">
                  Connect OAAS to your Slack workspace for real-time alerts and notifications.
                </p>
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-background flex items-center gap-2"
                  onClick={() => setLocation("/slack-integration")}
                >
                  <Slack className="w-5 h-5" />
                  View Full Slack Integration Guide
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="py-12 px-4 bg-accent/5 border-t border-accent/10">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Troubleshooting</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-4 bg-card border-accent/20">
              <h3 className="font-semibold mb-2">Logs not appearing?</h3>
              <p className="text-sm text-muted-foreground">
                Check that your API token is valid and has the correct permissions. Verify network connectivity to api.opsnexai.com.
              </p>
            </Card>
            <Card className="p-4 bg-card border-accent/20">
              <h3 className="font-semibold mb-2">Agent not connecting?</h3>
              <p className="text-sm text-muted-foreground">
                Review agent logs for connection errors. Ensure firewall rules allow outbound HTTPS to api.opsnexai.com:443.
              </p>
            </Card>
            <Card className="p-4 bg-card border-accent/20">
              <h3 className="font-semibold mb-2">High latency?</h3>
              <p className="text-sm text-muted-foreground">
                Check network bandwidth and agent resource usage. Consider batching logs to reduce API calls.
              </p>
            </Card>
            <Card className="p-4 bg-card border-accent/20">
              <h3 className="font-semibold mb-2">Need more help?</h3>
              <p className="text-sm text-muted-foreground">
                Contact our support team at info@opsnexai.com or schedule a demo for personalized setup assistance.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8">
            Follow the guide above for your log source, then start receiving AI-powered insights in Slack.
          </p>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-background"
            onClick={() => setLocation("/contact")}
          >
            Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
