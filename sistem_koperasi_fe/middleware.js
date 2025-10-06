import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  console.log('Middleware - Accessing Path:', path);
  console.log('Middleware - Secret Key:', SECRET_KEY);

  if (path === "/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get("accessToken")?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, { 
      algorithms: ["HS512"]
    });
    
    return NextResponse.next();
  } catch (err) {
    console.error('Error Details:', {
      name: err.name,
      code: err.code,
      message: err.message,
      stack: err.stack
    });
    
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ],
};
