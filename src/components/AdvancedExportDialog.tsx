'use client';

import * as React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { Download, FileJson, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';

import { Dialog, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useExpenses } from '@/context/ExpenseContext';
import { formatCurrency, cn } from '@/lib/utils';
import { type Category } from '@/types';

interface AdvancedExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ExportFormat = 'csv' | 'json' | 'pdf';

const ALL_CATEGORIES: Category[] = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Other'];

export function AdvancedExportDialog({ open, onOpenChange }: AdvancedExportDialogProps) {
  const { expenses } = useExpenses();
  
  // Form State
  const [formatType, setFormatType] = React.useState<ExportFormat>('pdf');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [selectedCategories, setSelectedCategories] = React.useState<Category[]>([...ALL_CATEGORIES]);
  const [filename, setFilename] = React.useState('');
  const [isExporting, setIsExporting] = React.useState(false);

  // Set default filename based on format change
  React.useEffect(() => {
    if (open && !filename) {
      setFilename(`expenses_export_${format(new Date(), 'yyyy-MM-dd')}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, formatType]);

  const toggleCategory = (cat: Category) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // Derived filtered data for preview and export
  const filteredData = React.useMemo(() => {
    return expenses.filter(exp => {
      // Category Filter
      if (!selectedCategories.includes(exp.category)) return false;
      
      // Date Filter
      const expDate = new Date(exp.date).getTime();
      if (startDate && expDate < new Date(startDate).getTime()) return false;
      if (endDate && expDate > new Date(endDate + 'T23:59:59.999Z').getTime()) return false;
      
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, selectedCategories, startDate, endDate]);

  const handleExport = async () => {
    setIsExporting(true);
    
    // Artificial delay for loading state polish (business app feel)
    await new Promise(resolve => setTimeout(resolve, 800));

    const finalName = filename.trim() || 'export';

    if (formatType === 'json') {
      const blob = new Blob([JSON.stringify(filteredData, null, 2)], { type: 'application/json' });
      downloadBlob(blob, `${finalName}.json`);
    } 
    else if (formatType === 'csv') {
      const headers = ['Date', 'Category', 'Description', 'Amount'];
      const rows = filteredData.map(exp => [
        format(new Date(exp.date), 'yyyy-MM-dd'),
        exp.category,
        `"${exp.description.replace(/"/g, '""')}"`,
        exp.amount.toString()
      ]);
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      downloadBlob(blob, `${finalName}.csv`);
    }
    else if (formatType === 'pdf') {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.text('Expense Report', 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated: ${format(new Date(), 'PPpp')}`, 14, 30);
      doc.text(`Total Records: ${filteredData.length}`, 14, 35);
      
      const totalAmount = filteredData.reduce((sum, exp) => sum + exp.amount, 0);
      doc.text(`Total Amount: ${formatCurrency(totalAmount)}`, 14, 40);

      const tableData = filteredData.map(exp => [
        format(new Date(exp.date), 'yyyy-MM-dd'),
        exp.category,
        exp.description,
        formatCurrency(exp.amount, exp.currency)
      ]);

      autoTable(doc, {
        startY: 45,
        head: [['Date', 'Category', 'Description', 'Amount']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }, // Primary blue color
      });

      doc.save(`${finalName}.pdf`);
    }

    setIsExporting(false);
    onOpenChange(false);
  };

  const downloadBlob = (blob: Blob, name: string) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const totalAmount = filteredData.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-[900px]">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Left Col: Controls */}
        <div className="flex-1 space-y-6 md:pr-6 md:border-r border-border">
          <div>
            <DialogHeader>
              <DialogTitle>Advanced Export</DialogTitle>
              <DialogDescription>
                Configure parameters to generate a highly detailed data export.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  type="button" 
                  variant={formatType === 'pdf' ? 'default' : 'outline'} 
                  onClick={() => setFormatType('pdf')}
                  className="w-full flex-col h-auto py-3 gap-1"
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-xs">PDF Report</span>
                </Button>
                <Button 
                  type="button" 
                  variant={formatType === 'csv' ? 'default' : 'outline'} 
                  onClick={() => setFormatType('csv')}
                  className="w-full flex-col h-auto py-3 gap-1"
                >
                  <FileSpreadsheet className="h-5 w-5" />
                  <span className="text-xs">CSV Data</span>
                </Button>
                <Button 
                  type="button" 
                  variant={formatType === 'json' ? 'default' : 'outline'} 
                  onClick={() => setFormatType('json')}
                  className="w-full flex-col h-auto py-3 gap-1"
                >
                  <FileJson className="h-5 w-5" />
                  <span className="text-xs">JSON Raw</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start">Start Date</Label>
                <Input 
                  id="start" 
                  type="date" 
                  value={startDate} 
                  onChange={e => setStartDate(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">End Date</Label>
                <Input 
                  id="end" 
                  type="date" 
                  value={endDate} 
                  onChange={e => setEndDate(e.target.value)} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                      selectedCategories.includes(cat) 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-background text-muted-foreground border-input hover:bg-secondary"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filename">Custom Filename</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  id="filename" 
                  value={filename}
                  onChange={e => setFilename(e.target.value)}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-2 rounded-md border border-border">
                  .{formatType}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Preview */}
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Data Preview</h3>
            <span className="text-sm bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
              {filteredData.length} records found
            </span>
          </div>
          
          <div className="flex-1 min-h-[250px] max-h-[350px] overflow-y-auto rounded-lg border bg-background/50 relative">
            {filteredData.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground h-full p-6 text-center">
                <FileSearch className="h-8 w-8 mb-2 opacity-20" />
                <p>No records match your exact filters.</p>
                <p className="text-sm opacity-60">Adjust dates or categories to see preview.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground sticky top-0 bg-background/95 backdrop-blur z-10 shadow-sm">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredData.slice(0, 50).map((exp, i) => (
                    <tr key={i} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">{format(new Date(exp.date), 'MMM dd')}</td>
                      <td className="px-4 py-3 truncate max-w-[150px]">{exp.description}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(exp.amount)}</td>
                    </tr>
                  ))}
                  {filteredData.length > 50 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-center text-xs text-muted-foreground italic">
                        ... and {filteredData.length - 50} more records ...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-secondary/50 rounded-lg p-4 flex items-center justify-between border shadow-sm">
            <span className="text-sm text-muted-foreground font-medium">Total Export Value</span>
            <span className="text-lg font-bold text-foreground">{formatCurrency(totalAmount)}</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isExporting}>
              Cancel
            </Button>
            <Button 
              onClick={handleExport} 
              disabled={filteredData.length === 0 || isExporting}
              className="min-w-[160px]"
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export {formatType.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </div>

      </div>
    </Dialog>
  );
}

// Inline missing icon
function FileSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <circle cx="11.5" cy="14.5" r="2.5" />
      <path d="M13.25 16.25 15 18" />
    </svg>
  )
}
