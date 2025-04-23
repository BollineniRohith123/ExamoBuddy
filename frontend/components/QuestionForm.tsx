'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { qaApi } from '@/lib/api';
import ReactMarkdown from 'react-markdown';

interface FormData {
  question: string;
}

export default function QuestionForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await qaApi.askQuestion(data.question);
      setAnswer(response.data.answer);
      setCurrentQuestion(data.question);
      reset();
    } catch (err) {
      console.error('Error asking question:', err);
      setError('Failed to get an answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownloadPdf = async () => {
    if (!answer) return;
    
    try {
      const response = await qaApi.generatePdf(answer, currentQuestion || undefined);
      
      // Create a blob from the PDF data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.download = 'examobuddy_answer.pdf';
      
      // Append the link to the body
      document.body.appendChild(link);
      
      // Click the link to trigger the download
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF. Please try again.');
    }
  };
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700">
            Ask a medical question
          </label>
          <div className="mt-1">
            <textarea
              id="question"
              rows={4}
              className={`block w-full rounded-md border ${
                errors.question ? 'border-red-300' : 'border-gray-300'
              } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2`}
              placeholder="Enter your medical question here..."
              {...register('question', { required: 'Question is required' })}
            />
            {errors.question && (
              <p className="mt-2 text-sm text-red-600">{errors.question.message}</p>
            )}
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Submit Question'
            )}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {answer && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          {currentQuestion && (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Question:</h3>
              <p className="mt-1 text-gray-600">{currentQuestion}</p>
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">Answer:</h3>
            <div className="mt-2 prose max-w-none">
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
