import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "CONFLICT"
  | "INTERNAL_SERVER_ERROR";

export interface ApiErrorPayload {
  error: string;
  code: ApiErrorCode;
}

/**
 * Standardized API Error Response Helper
 */
export function apiError(
  message: string,
  code: ApiErrorCode = "INTERNAL_SERVER_ERROR",
  status: number = 500
) {
  return NextResponse.json<ApiErrorPayload>(
    {
      error: message,
      code,
    },
    { status }
  );
}

/**
 * Standardized API Unauthorized Response Helper.
 * Forces immediate browser-side expiration of next-auth cookies to guard against infinite ghost redirect loops.
 */
export function apiUnauthorized(message: string = "Unauthorized") {
  const response = NextResponse.json<ApiErrorPayload>(
    {
      error: message,
      code: "UNAUTHORIZED",
    },
    { status: 401 }
  );

  const cookieNames = [
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "authjs.session-token",
    "__Secure-authjs.session-token",
  ];

  cookieNames.forEach((name) => {
    response.cookies.set(name, "", {
      path: "/",
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  });

  return response;
}

/**
 * Standardized API Success Response Helper
 */
export function apiSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}
