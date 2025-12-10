import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const staticPath = '/templates/gyro-tendies.zip';

    const redirectUrl = new URL(staticPath, request.nextUrl.origin);

    return NextResponse.redirect(redirectUrl, 302);
    
  } catch (error) {
    console.error('Error serving gyro-tendies template:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred during redirection setup.';

    return NextResponse.json(
      { error: 'Failed to process gyro-tendies template request', details: errorMessage },
      { status: 500 }
    );
  }
}
