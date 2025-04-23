'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import { historyApi, qaApi } from '../../lib/api';
import ReactMarkdown from 'react-markdown';

interface HistoryItem {
  id: number;
  question: string;
  answer: string;
  timestamp: string;
}

interface HistoryResponse {
  items: HistoryItem[];
  total: number;
}

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const limit = 10;

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      // For demo purposes, we'll create mock history data
      setTimeout(() => {
        const mockHistory: HistoryItem[] = [
          {
            id: 1,
            question: 'What is hypertension?',
            answer: 'Hypertension, or high blood pressure, is a condition where the force of blood against the artery walls is consistently too high. It is often called the "silent killer" because it typically has no symptoms but can lead to serious health problems like heart disease, stroke, and kidney damage.',
            timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
          },
          {
            id: 2,
            question: 'What are the symptoms of diabetes?',
            answer: 'The symptoms of diabetes can vary depending on how elevated your blood sugar is. Common symptoms include increased thirst, frequent urination, extreme hunger, unexplained weight loss, fatigue, irritability, blurred vision, slow-healing sores, and frequent infections.',
            timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
          },
          {
            id: 3,
            question: 'How does the heart work?',
            answer: 'The heart is a muscular organ that works as a pump, pushing blood through the body. It has four chambers and beats about 100,000 times per day, pumping about 2,000 gallons of blood.',
            timestamp: new Date(Date.now() - 172800000).toISOString() // 2 days ago
          }
        ];

        setHistory(mockHistory);
        setTotal(mockHistory.length);
        setLoading(false);
      }, 1000); // Simulate network delay
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to fetch history. This is a demo without a backend.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleViewItem = (item: HistoryItem) => {
    setSelectedItem(item);
  };

  const handleCloseItem = () => {
    setSelectedItem(null);
  };

  const handleDeleteItem = async (id: number) => {
    try {
      // For demo purposes, we'll simulate deleting an item
      setTimeout(() => {
        // Filter out the deleted item
        setHistory(prevHistory => prevHistory.filter(item => item.id !== id));

        // Close the item view if it's the one being deleted
        if (selectedItem && selectedItem.id === id) {
          setSelectedItem(null);
        }
      }, 500); // Simulate network delay
    } catch (err) {
      console.error('Error deleting history item:', err);
      setError('Failed to delete history item. This is a demo without a backend.');
    }
  };

  const handleDownloadPdf = async (answer: string, question?: string) => {
    try {
      // For demo purposes, we'll show an error message
      setError('PDF download is not available in the demo version without a backend.');

      // In a real implementation, this would call the backend API to generate a PDF
      // const response = await qaApi.generatePdf(answer, question);
      // const blob = new Blob([response.data], { type: 'application/pdf' });
      // const url = window.URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = 'examobuddy_answer.pdf';
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      // window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF. This is a demo without a backend.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Question History</h1>

              {error && (
                <div className="rounded-md bg-red-50 p-4 mb-6">
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

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No history found. Start asking questions!</p>
                </div>
              ) : (
                <div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Question
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {history.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 truncate max-w-md">
                                {item.question}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {formatDate(item.timestamp)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleViewItem(item)}
                                className="text-primary-600 hover:text-primary-900 mr-4"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(Math.max(0, page - 1))}
                          disabled={page === 0}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>

                        {Array.from({ length: totalPages }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                              page === i ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}

                        <button
                          onClick={() => handlePageChange(Math.min(totalPages - 1, page + 1))}
                          disabled={page === totalPages - 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  )}
                </div>
              )}

              {selectedItem && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <h2 className="text-xl font-bold text-gray-900">Question Details</h2>
                        <button
                          onClick={handleCloseItem}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-lg font-medium text-gray-900">Question:</h3>
                        <p className="mt-1 text-gray-600">{selectedItem.question}</p>
                      </div>

                      <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-900">Answer:</h3>
                        <div className="mt-2 prose max-w-none">
                          <ReactMarkdown>{selectedItem.answer}</ReactMarkdown>
                        </div>
                      </div>

                      <div className="mt-6">
                        <p className="text-sm text-gray-500">
                          Asked on {formatDate(selectedItem.timestamp)}
                        </p>
                      </div>

                      <div className="mt-6 flex justify-end space-x-4">
                        <button
                          onClick={() => handleDownloadPdf(selectedItem.answer, selectedItem.question)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Download as PDF
                        </button>
                        <button
                          onClick={() => handleDeleteItem(selectedItem.id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
