import type { Brand, VehicleModel, VehicleVariant } from "@/types";

/**
 * Starter list for entering vehicle details. It is not a confirmed list of
 * supported vehicles; customers can enter any make and model and the team
 * confirms service availability after receiving the request.
 */
const brandNames: [string, boolean][] = [
  ["Maruti Suzuki", true], ["Hyundai", true], ["Tata Motors", true], ["Mahindra", true],
  ["Toyota", true], ["Honda", true], ["Kia", true], ["BMW", true],
  ["Volkswagen", false], ["Skoda", false], ["Renault", false], ["Nissan", false], ["MG", false],
  ["Jeep", false], ["Citroen", false], ["Mercedes-Benz", false], ["Audi", false], ["Volvo", false],
  ["Jaguar", false], ["Land Rover", false], ["Lexus", false], ["Porsche", false], ["BYD", false],
  ["Isuzu", false], ["Force Motors", false],
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const brands: Brand[] = brandNames.map(([name, popular]) => ({ id: slug(name), name, popular, isActive: true }));

// Suggested India-market makes and models for quick form entry; not a coverage promise.
const modelNamesByBrand: Record<string, string[]> = {
  "maruti-suzuki": ["Alto K10", "S-Presso", "Celerio", "Wagon R", "Swift", "Dzire", "Baleno", "Fronx", "Brezza", "Grand Vitara", "XL6", "Ertiga", "Invicto", "Jimny", "e Vitara", "Eeco", "Ignis", "Ciaz"],
  hyundai: ["Grand i10 Nios", "i20", "i20 N Line", "Aura", "Exter", "Venue", "Venue N Line", "Verna", "Creta", "Creta N Line", "Creta Electric", "Alcazar", "Tucson", "IONIQ 5"],
  "tata-motors": ["Tiago", "Tiago EV", "Tigor", "Tigor EV", "Altroz", "Punch", "Punch EV", "Nexon", "Nexon EV", "Curvv", "Curvv EV", "Harrier", "Harrier EV", "Safari", "Sierra"],
  mahindra: ["Bolero", "Bolero Neo", "Thar", "Thar Roxx", "Scorpio Classic", "Scorpio N", "XUV 3XO", "XUV700", "BE 6", "XEV 9e", "XEV 9S"],
  toyota: ["Glanza", "Urban Cruiser Taisor", "Urban Cruiser Hyryder", "Rumion", "Innova Crysta", "Innova Hycross", "Fortuner", "Fortuner Legender", "Hilux", "Camry", "Vellfire", "Land Cruiser 300"],
  honda: ["Amaze", "City", "City e:HEV", "Elevate", "Jazz", "WR-V", "Civic", "Accord"],
  kia: ["Sonet", "Syros", "Seltos", "Carens", "Carens Clavis", "Carens Clavis EV", "Carnival", "EV6", "EV9", "Syros EV"],
  bmw: ["2 Series Gran Coupe", "3 Series Long Wheelbase", "5 Series Long Wheelbase", "7 Series", "X1", "X3", "X5", "X7", "XM", "iX1", "iX", "i5", "i7", "Z4", "M2", "M4"],
  volkswagen: ["Virtus", "Taigun", "Tiguan R-Line", "Tayron", "Golf GTI", "Polo", "Vento"],
  skoda: ["Kylaq", "Kushaq", "Slavia", "Kodiaq", "Superb", "Octavia", "Rapid", "Fabia"],
  renault: ["Kwid", "Triber", "Kiger", "Duster", "Lodgy", "Captur"],
  nissan: ["Magnite", "X-Trail", "Kicks", "Sunny", "Terrano"],
  mg: ["Comet EV", "ZS EV", "Windsor EV", "Astor", "Hector", "Hector Plus", "Gloster", "Cyberster", "M9"],
  jeep: ["Compass", "Meridian", "Wrangler", "Grand Cherokee", "Compass Trailhawk", "Renegade"],
  citroen: ["C3", "eC3", "C3 Aircross", "C5 Aircross", "Basalt"],
  "mercedes-benz": ["A-Class Limousine", "C-Class", "E-Class LWB", "S-Class", "GLA", "GLB", "GLC", "GLE", "GLS", "G-Class", "EQB", "EQE SUV", "EQS", "EQS SUV", "Maybach S-Class", "AMG C 43", "AMG G 63"],
  audi: ["A4", "A6", "A8 L", "Q3", "Q3 Sportback", "Q5", "Q5 Sportback", "Q7", "Q8", "Q8 e-tron", "e-tron GT", "S5 Sportback", "RS Q8"],
  volvo: ["EX30", "EX40", "EC40", "XC40", "XC40 Recharge", "XC60", "XC90", "S90"],
  jaguar: ["F-Pace", "I-Pace", "XF", "XE", "F-Type"],
  "land-rover": ["Range Rover", "Range Rover Sport", "Range Rover Velar", "Range Rover Evoque", "Defender", "Discovery", "Discovery Sport"],
  lexus: ["ES", "NX", "RX", "LX", "LM", "LC 500h", "LS"],
  porsche: ["911", "718 Boxster", "718 Cayman", "Macan", "Macan Electric", "Cayenne", "Cayenne Coupe", "Panamera", "Taycan", "Taycan Cross Turismo"],
  byd: ["Atto 3", "Seal", "Sealion 7", "eMax 7"],
  isuzu: ["D-Max V-Cross", "Hi-Lander", "S-CAB", "mu-X"],
  "force-motors": ["Gurkha 3-Door", "Gurkha 5-Door", "Trax Cruiser", "Trax Toofan", "Traveller", "Urbania"],
};

const models: VehicleModel[] = Object.entries(modelNamesByBrand).flatMap(([brandId, names]) =>
  names.map((name, index) => ({
    id: `${brandId}-${slug(name)}`,
    brandId,
    name,
    popular: index < 4,
    isActive: true,
  })),
);

// Variant data is intentionally limited to entries that have been configured.
const variants: VehicleVariant[] = [
  ...["E", "S", "SX", "SX(O)"].map((name) => ({
    id: `hyundai-creta-${slug(name)}`,
    modelId: "hyundai-creta",
    name,
    isActive: true,
  })),
];

const wait = <T,>(v: T) => Promise.resolve(v);

export async function getBrands(query = ""): Promise<Brand[]> {
  const q = query.trim().toLowerCase();
  return wait(brands.filter((b) => b.isActive && b.name.toLowerCase().includes(q)));
}
export async function getModels(brandId: string): Promise<VehicleModel[]> {
  return wait(models.filter((m) => m.brandId === brandId && m.isActive));
}
export async function getVariants(modelId: string): Promise<VehicleVariant[]> {
  return wait(variants.filter((v) => v.modelId === modelId && v.isActive));
}
