import { useState } from 'react';
import { Upload, Database, Trash2 } from 'lucide-react';
import { loadDatasetFromFile, importDataToDatabase, clearAllData } from '../lib/dataImport';

interface DataImportProps {
  onImportComplete: () => void;
}

export function DataImport({ onImportComplete }: DataImportProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleImport = async () => {
    setLoading(true);
    setMessage('');

    try {
      const data = await loadDatasetFromFile();
      await importDataToDatabase(data);
      setMessage(`Successfully imported ${data.length} records`);
      onImportComplete();
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!confirm('Are you sure you want to clear all data?')) return;

    setLoading(true);
    setMessage('');

    try {
      await clearAllData();
      setMessage('All data cleared successfully');
      onImportComplete();
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Database className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Data Management</h2>
      </div>

      <p className="text-gray-600 mb-6">
        Import the nutrition dataset into the database to begin analysis
      </p>

      <div className="flex gap-3">
        <button
          onClick={handleImport}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Upload className="w-5 h-5" />
          {loading ? 'Importing...' : 'Import Dataset'}
        </button>

        <button
          onClick={handleClear}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-5 h-5" />
          Clear Data
        </button>
      </div>

      {message && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            message.includes('Error')
              ? 'bg-red-50 text-red-700'
              : 'bg-green-50 text-green-700'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
