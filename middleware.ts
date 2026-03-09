import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = request.headers.get('x-next-locale') || 'de';

  if (request.headers.get('x-middleware-rewrite')) {
    return NextResponse.next();
  }

  if (pathname === '/' || !pathname.startsWith(`/${locale}`)) {
    const url = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url);
    return NextResponse.redirect(url, { headers: { 'x-middleware-rewrite': 'true' } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
