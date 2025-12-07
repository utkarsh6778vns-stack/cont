import React, { useState, useMemo } from 'react';
import { GeneratedEmail } from '../types';
import { Copy, Check, RefreshCw, Mail } from 'lucide-react';

interface EmailResultProps {
  emailData: GeneratedEmail | null;
  recipientEmail?: string;
  onReset: () => void;
}

const EmailResult: React.FC<EmailResultProps> = ({ emailData, recipientEmail, onReset }) => {
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  // Generate the mailto link with proper encoding for newlines
  const mailtoLink = useMemo(() => {
    if (!emailData) return '#';
    const subject = encodeURIComponent(emailData.subject);
    
    // Ensure newlines are encoded as %0D%0A (CRLF) for best compatibility with email clients
    const bodyContent = emailData.body.replace(/\n/g, '\r\n');
    const body = encodeURIComponent(bodyContent);
    
    const emailTo = recipientEmail ? recipientEmail : '';
    
    return `mailto:${emailTo}?subject=${subject}&body=${body}`;
  }, [emailData, recipientEmail]);

  if (!emailData) return null;

  const copyToClipboard = async (text: string, type: 'subject' | 'body') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'subject') {
        setCopiedSubject(true);
        setTimeout(() => setCopiedSubject(false), 2000);
      } else {
        setCopiedBody(true);
        setTimeout(() => setCopiedBody(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-full animate-fade-in-up">
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
          <Mail className="w-5 h-5 text-indigo-500" />
          Generated Draft
        </h2>
        <button
          onClick={onReset}
          className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          New Draft
        </button>
      </div>

      <div className="p-6 space-y-6 overflow-y-auto flex-1">
        {/* Subject Line Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subject Line</label>
            <button
              onClick={() => copyToClipboard(emailData.subject, 'subject')}
              className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                copiedSubject ? 'text-green-600 bg-green-50' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {copiedSubject ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedSubject ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium">
            {emailData.subject}
          </div>
        </div>

        {/* Body Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Body</label>
            <button
              onClick={() => copyToClipboard(emailData.body, 'body')}
              className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                copiedBody ? 'text-green-600 bg-green-50' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {copiedBody ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedBody ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 whitespace-pre-wrap leading-relaxed min-h-[300px]">
            {emailData.body}
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
        <a 
          href={mailtoLink}
          className="inline-flex items-center justify-center gap-2 text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
        >
          Open in Default Mail App
        </a>
      </div>
    </div>
  );
};

export default EmailResult;