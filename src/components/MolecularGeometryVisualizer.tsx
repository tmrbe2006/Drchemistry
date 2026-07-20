import { useState, useEffect, useRef } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";
import { 
  Sparkles, 
  RotateCw, 
  Compass, 
  Activity, 
  Info,
  Layers,
  Zap,
  Maximize2
} from "lucide-react";

interface Atom {
  symbol: string;
  x: number;
  y: number;
  z: number;
  color: string;
  radius: number; // visual size
  name: string;
  nameAr: string;
  electronegativity: number;
}

interface MoleculeData {
  formula: string;
  nameEn: string;
  nameAr: string;
  geometryEn: string;
  geometryAr: string;
  vsepr: string;
  hybridization: string;
  bondAngle: string;
  polarityEn: string;
  polarityAr: string;
  descriptionEn: string;
  descriptionAr: string;
  atoms: Atom[];
  bonds: [number, number][]; // index pairs representing bonds
  lonePairs?: { x: number; y: number; z: number }[]; // optional lone pairs coordinates
}

const MOLECULES: Record<string, MoleculeData> = {
  H2O: {
    formula: "H₂O",
    nameEn: "Water",
    nameAr: "الماء",
    geometryEn: "Bent / V-shaped",
    geometryAr: "منحنٍ / على شكل V",
    vsepr: "AX₂E₂",
    hybridization: "sp³",
    bondAngle: "104.5°",
    polarityEn: "Highly Polar",
    polarityAr: "قطبي للغاية",
    descriptionEn: "The bent shape of water is due to the two lone pairs on the oxygen atom, which exert strong repulsive forces on the O-H single bonds, reducing the angle from tetrahedral 109.5° to 104.5°.",
    descriptionAr: "الشكل المنحني للماء يرجع لوجود زوجين حرين من الإلكترونات على ذرة الأكسجين، حيث يمارسان قوة تنافر قوية على الروابط الأحادية بين الأكسجين والهيدروجين، مما يقلص الزاوية من 109.5° إلى 104.5°.",
    atoms: [
      { symbol: "O", x: 0, y: -0.3, z: 0, color: "#ef4444", radius: 18, name: "Oxygen", nameAr: "أكسجين", electronegativity: 3.44 },
      { symbol: "H", x: -0.85, y: 0.6, z: 0, color: "#f1f5f9", radius: 11, name: "Hydrogen", nameAr: "هيدروجين", electronegativity: 2.20 },
      { symbol: "H", x: 0.85, y: 0.6, z: 0, color: "#f1f5f9", radius: 11, name: "Hydrogen", nameAr: "هيدروجين", electronegativity: 2.20 }
    ],
    bonds: [[0, 1], [0, 2]],
    lonePairs: [
      { x: -0.4, y: -0.9, z: 0.5 },
      { x: 0.4, y: -0.9, z: -0.5 }
    ]
  },
  CO2: {
    formula: "CO₂",
    nameEn: "Carbon Dioxide",
    nameAr: "ثاني أكسيد الكربون",
    geometryEn: "Linear",
    geometryAr: "خطي",
    vsepr: "AX₂",
    hybridization: "sp",
    bondAngle: "180°",
    polarityEn: "Nonpolar",
    polarityAr: "غير قطبي",
    descriptionEn: "Carbon dioxide forms a symmetrical linear molecule. Although the individual C=O double bonds are highly polar, their dipoles pull in exactly opposite directions, canceling each other out.",
    descriptionAr: "جزيء ثاني أكسيد الكربون خطي متماثل. بالرغم من أن روابط C=O الثنائية قطبية للغاية، إلا أن عزوم القطبية تسحب في اتجاهين متعاكسين تماماً، مما يلغي بعضها بعضاً.",
    atoms: [
      { symbol: "C", x: 0, y: 0, z: 0, color: "#374151", radius: 16, name: "Carbon", nameAr: "كربون", electronegativity: 2.55 },
      { symbol: "O", x: -1.2, y: 0, z: 0, color: "#ef4444", radius: 18, name: "Oxygen", nameAr: "أكسجين", electronegativity: 3.44 },
      { symbol: "O", x: 1.2, y: 0, z: 0, color: "#ef4444", radius: 18, name: "Oxygen", nameAr: "أكسجين", electronegativity: 3.44 }
    ],
    bonds: [[0, 1], [0, 2]]
  },
  CH4: {
    formula: "CH₄",
    nameEn: "Methane",
    nameAr: "الميثان",
    geometryEn: "Tetrahedral",
    geometryAr: "رباعي الأوجه منتظم",
    vsepr: "AX₄",
    hybridization: "sp³",
    bondAngle: "109.5°",
    polarityEn: "Nonpolar",
    polarityAr: "غير قطبي",
    descriptionEn: "Methane has perfect tetrahedral symmetry. The carbon atom shares four sp³ hybrid orbitals with four hydrogen atoms, placing them at equal 109.5° angles to minimize electrostatic repulsion.",
    descriptionAr: "للميثان تماثل رباعي الأوجه مثالي. تشترك ذرة الكربون في أربعة مدارات هجينة من النوع sp³ مع أربع ذرات هيدروجين، مما يضعها عند زوايا متساوية تبلغ 109.5° لتقليل التنافر الكهروستاتيكي.",
    atoms: [
      { symbol: "C", x: 0, y: 0, z: 0, color: "#374151", radius: 16, name: "Carbon", nameAr: "كربون", electronegativity: 2.55 },
      { symbol: "H", x: 0, y: -1.1, z: 0, color: "#f1f5f9", radius: 11, name: "Hydrogen", nameAr: "هيدروجين", electronegativity: 2.20 },
      { symbol: "H", x: -0.85, y: 0.4, z: 0.7, color: "#f1f5f9", radius: 11, name: "Hydrogen", nameAr: "هيدروجين", electronegativity: 2.20 },
      { symbol: "H", x: 0.85, y: 0.4, z: 0.7, color: "#f1f5f9", radius: 11, name: "Hydrogen", nameAr: "هيدروجين", electronegativity: 2.20 },
      { symbol: "H", x: 0, y: 0.4, z: -1.0, color: "#f1f5f9", radius: 11, name: "Hydrogen", nameAr: "هيدروجين", electronegativity: 2.20 }
    ],
    bonds: [[0, 1], [0, 2], [0, 3], [0, 4]]
  },
  NH3: {
    formula: "NH₃",
    nameEn: "Ammonia",
    nameAr: "الأمونيا (النشادر)",
    geometryEn: "Trigonal Pyramidal",
    geometryAr: "هرمي ثلاثي القواعد",
    vsepr: "AX₃E",
    hybridization: "sp³",
    bondAngle: "107°",
    polarityEn: "Polar",
    polarityAr: "قطبي",
    descriptionEn: "Ammonia forms a pyramid with a triangular base. The single lone pair on nitrogen repels the three N-H bonds downward, reducing the ideal bond angle from tetrahedral 109.5° to 107°.",
    descriptionAr: "تشكل الأمونيا هرماً بقاعدة ثلاثية. يضغط الزوج الإلكتروني الحر المنفرد على النيتروجين الروابط الثلاثية N-H لأسفل، مما يقلص زاوية الرابطة المثالية من 109.5° إلى 107°.",
    atoms: [
      { symbol: "N", x: 0, y: -0.2, z: 0, color: "#3b82f6", radius: 17, name: "Nitrogen", nameAr: "نيتروجين", electronegativity: 3.04 },
      { symbol: "H", x: -0.85, y: 0.5, z: 0.5, color: "#f1f5f9", radius: 11, name: "Hydrogen", nameAr: "هيدروجين", electronegativity: 2.20 },
      { symbol: "H", x: 0.85, y: 0.5, z: 0.5, color: "#f1f5f9", radius: 11, name: "Hydrogen", nameAr: "هيدروجين", electronegativity: 2.20 },
      { symbol: "H", x: 0, y: 0.5, z: -0.9, color: "#f1f5f9", radius: 11, name: "Hydrogen", nameAr: "هيدروجين", electronegativity: 2.20 }
    ],
    bonds: [[0, 1], [0, 2], [0, 3]],
    lonePairs: [
      { x: 0, y: -0.9, z: 0 }
    ]
  },
  BF3: {
    formula: "BF₃",
    nameEn: "Boron Trifluoride",
    nameAr: "ثالث فلوريد البورون",
    geometryEn: "Trigonal Planar",
    geometryAr: "مستوٍ ثلاثي الأوجه",
    vsepr: "AX₃",
    hybridization: "sp²",
    bondAngle: "120°",
    polarityEn: "Nonpolar",
    polarityAr: "غير قطبي",
    descriptionEn: "Boron trifluoride is an electron-deficient molecule featuring perfect trigonal planar symmetry with 120° angles. The Boron atom has only 6 valence electrons in this stable Lewis structure.",
    descriptionAr: "ثالث فلوريد البورون جزيء يعاني من نقص إلكتروني، يتميز بتماثل مستوٍ ثلاثي الأوجه مثالي بزوايا 120°. تمتلك ذرة البورون 6 إلكترونات تكافؤ فقط في هذا التركيب المستقر.",
    atoms: [
      { symbol: "B", x: 0, y: 0, z: 0, color: "#f59e0b", radius: 15, name: "Boron", nameAr: "بورون", electronegativity: 2.04 },
      { symbol: "F", x: 0, y: -1.1, z: 0, color: "#10b981", radius: 16, name: "Fluorine", nameAr: "فلور", electronegativity: 3.98 },
      { symbol: "F", x: -0.95, y: 0.55, z: 0, color: "#10b981", radius: 16, name: "Fluorine", nameAr: "فلور", electronegativity: 3.98 },
      { symbol: "F", x: 0.95, y: 0.55, z: 0, color: "#10b981", radius: 16, name: "Fluorine", nameAr: "فلور", electronegativity: 3.98 }
    ],
    bonds: [[0, 1], [0, 2], [0, 3]]
  },
  SF6: {
    formula: "SF₆",
    nameEn: "Sulfur Hexafluoride",
    nameAr: "سداسي فلوريد الكبريت",
    geometryEn: "Octahedral",
    geometryAr: "ثماني الأوجه",
    vsepr: "AX₆",
    hybridization: "sp³d²",
    bondAngle: "90°",
    polarityEn: "Nonpolar",
    polarityAr: "غير قطبي",
    descriptionEn: "An expanded octet compound where sulfur is coordinated by six fluorine atoms in octahedral symmetry. All F-S-F angles are exactly 90° or 180°, and there are no lone pairs on the central atom.",
    descriptionAr: "مركب ذو ثمانية ممتدة (أوكتيت ممتد)، حيث يحيط بذرة الكبريت المركزية ست ذرات فلور بتماثل ثماني الأوجه. كافة زوايا F-S-F تبلغ 90° أو 180°، ولا توجد أزواج حرة على الذرة المركزية.",
    atoms: [
      { symbol: "S", x: 0, y: 0, z: 0, color: "#eab308", radius: 17, name: "Sulfur", nameAr: "كبريت", electronegativity: 2.58 },
      { symbol: "F", x: 0, y: -1.1, z: 0, color: "#10b981", radius: 15, name: "Fluorine", nameAr: "فلور", electronegativity: 3.98 },
      { symbol: "F", x: 0, y: 1.1, z: 0, color: "#10b981", radius: 15, name: "Fluorine", nameAr: "فلور", electronegativity: 3.98 },
      { symbol: "F", x: -1.1, y: 0, z: 0, color: "#10b981", radius: 15, name: "Fluorine", nameAr: "فلور", electronegativity: 3.98 },
      { symbol: "F", x: 1.1, y: 0, z: 0, color: "#10b981", radius: 15, name: "Fluorine", nameAr: "فلور", electronegativity: 3.98 },
      { symbol: "F", x: 0, y: 0, z: 1.1, color: "#10b981", radius: 15, name: "Fluorine", nameAr: "فلور", electronegativity: 3.98 },
      { symbol: "F", x: 0, y: 0, z: -1.1, color: "#10b981", radius: 15, name: "Fluorine", nameAr: "فلور", electronegativity: 3.98 }
    ],
    bonds: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6]]
  },
  BeCl2: {
    formula: "BeCl₂",
    nameEn: "Beryllium Chloride",
    nameAr: "كلوريد البيريليوم",
    geometryEn: "Linear",
    geometryAr: "خطي",
    vsepr: "AX₂",
    hybridization: "sp",
    bondAngle: "180°",
    polarityEn: "Nonpolar",
    polarityAr: "غير قطبي",
    descriptionEn: "Beryllium is an exceptional group 2 element that prefers covalent bonding. Its gaseous monomer BeCl₂ has linear molecular geometry with zero lone pairs on Be.",
    descriptionAr: "البيريليوم عنصر استثنائي في المجموعة الثانية يفضل الارتباط التساهمي. مونومير كلوريد البيريليوم BeCl₂ الغازي يمتلك بنية جزيئية خطية متماثلة بزاوية 180 درجة.",
    atoms: [
      { symbol: "Be", x: 0, y: 0, z: 0, color: "#ec4899", radius: 14, name: "Beryllium", nameAr: "بيريليوم", electronegativity: 1.57 },
      { symbol: "Cl", x: -1.3, y: 0, z: 0, color: "#84cc16", radius: 17, name: "Chlorine", nameAr: "كلور", electronegativity: 3.16 },
      { symbol: "Cl", x: 1.3, y: 0, z: 0, color: "#84cc16", radius: 17, name: "Chlorine", nameAr: "كلور", electronegativity: 3.16 }
    ],
    bonds: [[0, 1], [0, 2]]
  }
};

interface VisualizerProps {
  promptText?: string;
  lang: "ar" | "en";
}

export default function MolecularGeometryVisualizer({ promptText = "", lang }: VisualizerProps) {
  const isEn = lang === "en";
  const [selectedKey, setSelectedKey] = useState<string>("H2O");
  const [rotation, setRotation] = useState({ theta: -0.3, phi: 0.4 }); // Initial rotation angles (X and Y axis)
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-detect compound formula in prompt text
  useEffect(() => {
    if (!promptText) return;
    const cleanPrompt = promptText.toUpperCase();
    
    // Check for each compound in prompt
    if (cleanPrompt.includes("H2O") || cleanPrompt.includes("WATER") || cleanPrompt.includes("الماء")) {
      setSelectedKey("H2O");
    } else if (cleanPrompt.includes("CO2") || cleanPrompt.includes("CARBON DIOXIDE") || cleanPrompt.includes("ثاني أكسيد الكربون")) {
      setSelectedKey("CO2");
    } else if (cleanPrompt.includes("CH4") || cleanPrompt.includes("METHANE") || cleanPrompt.includes("ميثان")) {
      setSelectedKey("CH4");
    } else if (cleanPrompt.includes("NH3") || cleanPrompt.includes("AMMONIA") || cleanPrompt.includes("نشادر") || cleanPrompt.includes("أمونيا")) {
      setSelectedKey("NH3");
    } else if (cleanPrompt.includes("BF3") || cleanPrompt.includes("BORON TRIFLUORIDE") || cleanPrompt.includes("البورون")) {
      setSelectedKey("BF3");
    } else if (cleanPrompt.includes("SF6") || cleanPrompt.includes("SULFUR HEXAFLUORIDE") || cleanPrompt.includes("الكبريت")) {
      setSelectedKey("SF6");
    } else if (cleanPrompt.includes("BECL2") || cleanPrompt.includes("BERYLLIUM") || cleanPrompt.includes("بيريليوم")) {
      setSelectedKey("BeCl2");
    }
  }, [promptText]);

  const activeMolecule = MOLECULES[selectedKey] || MOLECULES.H2O;

  // 3D rotation math function
  const rotatePoint = (x: number, y: number, z: number, theta: number, phi: number) => {
    // Rotate around Y axis (phi)
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);
    let x1 = x * cosPhi - z * sinPhi;
    let z1 = x * sinPhi + z * cosPhi;
    let y1 = y;

    // Rotate around X axis (theta)
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);
    let x2 = x1;
    let y2 = y1 * cosTheta - z1 * sinTheta;
    let z2 = y1 * sinTheta + z1 * cosTheta;

    return { x: x2, y: y2, z: z2 };
  };

  // Drag controls to rotate molecule
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    setRotation((prev) => ({
      theta: prev.theta + dy * 0.01,
      phi: prev.phi + dx * 0.01
    }));
    
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  // Touch support for dragging
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    isDragging.current = true;
    dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.current.x;
    const dy = e.touches[0].clientY - dragStart.current.y;
    
    setRotation((prev) => ({
      theta: prev.theta + dy * 0.01,
      phi: prev.phi + dx * 0.01
    }));
    
    dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const resetRotation = () => {
    setRotation({ theta: -0.3, phi: 0.4 });
  };

  // Center & Scale of molecular SVG projection
  const scale = 75;
  const centerX = 120;
  const centerY = 120;

  // Project atoms with sorting by Z depth to handle visual overlapping
  const projectedAtoms = activeMolecule.atoms.map((atom, idx) => {
    const rotated = rotatePoint(atom.x, atom.y, atom.z, rotation.theta, rotation.phi);
    return {
      ...atom,
      originalIndex: idx,
      px: centerX + rotated.x * scale,
      py: centerY + rotated.y * scale,
      pz: rotated.z // depth for sorting
    };
  });

  // Sort projected atoms so that atoms further back (lower pz) render first
  const sortedAtomIndices = [...projectedAtoms]
    .map((atom, index) => ({ atom, index }))
    .sort((a, b) => a.atom.pz - b.atom.pz);

  // Recharts Electronegativity Comparison Data
  const chartData = activeMolecule.atoms.map((atom) => ({
    name: isEn ? atom.name : atom.nameAr,
    symbol: atom.symbol,
    Electronegativity: atom.electronegativity
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mt-6 animate-fade-in" id="molecular-geometry-dashboard">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Layers className="w-48 h-48 text-indigo-500" />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/25">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h4 className="text-base font-black tracking-tight flex items-center gap-1.5">
              <span>{isEn ? "Interactive 3D Molecular Geometry" : "مستكشف البنية والهندسة الجزيئية ثلاثي الأبعاد"}</span>
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            </h4>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
              {isEn 
                ? "Tactile VSEPR representation & electronegativity analysis" 
                : "تجسيد تفاعلي لنظرية التنافر وأزواج الإلكترونات وتحليل السالبية الكهربية"}
            </p>
          </div>
        </div>

        {/* Compound Selector Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider hidden md:inline">
            {isEn ? "Select Compound:" : "اختر المركب:"}
          </span>
          <select
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
            className="w-full sm:w-44 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-indigo-300 font-black focus:ring-2 focus:ring-indigo-500/50 focus:outline-hidden cursor-pointer"
          >
            {Object.entries(MOLECULES).map(([key, mol]) => (
              <option key={key} value={key}>
                {mol.formula} - {isEn ? mol.nameEn : mol.nameAr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* Left column: SVG 3D rotatable visualizer (6 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-between bg-slate-950/80 rounded-2xl border border-slate-800/80 p-5 relative min-h-[300px]">
          
          <div className="absolute top-4 left-4 flex gap-1.5 no-print">
            <button
              onClick={resetRotation}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all text-[10px] font-bold flex items-center gap-1"
              title={isEn ? "Reset View" : "إعادة ضبط المنظور"}
            >
              <RotateCw className="w-3 h-3" />
            </button>
            <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-500 text-[10px] flex items-center gap-1">
              <Maximize2 className="w-3 h-3" />
              <span>{isEn ? "Drag to Rotate" : "اسحب للتدوير"}</span>
            </div>
          </div>

          {/* VSEPR Quick Badges */}
          <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
            <span className="bg-indigo-600 text-white font-mono text-[10px] font-black px-2 py-0.5 rounded-md border border-indigo-400/20 shadow-xs">
              VSEPR: {activeMolecule.vsepr}
            </span>
            <span className="bg-teal-600 text-white font-mono text-[10px] font-black px-2 py-0.5 rounded-md border border-teal-400/20 shadow-xs">
              {activeMolecule.hybridization}
            </span>
          </div>

          {/* The Drag & Touch SVG Container */}
          <div 
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUpOrLeave}
            className="w-full flex justify-center items-center cursor-grab active:cursor-grabbing select-none py-4"
          >
            <svg 
              width="240" 
              height="240" 
              viewBox="0 0 240 240"
              className="filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]"
            >
              <defs>
                {/* Glow filters and 3D radial gradients */}
                <radialGradient id="centralGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                </radialGradient>
                {/* Atom sphere gradients dynamically styled */}
                {activeMolecule.atoms.map((atom, idx) => (
                  <radialGradient key={idx} id={`atomGrad-${idx}`} cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                    <stop offset="25%" stopColor={atom.color} />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.8" />
                  </radialGradient>
                ))}
                {/* Lone Pair orbital gradient */}
                <radialGradient id="lonePairGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.7" />
                  <stop offset="60%" stopColor="#a78bfa" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* DRAW BONDS FIRST (so they remain behind spheres visually) */}
              {activeMolecule.bonds.map(([u, v], bIdx) => {
                const atomU = projectedAtoms[u];
                const atomV = projectedAtoms[v];
                return (
                  <g key={`bond-${bIdx}`}>
                    {/* Shadow/Outer glow line */}
                    <line 
                      x1={atomU.px} 
                      y1={atomU.py} 
                      x2={atomV.px} 
                      y2={atomV.py} 
                      stroke="#1e1b4b" 
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    {/* Core cylindrical bond representation */}
                    <line 
                      x1={atomU.px} 
                      y1={atomU.py} 
                      x2={atomV.px} 
                      y2={atomV.py} 
                      stroke="url(#centralGlow)" 
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    <line 
                      x1={atomU.px} 
                      y1={atomU.py} 
                      x2={atomV.px} 
                      y2={atomV.py} 
                      stroke="#818cf8" 
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="4 2"
                    />
                  </g>
                );
              })}

              {/* DRAW LONE PAIRS if present */}
              {activeMolecule.lonePairs && activeMolecule.lonePairs.map((lp, lpIdx) => {
                // Rotate lone pair coordinates too
                const rotated = rotatePoint(lp.x, lp.y, lp.z, rotation.theta, rotation.phi);
                const lpx = centerX + rotated.x * scale;
                const lpy = centerY + rotated.y * scale;
                const centralAtom = projectedAtoms[0]; // connected to central

                return (
                  <g key={`lp-${lpIdx}`} className="animate-pulse">
                    {/* Orbital lobe outline */}
                    <path
                      d={`M ${centralAtom.px} ${centralAtom.py} Q ${lpx - 15} ${lpy - 5} ${lpx} ${lpy} Q ${lpx + 15} ${lpy + 5} ${centralAtom.px} ${centralAtom.py}`}
                      fill="url(#lonePairGrad)"
                      stroke="#c084fc"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                      opacity="0.6"
                    />
                    {/* Double dots of lone pair electrons */}
                    <circle cx={lpx - 4} cy={lpy} r="3" fill="#c084fc" />
                    <circle cx={lpx + 4} cy={lpy} r="3" fill="#c084fc" />
                  </g>
                );
              })}

              {/* DRAW ATOM SPHERES sorted by visual depth (pz) */}
              {sortedAtomIndices.map(({ atom, index }) => {
                const projected = projectedAtoms[index];
                // Relative size adjusted with perspective scale factor
                const depthScale = 1 + (projected.pz * 0.15); 
                const finalRadius = projected.radius * depthScale;

                return (
                  <g key={`atom-node-${index}`}>
                    {/* Sphere Shadow */}
                    <circle 
                      cx={projected.px + 4} 
                      cy={projected.py + 4} 
                      r={finalRadius} 
                      fill="#020617" 
                      opacity="0.4" 
                    />
                    {/* Shaded 3D sphere */}
                    <circle 
                      cx={projected.px} 
                      cy={projected.py} 
                      r={finalRadius} 
                      fill={`url(#atomGrad-${index})`} 
                    />
                    {/* Text Symbol inside atom */}
                    <text
                      x={projected.px}
                      y={projected.py + 4}
                      textAnchor="middle"
                      fill={projected.color === "#f1f5f9" ? "#0f172a" : "#ffffff"}
                      fontWeight="bold"
                      fontSize={finalRadius > 14 ? "12px" : "9px"}
                      fontFamily="monospace"
                    >
                      {projected.symbol}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="w-full text-center mt-2 border-t border-slate-900/60 pt-3">
            <span className="text-xs text-indigo-400 font-extrabold font-mono uppercase tracking-widest block">
              {isEn ? activeMolecule.geometryEn : activeMolecule.geometryAr}
            </span>
            <span className="text-[11px] text-slate-400 font-bold block mt-1">
              {isEn ? `Bond Angle: ${activeMolecule.bondAngle}` : `زاوية الرابطة: ${activeMolecule.bondAngle}`}
            </span>
          </div>
        </div>

        {/* Middle column: Molecule Info Card (4 cols) */}
        <div className="lg:col-span-4 bg-slate-950/40 border border-slate-850 p-5 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest block">
                {isEn ? "Molecular Dossier" : "الملف العلمي للجزيء"}
              </span>
              <h5 className="text-xl font-black text-white mt-1">
                {activeMolecule.formula}
              </h5>
              <p className="text-xs text-slate-400 mt-0.5 font-bold">
                {isEn ? activeMolecule.nameEn : activeMolecule.nameAr}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center bg-slate-950/60 p-2.5 rounded-xl border border-slate-900">
                <span className="text-slate-400 font-semibold">{isEn ? "Hybridization" : "التهجين"}</span>
                <span className="font-extrabold font-mono text-indigo-400">{activeMolecule.hybridization}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950/60 p-2.5 rounded-xl border border-slate-900">
                <span className="text-slate-400 font-semibold">{isEn ? "Polarity" : "القطبية"}</span>
                <span className={`font-extrabold ${activeMolecule.polarityEn.includes("Non") ? "text-emerald-400" : "text-amber-400"}`}>
                  {isEn ? activeMolecule.polarityEn : activeMolecule.polarityAr}
                </span>
              </div>
              <div className="flex justify-between items-center bg-slate-950/60 p-2.5 rounded-xl border border-slate-900">
                <span className="text-slate-400 font-semibold">{isEn ? "VSEPR Geometry" : "هندسة VSEPR"}</span>
                <span className="font-extrabold text-slate-200">{isEn ? activeMolecule.geometryEn : activeMolecule.geometryAr}</span>
              </div>
            </div>

            <div className="bg-slate-900/45 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-semibold">
              <span className="text-[10px] text-indigo-400 font-black flex items-center gap-1 uppercase tracking-wider mb-1.5">
                <Info className="w-3.5 h-3.5 shrink-0" />
                {isEn ? "Scientific Explanation" : "التفسير العلمي للبنية"}
              </span>
              <p className="font-medium text-slate-350">
                {isEn ? activeMolecule.descriptionEn : activeMolecule.descriptionAr}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-850/40 text-[9px] text-slate-500 font-bold flex items-center gap-1 justify-center">
            <Zap className="w-3 h-3 text-amber-500" />
            <span>{isEn ? "Drag molecule directly to rotate in 3D" : "اسحب الجزيء مباشرة لتدويره في الأبعاد الثلاثية"}</span>
          </div>
        </div>

        {/* Right column: Electronegativity Bar Chart (3 cols) */}
        <div className="lg:col-span-3 bg-slate-950/40 border border-slate-850 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest block mb-1">
              {isEn ? "Symmetry & Bonds" : "التناظر وروابط الطاقة"}
            </span>
            <h5 className="text-xs font-black text-slate-200">
              {isEn ? "Electronegativity Profile" : "الملف الكهروستاتيكي (السالبية)"}
            </h5>
            <p className="text-[10px] text-slate-500 font-bold mt-1.5 leading-normal">
              {isEn 
                ? "Comparing electronegativity values shows bond polarity vectors and electron pull dynamics." 
                : "توضح مقارنة السالبية الكهربية اتجاه عزوم القطبية وكثافة السحب الإلكتروني."}
            </p>
          </div>

          {/* Recharts Electronegativity Chart */}
          <div className="h-44 w-full mt-4" id="electronegativity-bar-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
              >
                <XAxis 
                  dataKey="symbol" 
                  stroke="#64748b" 
                  fontSize={10} 
                  fontWeight="bold"
                  tickLine={false}
                />
                <YAxis 
                  domain={[0, 4.5]} 
                  stroke="#64748b" 
                  fontSize={9}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "10px", fontSize: "11px", color: "#fff" }}
                  itemStyle={{ color: "#818cf8" }}
                />
                <Bar dataKey="Electronegativity" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.symbol === activeMolecule.atoms[0].symbol ? "#818cf8" : "#10b981"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-indigo-950/20 border border-indigo-900/30 p-2.5 rounded-xl flex items-center justify-between text-[10px] font-mono font-bold text-slate-350">
            <span>{isEn ? "Central Atom:" : "الذرة المركزية:"}</span>
            <span className="text-indigo-400 font-black">{activeMolecule.atoms[0].symbol} (Paulings: {activeMolecule.atoms[0].electronegativity})</span>
          </div>
        </div>

      </div>
    </div>
  );
}
