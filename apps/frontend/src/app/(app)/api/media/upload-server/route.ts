import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Disable body size limit for large file uploads
export const maxDuration = 120; // 2 minutes timeout


export const POST = async (request: NextRequest) => {
  const cookieStore = await cookies();

  // Read auth token from cookie (NOT_SECURED mode stores in cookie)
  const authCookie = cookieStore.get('auth')?.value;
  const showorgCookie = cookieStore.get('showorg')?.value;
  const impersonateCookie = cookieStore.get('impersonate')?.value;

  // Also check request headers for NOT_SECURED header-based auth
  const authHeader =
    request.headers.get('auth') || authCookie || '';
  const showorgHeader =
    request.headers.get('showorg') || showorgCookie || '';

  const backendUrl =
    process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

  // Forward the raw multipart/form-data body to the backend
  const formData = await request.formData();

  const headers: Record<string, string> = {
    ...(authHeader ? { auth: authHeader } : {}),
    ...(showorgHeader ? { showorg: showorgHeader } : {}),
    ...(impersonateCookie ? { impersonate: impersonateCookie } : {}),
  };

  try {
    const backendResponse = await fetch(
      `${backendUrl}/media/upload-server`,
      {
        method: 'POST',
        body: formData,
        headers,
      }
    );

    const responseData = await backendResponse.json();

    return NextResponse.json(responseData, {
      status: backendResponse.status,
    });
  } catch (err: any) {
    console.error('[upload-proxy] Error forwarding to backend:', err?.message);
    return NextResponse.json(
      { error: 'Upload failed', details: err?.message },
      { status: 500 }
    );
  }
};

// Required for large file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};
