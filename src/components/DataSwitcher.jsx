import React from 'react';
import { useApiData } from '../hooks/useApiData';
import { Database, RefreshCw, AlertCircle, Server } from 'lucide-react';

const DataSwitcher = () => {
  const { 
    loading, 
    error, 
    useApiData: isUsingApiData, 
    loadFromApi, 
    refreshData 
  } = useApiData();

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-sm font-medium text-gray-700">Источник данных:</h3>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={loadFromApi}
              disabled={loading}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isUsingApiData
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <RefreshCw size={16} className="mr-2 animate-spin" />
              ) : (
                <Server size={16} className="mr-2" />
              )}
              {loading ? 'Loading...' : 'Database'}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center text-red-600 text-sm">
            <AlertCircle size={16} className="mr-2" />
            {error}
          </div>
        )}

        {isUsingApiData && !loading && !error && (
          <div className="flex items-center text-green-600 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Data loaded from database
          </div>
        )}
      </div>
      
      {isUsingApiData && !loading && !error && (
        <div className="mt-3 text-xs text-gray-500">
          Data loaded from PostgreSQL database. Click "Database" button to refresh data.
        </div>
      )}
    </div>
  );
};

export default DataSwitcher;
