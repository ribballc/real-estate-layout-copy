/* ═══════════════════════════════════════════════════════
   CMS-READY VEHICLE DATA — replace with DB/API later
   ═══════════════════════════════════════════════════════ */

export interface VehicleModels {
  [make: string]: string[];
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
