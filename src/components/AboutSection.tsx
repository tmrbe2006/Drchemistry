import React from "react";
import { GraduationCap, Mail, Phone, Award, BookOpen, MapPin } from "lucide-react";
import { motion } from "motion/react";

interface AboutSectionProps {
  lang: "ar" | "en";
}

export default function AboutSection({ lang }: AboutSectionProps) {
  const isEn = lang === "en";

  const info = {
    name: isEn ? "Dr. Tamer Madbouly" : "د. تامر مدبولي",
    title: isEn ? "PhD in Chemistry - Ain Shams University" : "دكتوراة في الكيمياء جامعة عين شمس",
    diplomas: [
      isEn ? "Diploma in Biochemistry" : "دبلوم الكيمياء الحيوية",
      isEn ? "Diploma in Organic Chemistry" : "دبلوم الكيمياء العضوية",
    ],
    email: "tmrbe2006@gmail.com",
    phone: "01111256095",
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
      >
        {/* Header/Hero Section */}
        <div className="relative h-48 bg-linear-to-r from-teal-600 to-indigo-600 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
          </div>
          <div className="relative z-10 text-center">
            <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl border-4 border-white/20">
              <GraduationCap className="w-12 h-12 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12 -mt-12 relative z-20">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-50 dark:border-slate-800">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-black text-slate-850 dark:text-white mb-2">
                {info.name}
              </h2>
              <div className="flex items-center justify-center gap-2 text-teal-600 font-bold bg-teal-50 dark:bg-teal-900/20 px-4 py-1.5 rounded-full w-fit mx-auto">
                <Award className="w-5 h-5" />
                <span>{info.title}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Credentials */}
              <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-800 dark:text-white border-b-2 border-teal-500 pb-2 w-fit">
                  {isEn ? "Qualifications" : "المؤهلات العلمية"}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <BookOpen className="w-6 h-6 text-indigo-500 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-700 dark:text-slate-200">{info.title}</p>
                      <p className="text-sm text-slate-500">{isEn ? "Ain Shams University" : "جامعة عين شمس"}</p>
                    </div>
                  </div>
                  {info.diplomas.map((diploma, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                      <Award className="w-6 h-6 text-teal-500 shrink-0" />
                      <p className="font-bold text-slate-700 dark:text-slate-200">{diploma}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-800 dark:text-white border-b-2 border-indigo-500 pb-2 w-fit">
                  {isEn ? "Contact Information" : "معلومات التواصل"}
                </h3>
                <div className="space-y-4">
                  <a 
                    href={`mailto:${info.email}`}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-teal-300 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm group-hover:bg-teal-500 group-hover:text-white transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{isEn ? "Email" : "البريد الإلكتروني"}</p>
                      <p className="font-bold text-slate-700 dark:text-slate-200">{info.email}</p>
                    </div>
                  </a>

                  <a 
                    href={`tel:${info.phone}`}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-indigo-300 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{isEn ? "Phone" : "الهاتف"}</p>
                      <p className="font-bold text-slate-700 dark:text-slate-200">{info.phone}</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm">
                      <MapPin className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{isEn ? "Location" : "الموقع"}</p>
                      <p className="font-bold text-slate-700 dark:text-slate-200">{isEn ? "Egypt" : "مصر"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 rounded-[2rem] bg-linear-to-r from-teal-50 to-indigo-50 dark:from-teal-900/10 dark:to-indigo-900/10 border border-teal-100 dark:border-teal-800 text-center">
              <p className="text-slate-600 dark:text-slate-400 italic font-medium">
                {isEn 
                  ? "\"Chemistry is the language of life, and my mission is to make you speak it fluently.\"" 
                  : "\"الكيمياء هي لغة الحياة، ومهمتي هي أن أجعلك تتحدثها بطلاقة.\""}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
