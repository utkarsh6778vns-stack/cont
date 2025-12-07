import React, { useState } from 'react';
import PitchForm from './components/PitchForm';
import EmailResult from './components/EmailResult';
import BulkPitchForm from './components/BulkPitchForm';
import BulkResult from './components/BulkResult';
import { PitchFormData, GeneratedEmail, SenderStrategyData, BulkLead, BulkEmailJob } from './types';
import { generatePitchEmail } from './services/geminiService';
import { Rocket, Github, Info, User, Users } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  
  // Single Mode State
  const [emailData, setEmailData] = useState<GeneratedEmail | null>(null);
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [isSingleLoading, setIsSingleLoading] = useState(false);
  const [singleError, setSingleError] = useState<string | null>(null);

  // Bulk Mode State
  const [bulkJobs, setBulkJobs] = useState<BulkEmailJob[]>([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Single Form Handler
  const handleSingleSubmit = async (data: PitchFormData) => {
    setIsSingleLoading(true);
    setSingleError(null);
    setEmailData(null);
    setRecipientEmail(data.recipientEmail || '');

    try {
      const result = await generatePitchEmail(data);
      setEmailData(result);
    } catch (err: any) {
      setSingleError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSingleLoading(false);
    }
  };

  const handleSingleReset = () => {
    setEmailData(null);
    setSingleError(null);
    setRecipientEmail('');
  };

  // Bulk Form Handler
  const handleBulkStart = async (senderData: SenderStrategyData, leads: BulkLead[]) => {
    // Initialize jobs
    const initialJobs: BulkEmailJob[] = leads.map(lead => ({
      lead,
      status: 'pending'
    }));
    setBulkJobs(initialJobs);
    setIsBulkProcessing(true);

    // Process jobs sequentially to avoid rate limits
    // Note: In a real app, we might use a queue with concurrency
    for (let i = 0; i < leads.length; i++) {
      const jobIndex = i;
      const lead = leads[i];

      // Update status to processing
      setBulkJobs(prev => prev.map((job, idx) => 
        idx === jobIndex ? { ...job, status: 'processing' } : job
      ));

      try {
        const formData: PitchFormData = {
          ...senderData,
          recipientName: lead.recipientName,
          recipientCompany: lead.recipientCompany,
          recipientEmail: lead.recipientEmail,
          recipientWebsite: lead.recipientWebsite,
        };

        const result = await generatePitchEmail(formData);

        // Update with success
        setBulkJobs(prev => prev.map((job, idx) => 
          idx === jobIndex ? { ...job, status: 'completed', result } : job
        ));
      } catch (error: any) {
        // Update with error
        setBulkJobs(prev => prev.map((job, idx) => 
          idx === jobIndex ? { ...job, status: 'error', error: error.message || 'Failed' } : job
        ));
      }
    }

    setIsBulkProcessing(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">OutreachAI</h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm inline-flex">
            <button
              onClick={() => setActiveTab('single')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'single' 
                  ? 'bg-indigo-600 text-white shadow' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4" />
              Single Email
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'bulk' 
                  ? 'bg-indigo-600 text-white shadow' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" />
              Bulk Upload
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start h-full">
          
          {/* Left Column: Input Form */}
          <div className="space-y-6">
            <div className="prose prose-slate max-w-none">
              <h1 className="text-3xl font-extrabold text-slate-900">
                Land Your Next <span className="text-indigo-600">Web & AI</span> Client.
              </h1>
              <p className="text-lg text-slate-600">
                {activeTab === 'single' 
                  ? 'Generate highly personalized cold emails that pitch web development and AI integration services in seconds.' 
                  : 'Upload a spreadsheet (Excel or CSV) of leads to generate tailored pitches for your entire prospect list automatically.'}
              </p>
            </div>
            
            {activeTab === 'single' ? (
              <>
                <PitchForm onSubmit={handleSingleSubmit} isLoading={isSingleLoading} />
                {singleError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                    <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>{singleError}</p>
                  </div>
                )}
              </>
            ) : (
              <BulkPitchForm onStart={handleBulkStart} isProcessing={isBulkProcessing} />
            )}
          </div>

          {/* Right Column: Result Display */}
          <div className="lg:sticky lg:top-24 h-full min-h-[500px]">
            {activeTab === 'single' ? (
              emailData ? (
                <EmailResult emailData={emailData} recipientEmail={recipientEmail} onReset={handleSingleReset} />
              ) : (
                <div className="h-full bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                  <Rocket className="w-12 h-12 mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-slate-500 mb-2">Ready to Generate</h3>
                  <p className="max-w-xs mx-auto">
                    Fill out the form on the left to create a personalized email draft.
                  </p>
                </div>
              )
            ) : (
              // Bulk View
              bulkJobs.length > 0 ? (
                <BulkResult jobs={bulkJobs} />
              ) : (
                <div className="h-full bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                  <Users className="w-12 h-12 mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-slate-500 mb-2">Bulk Processing</h3>
                  <p className="max-w-xs mx-auto">
                    Upload a spreadsheet on the left to start generating multiple emails at once.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} OutreachAI. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;