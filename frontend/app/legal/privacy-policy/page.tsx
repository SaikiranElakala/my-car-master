import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/Simple";
import { PrivacyPolicyContent } from "@/components/legal/PrivacyPolicyContent";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/legal/privacy-policy" } };

export default function Page() {
  return <LegalPage title="Privacy Policy" showDraftNote={false} backgroundImage="/images/cars/Professional%20Vehicle%20Inspection%20Garage.png" backgroundPosition="center 25%" backgroundHeightClassName="flex min-h-[380px] items-center bg-cover bg-center md:min-h-[480px]"><PrivacyPolicyContent /></LegalPage>;
}
