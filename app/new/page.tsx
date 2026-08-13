import { headers } from "next/headers";
import { NewLandingClient } from "./NewLandingClient";
import { parseAcceptLanguage } from "./i18n";

export default async function NewLandingPage() {
  const h = await headers();
  // Vercel's edge network injects these on every request — no third-party lookup needed.
  const city = h.get("x-vercel-ip-city");
  const initialLang = parseAcceptLanguage(h.get("accept-language"));

  return (
    <NewLandingClient
      city={city ? decodeURIComponent(city) : null}
      initialLang={initialLang}
    />
  );
}
