import React, { useState } from 'react';
import PitchForm from './components/PitchForm';
import EmailResult from './components/EmailResult';
import { PitchFormData, GeneratedEmail } from './types';
import { generatePitchEmail } from './services/geminiService';
import { Rocket, Github, Info } from 'lucide-react';

const App: React.FC = () => {
  const [emailData, setEmailData] = useState<GeneratedEmail | null>(null);
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: PitchFormData) => {
    setIsLoading(true);
    setError(null);
    setEmailData(null);
    setRecipientEmail(data.recipientEmail || '');

    try {
      const result = await generatePitchEmail(data);
      setEmailData(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setEmailData(null);
    setError(null);
    setRecipientEmail('');
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start h-full">
          
          {/* Left Column: Input Form */}
          <div className="space-y-6">
            <div className="prose prose-slate max-w-none">
              <h1 className="text-3xl font-extrabold text-slate-900">
                Land Your Next <span className="text-indigo-600">Web & AI</span> Client.
              </h1>
              <p className="text-lg text-slate-600">
                Generate highly personalized cold emails that pitch web development and AI integration services in seconds using Gemini 2.5.
              </p>
            </div>
            
            <PitchForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Right Column: Result Display */}
          <div className="lg:sticky lg:top-24 h-full min-h-[500px]">
            {emailData ? (
              <EmailResult emailData={emailData} recipientEmail={recipientEmail} onReset={handleReset} />
            ) : (
              <div className="h-full bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <Rocket className="w-12 h-12 mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-slate-500 mb-2">Ready to Generate</h3>
                <p className="max-w-xs mx-auto">
                  Fill out the form on the left to create a personalized email draft tailored to your prospect.
                </p>
              </div>
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