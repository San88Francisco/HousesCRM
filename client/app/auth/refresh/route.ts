import { type NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  try {
    const { refreshToken } = await request.json();

    console.log('📥 Received refresh request in Next.js route');
    console.log('🔑 Refresh token present:', !!refreshToken);

    if (!refreshToken) {
      console.log('❌ No refresh token provided');
      return NextResponse.json({ error: 'Refresh token is required' }, { status: 400 });
    }

    console.log('📤 Forwarding to backend:', `${process.env.API_URL}/auth/refresh-token`);

    const response = await fetch(`${process.env.API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    console.log('📥 Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Backend error:', errorText);
      return NextResponse.json({ error: 'Failed to refresh token' }, { status: 401 });
    }

    const data = await response.json();
    console.log('✅ Backend success, returning new tokens');

    return NextResponse.json({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
  } catch (error) {
    console.error('💥 Refresh token error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
