import type { Metadata } from "next";
import { SimpleHeader } from "@/components/sections/Simple";
import { Coverage } from "@/components/sections/Coverage";

export const metadata: Metadata = { title: "Locations", alternates: { canonical: "/locations" } };

export default function Page() {
  return (
    <>
      <SimpleHeader title="Locations" lead="Browse service locations across Andhra Pradesh and Telangana." backgroundImage="/images/cars/Mapped%20Roads%2C%20Coastal%20Horizons.png" />
      <Coverage />
    </>
  );
}
