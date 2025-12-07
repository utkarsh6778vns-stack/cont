import React, { useState } from 'react';
import { PitchFormData, ToneType } from '../types';
import { Sparkles, Loader2 } from 'lucide-react';

interface PitchFormProps {
  onSubmit: (data: PitchFormData) => void;
  isLoading: boolean;
}

const PitchForm: React.FC<PitchFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<PitchFormData>({
    recipientName: '',
    recipientEmail: '',
    recipientCompany: '',
    recipientWebsite: '',
    senderName: '',
    senderPortfolio: '',
    tone: ToneType.PROFESSIONAL,
    specificFocus: 'Customer support automation',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          Campaign Details
        </h2>
        <p className="text-slate-500 mt-1">Enter the prospect's details to generate a tailored pitch.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Recipient Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Prospect</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Name</label>
              <input
                required
                type="text"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Email (Optional)</label>
              <input
                type="email"
                name="recipientEmail"
                value={formData.recipientEmail}
                onChange={handleChange}
                placeholder="e.g. john@acmecorp.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
              <input
                required
                type="text"
                name="recipientCompany"
                value={formData.recipientCompany}
                onChange={handleChange}
                placeholder="e.g. Acme Corp"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Website URL (Optional)</label>
              <input
                type="text"
                name="recipientWebsite"
                value={formData.recipientWebsite}
                onChange={handleChange}
                placeholder="e.g. acmecorp.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>

          {/* Sender Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">You</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
              <input
                required
                type="text"
                name="senderName"
                value={formData.senderName}
                onChange={handleChange}
                placeholder="e.g. Alex Smith"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Portfolio Link (Optional)</label>
              <input
                type="text"
                name="senderPortfolio"
                value={formData.senderPortfolio}
                onChange={handleChange}
                placeholder="e.g. alex-dev.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Strategy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tone of Voice</label>
              <select
                name="tone"
                value={formData.tone}
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
                value={formData.specificFocus}
                onChange={handleChange}
                placeholder="e.g. AI Chatbots, Lead Gen, SEO"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-white font-semibold shadow-lg transition-all
              ${isLoading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'
              }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Pitch...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Email
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PitchForm;