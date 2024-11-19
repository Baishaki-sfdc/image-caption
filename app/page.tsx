// app/page.tsx
import { ImageProcessor } from '@/components/app-components-image-processor'  // Updated import path

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Snapscribe</h1>
      <ImageProcessor />
    </div>
  )
}