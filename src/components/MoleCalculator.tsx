import { useState, useEffect } from "react";
import { Calculator, ArrowLeftRight, AlertCircle, Info } from "lucide-react";

interface MoleCalculatorProps {
  lang: "ar" | "en";
}

const ELEMENT_MASSES: Record<string, { mass: number; nameAr: string; nameEn: string }> = {
  H: { mass: 1.008, nameAr: "هيدروجين", nameEn: "Hydrogen" },
  He: { mass: 4.0026, nameAr: "هيليوم", nameEn: "Helium" },
  Li: { mass: 6.94, nameAr: "ليثيوم", nameEn: "Lithium" },
  Be: { mass: 9.0122, nameAr: "بيريليوم", nameEn: "Beryllium" },
  B: { mass: 10.81, nameAr: "بورون", nameEn: "Boron" },
  C: { mass: 12.011, nameAr: "كربون", nameEn: "Carbon" },
  N: { mass: 14.007, nameAr: "نيتروجين", nameEn: "Nitrogen" },
  O: { mass: 15.999, nameAr: "أكسجين", nameEn: "Oxygen" },
  F: { mass: 18.998, nameAr: "فلور", nameEn: "Fluorine" },
  Ne: { mass: 20.180, nameAr: "نيون", nameEn: "Neon" },
  Na: { mass: 22.990, nameAr: "صوديوم", nameEn: "Sodium" },
  Mg: { mass: 24.305, nameAr: "مغنيسيوم", nameEn: "Magnesium" },
  Al: { mass: 26.982, nameAr: "ألومنيوم", nameEn: "Aluminum" },
  Si: { mass: 28.085, nameAr: "سيليكون", nameEn: "Silicon" },
  P: { mass: 30.974, nameAr: "فوسفور", nameEn: "Phosphorus" },
  S: { mass: 32.06, nameAr: "كبريت", nameEn: "Sulfur" },
  Cl: { mass: 35.45, nameAr: "كلور", nameEn: "Chlorine" },
  Ar: { mass: 39.948, nameAr: "أرجون", nameEn: "Argon" },
  K: { mass: 39.098, nameAr: "بوتاسيوم", nameEn: "Potassium" },
  Ca: { mass: 40.078, nameAr: "كالسيوم", nameEn: "Calcium" },
  Fe: { mass: 55.845, nameAr: "حديد", nameEn: "Iron" },
  Cu: { mass: 63.546, nameAr: "نحاس", nameEn: "Copper" },
  Zn: { mass: 65.38, nameAr: "زنك", nameEn: "Zinc" },
  Au: { mass: 196.97, nameAr: "ذهب", nameEn: "Gold" }
};

const SUGGESTED_FORMULAS_AR = [
  { formula: "H2O", name: "الماء" },
  { formula: "CO2", name: "ثاني أكسيد الكربون" },
  { formula: "C6H12O6", name: "الجلوكوز (السكر)" },
  { formula: "H2SO4", name: "حمض الكبريتيك" },
  { formula: "NaCl", name: "ملح الطعام" },
  { formula: "CaCO3", name: "كربونات الكالسيوم" }
];

const SUGGESTED_FORMULAS_EN = [
  { formula: "H2O", name: "Water" },
  { formula: "CO2", name: "Carbon Dioxide" },
  { formula: "C6H12O6", name: "Glucose (Sugar)" },
  { formula: "H2SO4", name: "Sulfuric Acid" },
  { formula: "NaCl", name: "Table Salt" },
  { formula: "CaCO3", name: "Calcium Carbonate" }
];

export default function MoleCalculator({ lang }: MoleCalculatorProps) {
  const [formula, setFormula] = useState("H2O");
  const [mass, setMass] = useState("18.015");
  const [moles, setMoles] = useState("1");
  const [activeCalc, setActiveCalc] = useState<"mass-to-moles" | "moles-to-mass">("mass-to-moles");
  const isEn = lang === "en";

  const suggestions = isEn ? SUGGESTED_FORMULAS_EN : SUGGESTED_FORMULAS_AR;

  // Results of parsing
  const [parsedResult, setParsedResult] = useState<{
    isValid: boolean;
    elements: { symbol: string; count: number; mass: number; totalMass: number; nameAr: string; nameEn: string }[];
    totalMolarMass: number;
  }>({ isValid: true, elements: [], totalMolarMass: 18.015 });

  const parseFormula = (rawFormula: string) => {
    const clean = rawFormula.replace(/\s+/g, "");
    if (!clean) {
      return { isValid: false, elements: [], totalMolarMass: 0 };
    }

    const regex = /([A-Z][a-z]?)([0-9]*)/g;
    let match;
    const elementsList: any[] = [];
    let totalMolarMass = 0;
    let isValid = true;
    let matchedLength = 0;

    while ((match = regex.exec(clean)) !== null) {
      const symbol = match[1];
      const countStr = match[2];
      const count = countStr ? parseInt(countStr, 10) : 1;
      matchedLength += match[0].length;

      const elementData = ELEMENT_MASSES[symbol];
      if (elementData) {
        const mass = elementData.mass;
        const totalMass = mass * count;
        totalMolarMass += totalMass;
        elementsList.push({
          symbol,
          count,
          mass,
          totalMass,
          nameAr: elementData.nameAr,
          nameEn: elementData.nameEn
        });
      } else {
        isValid = false;
      }
    }

    if (matchedLength !== clean.length || clean.length === 0) {
      isValid = false;
    }

    return {
      isValid,
      elements: elementsList,
      totalMolarMass
    };
  };

  useEffect(() => {
    const res = parseFormula(formula);
    setParsedResult(res);
  }, [formula]);

  // Handle mass/moles conversion math
  const handleMassChange = (val: string) => {
    setMass(val);
    const num = parseFloat(val);
    if (!isNaN(num) && parsedResult.totalMolarMass > 0) {
      setMoles((num / parsedResult.totalMolarMass).toFixed(4));
    } else {
      setMoles("");
    }
  };

  const handleMolesChange = (val: string) => {
    setMoles(val);
    const num = parseFloat(val);
    if (!isNaN(num) && parsedResult.totalMolarMass > 0) {
      setMass((num * parsedResult.totalMolarMass).toFixed(3));
    } else {
      setMass("");
    }
  };

  // Recalculate conversions when molar mass changes
  useEffect(() => {
    if (parsedResult.isValid && parsedResult.totalMolarMass > 0) {
      if (activeCalc === "mass-to-moles") {
        const num = parseFloat(mass);
        if (!isNaN(num)) {
          setMoles((num / parsedResult.totalMolarMass).toFixed(4));
        }
      } else {
        const num = parseFloat(moles);
        if (!isNaN(num)) {
          setMass((num * parsedResult.totalMolarMass).toFixed(3));
        }
      }
    }
  }, [parsedResult.totalMolarMass, activeCalc]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl" id="mole-calculator-section">
      <div className="mb-8">
        <h3 className="text-xl sm:text-2xl font-black text-slate-850 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-teal-600 shrink-0" />
          {isEn ? "Molar Mass & Mole Converter" : "حاسبة الكتلة المولية وحساب المولات الكيميائية"}
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          {isEn 
            ? "Enter any chemical formula to calculate its total molar mass, and easily convert grams to moles or vice versa."
            : "اكتب أي صيغة كيميائية لحساب كتلتها المولية بدقة مع إمكانية تحويل الكتل الجرامية إلى مولات كيميائية."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input and Element breakdown */}
        <div>
          <label className="block text-sm font-black text-slate-700 mb-2">
            {isEn ? "Chemical Formula" : "الصيغة الكيميائية للمركب"}
          </label>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder={isEn ? "e.g., H2SO4" : "مثال: H2SO4"}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl font-mono text-base focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
              dir="ltr"
            />
          </div>

          {/* Quick choices */}
          <div className="flex flex-wrap gap-2 mb-6">
            {suggestions.map((item) => (
              <button
                key={item.formula}
                onClick={() => {
                  setFormula(item.formula);
                  if (item.formula === "H2O") setMass("18.015");
                  else if (item.formula === "CO2") setMass("44.009");
                  else if (item.formula === "NaCl") setMass("58.44");
                  else if (item.formula === "C6H12O6") setMass("180.156");
                  else if (item.formula === "H2SO4") setMass("98.079");
                  else if (item.formula === "CaCO3") setMass("100.086");
                }}
                className="text-xs bg-slate-50 hover:bg-teal-50 hover:text-teal-700 text-slate-650 px-3 py-1.5 rounded-lg border border-slate-100 transition-all font-bold"
              >
                {item.formula} <span className="text-[10px] text-slate-400 font-normal">({item.name})</span>
              </button>
            ))}
          </div>

          {/* Parsing status and results */}
          {parsedResult.isValid ? (
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5">
              <span className="text-xs text-slate-400 block mb-3 font-bold uppercase tracking-wider">
                {isEn ? "Molecular Weight Breakdown" : "تفصيل الوزن الجزيئي:"}
              </span>
              <div className="space-y-3">
                {parsedResult.elements.map((el, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <span className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 font-black font-mono flex items-center justify-center text-xs border border-teal-100">
                        {el.symbol}
                      </span>
                      <div>
                        <span className="font-extrabold text-slate-750">
                          {isEn ? el.nameEn : el.nameAr}
                        </span>
                        <span className="text-xs text-slate-400 block font-bold font-mono">
                          {isEn ? "Atomic Weight" : "كتلة العنصر"}: {el.mass.toFixed(3)} g/mol
                        </span>
                      </div>
                    </div>
                    <div className="text-right font-mono" style={{ direction: "ltr" }}>
                      <span className="text-slate-600 font-bold">{el.count} atoms</span>
                      <span className="text-slate-400 mx-1.5">×</span>
                      <span className="font-extrabold text-teal-600">{el.totalMass.toFixed(3)} g</span>
                    </div>
                  </div>
                ))}
                
                {/* Total Molar Mass */}
                <div className="pt-4 mt-2 border-t border-dashed border-slate-200 flex justify-between items-center">
                  <span className="font-black text-slate-800">
                    {isEn ? "Total Molar Mass (M):" : "الكتلة المولية الإجمالية (M):"}
                  </span>
                  <span className="font-black font-mono text-lg text-teal-700">
                    {parsedResult.totalMolarMass.toFixed(3)} <span className="text-xs font-normal">g/mol</span>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 flex gap-3 text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-black">
                  {isEn ? "Invalid Molecular Formula" : "خطأ في صيغة المركب!"}
                </span>
                <p className="text-xs text-rose-700 mt-1.5 leading-relaxed font-bold">
                  {isEn 
                    ? "Make sure you respect standard element capitalization (e.g., write H2O, not h2o). Our parser supports highly common educational elements up to Period 4."
                    : "تأكد من كتابة الرموز بالأحرف الكبيرة والصغيرة بشكل صحيح (مثال: H2O وليس h2o). يدعم البرنامج العناصر الشائعة في القشرة الأرضية والدورات الأربعة الأولى."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Mass to Mole conversions */}
        <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6 border-b border-slate-200/50 pb-4">
              <span className="font-black text-slate-800 flex items-center gap-2 text-sm">
                <ArrowLeftRight className="w-4 h-4 text-teal-600" />
                {isEn ? "Mass ⇌ Moles Converter" : "محول الكميات (جرام ⇌ مول)"}
              </span>
              <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setActiveCalc("mass-to-moles")}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-all font-bold ${
                    activeCalc === "mass-to-moles" ? "bg-teal-600 text-white shadow-xs" : "text-slate-650 hover:bg-slate-50"
                  }`}
                >
                  {isEn ? "Mass → Moles" : "الكتلة ← مول"}
                </button>
                <button
                  onClick={() => setActiveCalc("moles-to-mass")}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-all font-bold ${
                    activeCalc === "moles-to-mass" ? "bg-teal-600 text-white shadow-xs" : "text-slate-650 hover:bg-slate-50"
                  }`}
                >
                  {isEn ? "Moles → Mass" : "المولات ← كتلة"}
                </button>
              </div>
            </div>

            {/* Inputs based on selection */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {isEn ? "Mass in Grams (g)" : "الكتلة بالجرام (g)"}
                </label>
                <input
                  type="number"
                  value={mass}
                  onChange={(e) => handleMassChange(e.target.value)}
                  disabled={!parsedResult.isValid || activeCalc === "moles-to-mass"}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                  placeholder="e.g., 18.0"
                />
              </div>

              <div className="flex justify-center my-1 text-teal-600">
                <ArrowLeftRight className="w-5 h-5 rotate-90" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {isEn ? "Amount of Substance (mol)" : "كمية المادة بالمول (mol)"}
                </label>
                <input
                  type="number"
                  value={moles}
                  onChange={(e) => handleMolesChange(e.target.value)}
                  disabled={!parsedResult.isValid || activeCalc === "mass-to-moles"}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                  placeholder="e.g., 1.0"
                />
              </div>
            </div>

            {/* Dynamic formula explanation */}
            {parsedResult.isValid && parsedResult.totalMolarMass > 0 && (
              <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-5 mt-6 text-xs text-teal-900 leading-relaxed font-bold">
                <span className="font-black text-teal-800 flex items-center gap-1 mb-2">
                  <Info className="w-3.5 h-3.5" /> {isEn ? "Calculation Methodology:" : "المنهجية الحسابية:"}
                </span>
                {activeCalc === "mass-to-moles" ? (
                  <div>
                    <p className="font-mono bg-white py-1 px-2.5 rounded-lg border border-teal-100 inline-block mb-2 text-center shadow-2xs">
                      n = m ÷ M
                    </p>
                    <p className="font-semibold text-slate-700 leading-relaxed">
                      {isEn 
                        ? `Amount in moles (n) = given mass (${parseFloat(mass) || 0} g) ÷ molar mass (${parsedResult.totalMolarMass.toFixed(3)} g/mol) = ` 
                        : `عدد المولات (n) = الكتلة المعطاة بالجرام (${parseFloat(mass) || 0} g) ÷ الكتلة المولية للمركب (${parsedResult.totalMolarMass.toFixed(3)} g/mol) = `}
                      <span className="font-extrabold text-teal-700 underline">{moles || "0"} mol</span>.
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-mono bg-white py-1 px-2.5 rounded-lg border border-teal-100 inline-block mb-2 text-center shadow-2xs">
                      m = n × M
                    </p>
                    <p className="font-semibold text-slate-700 leading-relaxed">
                      {isEn 
                        ? `Mass in grams (m) = substance amount (${parseFloat(moles) || 0} mol) × molar mass (${parsedResult.totalMolarMass.toFixed(3)} g/mol) = `
                        : `الكتلة بالجرام (m) = عدد المولات المطلوب (${parseFloat(moles) || 0} mol) × الكتلة المولية للمركب (${parsedResult.totalMolarMass.toFixed(3)} g/mol) = `}
                      <span className="font-extrabold text-teal-700 underline">{mass || "0"} g</span>.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-[10px] text-center text-slate-400 mt-6 pt-4 border-t border-slate-200/50 font-bold">
            {isEn 
              ? "Interactive Lab Suite • Dr. Tamer Madbouly" 
              : "برنامج المعمل الكيميائي التفاعلي • د. تامر مدبولي"}
          </div>
        </div>
      </div>
    </div>
  );
}
