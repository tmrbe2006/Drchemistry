import { ChemicalElement } from "../types";

export const ALL_118_ELEMENTS: ChemicalElement[] = [
  // Period 1
  {
    number: 1, symbol: "H", name: "Hydrogen", nameAr: "الهيدروجين", mass: 1.008, category: "nonmetal", group: 1, period: 1, electronConfig: "1s¹",
    summaryAr: "أخف وأكثر العناصر وفرة في الكون، وهو وقود النجوم والماء الأساسي.",
    summaryEn: "The lightest and most abundant chemical element in the universe, constituting roughly 75% of all normal matter."
  },
  {
    number: 2, symbol: "He", name: "Helium", nameAr: "الهيليوم", mass: 4.0026, category: "noble", group: 18, period: 1, electronConfig: "1s²",
    summaryAr: "غاز خامل غير قابل للاشتعال، أخف من الهواء، ويستخدم في تبريد المغناطيسيات الفائقة والبالونات.",
    summaryEn: "A colorless, odorless, tasteless, non-toxic, inert gas that heads the noble gas series."
  },

  // Period 2
  {
    number: 3, symbol: "Li", name: "Lithium", nameAr: "الليثيوم", mass: 6.94, category: "alkali", group: 1, period: 2, electronConfig: "[He] 2s¹",
    summaryAr: "أخف الفلزات الصلبة على الإطلاق، وهو المكون الأساسي لبطاريات الهواتف والسيارات الكهربائية.",
    summaryEn: "The lightest of all solid metals, highly reactive, playing a crucial role in modern rechargeable batteries."
  },
  {
    number: 4, symbol: "Be", name: "Beryllium", nameAr: "البيريليوم", mass: 9.0122, category: "alkaline-earth", group: 2, period: 2, electronConfig: "[He] 2s²",
    summaryAr: "فلز خفيف وقوي جداً، ويستخدم في صناعة الطائرات والدروع الواقية وسبائك المعادن الخاصة.",
    summaryEn: "A relatively rare metal in the universe, light, strong and rigid, extensively used in aerospace components."
  },
  {
    number: 5, symbol: "B", name: "Boron", nameAr: "البورون", mass: 10.81, category: "metalloid", group: 13, period: 2, electronConfig: "[He] 2s² 2p¹",
    summaryAr: "شبه فلز صلب، يستخدم في صناعة زجاج البايركس المقاوم للحرارة كيميائياً، ومبيدات الآفات المعملية.",
    summaryEn: "A low-abundance metalloid element used heavily in fiberglass and specialized heat-resistant glassware."
  },
  {
    number: 6, symbol: "C", name: "Carbon", nameAr: "الكربون", mass: 12.011, category: "nonmetal", group: 14, period: 2, electronConfig: "[He] 2s² 2p²",
    summaryAr: "أساس الحياة العضوية بأكملها على الأرض، يتواجد في عدة صور منها الماس الفاخر والجرافيت.",
    summaryEn: "The absolute backbone of organic life on Earth, capable of forming stable covalent bonds with many elements."
  },
  {
    number: 7, symbol: "N", name: "Nitrogen", nameAr: "النيتروجين", mass: 14.007, category: "nonmetal", group: 15, period: 2, electronConfig: "[He] 2s² 2p³",
    summaryAr: "يشكل 78% من الغلاف الجوي، وهو عنصر أساسي في تكوين البروتينات والحمض النووي والأسمدة.",
    summaryEn: "Makes up about 78% of Earth's atmosphere and is an indispensable building block of amino acids and proteins."
  },
  {
    number: 8, symbol: "O", name: "Oxygen", nameAr: "الأكسجين", mass: 15.999, category: "nonmetal", group: 16, period: 2, electronConfig: "[He] 2s² 2p⁴",
    summaryAr: "ضروري لتنفس الكائنات الحية والاحتراق، يمثل حوالي 21% من الهواء وثلثي كتلة الماء والإنسان.",
    summaryEn: "Crucial for the respiration of most living organisms and combustion, constituting about 21% of Earth's air."
  },
  {
    number: 9, symbol: "F", name: "Fluorine", nameAr: "الفلور", mass: 18.998, category: "halogen", group: 17, period: 2, electronConfig: "[He] 2s² 2p⁵",
    summaryAr: "أكثر العناصر كهروسالبية وتفاعلاً على الإطلاق، يدخل في معاجين الأسنان وغاز الفريون.",
    summaryEn: "The most electronegative and reactive of all elements, extremely dangerous in elemental form, used in dental hygiene."
  },
  {
    number: 10, symbol: "Ne", name: "Neon", nameAr: "النيون", mass: 20.180, category: "noble", group: 18, period: 2, electronConfig: "[He] 2s² 2p⁶",
    summaryAr: "غاز خامل يتوهج بلون أحمر برتقالي متألق عند تمرير تيار كهربائي، ويستخدم في لوحات الإعلانات.",
    summaryEn: "An inert noble gas that glows with a brilliant reddish-orange light when utilized in discharge signs."
  },

  // Period 3
  {
    number: 11, symbol: "Na", name: "Sodium", nameAr: "الصوديوم", mass: 22.990, category: "alkali", group: 1, period: 3, electronConfig: "[Ne] 3s¹",
    summaryAr: "فلز ناعم وفضي شديد التفاعل مع الماء مطلقاً الهيدروجين، ويدخل في تركيب ملح الطعام.",
    summaryEn: "A soft, highly reactive alkali metal. It reacts violently with water and is a major component of table salt."
  },
  {
    number: 12, symbol: "Mg", name: "Magnesium", nameAr: "المغنيسيوم", mass: 24.305, category: "alkaline-earth", group: 2, period: 3, electronConfig: "[Ne] 3s²",
    summaryAr: "فلز خفيف يحترق بلهب أبيض باهر، يدخل في بناء الكلوروفيل للنبات ومكملات المعادن الحيوية.",
    summaryEn: "A shiny gray solid metal that burns with an intense, dazzling white light, essential for plant chlorophyll."
  },
  {
    number: 13, symbol: "Al", name: "Aluminum", nameAr: "الألومنيوم", mass: 26.982, category: "post-transition", group: 13, period: 3, electronConfig: "[Ne] 3s² 3p¹",
    summaryAr: "فلز خفيف جداً ومقاوم للصدأ بفضل طبقة الأكسيد، وهو الأكثر وفرة في قشرة الأرض.",
    summaryEn: "A lightweight, silvery-white, corrosion-resistant metal. It is the most abundant metal in the Earth's crust."
  },
  {
    number: 14, symbol: "Si", name: "Silicon", nameAr: "السيليكون", mass: 28.085, category: "metalloid", group: 14, period: 3, electronConfig: "[Ne] 3s² 3p²",
    summaryAr: "شبه موصل رئيسي يمثل حجر الأساس لرقاقات الكمبيوتر الحديثة والخلايا الشمسية المتطورة.",
    summaryEn: "A hard, crystalline semiconductor metalloid, forming the absolute foundation of computer microchips."
  },
  {
    number: 15, symbol: "P", name: "Phosphorus", nameAr: "الفوسفور", mass: 30.974, category: "nonmetal", group: 15, period: 3, electronConfig: "[Ne] 3s² 3p³",
    summaryAr: "عنصر لا فلزي نشط، يتواجد في العظام والأسمدة الكيميائية وأعواد الثقاب الدارجة.",
    summaryEn: "A highly reactive nonmetal found in human bone structure and DNA; commonly utilized in safety matches."
  },
  {
    number: 16, symbol: "S", name: "Sulfur", nameAr: "الكبريت", mass: 32.06, category: "nonmetal", group: 16, period: 3, electronConfig: "[Ne] 3s² 3p⁴",
    summaryAr: "عنصر أصفر صلب معروف برائحته النفاذة عند الاحتراق، يدخل في صناعة حمض الكبريتيك والبطاريات.",
    summaryEn: "An abundant, bright yellow, nonmetallic element that burns with a blue flame and a choking odor."
  },
  {
    number: 17, symbol: "Cl", name: "Chlorine", nameAr: "الكلور", mass: 35.45, category: "halogen", group: 17, period: 3, electronConfig: "[Ne] 3s² 3p⁵",
    summaryAr: "غاز أصفر مخضر سام، مطهر بكتيري رائع يستخدم لتعقيم مياه الشرب والمسابح ومبيض للأقمشة.",
    summaryEn: "A pale yellow-green gas with a suffocating smell, widely employed as a disinfectant in water treatment."
  },
  {
    number: 18, symbol: "Ar", name: "Argon", nameAr: "الأرجون", mass: 39.948, category: "noble", group: 18, period: 3, electronConfig: "[Ne] 3s² 3p⁶",
    summaryAr: "غاز خامل تماماً، يملأ المصابيح لمنع تأكسد خيوط التنجستين، وثالث أكثر الغازات وفرة بالهواء.",
    summaryEn: "The third most abundant gas in Earth's atmosphere, totally inert, used as a protective shield in welding."
  },

  // Period 4
  {
    number: 19, symbol: "K", name: "Potassium", nameAr: "البوتاسيوم", mass: 39.098, category: "alkali", group: 1, period: 4, electronConfig: "[Ar] 4s¹",
    summaryAr: "فلز قلوى ناعم وسريع التفاعل، وهو إلكتروليت حيوي هام لتنظيم ضربات القلب والضغط الشرياني.",
    summaryEn: "A silvery-white, highly reactive metal that is a key electrolyte for nerve functions and fluid balance."
  },
  {
    number: 20, symbol: "Ca", name: "Calcium", nameAr: "الكالسيوم", mass: 40.078, category: "alkaline-earth", group: 2, period: 4, electronConfig: "[Ar] 4s²",
    summaryAr: "عنصر أساسي في بناء الهيكل العظمي والأسنان ومهم لانقباض العضلات وصناعة الأسمنت الجيري.",
    summaryEn: "An essential mineral for bones and teeth, playing key structural roles in cement and biological materials."
  },
  {
    number: 21, symbol: "Sc", name: "Scandium", nameAr: "السكانديوم", mass: 44.956, category: "transition", group: 3, period: 4, electronConfig: "[Ar] 3d¹ 4s²",
    summaryAr: "فلز انتقالي نادر وخفيف، يضاف إلى الألمنيوم في صناعة مضارب البيسبول وهياكل الطائرات.",
    summaryEn: "A silvery-white metallic transition element, historically classified as a rare-earth element."
  },
  {
    number: 22, symbol: "Ti", name: "Titanium", nameAr: "التيتانيوم", mass: 47.867, category: "transition", group: 4, period: 4, electronConfig: "[Ar] 3d² 4s²",
    summaryAr: "فلز قوي جداً مثل الصلب وخفيف للغاية، مقاوم للتآكل ويستخدم في صناعة المفاصل الطبية والصواريخ.",
    summaryEn: "A lustrous transition metal with low density and high strength, highly resistant to corrosion."
  },
  {
    number: 23, symbol: "V", name: "Vanadium", nameAr: "الفاناديوم", mass: 50.942, category: "transition", group: 5, period: 4, electronConfig: "[Ar] 3d³ 4s²",
    summaryAr: "فلز صلب رمادي مائل للزرقة، يضاف للصلب لزيادة قوته ومقاومته للاهتزاز والصدمات.",
    summaryEn: "A hard, silvery-grey, malleable transition metal, primarily used as a steel additive to increase strength."
  },
  {
    number: 24, symbol: "Cr", name: "Chromium", nameAr: "الكروم", mass: 51.996, category: "transition", group: 6, period: 4, electronConfig: "[Ar] 3d⁵ 4s¹",
    summaryAr: "فلز فضي يمنع الصدأ، المكون الرئيسي للستانلس ستيل (الصلب غير القابل للصدأ)، وطلاء المعادن.",
    summaryEn: "A steely-grey, lustrous, hard and brittle transition metal, valued for its high corrosion resistance."
  },
  {
    number: 25, symbol: "Mn", name: "Manganese", nameAr: "المنغنيز", mass: 54.938, category: "transition", group: 7, period: 4, electronConfig: "[Ar] 3d⁵ 4s²",
    summaryAr: "فلز صلب يدخل في سبائك الحديد والصلب المقاومة للصدمات العنيفة، مثل السكك الحديدية.",
    summaryEn: "A transition metal often found in combination with iron, essential for steelmaking and industrial alloys."
  },
  {
    number: 26, symbol: "Fe", name: "Iron", nameAr: "الحديد", mass: 55.845, category: "transition", group: 8, period: 4, electronConfig: "[Ar] 3d⁶ 4s²",
    summaryAr: "أساس الحضارة الهندسية والصناعية، والناقل الأساسي للأكسجين في خلايا الدم الحمراء (الهيموجلوبين).",
    summaryEn: "The most common element on Earth by mass, forming much of Earth's outer and inner core; key to human blood."
  },
  {
    number: 27, symbol: "Co", name: "Cobalt", nameAr: "الكوبالت", mass: 58.933, category: "transition", group: 9, period: 4, electronConfig: "[Ar] 3d⁷ 4s²",
    summaryAr: "فلز صلب ذو خواص مغناطيسية، يستخدم في صناعة المغناطيسات القوية وبطاريات الليثيوم المتطورة.",
    summaryEn: "A ferromagnetic metal used in high-strength alloys, rechargeable batteries, and blue pigments."
  },
  {
    number: 28, symbol: "Ni", name: "Nickel", nameAr: "النيكل", mass: 58.693, category: "transition", group: 10, period: 4, electronConfig: "[Ar] 3d⁸ 4s²",
    summaryAr: "فلز فضي مقاوم للتآكل، يستخدم في صناعة العملات المعدنية وبطاريات قابلة لإعادة الشحن والسبائك.",
    summaryEn: "A silvery-white lustrous metal with a slight golden tinge, resistant to corrosion and used extensively in plating."
  },
  {
    number: 29, symbol: "Cu", name: "Copper", nameAr: "النحاس", mass: 63.546, category: "transition", group: 11, period: 4, electronConfig: "[Ar] 3d¹⁰ 4s¹",
    summaryAr: "موصل ممتاز للكهرباء والحرارة، ذو لون أحمر برتقالي مميز، ويستخدم في الأسلاك الكهربائية والسبائك.",
    summaryEn: "A soft, malleable metal with extremely high thermal and electrical conductivity, ideal for wiring."
  },
  {
    number: 30, symbol: "Zn", name: "Zinc", nameAr: "الزنك", mass: 65.38, category: "transition", group: 12, period: 4, electronConfig: "[Ar] 3d¹⁰ 4s²",
    summaryAr: "فلز فضي مزرق، مقاوم للصدأ، ويستخدم لجلونة الحديد، ويدخل كمحفز في عمل الإنزيمات الحيوية للجسم.",
    summaryEn: "A slightly brittle metal at room temp, commonly used to galvanize iron to prevent rust."
  },
  {
    number: 31, symbol: "Ga", name: "Gallium", nameAr: "الغاليوم", mass: 69.723, category: "post-transition", group: 13, period: 4, electronConfig: "[Ar] 3d¹⁰ 4s² 4p¹",
    summaryAr: "فلز فريد ينصهر عند درجة حرارة اليد (29.76 مئوية)، ويستخدم بكثافة في صناعة رقاقات الليزر وأشباه الموصلات.",
    summaryEn: "A soft, silvery metal that melts in a person's hand, widely used in semiconductor optoelectronics."
  },
  {
    number: 32, symbol: "Ge", name: "Germanium", nameAr: "الجرمانيوم", mass: 72.63, category: "metalloid", group: 14, period: 4, electronConfig: "[Ar] 3d¹⁰ 4s² 4p²",
    summaryAr: "شبه فلز صلب ذو مظهر لامع، ويستخدم في صناعة عدسات الرؤية الليلية والألياف الضوئية.",
    summaryEn: "A lustrous, hard-brittle, grayish-white metalloid chemically similar to silicon and tin."
  },
  {
    number: 33, symbol: "As", name: "Arsenic", nameAr: "الزرنيخ", mass: 74.922, category: "metalloid", group: 15, period: 4, electronConfig: "[Ar] 3d¹⁰ 4s² 4p³",
    summaryAr: "شبه فلز معروف تاريخياً بسميته الشديدة، ويستخدم بجرعات دقيقة جداً في الصناعات الإلكترونية والمبيدات.",
    summaryEn: "A metalloid notorious for its toxicity, historically used as a poison, but now vital in semiconductor doping."
  },
  {
    number: 34, symbol: "Se", name: "Selenium", nameAr: "السيلينيوم", mass: 78.971, category: "nonmetal", group: 16, period: 4, electronConfig: "[Ar] 3d¹⁰ 4s² 4p⁴",
    summaryAr: "لا فلز حساس للضوء، يستخدم في أجهزة الاستشعار الكهروضوئية وآلات تصوير المستندات وتصنيع الزجاج.",
    summaryEn: "A nonmetal with photovoltaic properties, essential as a dietary nutrient in microscopic quantities."
  },
  {
    number: 35, symbol: "Br", name: "Bromine", nameAr: "البروم", mass: 79.904, category: "halogen", group: 17, period: 4, electronConfig: "[Ar] 3d¹⁰ 4s² 4p⁵",
    summaryAr: "العنصر اللافلزي الوحيد الذي يتواجد في حالة سائلة حمراء داكنة عند درجة حرارة الغرفة، وله رائحة خانقة.",
    summaryEn: "The only nonmetallic element that is a liquid under standard conditions, highly volatile and corrosive."
  },
  {
    number: 36, symbol: "Kr", name: "Krypton", nameAr: "الكريبتون", mass: 83.798, category: "noble", group: 18, period: 4, electronConfig: "[Ar] 3d¹⁰ 4s² 4p⁶",
    summaryAr: "غاز نبيل نادر، يستخدم في مصابيح الفلاش عالية السرعة للتصوير الفوتوغرافي ومصابيح المطارات.",
    summaryEn: "A colorless, odorless noble gas that is used in commercial fluorescent lights and fast photography."
  },

  // Period 5
  {
    number: 37, symbol: "Rb", name: "Rubidium", nameAr: "الروبيديوم", mass: 85.468, category: "alkali", group: 1, period: 5, electronConfig: "[Kr] 5s¹",
    summaryAr: "فلز قلوى ناعم وسريع التفاعل، يشتعل تلقائياً في الهواء ويتفاعل بعنف شديد مع الماء.",
    summaryEn: "A soft, silvery-white alkali metal that ignites spontaneously in air and reacts violently with water."
  },
  {
    number: 38, symbol: "Sr", name: "Strontium", nameAr: "السترونشيوم", mass: 87.62, category: "alkaline-earth", group: 2, period: 5, electronConfig: "[Kr] 5s²",
    summaryAr: "فلز قلوى ترابي عالي التفاعل، تعطي أملاحه لوناً أحمر قرمزي باهر في الألعاب النارية الاستعراضية.",
    summaryEn: "A highly reactive alkaline earth metal that burns with a brilliant crimson red flame in fireworks."
  },
  {
    number: 39, symbol: "Y", name: "Yttrium", nameAr: "اليتريوم", mass: 88.906, category: "transition", group: 3, period: 5, electronConfig: "[Kr] 4d¹ 5s²",
    summaryAr: "فلز انتقالي فضي، يضاف لسبائك المعادن لزيادة مقاومتها للتآكل، ويدخل في شاشات التلفزيون القديمة والمستشعرات.",
    summaryEn: "A silvery-metallic transition metal, often chemically similar to the lanthanides, used in superconductors and lasers."
  },
  {
    number: 40, symbol: "Zr", name: "Zirconium", nameAr: "الزركونيوم", mass: 91.224, category: "transition", group: 4, period: 5, electronConfig: "[Kr] 4d² 5s²",
    summaryAr: "فلز صلب مقاوم للتآكل والحرارة بشكل مذهل، ويستخدم في كسوة الوقود النووي في المفاعلات.",
    summaryEn: "A lustrous, greyish-white, strong transition metal that is highly resistant to corrosion, especially in nuclear reactors."
  },
  {
    number: 41, symbol: "Nb", name: "Niobium", nameAr: "النيوبيوم", mass: 92.906, category: "transition", group: 5, period: 5, electronConfig: "[Kr] 4d⁴ 5s¹",
    summaryAr: "فلز انتقالي ناعم رمادي، يستخدم في صناعة الفولاذ فائق المقاومة للمحركات النفاثة والتوصيل الفائق.",
    summaryEn: "A light grey, crystalline, ductile transition metal used primarily in superconducting alloys and jet engines."
  },
  {
    number: 42, symbol: "Mo", name: "Molybdenum", nameAr: "الموليبدينوم", mass: 95.95, category: "transition", group: 6, period: 5, electronConfig: "[Kr] 4d⁵ 5s¹",
    summaryAr: "فلز ذو درجة انصهار عالية جداً، يضاف للفولاذ ليمنحه صلابة فائقة تحت درجات الحرارة القصوى.",
    summaryEn: "A silver metal with a very high melting point, heavily utilized as an alloy agent in structural steel."
  },
  {
    number: 43, symbol: "Tc", name: "Technetium", nameAr: "التكنيشيوم", mass: 98.0, category: "transition", group: 7, period: 5, electronConfig: "[Kr] 4d⁵ 5s²",
    summaryAr: "أول عنصر اصطناعي مشع تم إنتاجه، ويستخدم بشكل واسع جداً في الفحوصات الطبية النووية.",
    summaryEn: "The lightest chemical element whose isotopes are all radioactive; widely used as a medical imaging tracer."
  },
  {
    number: 44, symbol: "Ru", name: "Ruthenium", nameAr: "الروسينيوم", mass: 101.07, category: "transition", group: 8, period: 5, electronConfig: "[Kr] 4d⁷ 5s¹",
    summaryAr: "فلز صلب نادر جداً من مجموعة البلاتين، يستخدم لتقوية التوصيلات الكهربائية ومقاومة التآكل.",
    summaryEn: "A rare transition metal belonging to the platinum group, primarily used in wear-resistant electrical contacts."
  },
  {
    number: 45, symbol: "Rh", name: "Rhodium", nameAr: "الروديوم", mass: 102.91, category: "transition", group: 9, period: 5, electronConfig: "[Kr] 4d⁸ 5s¹",
    summaryAr: "من أندر وأثمن الفلزات النفيسة في العالم، ويستخدم بشكل أساسي في المحولات الحفازة لتقليل عوادم السيارات.",
    summaryEn: "An ultra-rare, corrosion-resistant precious metal used in automotive catalytic converters and high-end mirrors."
  },
  {
    number: 46, symbol: "Pd", name: "Palladium", nameAr: "البالاديوم", mass: 106.42, category: "transition", group: 10, period: 5, electronConfig: "[Kr] 4d¹⁰",
    summaryAr: "فلز ثمين له قدرة خارقة على امتصاص غاز الهيدروجين، ويدخل في خلايا الوقود وفي تنقية وتخزين الغازات.",
    summaryEn: "A rare and lustrous silvery-white precious metal, notable for absorbing up to 900 times its own volume of hydrogen."
  },
  {
    number: 47, symbol: "Ag", name: "Silver", nameAr: "الفضة", mass: 107.87, category: "transition", group: 11, period: 5, electronConfig: "[Kr] 4d¹⁰ 5s¹",
    summaryAr: "أعلى العناصر توصيلاً للكهرباء والحرارة والانعكاس الضوئي على الإطلاق، وتستخدم في الحلي والصناعات الدقيقة.",
    summaryEn: "The element with the highest electrical and thermal conductivity of any metal, highly prized as a precious material."
  },
  {
    number: 48, symbol: "Cd", name: "Cadmium", nameAr: "الكادميوم", mass: 112.41, category: "transition", group: 12, period: 5, electronConfig: "[Kr] 4d¹⁰ 5s²",
    summaryAr: "فلز سام ناعم، يستخدم تاريخياً في البطاريات الكهربائية القابلة لإعادة الشحن والطلاء الواقي.",
    summaryEn: "A soft, silvery-white transition metal. Highly toxic, it is used in rechargeable batteries and electroplating."
  },
  {
    number: 49, symbol: "In", name: "Indium", nameAr: "الإنديوم", mass: 114.82, category: "post-transition", group: 13, period: 5, electronConfig: "[Kr] 4d¹⁰ 5s² 5p¹",
    summaryAr: "فلز ناعم للغاية يتواجد بكثرة في شاشات اللمس والهواتف الذكية على هيئة أكسيد الإنديوم والقصدير.",
    summaryEn: "An extremely soft, silvery-white post-transition metal, crucial for liquid crystal displays (LCDs)."
  },
  {
    number: 50, symbol: "Sn", name: "Tin", nameAr: "القصدير", mass: 118.71, category: "post-transition", group: 14, period: 5, electronConfig: "[Kr] 4d¹⁰ 5s² 5p²",
    summaryAr: "فلز فضي سهل التشكيل ومقاوم للصدأ، يستخدم لحماية صفائح الأغذية وخلطه بالبرونز والنحاس.",
    summaryEn: "A silvery, malleable post-transition metal that is not easily oxidized in air, used to plate food cans."
  },
  {
    number: 51, symbol: "Sb", name: "Antimony", nameAr: "الأنتيمون", mass: 121.76, category: "metalloid", group: 15, period: 5, electronConfig: "[Kr] 4d¹⁰ 5s² 5p³",
    summaryAr: "شبه فلز رمادي لامع، يدخل في صناعة المواد المقاومة للاحتراق وفي زيادة صلابة الرصاص في البطاريات.",
    summaryEn: "A lustrous gray metalloid widely used as a flame retardant synergist and alloy hardener."
  },
  {
    number: 52, symbol: "Te", name: "Tellurium", nameAr: "التيلوريوم", mass: 127.60, category: "metalloid", group: 16, period: 5, electronConfig: "[Kr] 4d¹⁰ 5s² 5p⁴",
    summaryAr: "شبه فلز نادر، يستخدم لزيادة جودة ومرونة النحاس والفولاذ ويدخل في تصنيع الألواح الشمسية عالية الكفاءة.",
    summaryEn: "A rare, brittle, mildly toxic, silver-white metalloid used in thermoelectric and solar panel technology."
  },
  {
    number: 53, symbol: "I", name: "Iodine", nameAr: "اليود", mass: 126.90, category: "halogen", group: 17, period: 5, electronConfig: "[Kr] 4d¹⁰ 5s² 5p⁵",
    summaryAr: "لا فلز داكن يتسامى مباشرة إلى غاز بنفسجي جذاب، وهو مطهر جراحي ممتاز وعنصر حيوى للغدة الدرقية.",
    summaryEn: "A lustrous, purple-black nonmetal that sublimes into a violet gas; vital for thyroid hormone synthesis."
  },
  {
    number: 54, symbol: "Xe", name: "Xenon", nameAr: "الزينون", mass: 131.29, category: "noble", group: 18, period: 5, electronConfig: "[Kr] 4d¹⁰ 5s² 5p⁶",
    summaryAr: "غاز خامل ثقيل، يستخدم في مصابيح الإضاءة الأمامية للسيارات الفاخرة ومحركات الدفع الأيوني للمركبات الفضائية.",
    summaryEn: "An extremely heavy noble gas used in specialized high-intensity lamps and spacecraft ion thrusters."
  },

  // Period 6
  {
    number: 55, symbol: "Cs", name: "Cesium", nameAr: "السيزيوم", mass: 132.91, category: "alkali", group: 1, period: 6, electronConfig: "[Xe] 6s¹",
    summaryAr: "أكثر الفلزات كهروموجبية ونشاطاً كيميائياً، وهو العنصر الحرج المستخدم لضبط الوقت فائق الدقة في الساعات الذرية.",
    summaryEn: "An ultra-reactive alkali metal used as the official standard for defining the second in atomic clocks."
  },
  {
    number: 56, symbol: "Ba", name: "Barium", nameAr: "الباريوم", mass: 137.33, category: "alkaline-earth", group: 2, period: 6, electronConfig: "[Xe] 6s²",
    summaryAr: "فلز فضي سام عالي التفاعل، تستخدم مركباته كعامل تباين طبي ممتاز لتصوير الجهاز الهضمي بالأشعة السينية.",
    summaryEn: "A soft, silvery alkaline earth metal used in medical imaging contrast mediums and fireworks."
  },

  // Lanthanides (La to Lu - Row 9)
  {
    number: 57, symbol: "La", name: "Lanthanum", nameAr: "اللانثانوم", mass: 138.91, category: "lanthanide", group: 3, period: 6, electronConfig: "[Xe] 5d¹ 6s²",
    summaryAr: "رأس مجموعة اللانثانيدات، يستخدم في تكرير النفط، وصناعة زجاج الكاميرات والتلسكوبات عالية الجودة.",
    summaryEn: "The prototype of the lanthanide series. Used in petroleum cracking catalysts and high-refraction optical glass."
  },
  {
    number: 58, symbol: "Ce", name: "Cerium", nameAr: "السيريوم", mass: 140.12, category: "lanthanide", group: 3, period: 6, electronConfig: "[Xe] 4f¹ 5d¹ 6s²",
    summaryAr: "أكثر اللانثانيدات وفرة، يدخل في صناعة أحجار القداحات (الولاعات) وسبائك الألومنيوم المقاومة للحرارة.",
    summaryEn: "The most abundant rare-earth metal. Its oxide is widely used as a polishing agent for glass and mirrors."
  },
  {
    number: 59, symbol: "Pr", name: "Praseodymium", nameAr: "البراسيوديميوم", mass: 140.91, category: "lanthanide", group: 3, period: 6, electronConfig: "[Xe] 4f³ 6s²",
    summaryAr: "فلز فضي ناعم، يضاف إلى الكوبالت لإنتاج مغناطيسات قوية جداً للمحركات ومكبرات الصوت.",
    summaryEn: "A soft, silvery rare-earth metal used as an alloying agent with magnesium to make high-strength metals."
  },
  {
    number: 60, symbol: "Nd", name: "Neodymium", nameAr: "النيوديميوم", mass: 144.24, category: "lanthanide", group: 3, period: 6, electronConfig: "[Xe] 4f⁴ 6s²",
    summaryAr: "عنصر المغناطيسات الفائقة القوة (مغناطيس النيوديميوم) التي تشغل محركات السيارات الكهربائية والمولدات.",
    summaryEn: "A rare-earth element that is essential for fabricating the strongest permanent magnets known."
  },
  {
    number: 61, symbol: "Pm", name: "Promethium", nameAr: "البروميثيوم", mass: 145.0, category: "lanthanide", group: 3, period: 6, electronConfig: "[Xe] 4f⁵ 6s²",
    summaryAr: "عنصر مشع للغاية ولا يتواجد طبيعياً بقشرة الأرض، ويستخدم كوقود للبطاريات الذرية المصغرة.",
    summaryEn: "The only radioactive lanthanide. It does not exist naturally on Earth, synthesized in nuclear reactors."
  },
  {
    number: 62, symbol: "Sm", name: "Samarium", nameAr: "الساماريوم", mass: 150.36, category: "lanthanide", group: 3, period: 6, electronConfig: "[Xe] 4f⁶ 6s²",
    summaryAr: "فلز فضي صلب، يستخدم مع الكوبالت لصنع مغناطيسات قوية جداً تتحمل درجات الحرارة العالية بدون فقدان قوتها.",
    summaryEn: "A rare-earth metal used in high-temp Samarium-Cobalt magnets and as a neutron absorber in reactors."
  },
  {
    number: 63, symbol: "Eu", name: "Europium", nameAr: "اليوروبيوم", mass: 151.96, category: "lanthanide", group: 3, period: 6, electronConfig: "[Xe] 4f⁷ 6s²",
    summaryAr: "أكثر اللانثانيدات نشاطاً كيميائياً، وهو المسؤول عن إنتاج اللون الأحمر الفسفوري في الشاشات وتأمين العملات.",
    summaryEn: "The most reactive rare-earth element. Widely used as a phosphor in fluorescent lamps and banknote security."
  },
  {
    number: 64, symbol: "Gd", name: "Gadolinium", nameAr: "الجادولينيوم", mass: 157.25, category: "lanthanide", group: 3, period: 6, electronConfig: "[Xe] 4f⁷ 5d¹ 6s²",
    summaryAr: "فلز له خواص مغناطيسية مميزة، وتستخدم مركباته كعامل تباين آمن جداً في أشعة الرنين المغناطيسي (MRI).",
    summaryEn: "A rare-earth metal with unique magnetic properties, commonly injected as an MRI contrast agent."
  },
  {
    number: 65, symbol: "Tb", name: "Terbium", nameAr: "التيربيوم", mass: 158.93, category: "lanthanide", group: 3, period: 6, electronConfig: "[Xe] 4f⁹ 6s²",
    summaryAr: "فلز ناعم فضي، يستخدم كفوسفور أخضر في مصابيح الليد المتطورة وفي الأجهزة الإلكترونية اللمسية.",
    summaryEn: "A silvery-grey rare-earth metal used as a green phosphor in solid-state lighting and flat panels."
  },
  {
    number: 66, symbol: "Dy", name: "الديسبروسيوم", nameAr: "الديسبروسيوم", mass: 162.50, category: "lanthanide", group: 3, period: 6, electronConfig: "[Xe] 4f¹⁰ 6s²",
    summaryAr: "عنصر يضاف للمغناطيسات لزيادة مقاومتها للحرارة العالية، ويستخدم في قضبان التحكم بالمفاعلات النووية.",
    summaryEn: "A rare-earth metal characterized by high magnetic susceptibility, crucial for high-performance electric vehicle motors."
  },
  {
    number: 67, symbol: "Ho", name: "Holmium", nameAr: "الهولميوم", mass: 164.93, category: "lanthanide", group: 3, period: 6, electronConfig: "[Xe] 4f¹¹ 6s²",
    summaryAr: "يمتلك أعلى عزم مغناطيسي بين كافة العناصر، ويستخدم لتركيز الحقول المغناطيسية القوية وفي ليزر جراحة العيون.",
    summaryEn: "An element holding the highest magnetic moment of any natural element, used in specialized surgical lasers."
  },
  {
    number: 68, symbol: "Er", name: "Erbium", nameAr: "الإربيون", mass: 167.26, category: "lanthanide", group: 3, period: 6, electronConfig: "[Xe] 4f¹² 6s²",
    summaryAr: "فلز فضي يضاف للألياف الضوئية كعامل منشط لتضخيم إشارات الإنترنت الضوئية عبر المسافات الشاسعة.",
    summaryEn: "A rare-earth element whose ions emit a pink glow, heavily used as an optical amplifier in fiber optic cables."
  },
  {
    number: 69, symbol: "Tm", name: "Thulium", nameAr: "الثوليوم", mass: 168.93, category: "lanthanide", group: 3, period: 6, electronConfig: "[Xe] 4f¹³ 6s²",
    summaryAr: "أندر اللانثانيدات غير المشعة على الإطلاق، ويستخدم في أجهزة الأشعة السينية المحمولة والطبقة الحساسة لليزر الطارد.",
    summaryEn: "One of the rarest rare-earth metals, utilized as a radiation source in portable X-ray devices."
  },
  {
    number: 70, symbol: "Yb", name: "Ytterbium", nameAr: "الإيتريوم", mass: 173.05, category: "lanthanide", group: 3, period: 6, electronConfig: "[Xe] 4f¹⁴ 6s²",
    summaryAr: "فلز فضي ناعم ومرن، يدخل في الساعات الذرية فائقة الحساسية والمستوى العالي من الفولاذ المقاوم للإجهاد.",
    summaryEn: "A bright silvery metal used as a doping agent in laser crystals and high-precision optical atomic clocks."
  },
  {
    number: 71, symbol: "Lu", name: "Lutetium", nameAr: "اللوتيتيوم", mass: 174.97, category: "lanthanide", group: 3, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d¹ 6s²",
    summaryAr: "آخر اللانثانيدات وأصعبها استخلاصاً كيميائياً، ويستخدم كعامل حفاز في مصافي البترول وكاشفات الأورام.",
    summaryEn: "The final element of the lanthanide series, very dense and expensive, used in cancer radiotherapy."
  },

  // Transition metals of Period 6
  {
    number: 72, symbol: "Hf", name: "Hafnium", nameAr: "الهافنيوم", mass: 178.49, category: "transition", group: 4, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d² 6s²",
    summaryAr: "فلز انتقالي لامع مقاوم للتآكل، يمتلك قدرة ممتازة لامتصاص النيوترونات ولذلك يستخدم بقضبان المفاعلات.",
    summaryEn: "A lustrous, silvery-grey transition metal that absorbs neutrons efficiently, critical for nuclear control rods."
  },
  {
    number: 73, symbol: "Ta", name: "Tantalum", nameAr: "التانتالوم", mass: 180.95, category: "transition", group: 5, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d³ 6s²",
    summaryAr: "فلز ثقيل مقاوم للتآكل بشكل استثنائي، ويستخدم لصناعة مكثفات التانتالوم في الهواتف الذكية والأعضاء الطبية الاصطناعية.",
    summaryEn: "A highly corrosion-resistant metal widely used to make micro-capacitors in cell phones and medical implants."
  },
  {
    number: 74, symbol: "W", name: "Tungsten", nameAr: "التنجستن", mass: 183.84, category: "transition", group: 6, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d⁴ 6s²",
    summaryAr: "فلز صلب للغاية يتميز بأعلى درجة انصهار بين كافة المعادن (3422 مئوية)، ويستخدم في صناعة فتائل المصابيح والصواريخ.",
    summaryEn: "A transition metal with the highest melting point of all elements, critical for lightbulb filaments."
  },
  {
    number: 75, symbol: "Re", name: "Rhenium", nameAr: "الرينيوم", mass: 186.21, category: "transition", group: 7, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d⁵ 6s²",
    summaryAr: "فلز نادر جداً يقاوم الصدمات الحرارية العنيفة، ويستخدم في صناعة محركات التوربينات الغازية للطائرات.",
    summaryEn: "One of the rarest elements in Earth's crust, used in superalloys for jet engine combustion chambers."
  },
  {
    number: 76, symbol: "Os", name: "Osmium", nameAr: "الأوزميوم", mass: 190.23, category: "transition", group: 8, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d⁶ 6s²",
    summaryAr: "أكثف وأثقل عنصر طبيعي صلب معروف على الإطلاق، ويستخدم في السنون الدقيقة وسبائك الاحتكاك العالي.",
    summaryEn: "The densest naturally occurring element, extremely hard, used in high-wear electrical contacts and pen tips."
  },
  {
    number: 77, symbol: "Ir", name: "Iridium", nameAr: "الإريديوم", mass: 192.22, category: "transition", group: 9, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d⁷ 6s²",
    summaryAr: "أكثر المعادن مقاومة للتآكل في الجدول الدوري، ارتبط اسمه بالنيزك الذي تسبب في انقراض الديناصورات.",
    summaryEn: "The most corrosion-resistant metal known. Its high abundance in Cretaceous clay layers links it to the asteroid impact."
  },
  {
    number: 78, symbol: "Pt", name: "Platinum", nameAr: "البلاتين", mass: 195.08, category: "transition", group: 10, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d⁹ 6s¹",
    summaryAr: "فلز ثمين خامل كيميائياً، أندر وأثمن من الذهب، ويستخدم كعامل حفاز فعال في السيارات والمجوهرات الفاخرة.",
    summaryEn: "An extremely rare, precious transition metal, highly unreactive, used in automotive catalytic converters."
  },
  {
    number: 79, symbol: "Au", name: "Gold", nameAr: "الذهب", mass: 196.97, category: "transition", group: 11, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹",
    summaryAr: "فلز ثمين ولامع، لا يتفاعل مع الأكسجين أو الأحماض العادية، رمز للثروة والجمال وله استخدامات إلكترونية فائقة الدقة.",
    summaryEn: "A highly sought-after noble metal, completely immune to normal air rust, heavily utilized as currency and conductors."
  },
  {
    number: 80, symbol: "Hg", name: "Mercury", nameAr: "الزئبق", mass: 200.59, category: "transition", group: 12, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s²",
    summaryAr: "الفلز الوحيد الذي يتواجد في حالة سائلة فضية في ظروف الحرارة العادية، ويستخدم في موازين الحرارة والضغط الطبية.",
    summaryEn: "The only metal that exists as a liquid at room temperature, highly toxic, used in medical thermometers."
  },
  {
    number: 81, symbol: "Tl", name: "Thallium", nameAr: "الثاليوم", mass: 204.38, category: "post-transition", group: 13, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹",
    summaryAr: "فلز رمادي ناعم وسام جداً، استخدم مركباته تاريخياً كمبيد للقوارض ومادة للتصوير الطبي الضوئي.",
    summaryEn: "A soft, malleable, highly toxic metal, historically used as a rodenticide and in infrared detectors."
  },
  {
    number: 82, symbol: "Pb", name: "Lead", nameAr: "الرصاص", mass: 207.2, category: "post-transition", group: 14, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²",
    summaryAr: "فلز ثقيل وسام ومرن، يستخدم كدرع واقٍ ممتاز ضد الأشعة السينية والنووية الضارة، وفي بطاريات السيارات التقليدية.",
    summaryEn: "A heavy, toxic post-transition metal widely utilized in radiation shielding and lead-acid car batteries."
  },
  {
    number: 83, symbol: "Bi", name: "Bismuth", nameAr: "البزموت", mass: 208.98, category: "post-transition", group: 15, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³",
    summaryAr: "فلز ذو مظهر بلوري قزحي مبهر ومقاوم للصدأ، يعتبر تاريخياً أثقل عنصر مستقر غير مشع في الجدول الدوري.",
    summaryEn: "A crystalline post-transition metal with colorful oxide tarnishes, known for its extremely low toxicity."
  },
  {
    number: 84, symbol: "Po", name: "Polonium", nameAr: "البولونيوم", mass: 209.0, category: "post-transition", group: 16, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴",
    summaryAr: "عنصر مشع نادر للغاية وسام جداً، اكتشفته ماري كوري وأسمته تيمناً ببلدها بولندا.",
    summaryEn: "A highly radioactive metalloid discovered by Marie Curie. It emits high-energy alpha particles."
  },
  {
    number: 85, symbol: "At", name: "Astatine", nameAr: "الأستاتين", mass: 210.0, category: "halogen", group: 17, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵",
    summaryAr: "أندر العناصر الطبيعية على الإطلاق بقشرة الأرض، مشع وقصير العمر للغاية ويدخل في علاج السرطان.",
    summaryEn: "The rarest naturally occurring element in the Earth's crust, highly radioactive and unstable."
  },
  {
    number: 86, symbol: "Rn", name: "Radon", nameAr: "الرادون", mass: 222.0, category: "noble", group: 18, period: 6, electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶",
    summaryAr: "غاز خامل مشع طبيعياً ينتج من تحلل اليورانيوم، ويمثل خطراً صحياً كبيراً إذا تراكم في أقبية المنازل.",
    summaryEn: "A radioactive, colorless, odorless noble gas that can accumulate dangerously inside building basements."
  },

  // Period 7
  {
    number: 87, symbol: "Fr", name: "Francium", nameAr: "الفرانسيوم", mass: 223.0, category: "alkali", group: 1, period: 7, electronConfig: "[Rn] 7s¹",
    summaryAr: "فلز قلوى مشع فائق الندرة والنشاط، ولا يمكن تجميع كميات مرئية منه لسرعة تحلله الكيميائي.",
    summaryEn: "The second-rarest element in the crust. It is a highly radioactive alkali metal with an extremely short half-life."
  },
  {
    number: 88, symbol: "Ra", name: "Radium", nameAr: "الراديوم", mass: 226.0, category: "alkaline-earth", group: 2, period: 7, electronConfig: "[Rn] 7s²",
    summaryAr: "فلز مشع براق اكتشفته ماري كوري، وكان يستخدم قديماً لطلاء عقارب الساعات لتتوهج ليلاً.",
    summaryEn: "An alkaline earth metal discovered by Marie Curie, famous for its intense glow and historical watch dial usage."
  },

  // Actinides (Ac to Lr - Row 10)
  {
    number: 89, symbol: "Ac", name: "Actinium", nameAr: "الأكتينيوم", mass: 227.0, category: "actinide", group: 3, period: 7, electronConfig: "[Rn] 6d¹ 7s²",
    summaryAr: "فلز مشع فضي يتوهج بلون أزرق خافت في الظلام نتيجة تأينه القوي للهواء المحيط به.",
    summaryEn: "A silvery-white radioactive metal that glows with a pale blue light in the dark due to air ionization."
  },
  {
    number: 90, symbol: "Th", name: "Thorium", nameAr: "الثوريوم", mass: 232.04, category: "actinide", group: 3, period: 7, electronConfig: "[Rn] 6d² 7s²",
    summaryAr: "فلز مشع واعد جداً كبديل أنظف وأكثر أماناً من اليورانيوم لتشغيل مفاعلات الطاقة النووية المستقبلية.",
    summaryEn: "A naturally occurring radioactive metal considered a safer, more abundant alternative nuclear fuel than uranium."
  },
  {
    number: 91, symbol: "Pa", name: "Protactinium", nameAr: "البروتاكتينيوم", mass: 231.04, category: "actinide", group: 3, period: 7, electronConfig: "[Rn] 5f² 6d¹ 7s²",
    summaryAr: "عنصر مشع نادر وسام جداً، يتواجد طبيعياً بكميات ضئيلة للغاية كناتج لتحلل اليورانيوم.",
    summaryEn: "A dense, silvery-grey radioactive metal formed naturally from uranium decay, highly toxic."
  },
  {
    number: 92, symbol: "U", name: "Uranium", nameAr: "اليورانيوم", mass: 238.03, category: "actinide", group: 3, period: 7, electronConfig: "[Rn] 5f³ 6d¹ 7s²",
    summaryAr: "فلز مشع ثقيل جداً، يمثل مصدر الطاقة الرئيسي للمفاعلات النووية لإنتاج الكهرباء وفي الغواصات الحربية.",
    summaryEn: "A highly dense, naturally radioactive element utilized as the primary fuel source for nuclear power plants."
  },
  {
    number: 93, symbol: "Np", name: "النبتونيوم", nameAr: "النبتونيوم", mass: 237.0, category: "actinide", group: 3, period: 7, electronConfig: "[Rn] 5f⁴ 6d¹ 7s²",
    summaryAr: "عنصر اصطناعي مشع يقع بعد اليورانيوم، وينتج كمنتج ثانوي في مفاعلات الطاقة الذرية.",
    summaryEn: "The first transuranium element, synthetic and radioactive, created by bombarding uranium."
  },
  {
    number: 94, symbol: "Pu", name: "Plutonium", nameAr: "البلوتونيوم", mass: 244.0, category: "actinide", group: 3, period: 7, electronConfig: "[Rn] 5f⁶ 7s²",
    summaryAr: "عنصر مشع فائق السمية والأهمية العسكرية، ويشكل الوقود الأساسي للعديد من الأسلحة النووية.",
    summaryEn: "A highly radioactive synthetic element, famously used as fuel in nuclear reactors and nuclear weapons."
  },
  {
    number: 95, symbol: "Am", name: "Americium", nameAr: "الأمريسيوم", mass: 243.0, category: "actinide", group: 3, period: 7, electronConfig: "[Rn] 5f⁷ 7s²",
    summaryAr: "عنصر مشع اصطناعي، يطلق جسيمات ألفا ويستخدم في كاشفات الدخان المنزلية العادية.",
    summaryEn: "A synthetic radioactive element used inside commercial home ionization smoke detectors."
  },
  {
    number: 96, symbol: "Cm", name: "Curium", nameAr: "الكوريوم", mass: 247.0, category: "actinide", group: 3, period: 7, electronConfig: "[Rn] 5f⁷ 6d¹ 7s²",
    summaryAr: "أطلق اسمه تيمناً بماري وبيير كوري، مشع وقوي جداً ويستخدم كمصدر طاقة للمركبات الفضائية البعيدة.",
    summaryEn: "Named in honor of Marie and Pierre Curie, a hard radioactive metal used in space probe batteries."
  },
  {
    number: 97, symbol: "Bk", name: "Berkelium", nameAr: "البركليوم", mass: 247.0, category: "actinide", group: 3, period: 7, electronConfig: "[Rn] 5f⁹ 7s²",
    summaryAr: "عنصر اصطناعي مشع تم إنتاجه لأول مرة في جامعة كاليفورنيا ببيركلي، وليس له استخدامات تجارية.",
    summaryEn: "A synthetic transuranic element named after UC Berkeley, where it was first synthesized."
  },
  {
    number: 98, symbol: "Cf", name: "Californium", nameAr: "الكاليفورنيوم", mass: 251.0, category: "actinide", group: 3, period: 7, electronConfig: "[Rn] 5f¹⁰ 7s²",
    summaryAr: "باعث قوي جداً للنيوترونات، ويستخدم في الكشف عن الذهب والنفط وفحص المعادن وبناء المفاعلات.",
    summaryEn: "An intense neutron emitter, highly useful in oil well logging and detecting gold deposits."
  },
  {
    number: 99, symbol: "Es", name: "Einsteinium", nameAr: "الأينشتاينيوم", mass: 252.0, category: "actinide", group: 3, period: 7, electronConfig: "[Rn] 5f¹¹ 7s²",
    summaryAr: "أطلق عليه هذا الاسم تيمناً بألبرت أينشتاين، واكتشف لأول مرة في غبار أول قنبلة هيدروجينية عام 1952.",
    summaryEn: "Named after Albert Einstein, discovered in the debris of the first thermonuclear bomb test in 1952."
  },
  {
    number: 100, symbol: "Fm", name: "Fermium", nameAr: "الفرميوم", mass: 257.0, category: "actinide", group: 3, period: 7, electronConfig: "[Rn] 5f¹² 7s²",
    summaryAr: "سمي تيمناً بالعالم إنريكو فيرمي، وهو أثقل عنصر يمكن تحضيره عن طريق قذف نيوتروني مكثف.",
    summaryEn: "Named after Enrico Fermi, it is the heaviest element that can be prepared by neutron bombardment."
  },
  {
    number: 101, symbol: "Md", name: "Mendelevium", nameAr: "المندليفيوم", mass: 258.0, category: "actinide", group: 3, period: 7, electronConfig: "[Rn] 5f¹³ 7s²",
    summaryAr: "سمي تيمناً بـ ديميتري مندلييف واضع الجدول الدوري، وهو عنصر اصطناعي مشع وقصير العمر.",
    summaryEn: "A synthetic element named after Dmitri Mendeleev, the grandfather of the periodic table."
  },
  {
    number: 102, symbol: "No", name: "Nobelium", nameAr: "النوبليوم", mass: 259.0, category: "actinide", group: 3, period: 7, electronConfig: "[Rn] 5f¹⁴ 7s²",
    summaryAr: "سمي تيمناً بألفريد نوبل، عنصر مشع ثقيل لا يتواجد في الطبيعة وتم تصنيعه في مسرعات الجسيمات.",
    summaryEn: "A synthetic radioactive transuranic metal named after Alfred Nobel, founder of the Nobel prizes."
  },
  {
    number: 103, symbol: "Lr", name: "Lawrencium", nameAr: "اللورنسيوم", mass: 262.0, category: "actinide", group: 3, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d¹ 7s²",
    summaryAr: "آخر عناصر الأكتينيدات، وهو عنصر اصطناعي مشع تبلغ فترة عمر نصفه حوالي بضع ساعات كحد أقصى.",
    summaryEn: "The final element in the actinide series, a synthetic radioactive metal with a short half-life."
  },

  // Transition metals of Period 7 (Superheavies)
  {
    number: 104, symbol: "Rf", name: "Rutherfordium", nameAr: "الرذرفورديوم", mass: 267.0, category: "transition", group: 4, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d² 7s²",
    summaryAr: "عنصر اصطناعي مشع فائق الثقل، تبلغ فترة عمر نصفه ثوانٍ معدودة فقط.",
    summaryEn: "An extremely radioactive synthetic element, named after physicist Ernest Rutherford."
  },
  {
    number: 105, symbol: "Db", name: "Dubnium", nameAr: "الدوبنيوم", mass: 268.0, category: "transition", group: 5, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d³ 7s²",
    summaryAr: "سمي نسبة لمركز الأبحاث النووية في دوبنا بروسيا، وهو عنصر اصطناعي فائق الثقل وسريع التحلل.",
    summaryEn: "A highly synthetic radioactive element named after Dubna, Russia, where it was first created."
  },
  {
    number: 106, symbol: "Sg", name: "Seaborgium", nameAr: "السيبورغيوم", mass: 269.0, category: "transition", group: 6, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d⁴ 7s²",
    summaryAr: "سمي تيمناً بالعالم غلين سيبورغ، وهو عنصر اصطناعي مشع فائق الثقل من عناصر الدورة السابعة.",
    summaryEn: "A transuranic synthetic element named after Glenn T. Seaborg, first named after a living person."
  },
  {
    number: 107, symbol: "Bh", name: "Bohrium", nameAr: "البهريوم", mass: 270.0, category: "transition", group: 7, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d⁵ 7s²",
    summaryAr: "سمي تيمناً بنيلز بور الفيزيائي الشهير، وهو عنصر مشع ثقيل جداً غير مستقر على الإطلاق.",
    summaryEn: "A synthetic radioactive transition element named in honor of the physicist Niels Bohr."
  },
  {
    number: 108, symbol: "Hs", name: "Hassium", nameAr: "الهاسيوم", mass: 269.0, category: "transition", group: 8, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d⁶ 7s²",
    summaryAr: "سمي نسبة لولاية هسن الألمانية، عنصر فائق الثقل يتم إنتاجه بكميات ضئيلة جداً في مسرعات الذرة.",
    summaryEn: "A synthetic, highly radioactive transition metal named after the German state of Hesse."
  },
  {
    number: 109, symbol: "Mt", name: "Meitnerium", nameAr: "المايتنريوم", mass: 278.0, category: "transition", group: 9, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d⁷ 7s²",
    summaryAr: "سمي تيمناً بعالمة الفيزياء ليز مايتنر، عنصر فائق الثقل لا يتواجد في الطبيعة نهائياً.",
    summaryEn: "A synthetic, radioactive element named after Lise Meitner, co-discoverer of nuclear fission."
  },
  {
    number: 110, symbol: "Ds", name: "Darmstadtium", nameAr: "الدارمشتاتيوم", mass: 281.0, category: "transition", group: 10, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d⁸ 7s²",
    summaryAr: "سمي نسبة لمدينة دارمشتات بألمانيا، عنصر مشع فائق الثقل وقصير العمر بحدود الميلي ثانية.",
    summaryEn: "A superheavy, highly synthetic radioactive metal named after the German city of Darmstadt."
  },
  {
    number: 111, symbol: "Rg", name: "Roentgenium", nameAr: "الرونتجينيوم", mass: 282.0, category: "transition", group: 11, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d⁹ 7s²",
    summaryAr: "سمي تيمناً بلهلم رونتجن مكتشف الأشعة السينية، وهو عنصر اصطناعي مشع وسريع التحلل.",
    summaryEn: "An extremely radioactive synthetic transition metal named after X-ray discoverer Wilhelm Röntgen."
  },
  {
    number: 112, symbol: "Cn", name: "Copernicium", nameAr: "الكوبيرنيسيوم", mass: 285.0, category: "transition", group: 12, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d¹⁰ 7s²",
    summaryAr: "سمي تيمناً بالفلكي كوبرنيكوس، عنصر اصطناعي مشع، تم تصنيفه كفلز انتقالي نشط قصير العمر للغاية.",
    summaryEn: "A highly synthetic radioactive element named in honor of astronomer Nicolaus Copernicus."
  },
  {
    number: 113, symbol: "Nh", name: "Nihonium", nameAr: "النيهونيوم", mass: 286.0, category: "post-transition", group: 13, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹",
    summaryAr: "أول عنصر يتم اكتشافه وتسميته في آسيا (اليابان)، عنصر اصطناعي فائق الثقل وسريع التحلل.",
    summaryEn: "A synthetic radioactive element first discovered in Japan (Nihon), extremely unstable."
  },
  {
    number: 114, symbol: "Fl", name: "Flerovium", nameAr: "الفليروفيوم", mass: 289.0, category: "post-transition", group: 14, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²",
    summaryAr: "سمي نسبة لمختبر فليروف للتفاعلات النووية بروسيا، وهو عنصر اصطناعي مشع فائق الثقل.",
    summaryEn: "An artificial superheavy radioactive element named after Flerov Laboratory of Nuclear Reactions."
  },
  {
    number: 115, symbol: "Mc", name: "Moscovium", nameAr: "الموسكوفيوم", mass: 290.0, category: "post-transition", group: 15, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³",
    summaryAr: "سمي نسبة لموسكو، وهو عنصر اصطناعي فائق الثقل تم تصنيعه في مسرعات الجسيمات وغير مستقر كيميائياً.",
    summaryEn: "A synthetic radioactive element named after the Moscow Oblast region in Russia."
  },
  {
    number: 116, symbol: "Lv", name: "Livermorium", nameAr: "الليفرموريوم", mass: 293.0, category: "post-transition", group: 16, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴",
    summaryAr: "سمي نسبة لمختبر لورانس ليفرمور بكاليفورنيا، وهو عنصر فائق الثقل سريع التفكك الإشعاعي.",
    summaryEn: "A synthetic superheavy radioactive element named after Lawrence Livermore National Laboratory."
  },
  {
    number: 117, symbol: "Ts", name: "Tennessine", nameAr: "التينيسين", mass: 294.0, category: "halogen", group: 17, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵",
    summaryAr: "ثاني أثقل عناصر الجدول الدوري، سمي تيمناً بولاية تينيسي الأمريكية كونه عنصراً اصطناعياً فائق الثقل.",
    summaryEn: "A superheavy synthetic element named after the state of Tennessee, the second-heaviest element on the table."
  },
  {
    number: 118, symbol: "Og", name: "Oganesson", nameAr: "الأوغانيسون", mass: 294.0, category: "noble", group: 18, period: 7, electronConfig: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶",
    summaryAr: "أثقل عنصر كيميائي تم تصنيعه في تاريخ البشرية ويختتم الدورة السابعة والغازات الخاملة حالياً.",
    summaryEn: "The heaviest synthetic element ever created, concluding the seventh period of the periodic table."
  }
];
