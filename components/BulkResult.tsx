import React, { useState } from 'react';
import { BulkEmailJob } from '../types';
import { Check, Loader2, AlertCircle, ChevronDown, ChevronUp, Copy, Mail } from 'lucide-react';

interface BulkResultProps {
  jobs: BulkEmailJob[];
}

const BulkResult: React.FC<BulkResultProps> = ({ jobs }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getMailtoLink = (job: BulkEmailJob) => {
    if (!job.result) return '#';
    const subject = encodeURIComponent(job.result.subject);
    const body = encodeURIComponent(job.result.body.replace(/\n/g, '\r\n'));
    const email = job.lead.recipientEmail || '';
    return `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const completedCount = jobs.filter(j => j.status === 'completed').length;
  const progress = jobs.length > 0 ? (completedCount / jobs.length) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-full animate-fade-in-up">
      <div className="bg-slate-50 border-b border-slate-200 p-4">
        <h2 className="text-lg font-semibold text-slate-700 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-500" />
            Bulk Results
          </span>
          <span className="text-sm font-normal text-slate-500">
            {completedCount} / {jobs.length} Completed
          </span>
        </h2>
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3">
          <div 
            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-0">
        {jobs.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <p>No jobs started yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <div key={job.lead.id} className="bg-white">
                <div 
                  className={`p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors ${expandedId === job.lead.id ? 'bg-indigo-50/50' : ''}`}
                  onClick={() => toggleExpand(job.lead.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center">
                      {job.status === 'completed' && <Check className="w-5 h-5 text-green-500" />}
                      {job.status === 'processing' && <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />}
                      {job.status === 'pending' && <div className="w-2 h-2 rounded-full bg-slate-300" />}
                      {job.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{job.lead.recipientName}</p>
                      <p className="text-xs text-slate-500">{job.lead.recipientCompany}</p>
                    </div>
                  </div>
                  <div className="text-slate-400">
                    {expandedId === job.lead.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === job.lead.id && job.result && (
                  <div className="p-4 bg-slate-50 border-t border-slate-100 text-sm space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-slate-500 uppercase text-xs">Subject</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); copyToClipboard(job.result!.subject, `${job.lead.id}-sub`); }}
                          className="text-indigo-600 hover:text-indigo-800 text-xs flex items-center gap-1"
                        >
                          {copiedId === `${job.lead.id}-sub` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          Copy
                        </button>
                      </div>
                      <p className="bg-white border border-slate-200 p-2 rounded text-slate-800">{job.result.subject}</p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-slate-500 uppercase text-xs">Body</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); copyToClipboard(job.result!.body, `${job.lead.id}-body`); }}
                          className="text-indigo-600 hover:text-indigo-800 text-xs flex items-center gap-1"
                        >
                          {copiedId === `${job.lead.id}-body` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          Copy
                        </button>
                      </div>
                      <div className="bg-white border border-slate-200 p-3 rounded text-slate-700 whitespace-pre-wrap h-40 overflow-y-auto">
                        {job.result.body}
                      </div>
                    </div>
                    <div className="pt-2">
                       <a 
                         href={getMailtoLink(job)}
                         className="block w-full text-center py-2 bg-white border border-indigo-200 text-indigo-600 rounded hover:bg-indigo-50 transition-colors font-medium"
                       >
                         Open in Mail App
                       </a>
                    </div>
                  </div>
                )}
                
                {expandedId === job.lead.id && job.error && (
                  <div className="p-4 bg-red-50 text-red-600 text-sm">
                    Error: {job.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkResult;