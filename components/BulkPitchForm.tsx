import React, { useState, useRef } from 'react';
import { SenderStrategyData, ToneType, BulkLead } from '../types';
import { Upload, FileSpreadsheet, Download, Play, Users, X } from 'lucide-react';
import { parseSpreadsheet, downloadTemplate } from '../utils/csvHelper';

interface BulkPitchFormProps {
  onStart: (senderData: SenderStrategyData, leads: BulkLead[]) => void;
  isProcessing: boolean;
}

const BulkPitchForm: React.FC<BulkPitchFormProps> = ({ onStart, isProcessing }) => {
  const [senderData, setSenderData] = useState<SenderStrategyData>({
    senderName: '',
    senderPortfolio: '',
    tone: ToneType.PROFESSIONAL,
    specificFocus: 'Customer support automation',
  });
  const [leads, setLeads] = useState<BulkLead[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSenderData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation for common spreadsheet extensions
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExtension) {
      setError('Please upload a valid spreadsheet (.xlsx, .xls, .csv).');
      return;
    }

    setFileName(file.name);
    setError(null);

    try {
      const parsedLeads = await parseSpreadsheet(file);
      if (parsedLeads.length === 0) {
        setError('No valid leads found in file. Please ensure columns match the template: Name, Email, Company, Website.');
      } else {
        setLeads(parsedLeads);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to parse file.');
      setLeads([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (leads.length === 0) {
      setError('Please upload a valid spreadsheet with leads.');
      return;
    }
    onStart(senderData, leads);
  };

  const clearFile = () => {
    setFileName('');
    setLeads([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" />
          Bulk Campaign
        </h2>
        <p className="text-slate-500 mt-1">Upload a spreadsheet of prospects to generate emails in batch.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Spreadsheet Upload Section */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-indigo-900 uppercase tracking-wider flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              Upload Spreadsheet
            </h3>
            <button
              type="button"
              onClick={downloadTemplate}
              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium underline"
            >
              <Download className="w-3 h-3" />
              Download Template
            </button>
          </div>

          {!fileName ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-200 rounded-lg p-8 text-center cursor-pointer hover:bg-indigo-100/50 transition-colors"
            >
              <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
              <p className="text-sm text-indigo-900 font-medium">Click to upload Excel or CSV</p>
              <p className="text-xs text-indigo-500 mt-1">Supports .xlsx, .xls, .csv</p>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                className="hidden"
              />
            </div>
          ) : (
            <div className="bg-white border border-indigo-200 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <FileSpreadsheet className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{fileName}</p>
                  <p className="text-xs text-slate-500">{leads.length} leads found</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={clearFile}
                className="text-slate-400 hover:text-red-500 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          {error && <p className="text-xs text-red-600 mt-2 font-medium">{error}</p>}
        </div>

        {/* Sender Info - Reused structure */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Your Info (Applied to All)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
              <input
                required
                type="text"
                name="senderName"
                value={senderData.senderName}
                onChange={handleChange}
                placeholder="e.g. Alex Smith"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Portfolio Link</label>
              <input
                type="text"
                name="senderPortfolio"
                value={senderData.senderPortfolio}
                onChange={handleChange}
                placeholder="e.g. alex-dev.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Strategy Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Strategy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tone of Voice</label>
              <select
                name="tone"
                value={senderData.tone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
              >
                {Object.values(ToneType).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Key Value Proposition</label>
              <input
                type="text"
                name="specificFocus"
                value={senderData.specificFocus}
                onChange={handleChange}
                placeholder="e.g. AI Chatbots, Lead Gen"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing || leads.length === 0}
          className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-white font-semibold shadow-lg transition-all
            ${isProcessing || leads.length === 0
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'
            }`}
        >
          {isProcessing ? (
            'Processing Batch...'
          ) : (
            <>
              <Play className="w-5 h-5" />
              Generate All Emails
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BulkPitchForm;