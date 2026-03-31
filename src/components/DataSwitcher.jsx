import React from 'react';
import { useExcelData } from '../hooks/useExcelData';
import { FileSpreadsheet, Database, RefreshCw, AlertCircle } from 'lucide-react';

const DataSwitcher = () => {
  const { 
    loading, 
    error, 
    useExcelData: isUsingExcelData, 
    loadFromExcel, 
    useMockData 
  } = useExcelData();

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-sm font-medium text-gray-700">Источник данных:</h3>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={useMockData}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                !isUsingExcelData
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              <Database size={16} className="mr-2" />
              Моковые данные
            </button>
            
            <button
              onClick={loadFromExcel}
              disabled={loading}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isUsingExcelData
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <RefreshCw size={16} className="mr-2 animate-spin" />
              ) : (
                <FileSpreadsheet size={16} className="mr-2" />
              )}
              {loading ? 'Загрузка...' : 'Excel файл'}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center text-red-600 text-sm">
            <AlertCircle size={16} className="mr-2" />
            {error}
          </div>
        )}

        {isUsingExcelData && !loading && !error && (
          <div className="flex items-center text-green-600 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Данные из Excel загружены
          </div>
        )}
      </div>
      
      {isUsingExcelData && !loading && !error && (
        <div className="mt-3 text-xs text-gray-500">
          Данные загружены из файла transport_data.xlsx. Для обновления данных нажмите кнопку "Excel файл".
        </div>
      )}
    </div>
  );
};

export default DataSwitcher;
