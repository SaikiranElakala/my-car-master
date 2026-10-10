export type Brand = { id: string; name: string; popular?: boolean; isActive: boolean };
export type VehicleModel = { id: string; brandId: string; name: string; popular?: boolean; isActive: boolean };
export type VehicleVariant = { id: string; modelId: string; name: string; isActive: boolean };

export type ServiceInfo = {
  slug: string;
  name: string;
  startingPricePaise: number | null; // backend-controlled later
  bookable: boolean;
};

export type FaqItem = { q: string; a: string; service?: string };
export type ChecklistGroup = { category: string; items: string[] };
