import { type NextRequest } from "next/server";

const noStoreRedirectHeaders = {
  "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

const targetPaths = {
  portfolio: "/",
  about: "/about",
} as const;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function getTargetPath(target: string) {
  return target in targetPaths
    ? targetPaths[target as keyof typeof targetPaths]
    : targetPaths.portfolio;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const campaign = searchParams.get("campaign") ?? "";
  const recipient = searchParams.get("recipient") ?? "";
  const target = searchParams.get("target") ?? "portfolio";
  const redirectUrl = new URL(getTargetPath(target), request.url);

  redirectUrl.searchParams.set("utm_source", "email");
  redirectUrl.searchParams.set("utm_medium", "resume");
  redirectUrl.searchParams.set("utm_campaign", campaign);
  redirectUrl.searchParams.set("utm_content", recipient);

  console.log(
    JSON.stringify({
      type: "email_link_clicked",
      campaign,
      recipient,
      target,
      destination: redirectUrl.toString(),
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent") ?? "",
      referer: request.headers.get("referer") ?? "",
      time: new Date().toISOString(),
    }),
  );

  return new Response(null, {
    status: 302,
    headers: {
      ...noStoreRedirectHeaders,
      Location: redirectUrl.toString(),
    },
  });
}
