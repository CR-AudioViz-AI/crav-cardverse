'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Upload,
  FileSpreadsheet,
  Download,
  Check,
  AlertCircle,
} from 'lucide-react'

export default function ImportCardsPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<any[]>([])
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Please upload a CSV file')
        return
      }
      setFile(selectedFile)
      setError('')
      
      // Parse CSV preview
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        const lines = text.split('\n').slice(0, 6) // Header + 5 rows
        const parsed = lines.map(line => line.split(','))
        setPreview(parsed)
      }
      reader.readAsText(selectedFile)
    }
  }

  const handleImport = async () => {
    if (!file) return
    setLoading(true)
    
    // Simulate import
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    router.push('/collection?imported=true')
  }

  const downloadTemplate = () => {
    const template = 'name,category,set_name,card_number,year,rarity,condition,purchase_price,current_value\nCharizard Holo,pokemon,Base Set,4/102,1999,rare,near mint,500,12000\nMichael Jordan Rookie,sports,1986 Fleer,57,1986,rare,excellent,1000,15000'
    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cravcards_template.csv'
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Link 
          href="/collection"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Collection
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Import Cards</h1>
        <p className="text-gray-400 mb-8">Bulk import your collection from a CSV file</p>

        {/* Template Download */}
        <div className="bg-gray-900/50 rounded-xl p-6 border border-purple-900/30 mb-6">
          <div className="flex items-start gap-4">
            <FileSpreadsheet className="w-10 h-10 text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white mb-1">CSV Template</h2>
              <p className="text-gray-400 text-sm mb-3">
                Download our template to ensure your data is formatted correctly
              </p>
              <button
                onClick={downloadTemplate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition border border-green-600/50"
              >
                <Download className="w-4 h-4" />
                Download Template
              </button>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`bg-gray-900/50 rounded-xl p-12 border-2 border-dashed cursor-pointer transition ${
            file ? 'border-green-500' : 'border-gray-700 hover:border-purple-500'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <div className="text-center">
            {file ? (
              <>
                <Check className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-gray-400 text-sm mt-1">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-white font-medium">Click to upload CSV</p>
                <p className="text-gray-400 text-sm mt-1">or drag and drop</p>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Preview */}
        {preview.length > 0 && (
          <div className="mt-6 bg-gray-900/50 rounded-xl p-6 border border-purple-900/30">
            <h3 className="text-lg font-bold text-white mb-4">Preview</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    {preview[0]?.map((header: string, i: number) => (
                      <th key={i} className="text-left py-2 px-3 text-gray-400 font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(1).map((row, rowIdx) => (
                    <tr key={rowIdx} className="border-b border-gray-800">
                      {row.map((cell: string, cellIdx: number) => (
                        <td key={cellIdx} className="py-2 px-3 text-gray-300">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-500 text-sm mt-3">
              Showing first 5 rows. Full import will process all rows.
            </p>
          </div>
        )}

        {/* Import Button */}
        {file && (
          <button
            onClick={handleImport}
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold rounded-xl transition"
          >
            {loading ? 'Importing...' : 'Import Cards'}
          </button>
        )}
      </div>
    </div>
  )
}
