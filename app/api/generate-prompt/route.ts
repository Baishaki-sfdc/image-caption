// app/api/process-image/route.ts
import { NextResponse } from 'next/server';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY; // Get this from Hugging Face
const API_URL = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Convert image to binary data
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Make request to Hugging Face API
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      method: "POST",
      body: buffer,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const generatedPrompt = Array.isArray(result) ? result[0].generated_text : result.generated_text;

    return NextResponse.json({
      success: true,
      generatedPrompt: generatedPrompt,
    });

  } catch (error: any) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to process image',
        success: false
      },
      { status: 500 }
    );
  }
}