import { type NextRequest } from "next/server";

const noStoreRedirectHeaders = {
  "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function getRedirectUrl(request: NextRequest, url: string) {
  try {
    return new URL(url, request.url).toString();
  } catch {
    return new URL("/", request.url).toString();
  }
}

async function writeTrackingEvent(event: Record<string, unknown>) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn("Supabase tracking env vars are not configured.");
    return;
  }

  const endpoint = new URL("/rest/v1/email_tracking_events", supabaseUrl);

  const response = await fetch(endpoint.toString(), {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase tracking insert failed: ${response.status} ${errorText}`);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const campaign = searchParams.get("campaign") ?? "";
  const recipient = searchParams.get("recipient") ?? "";
  const token = searchParams.get("token") ?? "";
  const target = searchParams.get("target") ?? "";
  const url = searchParams.get("url") ?? "/";
  const destination = getRedirectUrl(request, url);

  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") ?? "";
  const referer = request.headers.get("referer") ?? "";
  const event = {
    type: "portfolio_click",
    campaign,
    recipient,
    token,
    target,
    url,
    ip,
    user_agent: userAgent,
    referer,
    raw: {
      query: Object.fromEntries(searchParams.entries()),
      destination,
      headers: {
        "x-forwarded-for": request.headers.get("x-forwarded-for") ?? "",
        "x-real-ip": request.headers.get("x-real-ip") ?? "",
        "user-agent": userAgent,
        referer,
      },
      time: new Date().toISOString(),
    },
  };

  try {
    await writeTrackingEvent(event);
  } catch (error) {
    console.error(error);
  }

  return new Response(null, {
    status: 302,
    headers: {
      ...noStoreRedirectHeaders,
      Location: destination,
    },
  });
}
