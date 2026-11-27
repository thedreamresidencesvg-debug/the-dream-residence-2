import { NextResponse, type NextRequest } from "next/server";

const maintenancePage = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Under construction | The Dream Residence</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #fafaf5;
      color: #1c2028;
      font: 1rem/1.6 system-ui, sans-serif;
    }
    main {
      box-sizing: border-box;
      width: 100%;
      padding: 3rem 1.25rem;
      text-align: center;
    }
    .name {
      margin: 0 0 1rem;
      color: #5c2d91;
      font-weight: 600;
    }
    h1 {
      margin: 0;
      font: 400 clamp(2rem, 7vw, 4.5rem)/1.1 Georgia, serif;
      text-wrap: balance;
    }
    .message {
      margin: 1rem 0 0;
      color: #434a56;
      font-size: 1.125rem;
    }
  </style>
</head>
<body>
  <main>
    <p class="name">The Dream Residence</p>
    <h1>Under construction</h1>
    <p class="message">We&rsquo;ll be back soon.</p>
  </main>
</body>
</html>`;

export function proxy({ nextUrl, method }: NextRequest) {
  const { pathname } = nextUrl;

  // Let staff manage existing bookings and let Stripe report payments already in flight.
  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/api/admin/") ||
    pathname === "/api/webhook/stripe"
  ) {
    return NextResponse.next();
  }

  const headers = { "Cache-Control": "no-store", "Retry-After": "3600" };

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "The Dream Residence is under construction. We'll be back soon." },
      { status: 503, headers },
    );
  }

  return new NextResponse(method === "HEAD" ? null : maintenancePage, {
    status: 503,
    headers: { ...headers, "Content-Type": "text/html; charset=utf-8" },
  });
}

export const config = {
  matcher: ["/((?!_next/static/|icon\\.svg$).*)"],
};
