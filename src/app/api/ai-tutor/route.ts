import { NextResponse } from 'next/server';

// This implements a mock streaming response simulating the Ascendia Aria AI behavior.
// Because we don't assume an OPENAI_API_KEY is present in the environment yet,
// this Edge route will stream a highly intelligent simulated response token-by-token.

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, lessonContext, courseContext } = body;

    const encoder = new TextEncoder();

    const mockResponse = `Hello there! I'm Aria, your Ascendia Tutor. \n\nI see you are learning about **${courseContext?.title || 'this topic'}**, specifically asking: *"${question}"*.\n\nBased on the current lesson, I recommend paying close attention to the structural definitions laid out in the first 5 minutes. If you look closely at the framework, you'll see why it solves the specific pain points mentioned in your query.\n\nYou're doing fantastic. Keep that XP streak going! Let me know if you need to break down any specific coding concept.`;

    const stream = new ReadableStream({
      async start(controller) {
        const words = mockResponse.split(' ');
        
        for (let i = 0; i < words.length; i++) {
          // Simulate network/token generation delay
          await new Promise(resolve => setTimeout(resolve, 50));
          controller.enqueue(encoder.encode(words[i] + ' '));
        }
        
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 });
  }
}
