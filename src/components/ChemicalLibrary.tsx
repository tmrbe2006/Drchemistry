import React, { useState, useMemo } from "react";
import { Search, Database, Plus, Beaker, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Chemical {
  nameEn: string;
  nameAr: string;
  formula: string;
  weight: number;
  category: "organic" | "inorganic" | "acid" | "base" | "salt";
}

const CHEMICALS: Chemical[] = [
  // Inorganic
  { nameEn: "Water", nameAr: "ماء", formula: "H2O", weight: 18.015, category: "inorganic" },
  { nameEn: "Carbon Dioxide", nameAr: "ثاني أكسيد الكربون", formula: "CO2", weight: 44.01, category: "inorganic" },
  { nameEn: "Oxygen", nameAr: "أكسجين", formula: "O2", weight: 31.998, category: "inorganic" },
  { nameEn: "Nitrogen", nameAr: "نيتروجين", formula: "N2", weight: 28.014, category: "inorganic" },
  { nameEn: "Hydrogen Peroxide", nameAr: "فوق أكسيد الهيدروجين", formula: "H2O2", weight: 34.014, category: "inorganic" },
  { nameEn: "Sulfur Dioxide", nameAr: "ثاني أكسيد الكبريت", formula: "SO2", weight: 64.06, category: "inorganic" },
  { nameEn: "Ozone", nameAr: "أوزون", formula: "O3", weight: 47.998, category: "inorganic" },
  { nameEn: "Carbon Monoxide", nameAr: "أول أكسيد الكربون", formula: "CO", weight: 28.01, category: "inorganic" },
  { nameEn: "Silicon Dioxide", nameAr: "ثاني أكسيد السيليكون", formula: "SiO2", weight: 60.08, category: "inorganic" },
  
  // Organic
  { nameEn: "Methane", nameAr: "ميثان", formula: "CH4", weight: 16.04, category: "organic" },
  { nameEn: "Ethane", nameAr: "إيثان", formula: "C2H6", weight: 30.07, category: "organic" },
  { nameEn: "Propane", nameAr: "بروبان", formula: "C3H8", weight: 44.1, category: "organic" },
  { nameEn: "Butane", nameAr: "بوتان", formula: "C4H10", weight: 58.12, category: "organic" },
  { nameEn: "Pentane", nameAr: "بنتان", formula: "C5H12", weight: 72.15, category: "organic" },
  { nameEn: "Hexane", nameAr: "هكسان", formula: "C6H14", weight: 86.18, category: "organic" },
  { nameEn: "Glucose", nameAr: "جلوكوز", formula: "C6H12O6", weight: 180.16, category: "organic" },
  { nameEn: "Ethanol", nameAr: "إيثانول", formula: "C2H5OH", weight: 46.07, category: "organic" },
  { nameEn: "Methanol", nameAr: "ميثانول", formula: "CH3OH", weight: 32.04, category: "organic" },
  { nameEn: "Acetone", nameAr: "أسيتون", formula: "C3H6O", weight: 58.08, category: "organic" },
  { nameEn: "Benzene", nameAr: "بنزين", formula: "C6H6", weight: 78.11, category: "organic" },
  { nameEn: "Sucrose", nameAr: "سكروز", formula: "C12H22O11", weight: 342.3, category: "organic" },
  { nameEn: "Glycerol", nameAr: "جليسرول", formula: "C3H8O3", weight: 92.09, category: "organic" },
  { nameEn: "Urea", nameAr: "يوريا", formula: "CO(NH2)2", weight: 60.06, category: "organic" },
  { nameEn: "Formaldehyde", nameAr: "فورمالديهايد", formula: "CH2O", weight: 30.03, category: "organic" },
  { nameEn: "Aspirin", nameAr: "أسبرين", formula: "C9H8O4", weight: 180.16, category: "organic" },
  { nameEn: "Caffeine", nameAr: "كافيين", formula: "C8H10N4O2", weight: 194.19, category: "organic" },
  
  // Acids
  { nameEn: "Sulfuric Acid", nameAr: "حمض الكبريتيك", formula: "H2SO4", weight: 98.08, category: "acid" },
  { nameEn: "Hydrochloric Acid", nameAr: "حمض الهيدروكلوريك", formula: "HCl", weight: 36.46, category: "acid" },
  { nameEn: "Nitric Acid", nameAr: "حمض النيتريك", formula: "HNO3", weight: 63.01, category: "acid" },
  { nameEn: "Phosphoric Acid", nameAr: "حمض الفوسفوريك", formula: "H3PO4", weight: 97.99, category: "acid" },
  { nameEn: "Acetic Acid", nameAr: "حمض الأسيتيك", formula: "CH3COOH", weight: 60.05, category: "acid" },
  { nameEn: "Citric Acid", nameAr: "حمض الستريك", formula: "C6H8O7", weight: 192.12, category: "acid" },
  { nameEn: "Carbonic Acid", nameAr: "حمض الكربونيك", formula: "H2CO3", weight: 62.03, category: "acid" },
  { nameEn: "Formic Acid", nameAr: "حمض الفورميك", formula: "HCOOH", weight: 46.03, category: "acid" },
  { nameEn: "Oxalic Acid", nameAr: "حمض الأوكساليك", formula: "H2C2O4", weight: 90.03, category: "acid" },
  { nameEn: "Hydrofluoric Acid", nameAr: "حمض الهيدروفلوريك", formula: "HF", weight: 20.01, category: "acid" },
  { nameEn: "Hydrobromic Acid", nameAr: "حمض الهيدروبروميك", formula: "HBr", weight: 80.91, category: "acid" },
  { nameEn: "Perchloric Acid", nameAr: "حمض البيركلوريك", formula: "HClO4", weight: 100.46, category: "acid" },
  
  // Bases
  { nameEn: "Sodium Hydroxide", nameAr: "هيدروكسيد الصوديوم", formula: "NaOH", weight: 39.997, category: "base" },
  { nameEn: "Potassium Hydroxide", nameAr: "هيدروكسيد البوتاسيوم", formula: "KOH", weight: 56.105, category: "base" },
  { nameEn: "Calcium Hydroxide", nameAr: "هيدروكسيد الكالسيوم", formula: "Ca(OH)2", weight: 74.093, category: "base" },
  { nameEn: "Ammonia", nameAr: "أمونيا", formula: "NH3", weight: 17.031, category: "base" },
  { nameEn: "Magnesium Hydroxide", nameAr: "هيدروكسيد المغنيسيوم", formula: "Mg(OH)2", weight: 58.32, category: "base" },
  { nameEn: "Aluminum Hydroxide", nameAr: "هيدروكسيد الألومنيوم", formula: "Al(OH)3", weight: 78.0, category: "base" },
  { nameEn: "Lithium Hydroxide", nameAr: "هيدروكسيد الليثيوم", formula: "LiOH", weight: 23.95, category: "base" },
  { nameEn: "Barium Hydroxide", nameAr: "هيدروكسيد الباريوم", formula: "Ba(OH)2", weight: 171.34, category: "base" },
  
  // Salts
  { nameEn: "Sodium Chloride", nameAr: "كلوريد الصوديوم", formula: "NaCl", weight: 58.44, category: "salt" },
  { nameEn: "Calcium Carbonate", nameAr: "كربونات الكالسيوم", formula: "CaCO3", weight: 100.09, category: "salt" },
  { nameEn: "Potassium Permanganate", nameAr: "برمنجنات البوتاسيوم", formula: "KMnO4", weight: 158.03, category: "salt" },
  { nameEn: "Silver Nitrate", nameAr: "نترات الفضة", formula: "AgNO3", weight: 169.87, category: "salt" },
  { nameEn: "Sodium Bicarbonate", nameAr: "بيكربونات الصوديوم", formula: "NaHCO3", weight: 84.01, category: "salt" },
  { nameEn: "Magnesium Sulfate", nameAr: "كبريتات المغنيسيوم", formula: "MgSO4", weight: 120.37, category: "salt" },
  { nameEn: "Copper(II) Sulfate", nameAr: "كبريتات النحاس الثنائي", formula: "CuSO4", weight: 159.61, category: "salt" },
  { nameEn: "Aluminum Sulfate", nameAr: "كبريتات الألومنيوم", formula: "Al2(SO4)3", weight: 342.15, category: "salt" },
  { nameEn: "Ammonium Nitrate", nameAr: "نترات الأمونيوم", formula: "NH4NO3", weight: 80.04, category: "salt" },
  { nameEn: "Potassium Chloride", nameAr: "كلوريد البوتاسيوم", formula: "KCl", weight: 74.55, category: "salt" },
  { nameEn: "Sodium Carbonate", nameAr: "كربونات الصوديوم", formula: "Na2CO3", weight: 105.99, category: "salt" },
  { nameEn: "Calcium Chloride", nameAr: "كلوريد الكالسيوم", formula: "CaCl2", weight: 110.98, category: "salt" },
  { nameEn: "Iron(III) Chloride", nameAr: "كلوريد الحديد الثلاثي", formula: "FeCl3", weight: 162.2, category: "salt" },
  { nameEn: "Zinc Sulfate", nameAr: "كبريتات الزنك", formula: "ZnSO4", weight: 161.47, category: "salt" },
  { nameEn: "Barium Sulfate", nameAr: "كبريتات الباريوم", formula: "BaSO4", weight: 233.39, category: "salt" },
  { nameEn: "Lead(II) Nitrate", nameAr: "نترات الرصاص الثنائي", formula: "Pb(NO3)2", weight: 331.2, category: "salt" },
  { nameEn: "Potassium Iodide", nameAr: "يوديد البوتاسيوم", formula: "KI", weight: 166.0, category: "salt" },
  { nameEn: "Sodium Sulfate", nameAr: "كبريتات الصوديوم", formula: "Na2SO4", weight: 142.04, category: "salt" },
  { nameEn: "Nickel(II) Chloride", nameAr: "كلوريد النيكل الثنائي", formula: "NiCl2", weight: 129.6, category: "salt" },
  { nameEn: "Cobalt(II) Chloride", nameAr: "كلوريد الكوبالت الثنائي", formula: "CoCl2", weight: 129.8, category: "salt" },
  
  // Indicators & Others
  { nameEn: "Phenolphthalein", nameAr: "فينولفثالين", formula: "C20H14O4", weight: 318.32, category: "organic" },
  { nameEn: "Methyl Orange", nameAr: "ميثيل برتقالي", formula: "C14H14N3NaO3S", weight: 327.33, category: "organic" },
  { nameEn: "Starch", nameAr: "نشا", formula: "(C6H10O5)n", weight: 162.14, category: "organic" },
  { nameEn: "Potassium Dichromate", nameAr: "ثاني كرومات البوتاسيوم", formula: "K2Cr2O7", weight: 294.18, category: "salt" },
  { nameEn: "Potassium Chromate", nameAr: "كرومات البوتاسيوم", formula: "K2CrO4", weight: 194.19, category: "salt" },
  { nameEn: "Silver Chloride", nameAr: "كلوريد الفضة", formula: "AgCl", weight: 143.32, category: "salt" },
  { nameEn: "Silver Bromide", nameAr: "بروميد الفضة", formula: "AgBr", weight: 187.77, category: "salt" },
  { nameEn: "Silver Iodide", nameAr: "يوديد الفضة", formula: "AgI", weight: 234.77, category: "salt" },
  { nameEn: "Barium Chloride", nameAr: "كلوريد الباريوم", formula: "BaCl2", weight: 208.23, category: "salt" },
  { nameEn: "Ammonium Hydroxide", nameAr: "هيدروكسيد الأمونيوم", formula: "NH4OH", weight: 35.04, category: "base" },
  { nameEn: "Hydrogen Sulfide", nameAr: "كبريتيد الهيدروجين", formula: "H2S", weight: 34.08, category: "inorganic" },
  { nameEn: "Sulfur Trioxide", nameAr: "ثالث أكسيد الكبريت", formula: "SO3", weight: 80.06, category: "inorganic" },
  { nameEn: "Phosphorus Pentoxide", nameAr: "خامس أكسيد الفوسفور", formula: "P2O5", weight: 141.94, category: "inorganic" },
  { nameEn: "Calcium Oxide", nameAr: "أكسيد الكالسيوم", formula: "CaO", weight: 56.08, category: "inorganic" },
  { nameEn: "Iron(III) Oxide", nameAr: "أكسيد الحديد الثلاثي", formula: "Fe2O3", weight: 159.69, category: "inorganic" },
  { nameEn: "Magnesium Oxide", nameAr: "أكسيد المغنيسيوم", formula: "MgO", weight: 40.3, category: "inorganic" },
  { nameEn: "Copper(II) Oxide", nameAr: "أكسيد النحاس الثنائي", formula: "CuO", weight: 79.55, category: "inorganic" },
  { nameEn: "Lead(II) Oxide", nameAr: "أكسيد الرصاص الثنائي", formula: "PbO", weight: 223.2, category: "inorganic" },
  { nameEn: "Zinc Oxide", nameAr: "أكسيد الزنك", formula: "ZnO", weight: 81.38, category: "inorganic" },
  { nameEn: "Aluminum Oxide", nameAr: "أكسيد الألومنيوم", formula: "Al2O3", weight: 101.96, category: "inorganic" },
  
  // More Inorganic & Salts
  { nameEn: "Sodium Cyanide", nameAr: "سيانيد الصوديوم", formula: "NaCN", weight: 49.01, category: "salt" },
  { nameEn: "Potassium Cyanide", nameAr: "سيانيد البوتاسيوم", formula: "KCN", weight: 65.12, category: "salt" },
  { nameEn: "Barium Nitrate", nameAr: "نترات الباريوم", formula: "Ba(NO3)2", weight: 261.34, category: "salt" },
  { nameEn: "Lead(II) Sulfate", nameAr: "كبريتات الرصاص الثنائي", formula: "PbSO4", weight: 303.26, category: "salt" },
  { nameEn: "Mercury(II) Chloride", nameAr: "كلوريد الزئبق الثنائي", formula: "HgCl2", weight: 271.5, category: "salt" },
  { nameEn: "Tin(II) Chloride", nameAr: "كلوريد القصدير الثنائي", formula: "SnCl2", weight: 189.6, category: "salt" },
  { nameEn: "Manganese(II) Sulfate", nameAr: "كبريتات المنجنيز الثنائي", formula: "MnSO4", weight: 151.0, category: "salt" },
  { nameEn: "Potassium Bromide", nameAr: "بروميد البوتاسيوم", formula: "KBr", weight: 119.0, category: "salt" },
  { nameEn: "Sodium Thiosulfate", nameAr: "ثيوسلفات الصوديوم", formula: "Na2S2O3", weight: 158.11, category: "salt" },
  { nameEn: "Ammonium Sulfate", nameAr: "كبريتات الأمونيوم", formula: "(NH4)2SO4", weight: 132.14, category: "salt" },
  { nameEn: "Ammonium Chloride", nameAr: "كلوريد الأمونيوم", formula: "NH4Cl", weight: 53.49, category: "salt" },
  { nameEn: "Iron(II) Sulfate", nameAr: "كبريتات الحديد الثنائي", formula: "FeSO4", weight: 151.9, category: "salt" },
  { nameEn: "Calcium Phosphate", nameAr: "فوسفات الكالسيوم", formula: "Ca3(PO4)2", weight: 310.18, category: "salt" },
  { nameEn: "Sodium Nitrate", nameAr: "نترات الصوديوم", formula: "NaNO3", weight: 84.99, category: "salt" },
  { nameEn: "Potassium Nitrate", nameAr: "نترات البوتاسيوم", formula: "KNO3", weight: 101.1, category: "salt" },

  // More Organic
  { nameEn: "Toluene", nameAr: "تولوين", formula: "C7H8", weight: 92.14, category: "organic" },
  { nameEn: "Phenol", nameAr: "فينول", formula: "C6H6O", weight: 94.11, category: "organic" },
  { nameEn: "Aniline", nameAr: "أنيلين", formula: "C6H7N", weight: 93.13, category: "organic" },
  { nameEn: "Benzoic Acid", nameAr: "حمض البنزويك", formula: "C7H6O2", weight: 122.12, category: "acid" },
  { nameEn: "Salicylic Acid", nameAr: "حمض الساليسيليك", formula: "C7H6O3", weight: 138.12, category: "acid" },
  { nameEn: "Ethylene Glycol", nameAr: "إيثيلين جليكول", formula: "C2H6O2", weight: 62.07, category: "organic" },
  { nameEn: "Naphthalene", nameAr: "نفتالين", formula: "C10H8", weight: 128.17, category: "organic" },
  { nameEn: "Pyridine", nameAr: "بيريدين", formula: "C5H5N", weight: 79.1, category: "organic" },
  { nameEn: "Diethyl Ether", nameAr: "إيثير ثنائي الإيثيل", formula: "C4H10O", weight: 74.12, category: "organic" },
  { nameEn: "Ethyl Acetate", nameAr: "أسيتات الإيثيل", formula: "C4H8O2", weight: 88.11, category: "organic" },
  { nameEn: "Chloroform", nameAr: "كلوروفورم", formula: "CHCl3", weight: 119.38, category: "organic" },
  { nameEn: "Dichloromethane", nameAr: "ثنائي كلورو ميثان", formula: "CH2Cl2", weight: 84.93, category: "organic" },
  { nameEn: "Carbon Tetrachloride", nameAr: "رابع كلوريد الكربون", formula: "CCl4", weight: 153.82, category: "organic" },

  // More Gases
  { nameEn: "Hydrogen", nameAr: "هيدروجين", formula: "H2", weight: 2.016, category: "inorganic" },
  { nameEn: "Chlorine", nameAr: "كلور", formula: "Cl2", weight: 70.9, category: "inorganic" },
  { nameEn: "Helium", nameAr: "هيليوم", formula: "He", weight: 4.003, category: "inorganic" },
  { nameEn: "Argon", nameAr: "أرجون", formula: "Ar", weight: 39.948, category: "inorganic" },
  { nameEn: "Neon", nameAr: "نيون", formula: "Ne", weight: 20.18, category: "inorganic" },
  { nameEn: "Nitrous Oxide", nameAr: "أكسيد النيتروز", formula: "N2O", weight: 44.01, category: "inorganic" },
  { nameEn: "Nitric Oxide", nameAr: "أكسيد النيتريك", formula: "NO", weight: 30.01, category: "inorganic" },
  { nameEn: "Nitrogen Dioxide", nameAr: "ثاني أكسيد النيتروجين", formula: "NO2", weight: 46.01, category: "inorganic" },
  { nameEn: "Sulfur Hexafluoride", nameAr: "سداسي فلوريد الكبريت", formula: "SF6", weight: 146.06, category: "inorganic" },
  
  // Even More Inorganic & Salts
  { nameEn: "Sodium Phosphite", nameAr: "فوسفيت الصوديوم", formula: "Na2HPO3", weight: 125.96, category: "salt" },
  { nameEn: "Potassium Perchlorate", nameAr: "بيركلورات البوتاسيوم", formula: "KClO4", weight: 138.55, category: "salt" },
  { nameEn: "Magnesium Carbonate", nameAr: "كربونات المغنيسيوم", formula: "MgCO3", weight: 84.31, category: "salt" },
  { nameEn: "Barium Carbonate", nameAr: "كربونات الباريوم", formula: "BaCO3", weight: 197.34, category: "salt" },
  { nameEn: "Strontium Carbonate", nameAr: "كربونات السترونشيوم", formula: "SrCO3", weight: 147.63, category: "salt" },
  { nameEn: "Lithium Carbonate", nameAr: "كربونات الليثيوم", formula: "Li2CO3", weight: 73.89, category: "salt" },
  { nameEn: "Sodium Chromate", nameAr: "كرومات الصوديوم", formula: "Na2CrO4", weight: 161.97, category: "salt" },
  { nameEn: "Sodium Dichromate", nameAr: "ثاني كرومات الصوديوم", formula: "Na2Cr2O7", weight: 261.97, category: "salt" },
  { nameEn: "Ammonium Dichromate", nameAr: "ثاني كرومات الأمونيوم", formula: "(NH4)2Cr2O7", weight: 252.06, category: "salt" },
  { nameEn: "Potassium Ferrocyanide", nameAr: "فيروسيانيد البوتاسيوم", formula: "K4[Fe(CN)6]", weight: 368.35, category: "salt" },
  { nameEn: "Potassium Ferricyanide", nameAr: "فيريسيانيد البوتاسيوم", formula: "K3[Fe(CN)6]", weight: 329.24, category: "salt" },
  
  // More Complex Organic
  { nameEn: "Ascorbic Acid", nameAr: "حمض الأسكوربيك", formula: "C6H8O6", weight: 176.12, category: "organic" },
  { nameEn: "Lactic Acid", nameAr: "حمض اللاكتيك", formula: "C3H6O3", weight: 90.08, category: "organic" },
  { nameEn: "Tartaric Acid", nameAr: "حمض الطرطريك", formula: "C4H6O6", weight: 150.09, category: "organic" },
  { nameEn: "Malic Acid", nameAr: "حمض الماليك", formula: "C4H6O5", weight: 134.09, category: "organic" },
  { nameEn: "Nicotine", nameAr: "نيكوتين", formula: "C10H14N2", weight: 162.23, category: "organic" },
  { nameEn: "Cholesterol", nameAr: "كوليسترول", formula: "C27H46O", weight: 386.65, category: "organic" },
  { nameEn: "Menthol", nameAr: "منثول", formula: "C10H20O", weight: 156.27, category: "organic" },
  { nameEn: "Vanillin", nameAr: "فانيلين", formula: "C8H8O3", weight: 152.15, category: "organic" },
  { nameEn: "Camphor", nameAr: "كافور", formula: "C10H16O", weight: 152.23, category: "organic" },
  { nameEn: "Indigo", nameAr: "أنديجو", formula: "C16H10N2O2", weight: 262.26, category: "organic" },
  { nameEn: "Quinine", nameAr: "كينين", formula: "C20H24N2O2", weight: 324.42, category: "organic" },
  { nameEn: "Penicillin G", nameAr: "بنسلين جي", formula: "C16H18N2O4S", weight: 334.39, category: "organic" },
  { nameEn: "Vitamin B12", nameAr: "فيتامين ب12", formula: "C63H88CoN14O14P", weight: 1355.37, category: "organic" },
  
  // Reagents & Others
  { nameEn: "Sodium Azide", nameAr: "أزيد الصوديوم", formula: "NaN3", weight: 65.01, category: "inorganic" },
  { nameEn: "Hydrazine", nameAr: "هيدرازين", formula: "N2H4", weight: 32.05, category: "inorganic" },
  { nameEn: "Hydroxylamine", nameAr: "هيدروكسيل أمين", formula: "NH2OH", weight: 33.03, category: "inorganic" },
  { nameEn: "Thionyl Chloride", nameAr: "كلوريد الثيونيل", formula: "SOCl2", weight: 118.97, category: "inorganic" },
  { nameEn: "Phosphorus Trichloride", nameAr: "ثالث كلوريد الفوسفور", formula: "PCl3", weight: 137.33, category: "inorganic" },
  { nameEn: "Phosphorus Pentachloride", nameAr: "خامس كلوريد الفوسفور", formula: "PCl5", weight: 208.24, category: "inorganic" },
  { nameEn: "Lithium Aluminum Hydride", nameAr: "هيدريد ألومنيوم الليثيوم", formula: "LiAlH4", weight: 37.95, category: "inorganic" },
  { nameEn: "Sodium Borohydride", nameAr: "بورهيدريد الصوديوم", formula: "NaBH4", weight: 37.83, category: "inorganic" },
  { nameEn: "Tetrahydrofuran", nameAr: "رباعي هيدرو فوران", formula: "C4H8O", weight: 72.11, category: "organic" },
  { nameEn: "Dimethyl Sulfoxide", nameAr: "ثنائي ميثيل سلفوكسيد", formula: "C2H6OS", weight: 78.13, category: "organic" },
  { nameEn: "Acetonitrile", nameAr: "أسيتونتريل", formula: "C2H3N", weight: 41.05, category: "organic" },
  
  // More Acids & Bases
  { nameEn: "Periodic Acid", nameAr: "حمض البيروديك", formula: "HIO4", weight: 191.91, category: "acid" },
  { nameEn: "Hypochlorous Acid", nameAr: "حمض الهيبوكلوروز", formula: "HClO", weight: 52.46, category: "acid" },
  { nameEn: "Chlorous Acid", nameAr: "حمض الكلوروز", formula: "HClO2", weight: 68.46, category: "acid" },
  { nameEn: "Hydrazoic Acid", nameAr: "حمض الهيدرازويك", formula: "HN3", weight: 43.03, category: "acid" },
  { nameEn: "Sulfurous Acid", nameAr: "حمض الكبريتوز", formula: "H2SO3", weight: 82.07, category: "acid" },
  { nameEn: "Potassium Hydride", nameAr: "هيدريد البوتاسيوم", formula: "KH", weight: 40.11, category: "base" },
  { nameEn: "Sodium Amide", nameAr: "أميد الصوديوم", formula: "NaNH2", weight: 39.01, category: "base" },
  { nameEn: "Cesium Hydroxide", nameAr: "هيدروكسيد السيزيوم", formula: "CsOH", weight: 149.91, category: "base" },
  
  // More Salts
  { nameEn: "Sodium Fluoride", nameAr: "فلوريد الصوديوم", formula: "NaF", weight: 41.99, category: "salt" },
  { nameEn: "Potassium Fluoride", nameAr: "فلوريد البوتاسيوم", formula: "KF", weight: 58.1, category: "salt" },
  { nameEn: "Calcium Fluoride", nameAr: "فلوريد الكالسيوم", formula: "CaF2", weight: 78.07, category: "salt" },
  { nameEn: "Lithium Chloride", nameAr: "كلوريد الليثيوم", formula: "LiCl", weight: 42.39, category: "salt" },
  { nameEn: "Sodium Iodide", nameAr: "يوديد الصوديوم", formula: "NaI", weight: 149.89, category: "salt" },
  { nameEn: "Potassium Bromate", nameAr: "برومات البوتاسيوم", formula: "KBrO3", weight: 167.0, category: "salt" },
  { nameEn: "Sodium Chlorate", nameAr: "كلورات الصوديوم", formula: "NaClO3", weight: 106.44, category: "salt" },
  { nameEn: "Ammonium Phosphate", nameAr: "فوسفات الأمونيوم", formula: "(NH4)3PO4", weight: 149.09, category: "salt" },
  { nameEn: "Iron(II) Chloride", nameAr: "كلوريد الحديد الثنائي", formula: "FeCl2", weight: 126.75, category: "salt" },
  { nameEn: "Nickel(II) Sulfate", nameAr: "كبريتات النيكل الثنائي", formula: "NiSO4", weight: 154.75, category: "salt" },
  { nameEn: "Cobalt(II) Nitrate", nameAr: "نترات الكوبالت الثنائي", formula: "Co(NO3)2", weight: 182.94, category: "salt" },
  { nameEn: "Zinc Chloride", nameAr: "كلوريد الزنك", formula: "ZnCl2", weight: 136.3, category: "salt" },
  { nameEn: "Manganese(IV) Oxide", nameAr: "ثاني أكسيد المنجنيز", formula: "MnO2", weight: 86.94, category: "inorganic" },
  
  // More Organics
  { nameEn: "Isopropanol", nameAr: "إيزوبروبانول", formula: "C3H8O", weight: 60.1, category: "organic" },
  { nameEn: "Cyclohexane", nameAr: "هكسان حلقي", formula: "C6H12", weight: 84.16, category: "organic" },
  { nameEn: "Ethylene", nameAr: "إيثيلين", formula: "C2H4", weight: 28.05, category: "organic" },
  { nameEn: "Acetylene", nameAr: "أسيتيلين", formula: "C2H2", weight: 26.04, category: "organic" },
  { nameEn: "Urea", nameAr: "يوريا", formula: "CH4N2O", weight: 60.06, category: "organic" },
  { nameEn: "Glycine", nameAr: "جليسين", formula: "C2H5NO2", weight: 75.07, category: "organic" },
  { nameEn: "Alanine", nameAr: "ألانين", formula: "C3H7NO2", weight: 89.09, category: "organic" },
  { nameEn: "Butanoic Acid", nameAr: "حمض البوتانويك", formula: "C4H8O2-acid", weight: 88.11, category: "acid" },
  { nameEn: "Propanoic Acid", nameAr: "حمض البروبانويك", formula: "C3H6O2", weight: 74.08, category: "acid" },
  { nameEn: "Maleic Acid", nameAr: "حمض الماليك", formula: "C4H4O4", weight: 116.07, category: "acid" },
  { nameEn: "Fumaric Acid", nameAr: "حمض الفوماريك", formula: "C4H4O4-fumaric", weight: 116.07, category: "acid" },
  
  // More Minerals & Crystals
  { nameEn: "Gypsum", nameAr: "جبس", formula: "CaSO4·2H2O", weight: 172.17, category: "salt" },
  { nameEn: "Epsom Salt", nameAr: "ملح إبسوم", formula: "MgSO4·7H2O", weight: 246.47, category: "salt" },
  { nameEn: "Blue Vitriol", nameAr: "الزاج الأزرق", formula: "CuSO4·5H2O", weight: 249.68, category: "salt" },
  { nameEn: "Alum", nameAr: "شبة", formula: "KAl(SO4)2·12H2O", weight: 474.39, category: "salt" },
  { nameEn: "Borax", nameAr: "بورق", formula: "Na2B4O7·10H2O", weight: 381.37, category: "salt" },
  
  // Noble Gases Compounds (Rare)
  { nameEn: "Xenon Difluoride", nameAr: "ثنائي فلوريد الزينون", formula: "XeF2", weight: 169.29, category: "inorganic" },
  { nameEn: "Xenon Tetrafluoride", nameAr: "رباعي فلوريد الزينون", formula: "XeF4", weight: 207.28, category: "inorganic" },
  { nameEn: "Xenon Hexafluoride", nameAr: "سداسي فلوريد الزينون", formula: "XeF6", weight: 245.28, category: "inorganic" },
  { nameEn: "Xenon Tetroxide", nameAr: "رابع أكسيد الزينون", formula: "XeO4", weight: 195.29, category: "inorganic" },
];

interface ChemicalLibraryProps {
  lang: "ar" | "en";
  onSelect: (formula: string) => void;
}

export default function ChemicalLibrary({ lang, onSelect }: ChemicalLibraryProps) {
  const isEn = lang === "en";
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredChemicals = useMemo(() => {
    return CHEMICALS.filter(c => {
      const matchesSearch = 
        c.nameEn.toLowerCase().includes(search.toLowerCase()) ||
        c.nameAr.includes(search) ||
        c.formula.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = activeCategory ? c.category === activeCategory : true;
      
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const categories = [
    { id: "organic", labelEn: "Organic", labelAr: "عضوية" },
    { id: "inorganic", labelEn: "Inorganic", labelAr: "غير عضوية" },
    { id: "acid", labelEn: "Acids", labelAr: "أحماض" },
    { id: "base", labelEn: "Bases", labelAr: "قواعد" },
    { id: "salt", labelEn: "Salts", labelAr: "أملاح" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-150 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-full max-h-[600px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl">
            <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-850 dark:text-white leading-none">
              {isEn ? "Formula Library" : "مكتبة الصيغ الكيميائية"}
            </h3>
            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest">
              {isEn ? "Quick Reference" : "مرجع سريع"}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isEn ? "Search chemical or formula..." : "ابحث عن مادة أو صيغة..."}
          className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 rounded-2xl py-3 pl-10 pr-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden transition-all dark:text-white"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-black whitespace-nowrap transition-all ${
            activeCategory === null 
              ? "bg-slate-850 text-white dark:bg-white dark:text-slate-900" 
              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200"
          }`}
        >
          {isEn ? "All" : "الكل"}
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black whitespace-nowrap transition-all ${
              activeCategory === cat.id 
                ? "bg-indigo-600 text-white" 
                : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            {isEn ? cat.labelEn : cat.labelAr}
          </button>
        ))}
      </div>

      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-2">
        <AnimatePresence mode="popLayout">
          {filteredChemicals.length > 0 ? (
            filteredChemicals.map((chem, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={`${chem.nameEn}-${chem.formula}-${idx}`}
                className="group p-3 bg-slate-50 dark:bg-slate-850 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl border border-slate-200/50 dark:border-slate-800 transition-all cursor-pointer flex items-center justify-between"
                onClick={() => onSelect(chem.formula.split('-')[0])}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-750 shadow-xs group-hover:border-indigo-200 transition-all">
                    <Beaker className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 leading-tight">
                      {isEn ? chem.nameEn : chem.nameAr}
                    </h4>
                    <p className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {chem.formula}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500">
                    MW: {chem.weight}
                  </span>
                  <button className="p-1.5 bg-indigo-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 shadow-md">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-850 rounded-full flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-800">
                <Info className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold text-sm">
                {isEn ? "No results found" : "لا توجد نتائج"}
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
