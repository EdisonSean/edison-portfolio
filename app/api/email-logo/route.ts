import { type NextRequest } from "next/server";

const logoUrl =
  "https://edisonfx-media.oss-cn-hongkong.aliyuncs.com/MyLogo/LOGO_white_alpha_wide.png";

const noStoreImageHeaders = {
  "Content-Type": "image/png",
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

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const campaign = searchParams.get("campaign") ?? "";
  const recipient = searchParams.get("recipient") ?? "";

  console.log(
    JSON.stringify({
      type: "email_logo_loaded",
      campaign,
      recipient,
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent") ?? "",
      referer: request.headers.get("referer") ?? "",
      time: new Date().toISOString(),
    }),
  );

  const logoResponse = await fetch(logoUrl, { cache: "no-store" });

  if (!logoResponse.ok) {
    return new Response("Logo image unavailable", {
      status: 502,
      headers: {
        "Cache-Control": noStoreImageHeaders["Cache-Control"],
        Pragma: noStoreImageHeaders.Pragma,
        Expires: noStoreImageHeaders.Expires,
      },
    });
  }

  return new Response(await logoResponse.arrayBuffer(), {
    headers: noStoreImageHeaders,
  });
}
