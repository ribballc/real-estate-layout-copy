/* ═══════════════════════════════════════════════════════
   CMS-READY VEHICLE DATA — replace with DB/API later
   ═══════════════════════════════════════════════════════ */

export interface VehicleModels {
  [make: string]: string[];
}

/** Optional: model available only in [start, end] (inclusive). Omitted = all years. */
export interface VehicleModelYearRanges {
  [make: string]: { [model: string]: { start: number; end: number } };
}

const currentYear = new Date().getFullYear();

export const vehicleYears: number[] = Array.from(
  { length: currentYear - 1989 },
  (_, i) => currentYear + 1 - i
);

export const vehicleMakes: string[] = [
  "Acura", "Alfa Romeo", "Aston Martin", "Audi",
  "Bentley", "BMW", "Buick",
  "Cadillac", "Chevrolet", "Chrysler",
  "Dodge",
  "Ferrari", "Fiat", "Ford",
  "Genesis", "GMC",
  "Honda", "Hyundai",
  "Infiniti",
  "Jaguar", "Jeep",
  "Kia",
  "Lamborghini", "Land Rover", "Lexus", "Lincoln", "Lotus", "Lucid",
  "Maserati", "Mazda", "McLaren", "Mercedes-Benz", "Mini", "Mitsubishi",
  "Nissan",
  "Polestar", "Pontiac", "Porsche",
  "RAM", "Rivian", "Rolls-Royce",
  "Subaru", "Suzuki",
  "Tesla", "Toyota",
  "Volkswagen", "Volvo",
];

export const vehicleModels: VehicleModels = {
  "Acura": ["ILX", "Integra", "MDX", "NSX", "RDX", "RLX", "TL", "TLX", "TSX", "ZDX"],
  "Alfa Romeo": ["4C", "Giulia", "Stelvio", "Tonale"],
  "Aston Martin": ["DB11", "DB12", "DBX", "Vantage"],
  "Audi": ["A3", "A4", "A5", "A6", "A7", "A8", "e-tron", "e-tron GT", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "R8", "RS3", "RS5", "RS6", "RS7", "S3", "S4", "S5", "S6", "S7", "S8", "SQ5", "SQ7", "SQ8", "TT"],
  "Bentley": ["Bentayga", "Continental GT", "Flying Spur"],
  "BMW": ["2 Series", "3 Series", "4 Series", "5 Series", "7 Series", "8 Series", "i4", "i5", "i7", "iX", "M2", "M3", "M4", "M5", "M8", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "XM", "Z4"],
  "Buick": ["Enclave", "Encore", "Encore GX", "Envision", "LaCrosse", "Regal"],
  "Cadillac": ["CT4", "CT5", "Escalade", "Escalade ESV", "Lyriq", "XT4", "XT5", "XT6"],
  "Chevrolet": ["Blazer", "Bolt", "Camaro", "Colorado", "Corvette", "Equinox", "Express", "Impala", "Malibu", "Silverado 1500", "Silverado 2500HD", "Silverado 3500HD", "Suburban", "Tahoe", "Traverse", "Trailblazer", "Trax"],
  "Chrysler": ["300", "Pacifica", "Voyager"],
  "Dodge": ["Challenger", "Charger", "Durango", "Hornet", "Ram 1500", "Ram 2500", "Ram 3500"],
  "Ferrari": ["296 GTB", "296 GTS", "812", "F8", "Portofino", "Purosangue", "Roma", "SF90"],
  "Fiat": ["500", "500L", "500X"],
  "Ford": ["Bronco", "Bronco Sport", "E-Transit", "Edge", "Escape", "Expedition", "Explorer", "F-150", "F-150 Lightning", "F-250", "F-350", "Maverick", "Mustang", "Mustang Mach-E", "Ranger", "Transit"],
  "Genesis": ["Electrified G80", "Electrified GV70", "G70", "G80", "G90", "GV60", "GV70", "GV80"],
  "GMC": ["Acadia", "Canyon", "Hummer EV", "Sierra 1500", "Sierra 2500HD", "Sierra 3500HD", "Terrain", "Yukon", "Yukon XL"],
  "Honda": ["Accord", "Civic", "CR-V", "HR-V", "Insight", "Odyssey", "Passport", "Pilot", "Prologue", "Ridgeline"],
  "Hyundai": ["Elantra", "Ioniq 5", "Ioniq 6", "Kona", "Palisade", "Santa Cruz", "Santa Fe", "Sonata", "Tucson", "Venue"],
  "Infiniti": ["Q50", "Q60", "QX50", "QX55", "QX60", "QX80"],
  "Jaguar": ["E-PACE", "F-PACE", "F-TYPE", "I-PACE", "XE", "XF"],
  "Jeep": ["Cherokee", "Compass", "Gladiator", "Grand Cherokee", "Grand Cherokee L", "Grand Wagoneer", "Renegade", "Wagoneer", "Wrangler"],
  "Kia": ["Carnival", "EV6", "EV9", "Forte", "K5", "Niro", "Seltos", "Sorento", "Soul", "Sportage", "Stinger", "Telluride"],
  "Lamborghini": ["Huracán", "Revuelto", "Urus"],
  "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Range Rover", "Range Rover Evoque", "Range Rover Sport", "Range Rover Velar"],
  "Lexus": ["ES", "GX", "IS", "LC", "LS", "LX", "NX", "RC", "RX", "RZ", "TX", "UX"],
  "Lincoln": ["Aviator", "Corsair", "Nautilus", "Navigator"],
  "Lotus": ["Eletre", "Emira"],
  "Lucid": ["Air"],
  "Maserati": ["Ghibli", "GranTurismo", "Grecale", "Levante", "MC20", "Quattroporte"],
  "Mazda": ["CX-30", "CX-5", "CX-50", "CX-70", "CX-90", "Mazda3", "Mazda6", "MX-5 Miata", "MX-30"],
  "McLaren": ["720S", "750S", "Artura", "GT"],
  "Mercedes-Benz": ["A-Class", "AMG GT", "C-Class", "CLA", "CLE", "E-Class", "EQB", "EQE", "EQS", "G-Class", "GLA", "GLB", "GLC", "GLE", "GLS", "Maybach", "S-Class", "SL"],
  "Mini": ["Clubman", "Convertible", "Countryman", "Hardtop"],
  "Mitsubishi": ["Eclipse Cross", "Mirage", "Outlander", "Outlander Sport"],
  "Nissan": ["Altima", "Armada", "Frontier", "GT-R", "Kicks", "Leaf", "Maxima", "Murano", "Pathfinder", "Rogue", "Sentra", "Titan", "Versa", "Z"],
  "Polestar": ["Polestar 2", "Polestar 3"],
  "Pontiac": ["G6", "G8", "GTO", "Solstice", "Vibe"],
  "Porsche": ["718 Boxster", "718 Cayman", "911", "Cayenne", "Macan", "Panamera", "Taycan"],
  "RAM": ["1500", "2500", "3500", "ProMaster"],
  "Rivian": ["R1S", "R1T"],
  "Rolls-Royce": ["Cullinan", "Ghost", "Phantom", "Spectre", "Wraith"],
  "Subaru": ["Ascent", "BRZ", "Crosstrek", "Forester", "Impreza", "Legacy", "Outback", "Solterra", "WRX"],
  "Suzuki": ["Grand Vitara", "Jimny", "Swift", "Vitara"],
  "Tesla": ["Cybertruck", "Model 3", "Model S", "Model X", "Model Y"],
  "Toyota": ["4Runner", "bZ4X", "Camry", "Corolla", "Corolla Cross", "Crown", "GR Supra", "Grand Highlander", "Highlander", "Land Cruiser", "Prius", "RAV4", "Sequoia", "Sienna", "Tacoma", "Tundra", "Venza"],
  "Volkswagen": ["Arteon", "Atlas", "Atlas Cross Sport", "Golf", "Golf GTI", "Golf R", "ID.4", "ID.Buzz", "Jetta", "Taos", "Tiguan"],
  "Volvo": ["C40 Recharge", "S60", "S90", "V60", "V90", "XC40", "XC60", "XC90"],
};

/** Year ranges for models; when absent, model is shown for all years. */
export const vehicleModelYearRanges: VehicleModelYearRanges = (() => {
  const y = new Date().getFullYear();
  return {
    "Honda": { "Insight": { start: 1999, end: 2022 }, "Prologue": { start: 2024, end: y } },
    "Toyota": { "bZ4X": { start: 2023, end: y }, "Crown": { start: 2023, end: y }, "GR Supra": { start: 2020, end: y }, "Prius": { start: 1997, end: y } },
    "Ford": { "Bronco": { start: 2021, end: y }, "Bronco Sport": { start: 2021, end: y }, "E-Transit": { start: 2022, end: y }, "F-150 Lightning": { start: 2022, end: y }, "Mustang Mach-E": { start: 2021, end: y }, "Maverick": { start: 2022, end: y } },
    "Chevrolet": { "Bolt": { start: 2017, end: y }, "Blazer": { start: 2019, end: y } },
    "Tesla": { "Cybertruck": { start: 2024, end: y }, "Model 3": { start: 2017, end: y }, "Model Y": { start: 2020, end: y } },
    "Nissan": { "Leaf": { start: 2011, end: y }, "Z": { start: 2023, end: y } },
    "Polestar": { "Polestar 2": { start: 2021, end: y }, "Polestar 3": { start: 2024, end: y } },
    "Rivian": { "R1S": { start: 2022, end: y }, "R1T": { start: 2022, end: y } },
    "Lucid": { "Air": { start: 2022, end: y } },
    "Porsche": { "Taycan": { start: 2020, end: y } },
    "Hyundai": { "Ioniq 5": { start: 2022, end: y }, "Ioniq 6": { start: 2023, end: y } },
    "Kia": { "EV6": { start: 2022, end: y }, "EV9": { start: 2024, end: y } },
    "Genesis": { "Electrified G80": { start: 2022, end: y }, "Electrified GV70": { start: 2022, end: y }, "GV60": { start: 2023, end: y } },
    "Volkswagen": { "ID.4": { start: 2021, end: y }, "ID.Buzz": { start: 2024, end: y } },
    "Subaru": { "Solterra": { start: 2023, end: y } },
    "Mazda": { "MX-30": { start: 2021, end: 2023 } },
    "Mercedes-Benz": { "EQB": { start: 2022, end: y }, "EQE": { start: 2023, end: y }, "EQS": { start: 2022, end: y }, "CLE": { start: 2024, end: y } },
    "BMW": { "i4": { start: 2022, end: y }, "i5": { start: 2024, end: y }, "i7": { start: 2023, end: y }, "iX": { start: 2022, end: y }, "XM": { start: 2023, end: y } },
    "Audi": { "e-tron": { start: 2019, end: y }, "e-tron GT": { start: 2022, end: y }, "Q4 e-tron": { start: 2022, end: y } },
    "Lexus": { "RZ": { start: 2023, end: y }, "TX": { start: 2024, end: y } },
    "Jeep": { "Grand Cherokee L": { start: 2021, end: y }, "Wagoneer": { start: 2022, end: y }, "Grand Wagoneer": { start: 2021, end: y } },
    "Dodge": { "Hornet": { start: 2023, end: y } },
  };
})();

/** Filter models by year; when no range is defined, include model. */
export function getModelsForYear(make: string, year: number): string[] {
  const models = vehicleModels[make];
  if (!models) return [];
  const ranges = vehicleModelYearRanges[make];
  if (!ranges) return models;
  return models.filter((model) => {
    const r = ranges[model];
    if (!r) return true;
    return year >= r.start && year <= r.end;
  });
}
