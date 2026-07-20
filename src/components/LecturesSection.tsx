import React, { useState, useEffect } from "react";
import { Youtube, Plus, Trash2, ExternalLink, Play, Video, Lock, Unlock, FileText, Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Resource {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  type: "youtube" | "pdf" | "link";
}

interface LecturesSectionProps {
  lang: "ar" | "en";
}

export default function LecturesSection({ lang }: LecturesSectionProps) {
  const isEn = lang === "en";
  const [resources, setResources] = useState<Resource[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"youtube" | "pdf">("youtube");
  const [isAdding, setIsAdding] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  useEffect(() => {
    // Check if admin is already logged in
    const adminSession = localStorage.getItem("dr_tamer_admin_active");
    if (adminSession === "true") setIsAdmin(true);

    const saved = localStorage.getItem("dr_tamer_lectures_v2");
    if (saved) {
      setResources(JSON.parse(saved));
    } else {
      // Migrate or set defaults
      const oldSaved = localStorage.getItem("dr_tamer_lectures");
      let defaults: Resource[] = [];
      if (oldSaved) {
        const oldData = JSON.parse(oldSaved);
        defaults = oldData.map((v: any) => ({ ...v, type: "youtube" }));
      } else {
        defaults = [
          {
            id: "1",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            title: isEn ? "Welcome to Chemistry" : "مرحباً بكم في عالم الكيمياء",
            thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg",
            type: "youtube"
          }
        ];
      }
      setResources(defaults);
      localStorage.setItem("dr_tamer_lectures_v2", JSON.stringify(defaults));
    }
  }, [isEn]);

  const extractVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    
    let thumbnail = "";
    if (newType === "youtube") {
      const videoId = extractVideoId(newUrl);
      if (!videoId) {
        alert(isEn ? "Invalid YouTube URL" : "رابط يوتيوب غير صحيح");
        return;
      }
      thumbnail = `https://img.youtube.com/vi/${videoId}/0.jpg`;
    } else {
      // PDF or general link icon/placeholder
      thumbnail = "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=500";
    }

    const newResource: Resource = {
      id: Date.now().toString(),
      url: newUrl,
      title: newTitle || (isEn ? "New Resource" : "مورد جديد"),
      thumbnail,
      type: newType
    };

    const updated = [newResource, ...resources];
    setResources(updated);
    localStorage.setItem("dr_tamer_lectures_v2", JSON.stringify(updated));
    setNewUrl("");
    setNewTitle("");
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (!isAdmin) return;
    const updated = resources.filter(v => v.id !== id);
    setResources(updated);
    localStorage.setItem("dr_tamer_lectures_v2", JSON.stringify(updated));
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple secure check for admin (you can change this password)
    if (adminPassword === "dr_tamer_2026") {
      setIsAdmin(true);
      localStorage.setItem("dr_tamer_admin_active", "true");
      setShowAdminPrompt(false);
      setAdminPassword("");
    } else {
      alert(isEn ? "Incorrect Password" : "كلمة المرور غير صحيحة");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("dr_tamer_admin_active");
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Header with Admin Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-black text-slate-850 dark:text-white flex items-center gap-3">
            <Video className="w-8 h-8 text-teal-600" />
            {isEn ? "Educational Resources" : "المصادر التعليمية"}
          </h2>
          <p className="text-slate-500 font-bold mt-1">
            {isEn ? "Lectures, Videos, and PDF Materials" : "المحاضرات، الفيديوهات، وملفات الـ PDF"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsAdding(!isAdding)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black shadow-lg transition-all active:scale-95"
              >
                {isAdding ? (isEn ? "Cancel" : "إلغاء") : (
                  <>
                    <Plus className="w-5 h-5" />
                    {isEn ? "Add Resource" : "إضافة مورد"}
                  </>
                )}
              </button>
              <button 
                onClick={handleLogout}
                className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl hover:text-rose-500 transition-all shadow-sm"
                title={isEn ? "Admin Logout" : "خروج الأدمن"}
              >
                <Unlock className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowAdminPrompt(true)}
              className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-teal-600 font-bold transition-all border border-transparent hover:border-teal-100 dark:hover:border-teal-900 rounded-xl"
            >
              <Lock className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest">{isEn ? "Admin Access" : "دخول الأدمن"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Login Modal/Prompt */}
      <AnimatePresence>
        {showAdminPrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              <h3 className="text-2xl font-black text-slate-850 dark:text-white mb-2 text-center">
                {isEn ? "Admin Login" : "تسجيل دخول الأدمن"}
              </h3>
              <p className="text-center text-slate-500 font-bold mb-6 text-sm">
                {isEn ? "Enter your password to manage lectures" : "أدخل كلمة المرور لإدارة المحاضرات"}
              </p>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input 
                  type="password"
                  autoFocus
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder={isEn ? "Password" : "كلمة المرور"}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-teal-500 outline-hidden font-bold"
                />
                <div className="flex gap-3">
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-teal-600 text-white rounded-2xl font-black shadow-lg shadow-teal-100 dark:shadow-none"
                  >
                    {isEn ? "Unlock" : "فتح"}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowAdminPrompt(false)}
                    className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black"
                  >
                    {isEn ? "Back" : "رجوع"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAdmin && isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-12"
          >
            <form onSubmit={handleAddResource} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border-2 border-dashed border-teal-200 dark:border-teal-900 shadow-xl">
              <div className="flex gap-4 mb-6">
                <button 
                  type="button"
                  onClick={() => setNewType("youtube")}
                  className={`flex-1 py-3 rounded-xl font-black flex items-center justify-center gap-2 transition-all ${newType === "youtube" ? "bg-rose-600 text-white shadow-lg" : "bg-slate-50 dark:bg-slate-800 text-slate-500"}`}
                >
                  <Youtube className="w-5 h-5" />
                  YouTube
                </button>
                <button 
                  type="button"
                  onClick={() => setNewType("pdf")}
                  className={`flex-1 py-3 rounded-xl font-black flex items-center justify-center gap-2 transition-all ${newType === "pdf" ? "bg-teal-600 text-white shadow-lg" : "bg-slate-50 dark:bg-slate-800 text-slate-500"}`}
                >
                  <FileText className="w-5 h-5" />
                  PDF
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">
                    {isEn ? (newType === "youtube" ? "YouTube Link" : "PDF URL / Drive Link") : (newType === "youtube" ? "رابط اليوتيوب" : "رابط الـ PDF")}
                  </label>
                  <input 
                    type="url" 
                    required
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-teal-500 outline-hidden transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">
                    {isEn ? "Title" : "العنوان"}
                  </label>
                  <input 
                    type="text" 
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={isEn ? "Resource Title" : "عنوان المصدر"}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-teal-500 outline-hidden transition-all font-bold"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="mt-6 w-full py-4 bg-linear-to-r from-teal-600 to-emerald-600 text-white rounded-2xl font-black shadow-xl hover:shadow-teal-200 transition-all active:scale-[0.98]"
              >
                {isEn ? "Confirm Add Resource" : "تأكيد إضافة المورد"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {resources.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
            <Video className="w-10 h-10 text-slate-300" />
          </div>
          <p className="text-slate-400 font-black text-xl">
            {isEn ? "No resources found" : "لا توجد مصادر حالياً"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((res) => (
            <motion.div 
              layout
              key={res.id}
              className="group bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img 
                  src={res.thumbnail} 
                  alt={res.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a 
                    href={res.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`w-16 h-16 text-white rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500 ${res.type === 'youtube' ? 'bg-rose-600' : 'bg-teal-600'}`}
                  >
                    {res.type === 'youtube' ? <Play className="w-8 h-8 fill-current ml-1" /> : <FileText className="w-8 h-8" />}
                  </a>
                </div>
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => handleDelete(res.id)}
                      className="p-2.5 bg-white/90 dark:bg-slate-900/90 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h4 className="font-black text-slate-800 dark:text-white line-clamp-2 mb-4 group-hover:text-teal-600 transition-colors">
                  {res.title}
                </h4>
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black ${res.type === 'youtube' ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/20' : 'text-teal-600 bg-teal-50 dark:bg-teal-900/20'}`}>
                    {res.type === 'youtube' ? <Youtube className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                    <span>{res.type === 'youtube' ? 'YouTube' : 'PDF Document'}</span>
                  </div>
                  <a 
                    href={res.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-slate-400 hover:text-teal-600 text-xs font-bold transition-colors"
                  >
                    {isEn ? "Open" : "فتح"}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

