import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';
import { Home, Plus, Edit2, Trash2, Power } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertRuleComposer } from '@/components/AlertRuleComposer';
import { AlertRule, generateRuleDescription } from '@/lib/alertRulesTypes';
import { trackPageView } from '@/lib/analytics';
import { Footer } from '@/components/Footer';

/**
 * Alert Rules Engine Page
 * 
 * Visual rule builder for conditional alert routing
 * - Create/edit alert rules with drag-and-drop UI
 * - Define conditions and actions
 * - Test rules with sample payloads
 * - Manage rule lifecycle
 * 
 * Design: Professional SaaS dashboard with dark theme and teal accents
 */

export default function AlertRulesEngine() {
  const [, setLocation] = useLocation();
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [isComposing, setIsComposing] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);

  useEffect(() => {
    trackPageView('Alert Rules Engine', '/alert-rules');
    
    // Load rules from localStorage
    const savedRules = localStorage.getItem('alertRules');
    if (savedRules) {
      try {
        setRules(JSON.parse(savedRules));
      } catch (error) {
        console.error('Failed to load rules:', error);
      }
    }
  }, []);

  const handleSaveRule = (rule: AlertRule) => {
    const updatedRules = editingRule
      ? rules.map((r) => (r.id === rule.id ? rule : r))
      : [...rules, rule];

    setRules(updatedRules);
    localStorage.setItem('alertRules', JSON.stringify(updatedRules));
    setIsComposing(false);
    setEditingRule(null);
  };

  const handleDeleteRule = (ruleId: string) => {
    const updatedRules = rules.filter((r) => r.id !== ruleId);
    setRules(updatedRules);
    localStorage.setItem('alertRules', JSON.stringify(updatedRules));
  };

  const handleToggleRule = (ruleId: string) => {
    const updatedRules = rules.map((r) =>
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    );
    setRules(updatedRules);
    localStorage.setItem('alertRules', JSON.stringify(updatedRules));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Alert Rules Engine</h1>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="w-4 h-4 mr-2" />
              HOME
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isComposing ? (
          // Rule Composer View
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingRule ? 'Edit Rule' : 'Create New Rule'}
            </h2>
            <AlertRuleComposer
              rule={editingRule || undefined}
              onSave={handleSaveRule}
              onCancel={() => {
                setIsComposing(false);
                setEditingRule(null);
              }}
            />
          </div>
        ) : (
          <>
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">Manage Alert Rules</h2>
                  <p className="text-lg text-muted-foreground">
                    Create conditional rules to route alerts to different channels
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setEditingRule(null);
                    setIsComposing(true);
                  }}
                  className="bg-accent hover:bg-accent/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Rule
                </Button>
              </div>
            </div>

            {/* Rules List */}
            {rules.length === 0 ? (
              <Card className="bg-card border border-border text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground mb-4">No alert rules created yet</p>
                  <Button
                    onClick={() => {
                      setEditingRule(null);
                      setIsComposing(true);
                    }}
                    className="bg-accent hover:bg-accent/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Rule
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {rules.map((rule) => (
                  <Card
                    key={rule.id}
                    className={`bg-card border ${
                      rule.enabled ? 'border-border' : 'border-muted'
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{rule.name}</CardTitle>
                            <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                              {rule.enabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </div>
                          {rule.description && (
                            <CardDescription className="mb-3">{rule.description}</CardDescription>
                          )}
                          <p className="text-sm text-muted-foreground italic">
                            {generateRuleDescription(rule)}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Badge variant="outline">{rule.conditions.conditions.length} conditions</Badge>
                          <Badge variant="outline">{rule.actions.length} actions</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleRule(rule.id)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Power className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingRule(rule);
                              setIsComposing(true);
                            }}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRule(rule.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Stats */}
            {rules.length > 0 && (
              <div className="mt-8 grid grid-cols-3 gap-4">
                <Card className="bg-card border border-border">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-accent">{rules.length}</p>
                      <p className="text-sm text-muted-foreground">Total Rules</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border border-border">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-500">
                        {rules.filter((r) => r.enabled).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Enabled</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border border-border">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-muted-foreground">
                        {rules.reduce((sum, r) => sum + r.actions.length, 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Actions</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
