// components/image-processor.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Upload, ImageIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export function ImageProcessor() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
      setProcessedImage(null)
      setGeneratedPrompt(null)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (file) {
      setIsLoading(true)
      setError(null)
      
      const formData = new FormData()
      formData.append('image', file)
      
      try {
        const response = await fetch('/api/generate-prompt', {
          method: 'POST',
          body: formData,
        })
        
        const result = await response.json()
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to process image')
        }

        setProcessedImage(preview)
        setGeneratedPrompt(result.generatedPrompt)
      } catch (error: any) {
        console.error('Error processing image:', error)
        setError(error.message || 'Failed to process image. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Upload an Image</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center justify-center w-full">
              <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:hover:border-gray-500">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <Input id="dropzone-file" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </Label>
            </div>
            {preview && (
              <div className="mt-4">
                <Image src={preview} alt="Preview of uploaded image" width={300} height={300} className="rounded-lg mx-auto" />
              </div>
            )}
            <Button type="submit" disabled={!file || isLoading} className="w-full">
              {isLoading ? 'Processing...' : 'Generate Prompt'}
            </Button>
          </form>

          {/* Error message display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {generatedPrompt && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Generated Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">{generatedPrompt}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {(processedImage || preview) && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Uploaded Image</CardTitle>
          </CardHeader>
          <CardContent>
            <Image 
              src={processedImage || preview!} 
              alt="Uploaded image" 
              width={300} 
              height={300} 
              className="rounded-lg mx-auto" 
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}