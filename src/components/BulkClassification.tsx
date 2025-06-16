import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, Download, Loader2 } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { classifyText } from '../lib/deepseek';

interface ProcessedRow {
  title: string;
  ddc?: {
    number: string;
    category: string;
    description: string;
  };
  error?: string;
}

// Maximum number of concurrent requests
const MAX_CONCURRENT = 3; // Reduced from 5 to 3 to avoid rate limiting

// Delay between chunks to prevent rate limiting
const CHUNK_DELAY = 3000; // Increased from 2000ms to 3000ms (3 seconds)

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export function BulkClassification() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedData, setProcessedData] = useState<ProcessedRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process a single title with retry logic
  const processTitle = async (title: string, retryCount = 0): Promise<ProcessedRow> => {
    try {
      const response = await classifyText(title);
      let ddc;
      try {
        ddc = JSON.parse(response);
      } catch (e) {
        throw new Error('Failed to parse classification result');
      }
      return {
        title,
        ddc
      };
    } catch (err) {
      // Retry logic
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying classification for "${title}" (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return processTitle(title, retryCount + 1);
      }
      
      return {
        title,
        error: err instanceof Error ? err.message : 'Classification failed after multiple attempts'
      };
    }
  };

  // Process titles in chunks with error handling
  const processChunk = async (titles: string[]): Promise<ProcessedRow[]> => {
    try {
      // Process titles sequentially within a chunk to avoid overwhelming the API
      const results: ProcessedRow[] = [];
      
      for (const title of titles) {
        try {
          const result = await processTitle(title);
          results.push(result);
          
          // Small delay between individual requests within a chunk
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (e) {
          results.push({
            title,
            error: e instanceof Error ? e.message : 'Failed to process item'
          });
        }
      }
      
      return results;
    } catch (e) {
      console.error('Chunk processing error:', e);
      return titles.map(title => ({
        title,
        error: 'Failed to process chunk'
      }));
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setProcessedData([]);
    setProgress(0);
    setIsProcessing(true);

    try {
      let data: ProcessedRow[] = [];

      if (file.name.endsWith('.csv')) {
        // Parse CSV
        const result = await new Promise<Papa.ParseResult<any>>((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            complete: resolve,
            error: (error) => {
              reject(new Error(`CSV parsing error: ${error.message}`));
            }
          });
        });
        
        // Safely extract titles from the parsed data
        if (result && result.data && Array.isArray(result.data)) {
          data = result.data
            .filter(row => row && typeof row === 'object')
            .map(row => ({ 
              title: (row.title || row.Title || '').toString().trim() // Handle both lowercase and uppercase column names
            }))
            .filter(row => row.title && row.title.length > 0); // Filter out empty titles
        } else {
          throw new Error('Invalid CSV format: No data rows found');
        }
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        // Parse Excel
        try {
          const buffer = await file.arrayBuffer();
          const workbook = XLSX.read(buffer);
          
          if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
            throw new Error('Invalid Excel file: No sheets found');
          }
          
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          if (!worksheet) {
            throw new Error('Invalid Excel file: Empty worksheet');
          }
          
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          if (!Array.isArray(jsonData)) {
            throw new Error('Failed to parse Excel data');
          }
          
          data = jsonData
            .filter(row => row && typeof row === 'object')
            .map((row: any) => ({ 
              title: ((row.title || row.Title || '')).toString().trim() // Handle both lowercase and uppercase column names
            }))
            .filter(row => row.title && row.title.length > 0); // Filter out empty titles
        } catch (e) {
          console.error('Excel parsing error:', e);
          throw new Error('Failed to parse Excel file: ' + (e instanceof Error ? e.message : 'Unknown error'));
        }
      } else {
        throw new Error('Unsupported file format. Please upload a CSV or Excel file.');
      }

      // Filter out rows without titles
      data = data.filter(row => row.title && row.title.trim() !== '');

      if (data.length === 0) {
        throw new Error('No valid titles found in the file. Please ensure your file has a "title" or "Title" column with non-empty values.');
      }

      // Process data in chunks
      const titles = data.map(row => row.title);
      const chunks: string[][] = [];
      
      // Create chunks of MAX_CONCURRENT size
      for (let i = 0; i < titles.length; i += MAX_CONCURRENT) {
        chunks.push(titles.slice(i, i + MAX_CONCURRENT));
      }

      const processedChunks: ProcessedRow[] = [];
      
      // Process each chunk with delay
      for (let i = 0; i < chunks.length; i++) {
        try {
          const chunkResults = await processChunk(chunks[i]);
          processedChunks.push(...chunkResults);
          
          // Update progress
          setProgress(((i + 1) / chunks.length) * 100);
          
          // Update processed data in real-time
          setProcessedData([...processedChunks]);

          // Add delay between chunks to prevent rate limiting
          if (i < chunks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, CHUNK_DELAY));
          }
        } catch (chunkError) {
          console.error('Error processing chunk:', chunkError);
          // Continue with next chunk instead of failing the entire process
          const errorResults = chunks[i].map(title => ({
            title,
            error: 'Failed to process: API connection error'
          }));
          processedChunks.push(...errorResults);
          setProcessedData([...processedChunks]);
        }
      }

    } catch (err) {
      console.error('File processing error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const downloadResults = () => {
    try {
      if (!processedData || processedData.length === 0) {
        setError('No data to download');
        return;
      }
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // Convert data to worksheet format
      const wsData = processedData.map(row => ({
        'Title': row.title || '',
        'DDC Number': row.ddc?.number || '',
        'Category': row.ddc?.category || '',
        'Description': row.ddc?.description || '',
        'Error': row.error || ''
      }));
      
      const ws = XLSX.utils.json_to_sheet(wsData);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Classifications');
      
      // Generate download
      XLSX.writeFile(wb, 'ddc_classifications.xlsx');
    } catch (e) {
      console.error('Download error:', e);
      setError('Failed to download results: ' + (e instanceof Error ? e.message : 'Unknown error'));
    }
  };

  return (
    <div className="w-full space-y-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <FileSpreadsheet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span>Bulk Classification</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Upload a CSV or Excel file with a "title" column to classify multiple items at once.
          Processing is optimized with automatic retries for more reliable results.
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,.xlsx,.xls"
            className="hidden"
            disabled={isProcessing}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className={`
              w-full py-8 px-4 border-2 border-dashed rounded-xl
              flex flex-col items-center justify-center space-y-2
              transition-colors duration-200
              ${isProcessing
                ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600'
                : 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30'
              }
            `}
          >
            <Upload className={`w-8 h-8 ${
              isProcessing ? 'text-gray-400 dark:text-gray-500' : 'text-blue-500 dark:text-blue-400'
            }`} />
            <div className="text-center">
              <span className={`font-medium ${
                isProcessing ? 'text-gray-600 dark:text-gray-400' : 'text-blue-600 dark:text-blue-400'
              }`}>
                {isProcessing ? 'Processing...' : 'Click to upload or drag and drop'}
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                CSV or Excel files only
              </p>
            </div>
          </button>
        </div>

        {/* Progress Bar */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  Processing {processedData.length} of {Math.ceil(progress)} titles...
                </span>
              </div>
              <span className="font-medium text-gray-900 dark:text-gray-100">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Results */}
        {processedData.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Results ({processedData.length} items)
              </h3>
              <button
                onClick={downloadResults}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Excel</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b dark:border-gray-700">
                    <th className="px-4 py-2 text-gray-600 dark:text-gray-400">Title</th>
                    <th className="px-4 py-2 text-gray-600 dark:text-gray-400">DDC Number</th>
                    <th className="px-4 py-2 text-gray-600 dark:text-gray-400">Category</th>
                    <th className="px-4 py-2 text-gray-600 dark:text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {processedData.map((row, index) => (
                    <tr key={index} className="border-b dark:border-gray-700">
                      <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                        {row.title}
                      </td>
                      <td className="px-4 py-2">
                        {row.ddc ? (
                          <span className="font-mono text-blue-600 dark:text-blue-400">
                            {row.ddc.number}
                          </span>
                        ) : (
                          <span className="text-red-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                        {row.ddc?.category || '-'}
                      </td>
                      <td className="px-4 py-2">
                        {row.error ? (
                          <span className="text-red-500">{row.error}</span>
                        ) : (
                          <span className="text-green-500">Success</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}