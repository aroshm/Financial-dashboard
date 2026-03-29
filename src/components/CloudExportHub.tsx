'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  Cloud, 
  LayoutDashboard, 
  Blocks, 
  Bot, 
  Clock, 
  Share2,
  FileText,
  PieChart,
  Calendar,
  CreditCard,
  Mail,
  RefreshCw,
  CheckCircle2,
  Link as LinkIcon,
  QrCode,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Dialog } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';

import { cn } from '@/lib/utils';

interface CloudExportHubProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TabKey = 'templates' | 'integrations' | 'automations' | 'history' | 'share';

interface Integration {
  id: string;
  name: string;
  icon: string | React.ElementType;
  connected: boolean;
  color: string;
}

interface ExportHistoryItem {
  id: string;
  name: string;
  destination: string;
  date: string;
  status: 'success' | 'failed' | 'processing';
}

export function CloudExportHub({ open, onOpenChange }: CloudExportHubProps) {
  const [activeTab, setActiveTab] = React.useState<TabKey>('templates');
  
  // Simulated state for Integrations
  const [integrations, setIntegrations] = React.useState<Integration[]>([
    { id: 'gdrive', name: 'Google Drive', icon: PieChart, connected: false, color: 'bg-green-500/10 text-green-500' },
    { id: 'notion', name: 'Notion Workspace', icon: FileText, connected: true, color: 'bg-slate-500/10 text-slate-400' },
    { id: 'dropbox', name: 'Dropbox', icon: Blocks, connected: false, color: 'bg-blue-500/10 text-blue-500' },
    { id: 'slack', name: 'Slack Channel', icon: Mail, connected: false, color: 'bg-purple-500/10 text-purple-500' }
  ]);

  // Simulated state for History
  const [history, setHistory] = React.useState<ExportHistoryItem[]>([
    { id: '1', name: 'Jan 2026 Budget Sync', destination: 'Notion Workspace', date: new Date(Date.now() - 86400000 * 2).toISOString(), status: 'success' },
    { id: '2', name: 'Q4 Tax Report', destination: 'hello@example.com', date: new Date(Date.now() - 86400000 * 15).toISOString(), status: 'success' },
  ]);

  const handleConnect = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (!integration) return;

    if (integration.connected) {
      toast.success(`Disconnected from ${integration.name}`);
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: false } : i));
      return;
    }

    const promise = new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast.promise(promise, {
      loading: `Authenticating with ${integration.name}...`,
      success: () => {
        setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: true } : i));
        return `Successfully connected to ${integration.name}!`;
      },
      error: 'Authentication failed. Please try again.',
    });
  };

  const handleRunTemplate = (templateName: string, destination: string) => {
    const promise = new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.promise(promise, {
      loading: `Generating & Syncing ${templateName}...`,
      success: () => {
        setHistory(prev => [{
          id: Math.random().toString(),
          name: templateName,
          destination: destination,
          date: new Date().toISOString(),
          status: 'success'
        }, ...prev]);
        return `${templateName} successfully synced to ${destination}!`;
      },
      error: 'Sync failed.',
    });
  };

  const tabs = [
    { id: 'templates', label: 'Export Templates', icon: LayoutDashboard },
    { id: 'integrations', label: 'Cloud Connections', icon: Blocks },
    { id: 'automations', label: 'Automations', icon: Bot },
    { id: 'history', label: 'Audit Log', icon: Clock },
    { id: 'share', label: 'Share Link', icon: Share2 },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-[1000px] p-0 overflow-hidden">
      <div className="flex flex-col md:flex-row h-[75vh] min-h-[600px] w-full bg-background rounded-xl overflow-hidden m-0">
        
        {/* Left Sidebar */}
        <div className="w-full md:w-64 bg-card border-r border-border p-4 flex flex-col">
          <div className="flex items-center space-x-2 px-2 py-4 mb-4">
            <div className="bg-primary/20 text-primary p-2 rounded-lg">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">Data Hub</h2>
              <p className="text-xs text-muted-foreground whitespace-nowrap">Enterprise Sync Engine</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    activeTab === tab.id 
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className={cn("w-4 h-4", activeTab === tab.id ? "text-primary-foreground" : "text-muted-foreground")} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="mt-auto pt-4 border-t border-border px-2">
            <div className="flex items-center space-x-2 text-xs text-green-500 font-medium bg-green-500/10 px-3 py-2 rounded-md">
              <ShieldCheck className="w-4 h-4" />
              <span>End-to-End Encrypted</span>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-background relative">
          
          {/* TEMPLATES TAB */}
          {activeTab === 'templates' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h3 className="text-2xl font-bold tracking-tight">One-Click Templates</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Instantly structure and push your tracked data to connected workspaces.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { name: 'End of Year Tax Report', desc: 'Aggregates all categorizations into an IRS-friendly PDF layout.', icon: FileText, dest: 'john.doe@email.com', color: 'bg-emerald-500/10 text-emerald-500', btnText: 'Email PDF' },
                  { name: 'Monthly Budget Rollup', desc: 'Syncs current month totals into your connected Notion database.', icon: Calendar, dest: 'Notion Workspace', color: 'bg-blue-500/10 text-blue-500', btnText: 'Sync to Notion' },
                  { name: 'Category Analysis', desc: 'Explodes all expenses into a pivot table structure for Excel/Sheets.', icon: PieChart, dest: 'Google Drive', color: 'bg-orange-500/10 text-orange-500', btnText: 'Push to Drive' },
                  { name: 'Receipt Reconciliation', desc: 'Zips all descriptions and amounts for corporate reimbursement.', icon: CreditCard, dest: 'Slack Channel', color: 'bg-purple-500/10 text-purple-500', btnText: 'Notify Slack' },
                ].map((tpl, i) => {
                  const Icon = tpl.icon;
                  return (
                    <div key={i} className="flex flex-col border border-border rounded-xl p-5 bg-card hover:border-primary/50 transition-colors shadow-sm relative overflow-hidden group">
                      <div className="flex items-start justify-between mb-4">
                        <div className={cn("p-2.5 rounded-lg", tpl.color)}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium bg-secondary px-2 py-1 rounded-full text-muted-foreground">
                          {tpl.dest}
                        </span>
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">{tpl.name}</h4>
                      <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{tpl.desc}</p>
                      <Button 
                        className="mt-auto w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" 
                        variant="secondary"
                        onClick={() => handleRunTemplate(tpl.name, tpl.dest)}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        {tpl.btnText}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* INTEGRATIONS TAB */}
          {activeTab === 'integrations' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">Cloud Connections</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Manage third-party OAuth links to synchronize data instantly.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                </Button>
              </div>

              <div className="grid gap-4">
                {integrations.map(integ => {
                  const Icon = integ.icon;
                  return (
                    <div key={integ.id} className="flex items-center justify-between p-4 border border-border bg-card rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className={cn("p-3 rounded-xl", integ.color)}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{integ.name}</h4>
                          <p className="text-sm text-muted-foreground flex items-center">
                            Status: 
                            {integ.connected ? (
                              <span className="text-green-500 font-medium flex items-center ml-1"><CheckCircle2 className="w-3 h-3 mr-1" /> Active Sync</span>
                            ) : (
                              <span className="text-muted-foreground ml-1">Not Connected</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant={integ.connected ? 'outline' : 'default'}
                        onClick={() => handleConnect(integ.id)}
                      >
                        {integ.connected ? 'Disconnect' : 'Connect Account'}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* AUTOMATIONS TAB */}
          {activeTab === 'automations' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div>
                <h3 className="text-2xl font-bold tracking-tight">Sync Automations</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Configure recurring cloud pipelines to keep your workspaces up to date.
                </p>
              </div>

              <div className="border border-border rounded-xl p-6 bg-card space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Create New Pipeline</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Schedule</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>Every Friday at 5 PM</option>
                        <option>1st of Every Month</option>
                        <option>Daily at Midnight</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Payload Format</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>Full Backup (JSON)</option>
                        <option>Monthly Summary (PDF)</option>
                        <option>Tidy Dataset (CSV)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Destination</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        {integrations.filter(i => i.connected).map(i => (
                          <option key={i.id}>{i.name}</option>
                        ))}
                        {integrations.filter(i => i.connected).length === 0 && <option disabled>No active connections</option>}
                      </select>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4" onClick={() => {
                    toast.success('Automation pipeline saved and activated successfully!');
                  }}>
                    Deploy Automation
                  </Button>
                </div>
              </div>

              <div className="border border-border rounded-xl p-4 bg-secondary flex items-start gap-3">
                <Bot className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h5 className="font-semibold text-sm">Cron Job Enabled</h5>
                  <p className="text-xs text-muted-foreground">Your pipelines are executed by AWS Lambda functions globally within 50ms of scheduling.</p>
                </div>
              </div>
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div>
                <h3 className="text-2xl font-bold tracking-tight">Audit Log</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  A cryptographic trail of all data successfully exported and synced outbound.
                </p>
              </div>

              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-secondary text-muted-foreground text-xs uppercase font-medium">
                    <tr>
                      <th className="px-4 py-3">Timestamp</th>
                      <th className="px-4 py-3">Payload Name</th>
                      <th className="px-4 py-3">Destination</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {history.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No sync history found.</td>
                      </tr>
                    ) : (
                      history.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap">{format(new Date(item.date), 'MMM dd, yyyy HH:mm')}</td>
                          <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{item.destination}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Success
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SHARE TAB */}
          {activeTab === 'share' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div>
                <h3 className="text-2xl font-bold tracking-tight">Share Live View</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Generate secure, temporary read-only links for external stakeholders like accountants or partners.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-5 border border-border rounded-xl bg-card space-y-4 shadow-sm">
                    <h4 className="font-semibold flex items-center">
                      <LinkIcon className="w-4 h-4 mr-2 text-primary" /> Generate Secure Link
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Require Password?</span>
                        <input type="checkbox" className="rounded accent-primary w-4 h-4" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Expiration</span>
                        <select className="bg-background border border-border rounded text-xs px-2 py-1">
                          <option>7 Days</option>
                          <option>30 Days</option>
                          <option>Never</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button className="w-full" onClick={() => {
                        toast.success('Live link copied to clipboard!');
                      }}>
                        Create Link
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-6 border border-border border-dashed rounded-xl bg-secondary/50">
                  <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                    <QrCode className="w-32 h-32 text-black" />
                  </div>
                  <h4 className="font-medium text-foreground">Scan to view payload</h4>
                  <p className="text-xs text-muted-foreground mt-1 text-center">Open camera on your mobile device to preview the live synchronization dashboard instantly.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </Dialog>
  );
}
