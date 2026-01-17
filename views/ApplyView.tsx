import React, { useState } from 'react';
import { useSupabaseStore } from '../lib/supabase-store';
import { useDialog } from '../lib/dialog-context';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Send, UserPlus } from 'lucide-react';
import Logo from '../components/Logo';

const ApplyView: React.FC = () => {
  const { setView } = useSupabaseStore();
  const { showDialog } = useDialog();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      showDialog({
        type: 'error',
        title: 'Missing Information',
        message: 'Please fill in your name and email.',
        actions: [{ label: 'OK', onClick: () => {}, variant: 'primary' }]
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('user_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          message: formData.message || '',
          status: 'PENDING'
        });

      if (error) throw error;

      showDialog({
        type: 'success',
        title: 'Application Submitted',
        message: 'Your application has been submitted successfully. Our management team will review it and contact you soon.',
        actions: [
          { 
            label: 'Back to Welcome', 
            onClick: () => setView('landing'), 
            variant: 'primary' 
          }
        ]
      });

      // Clear form
      setFormData({ name: '', email: '', message: '' });
    } catch (error: any) {
      console.error('Error submitting application:', error);
      showDialog({
        type: 'error',
        title: 'Submission Failed',
        message: error.message || 'Failed to submit application. Please try again.',
        actions: [{ label: 'OK', onClick: () => {}, variant: 'primary' }]
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 gradient-bg">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => setView('landing')}
          className="mb-6 inline-flex items-center space-x-2 text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Welcome</span>
        </button>

        {/* Logo */}
        <Logo size="lg" className="mx-auto mb-8" />

        {/* Form Card */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl glow-border">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary mb-2">Apply to be an Editor</h2>
            <p className="text-secondary text-sm">
              Submit your application and our team will review it
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-primary placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                required
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-primary placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Why do you want to join? (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us about your experience and why you'd like to join Idyll Productions..."
                rows={4}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-primary placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-secondary">
              Already have an account?{' '}
              <button
                onClick={() => setView('login')}
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyView;
