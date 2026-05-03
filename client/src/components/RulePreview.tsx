import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Play } from 'lucide-react';
import {
  AlertRule,
  AlertPayload,
  evaluateRule,
  generateRuleDescription,
  SEVERITY_OPTIONS,
  ENVIRONMENT_OPTIONS,
} from '@/lib/alertRulesTypes';

interface RulePreviewProps {
  rule: AlertRule;
}

export function RulePreview({ rule }: RulePreviewProps) {
  const [testPayload, setTestPayload] = useState<AlertPayload>({
    severity: 'critical',
    service: 'api-service',
    environment: 'production',
    message: 'High error rate detected',
    tags: ['production', 'api'],
    errorRate: 5.2,
    responseTime: 250,
    timestamp: new Date(),
  });

  const [testResult, setTestResult] = useState<boolean | null>(null);
  const matched = testResult !== null ? testResult : null;

  const handleTest = () => {
    const result = evaluateRule(rule, testPayload);
    setTestResult(result);
  };

  const ruleDescription = generateRuleDescription(rule);

  return (
    <div className="space-y-6">
      {/* Rule Description */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-lg">Rule Logic</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">{ruleDescription}</p>
        </CardContent>
      </Card>

      {/* Test Payload */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-lg">Test Rule</CardTitle>
          <CardDescription>Send a test alert to verify rule matching</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Severity</label>
              <select
                value={testPayload.severity}
                onChange={(e) =>
                  setTestPayload({
                    ...testPayload,
                    severity: e.target.value as any,
                  })
                }
                className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-sm"
              >
                {SEVERITY_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Environment</label>
              <select
                value={testPayload.environment}
                onChange={(e) =>
                  setTestPayload({
                    ...testPayload,
                    environment: e.target.value as any,
                  })
                }
                className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-sm"
              >
                {ENVIRONMENT_OPTIONS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Service</label>
              <Input
                value={testPayload.service}
                onChange={(e) =>
                  setTestPayload({
                    ...testPayload,
                    service: e.target.value,
                  })
                }
                placeholder="Service name"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Error Rate (%)</label>
              <Input
                type="number"
                value={testPayload.errorRate || ''}
                onChange={(e) =>
                  setTestPayload({
                    ...testPayload,
                    errorRate: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                placeholder="0"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Message</label>
            <Input
              value={testPayload.message}
              onChange={(e) =>
                setTestPayload({
                  ...testPayload,
                  message: e.target.value,
                })
              }
              placeholder="Alert message"
              className="mt-1"
            />
          </div>

          <Button onClick={handleTest} className="w-full bg-accent hover:bg-accent/90">
            <Play className="w-4 h-4 mr-2" />
            Test Rule
          </Button>

          {/* Test Result */}
          {matched !== null && (
            <div
              className={`p-4 rounded-lg border flex items-center gap-3 ${
                matched
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-red-500/10 border-red-500/30'
              }`}
            >
              {matched ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-green-500">Rule Matched</p>
                    <p className="text-sm text-green-500/80">
                      {rule.actions.length} action(s) will be triggered
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-medium text-red-500">Rule Did Not Match</p>
                    <p className="text-sm text-red-500/80">No actions will be triggered</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Triggered Actions */}
          {matched && rule.actions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Triggered Actions:</p>
              <div className="space-y-2">
                {rule.actions.map((action) => (
                  <div
                    key={action.id}
                    className="p-3 bg-background border border-border rounded-lg text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        Send to {action.type}: {action.target}
                      </span>
                      {action.priority && (
                        <Badge variant="outline">{action.priority}</Badge>
                      )}
                    </div>
                    {action.throttle && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Throttled to 1 alert per {action.throttle}s
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
