'use client';

import * as React from 'react';
import Image from 'next/image';
import { 
  Calculator, 
  User, 
  Activity, 
  Info, 
  ChevronRight, 
  ChevronDown,
  Timer, 
  Zap, 
  Dumbbell, 
  CheckCircle2,
  AlertCircle,
  Gavel,
  Menu,
  Coffee,
  FileText,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types & Constants ---

type Gender = 'M' | 'F';

type AgeGroup = 
  | '18-24' 
  | '25-29' 
  | '30-34' 
  | '35-39' 
  | '40-44' 
  | '45-49' 
  | '50+';

interface FormData {
  gender: Gender;
  ageGroup: AgeGroup;
  run2400: string; // MM:SS
  shuttleRun: string; // SS.SS
  bar: string; // Reps or Seconds
  pushUps: string; // Reps
  sitUps: string; // Reps
  barOrPushUpChoice: 'bar' | 'pushUp';
}

const AGE_GROUPS: AgeGroup[] = [
  '18-24',
  '25-29',
  '30-34',
  '35-39',
  '40-44',
  '45-49',
  '50+'
];

const SCORING_TABLES: Record<AgeGroup, number[]> = {
  '18-24': [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0],
  '25-29': [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 10.0],
  '30-34': [0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 10.0, 10.0],
  '35-39': [0.0, 0.0, 0.0, 0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 10.0, 10.0, 10.0],
  '40-44': [0.0, 0.0, 0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 10.0, 10.0, 10.0, 10.0],
  '45-49': [0.0, 0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0],
  '50+':   [0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0],
};

const EXERCISE_TABLES = {
  M: {
    run2400: [22.21, 22.20, 21.20, 20.40, 19.50, 18.00, 17.10, 16.20, 15.30, 14.40, 13.50, 13.00, 12.30, 12.00, 11.30, 11.00, 10.30, 10.00, 9.45, 9.30, 9.15],
    shuttleRun: [14.3, 14.1, 13.9, 13.7, 13.5, 13.3, 13.1, 12.9, 12.7, 12.5, 12.3, 12.1, 11.9, 11.7, 11.5, 11.3, 11.1, 10.9, 10.7, 10.5, 10.3],
    bar: [0, 0, 0, 0, 0, 0, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15],
    pushUps: [8, 9, 10, 11, 12, 13, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42],
    sitUps: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 31, 32, 35, 38, 41, 44, 47, 50, 53, 56],
  },
  F: {
    run2400: [23.40, 22.50, 22.00, 21.10, 20.20, 19.30, 18.40, 17.50, 17.00, 16.10, 15.20, 14.30, 14.00, 13.30, 13.00, 12.30, 12.00, 11.30, 11.15, 11.00, 10.45],
    shuttleRun: [15.3, 15.1, 14.9, 14.7, 14.5, 14.3, 14.1, 13.9, 13.7, 13.5, 13.3, 13.1, 12.9, 12.7, 12.5, 12.3, 12.1, 11.9, 11.7, 11.5, 11.3],
    bar: [0, 0, 0, 1.9, 2.9, 3.9, 4.9, 5.9, 6.9, 7.9, 8.9, 9.9, 10.9, 11.9, 12.9, 13.9, 14.9, 15.9, 16.9, 17.9, 18.0],
    pushUps: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32],
    sitUps: [0, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44],
  }
};

// --- Helper Functions ---

const formatMMSS = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
};

const formatSSSS = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}.${digits.slice(2)}`;
};

const getScoringIndex = (exercise: keyof typeof EXERCISE_TABLES.M, value: number, gender: Gender): number => {
  const table = EXERCISE_TABLES[gender][exercise];
  let index = 0;

  if (exercise === 'run2400' || exercise === 'shuttleRun') {
    // Timed exercises: Find max index where value <= table[index]
    for (let i = 0; i < 21; i++) {
      if (value <= table[i]) {
        index = i;
      } else {
        break;
      }
    }
  } else {
    // Repetition/Duration exercises: Find max index where value >= table[index]
    for (let i = 0; i < 21; i++) {
      if (value >= table[i]) {
        index = i;
      } else {
        break;
      }
    }
  }

  return index;
};

const calculatePoints = (exercise: keyof typeof EXERCISE_TABLES.M, value: number, gender: Gender, ageGroup: AgeGroup): number => {
  const index = getScoringIndex(exercise, value, gender);
  return SCORING_TABLES[ageGroup][index];
};

// --- Components ---

export default function EACFCalculator() {
  const [formData, setFormData] = React.useState<FormData>({
    gender: 'M',
    ageGroup: '18-24',
    run2400: '',
    shuttleRun: '',
    bar: '',
    pushUps: '',
    sitUps: '',
    barOrPushUpChoice: 'pushUp'
  });

  const [result, setResult] = React.useState<{
    totalScore: number;
    average: number;
    status: 'Aprovado' | 'Reprovado';
    details: { name: string; score: number | string; points: number }[];
  } | null>(null);

  const [activeTab, setActiveTab] = React.useState<'calculator' | 'criteria'>('calculator');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  const isFemale = formData.gender === 'F';
  const isAge35to49 = ['35-39', '40-44', '45-49'].includes(formData.ageGroup);
  const isAge50Plus = formData.ageGroup === '50+';

  const handleCalculate = () => {
    const details: { name: string; score: number | string; points: number }[] = [];
    
    const parseTimeAsFloat = (time: string) => {
      // Replicate Python's .replace(':', '.') logic
      return parseFloat(time.replace(':', '.')) || 0;
    };

    // 1. Run 2400m (Mandatory for all)
    const runVal = parseTimeAsFloat(formData.run2400);
    details.push({ 
      name: 'Corrida 2.4km', 
      score: formData.run2400 || '00:00', 
      points: calculatePoints('run2400', runVal, formData.gender, formData.ageGroup) 
    });

    // 2. Sit-ups (Mandatory for all)
    const sitUpsVal = parseInt(formData.sitUps) || 0;
    details.push({ 
      name: 'Abdominais', 
      score: sitUpsVal, 
      points: calculatePoints('sitUps', sitUpsVal, formData.gender, formData.ageGroup) 
    });

    if (isAge50Plus) {
      // 50+: Mandatory Push-ups
      const pushUpsVal = parseInt(formData.pushUps) || 0;
      details.push({ 
        name: 'Flexão de Braços', 
        score: pushUpsVal, 
        points: calculatePoints('pushUps', pushUpsVal, formData.gender, formData.ageGroup) 
      });
    } else if (isAge35to49) {
      // 35-49: Choice
      if (formData.barOrPushUpChoice === 'bar') {
        const barVal = parseInt(formData.bar) || 0;
        details.push({ 
          name: isFemale ? 'Suspensão na Barra' : 'Barra Fixa', 
          score: barVal, 
          points: calculatePoints('bar', barVal, formData.gender, formData.ageGroup) 
        });
      } else {
        const pushUpsVal = parseInt(formData.pushUps) || 0;
        details.push({ 
          name: 'Flexão de Braços', 
          score: pushUpsVal, 
          points: calculatePoints('pushUps', pushUpsVal, formData.gender, formData.ageGroup) 
        });
      }
      const shuttleVal = parseFloat(formData.shuttleRun) || 0;
      details.push({ 
        name: 'Shuttle Run', 
        score: formData.shuttleRun || '00.00', 
        points: calculatePoints('shuttleRun', shuttleVal, formData.gender, formData.ageGroup) 
      });
    } else {
      // < 35: Mandatory Bar, Shuttle Run (Push-ups hidden for this group)
      const barVal = parseInt(formData.bar) || 0;
      details.push({ 
        name: isFemale ? 'Suspensão na Barra' : 'Barra Fixa', 
        score: barVal, 
        points: calculatePoints('bar', barVal, formData.gender, formData.ageGroup) 
      });
      
      const shuttleVal = parseFloat(formData.shuttleRun) || 0;
      details.push({ 
        name: 'Shuttle Run', 
        score: formData.shuttleRun || '00.00', 
        points: calculatePoints('shuttleRun', shuttleVal, formData.gender, formData.ageGroup) 
      });
    }

    const totalScore = details.reduce((acc, d) => acc + d.points, 0);
    const average = totalScore / details.length;
    const hasZero = details.some(d => d.points === 0);
    const status = (average >= 6 && !hasZero) ? 'Aprovado' : 'Reprovado';

    setResult({ totalScore, average, status, details });
    
    // Scroll to result on mobile
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f6f6f8] text-slate-900 font-sans">
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-[#1a2a44] text-white p-4 flex items-center justify-between shadow-md z-50">
        <div className="flex items-center gap-3">
          <div className="relative size-10 rounded-lg overflow-hidden border border-white/20">
            <Image 
              src="/pmrn-logo.png"
              alt="PM RN"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-bold text-sm">EACF-PMRN</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Overlay) */}
      <AnimatePresence>
        {(isSidebarOpen || isDesktop) && (
          <>
            {/* Mobile Overlay Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-[60]"
            />
            <motion.aside 
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                "fixed lg:static inset-y-0 left-0 w-72 bg-[#1a2a44] text-white flex flex-col border-r border-slate-200 z-[70] lg:z-0",
                !isSidebarOpen && "hidden lg:flex"
              )}
            >
              <div className="p-6 flex items-center justify-between lg:justify-start gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative size-14 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
                    <Image 
                      src="/pmrn-logo.png" 
                      alt="PM RN Logo" 
                      fill
                      className="object-contain p-1 bg-white"
                      priority
                    />
                  </div>
                  <div>
                    <h1 className="text-xl font-black leading-none text-white tracking-tight">EACF<span className="text-blue-400">.</span>PMRN</h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Simulador Oficial</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-2">
                <SidebarItem 
                  icon={Calculator} 
                  label="Calculadora" 
                  active={activeTab === 'calculator'} 
                  onClick={() => {
                    setActiveTab('calculator');
                    setIsSidebarOpen(false);
                  }}
                />
                <SidebarItem 
                  icon={Gavel} 
                  label="Critérios de Avaliação" 
                  active={activeTab === 'criteria'}
                  onClick={() => {
                    setActiveTab('criteria');
                    setIsSidebarOpen(false);
                  }}
                />
              </nav>

              <div className="p-6 border-t border-white/10">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4">Desenvolvimento</p>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">                  
                  <div>
                    <p className="text-[11px] font-bold text-white">Sgt PM Vanderson</p>
                    <p className="text-[9px] text-slate-400">6º BPM - PMRN</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'calculator' ? (
              <motion.div
                key="calculator"
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <header className="mb-8 lg:mb-14 relative">
                  <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-1 h-12 bg-blue-600 rounded-full hidden lg:block" />
                  <div className="flex items-center gap-2 text-[#135bec] text-xs font-black uppercase tracking-[0.2em] mb-3">
                    <Calculator size={14} className="animate-pulse" />
                    <span>Sistema de Avaliação Física</span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-[#1a2a44] leading-[1.1]">
                    Simulador de <br className="hidden lg:block" />
                    Pontuação <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#135bec] to-[#1a2a44]">EACF</span>
                  </h2>
                  <p className="text-slate-500 mt-5 text-base lg:text-xl max-w-2xl font-medium leading-relaxed">
                    Calcule seu desempenho físico com base nos critérios oficiais da PMRN. 
                    Resultados instantâneos, detalhados e em conformidade com o edital.
                  </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Calculator Form */}
                  <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-110" />
                      
                      <div className="p-8 lg:p-10 relative">
                        <div className="flex items-center gap-4 mb-10">
                          <div className="size-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
                            <User size={24} />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-[#1a2a44] tracking-tight">Perfil do Candidato</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Identificação e Critérios</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Gênero</label>
                            <div className="flex p-1.5 bg-slate-100 rounded-2xl gap-1.5">
                              {['M', 'F'].map((g) => (
                                <button
                                  key={g}
                                  onClick={() => setFormData(prev => ({ ...prev, gender: g as 'M' | 'F' }))}
                                  className={cn(
                                    "flex-1 py-3.5 rounded-xl text-xs font-black transition-all duration-300",
                                    formData.gender === g 
                                      ? "bg-white text-[#135bec] shadow-sm scale-[1.02]" 
                                      : "text-slate-500 hover:text-slate-700"
                                  )}
                                >
                                  {g === 'M' ? 'MASCULINO' : 'FEMININO'}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Faixa Etária</label>
                            <div className="relative">
                              <select 
                                value={formData.ageGroup}
                                onChange={(e) => setFormData(prev => ({ ...prev, ageGroup: e.target.value as AgeGroup }))}
                                className="w-full p-4 bg-slate-100 rounded-2xl text-sm font-black text-slate-700 border-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                              >
                                {AGE_GROUPS.map(group => (
                                  <option key={group} value={group}>{group} ANOS</option>
                                ))}
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <ChevronDown size={16} />
                              </div>
                            </div>
                          </div>

                          {isAge35to49 && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="md:col-span-2 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-6"
                            >
                              <div className="flex items-center gap-4">
                                <div className="size-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                  <Activity size={20} />
                                </div>
                                <div>
                                  <p className="text-sm font-black text-blue-900 tracking-tight">Opção de Exercício</p>
                                  <p className="text-xs text-blue-700/60 font-medium">Escolha entre Barra ou Flexão para sua idade.</p>
                                </div>
                              </div>
                              <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-blue-100">
                                <button 
                                  onClick={() => setFormData(prev => ({ ...prev, barOrPushUpChoice: 'bar' }))}
                                  className={cn(
                                    "px-6 py-2.5 rounded-xl text-[10px] font-black transition-all duration-300",
                                    formData.barOrPushUpChoice === 'bar' ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-400 hover:text-slate-600"
                                  )}
                                >
                                  BARRA FIXA
                                </button>
                                <button 
                                  onClick={() => setFormData(prev => ({ ...prev, barOrPushUpChoice: 'pushUp' }))}
                                  className={cn(
                                    "px-6 py-2.5 rounded-xl text-[10px] font-black transition-all duration-300",
                                    formData.barOrPushUpChoice === 'pushUp' ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-400 hover:text-slate-600"
                                  )}
                                >
                                  FLEXÃO
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        <div className="mt-14 pt-10 border-t border-slate-100">
                          <div className="flex items-center gap-4 mb-10">
                            <div className="size-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-100">
                              <Activity size={24} />
                            </div>
                            <div>
                              <h3 className="text-2xl font-black text-[#1a2a44] tracking-tight">Desempenho Físico</h3>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Insira seus resultados</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup 
                              label="Corrida 2.4km" 
                              icon={Timer} 
                              placeholder="MM:SS"
                              value={formData.run2400}
                              onChange={(val) => setFormData(prev => ({ ...prev, run2400: formatMMSS(val) }))}
                              subtext="Ex: 12:00"
                            />

                            {!isAge50Plus && (
                              <InputGroup 
                                label="Shuttle Run" 
                                icon={Zap} 
                                placeholder="00.00"
                                value={formData.shuttleRun}
                                onChange={(val) => setFormData(prev => ({ ...prev, shuttleRun: formatSSSS(val) }))}
                                subtext="Tempo em segundos"
                              />
                            )}

                            {(!isAge50Plus && (!isAge35to49 || formData.barOrPushUpChoice === 'bar')) && (
                              <InputGroup 
                                label={isFemale ? "Suspensão Barra" : "Barra Fixa"}
                                icon={Dumbbell} 
                                placeholder="0"
                                type="number"
                                value={formData.bar}
                                onChange={(val) => setFormData(prev => ({ ...prev, bar: val }))}
                                subtext={isFemale ? "Tempo em segundos" : "Número de repetições"}
                              />
                            )}

                            {(isAge50Plus || (isAge35to49 && formData.barOrPushUpChoice === 'pushUp')) && (
                              <InputGroup 
                                label="Flexão de Braços" 
                                icon={Activity} 
                                placeholder="0"
                                type="number"
                                value={formData.pushUps}
                                onChange={(val) => setFormData(prev => ({ ...prev, pushUps: val }))}
                                subtext="Repetições totais"
                              />
                            )}

                            <div className="md:col-span-2">
                              <InputGroup 
                                label="Abdominais Remador" 
                                icon={Activity} 
                                placeholder="0"
                                type="number"
                                value={formData.sitUps}
                                onChange={(val) => setFormData(prev => ({ ...prev, sitUps: val }))}
                                subtext="Repetições em 1 minuto"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-8 lg:p-10 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                          <div className="size-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                            <Info size={20} />
                          </div>
                          <p className="text-xs text-slate-500 font-medium max-w-[200px] leading-relaxed">
                            Certifique-se de que todos os dados estão corretos antes de calcular.
                          </p>
                        </div>
                        <button 
                          onClick={handleCalculate}
                          className="group relative w-full sm:w-auto flex items-center justify-center gap-4 px-12 py-6 bg-gradient-to-r from-[#135bec] to-[#1a2a44] text-white rounded-[2rem] font-black text-xl tracking-tighter uppercase overflow-hidden transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:shadow-blue-900/40 active:scale-95"
                        >
                          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                          <div className="relative flex items-center justify-center gap-3">
                            <Zap className="text-yellow-400 group-hover:animate-pulse" size={24} />
                            <span>CALCULAR</span>
                          </div>
                        </button>
                      </div>
                    </section>
                  </div>

                  {/* Results & Info Sidebar */}
                  <div className="space-y-8">
                    {/* Results Section */}
                    <div id="result-section">
                      <AnimatePresence mode="wait">
                        {result ? (
                          <motion.div 
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden relative"
                          >
                            <div className={cn(
                              "p-10 text-white text-center relative overflow-hidden",
                              result.status === 'Aprovado' ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-rose-500 to-pink-600"
                            )}>
                              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                                <div className="absolute top-4 left-4 size-20 rounded-full border-4 border-white" />
                                <div className="absolute bottom-4 right-4 size-32 rounded-full border-8 border-white" />
                              </div>
                              
                              <div className="inline-flex items-center justify-center size-20 bg-white/20 backdrop-blur-md rounded-3xl mb-6 border border-white/30 shadow-inner">
                                {result.status === 'Aprovado' ? <CheckCircle2 className="text-white" size={40} /> : <AlertCircle className="text-white" size={40} />}
                              </div>
                              
                              <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Status Final</p>
                              <h3 className="text-5xl font-black tracking-tighter uppercase">{result.status}</h3>
                              
                              <div className="mt-8 pt-8 border-t border-white/20 flex justify-center">
                                <div className="text-center">
                                  <p className="text-white/60 text-[10px] uppercase font-black tracking-widest mb-1">Resultado Geral</p>
                                  <p className="text-4xl font-black">{result.average.toFixed(2)}</p>
                                </div>
                              </div>
                            </div>

                            <div className="p-8">
                              <h4 className="text-[#1a2a44] font-black text-sm mb-6 flex items-center gap-2 uppercase tracking-wider">
                                <div className="size-1.5 bg-blue-600 rounded-full" />
                                Detalhamento por Item
                              </h4>
                              <div className="space-y-4">
                                {result.details.map((detail, idx) => (
                                  <div key={idx} className="space-y-2 group">
                                    <div className="flex items-center justify-between px-1">
                                      <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{detail.name}</span>
                                      <span className={cn(
                                        "text-xs font-black",
                                        detail.points >= 6 ? "text-emerald-600" : "text-rose-500"
                                      )}>
                                        {detail.points.toFixed(1)} pts
                                      </span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(detail.points / 10) * 100}%` }}
                                        className={cn(
                                          "h-full rounded-full shadow-sm",
                                          detail.points >= 6 ? "bg-gradient-to-r from-emerald-400 to-emerald-600" : "bg-gradient-to-r from-rose-400 to-rose-600"
                                        )}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="mt-8 p-5 bg-blue-50/50 rounded-3xl border border-blue-100 flex gap-4">
                                <div className="size-8 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                                  <Info size={16} />
                                </div>
                                <p className="text-[10px] text-blue-800 font-medium leading-relaxed">
                                  <strong>Critério de Aprovação:</strong> Média mínima de 6.0 e nenhuma nota individual zerada.
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                            <div className="size-20 bg-white rounded-3xl flex items-center justify-center text-slate-300 mb-6 shadow-sm">
                              <Calculator size={40} />
                            </div>
                            <h3 className="text-slate-900 font-black text-lg mb-2 tracking-tight">Aguardando Dados</h3>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[200px] mx-auto">
                              Preencha as métricas ao lado para visualizar seu resultado detalhado.
                            </p>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Quick Info Card */}
                    <div className="bg-[#1a2a44] p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150" />
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-6">
                          <Info size={20} className="text-blue-400" />
                          <h4 className="text-lg font-black tracking-tight">Informações Úteis</h4>
                        </div>
                        <ul className="space-y-4">
                          {[
                            { text: "Média mínima de 6.0 para aprovação.", icon: CheckCircle2 },
                            { text: "Nenhum teste pode ter nota zero.", icon: AlertCircle },
                            { text: "Critérios baseados no último edital PMRN.", icon: FileText }
                          ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed group/item">
                              <item.icon size={16} className="mt-0.5 text-blue-500 shrink-0 group-hover/item:scale-110 transition-transform" />
                              <span className="group-hover/item:text-white transition-colors">{item.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer / Disclaimer */}
                <footer className="mt-20 pt-10 border-t border-slate-100">
                  <div className="flex flex-col items-center justify-center gap-6">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                      <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Desenvolvido por <span className="text-[#1a2a44]">Sgt PM Vanderson - 6º BPM</span>
                      </p>
                    </div>
                  </div>
                </footer>
              </motion.div>
            ) : (
              <motion.div
                key="criteria"
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <header className="mb-6 lg:mb-10">
                  <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-[#1a2a44]">
                    Critérios de Avaliação (EACF)
                  </h2>
                  <p className="text-slate-500 mt-2 text-base lg:text-lg">
                    Tabelas oficiais de pontuação por faixa etária e gênero.
                  </p>
                </header>

                <div className="space-y-12 pb-12">
                  {/* Male Table */}
                  <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 bg-[#1a2a44] text-white">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <User size={20} />
                        Tabela Masculina
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-4 text-xs font-bold uppercase text-slate-500 whitespace-nowrap">Corrida 2.4km</th>
                            <th className="p-4 text-xs font-bold uppercase text-slate-500 whitespace-nowrap">Shuttle Run</th>
                            <th className="p-4 text-xs font-bold uppercase text-slate-500 whitespace-nowrap">Barra</th>
                            <th className="p-4 text-xs font-bold uppercase text-slate-500 whitespace-nowrap">Flexão</th>
                            <th className="p-4 text-xs font-bold uppercase text-slate-500 whitespace-nowrap">Abdominais</th>
                            {AGE_GROUPS.map(age => (
                              <th key={age} className="p-4 text-xs font-bold uppercase text-slate-500 whitespace-nowrap">{age}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {EXERCISE_TABLES.M.run2400.map((_, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 text-sm font-medium text-slate-700">{EXERCISE_TABLES.M.run2400[idx].toFixed(2).replace('.', ':')}</td>
                              <td className="p-4 text-sm text-slate-600">{EXERCISE_TABLES.M.shuttleRun[idx].toFixed(1)}</td>
                              <td className="p-4 text-sm text-slate-600">{EXERCISE_TABLES.M.bar[idx]}</td>
                              <td className="p-4 text-sm text-slate-600">{EXERCISE_TABLES.M.pushUps[idx]}</td>
                              <td className="p-4 text-sm text-slate-600">{EXERCISE_TABLES.M.sitUps[idx]}</td>
                              {AGE_GROUPS.map(age => (
                                <td key={age} className={cn(
                                  "p-4 text-sm font-bold",
                                  SCORING_TABLES[age][idx] >= 6 ? "text-emerald-600" : "text-rose-500"
                                )}>
                                  {SCORING_TABLES[age][idx].toFixed(1)}
                                </td>
                              ))}
                            </tr>
                          )).reverse()}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  {/* Female Table */}
                  <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 bg-[#135bec] text-white">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <User size={20} />
                        Tabela Feminina
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-4 text-xs font-bold uppercase text-slate-500 whitespace-nowrap">Corrida 2.4km</th>
                            <th className="p-4 text-xs font-bold uppercase text-slate-500 whitespace-nowrap">Shuttle Run</th>
                            <th className="p-4 text-xs font-bold uppercase text-slate-500 whitespace-nowrap">Suspensão</th>
                            <th className="p-4 text-xs font-bold uppercase text-slate-500 whitespace-nowrap">Flexão</th>
                            <th className="p-4 text-xs font-bold uppercase text-slate-500 whitespace-nowrap">Abdominais</th>
                            {AGE_GROUPS.map(age => (
                              <th key={age} className="p-4 text-xs font-bold uppercase text-slate-500 whitespace-nowrap">{age}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {EXERCISE_TABLES.F.run2400.map((_, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 text-sm font-medium text-slate-700">{EXERCISE_TABLES.F.run2400[idx].toFixed(2).replace('.', ':')}</td>
                              <td className="p-4 text-sm text-slate-600">{EXERCISE_TABLES.F.shuttleRun[idx].toFixed(1)}</td>
                              <td className="p-4 text-sm text-slate-600">{EXERCISE_TABLES.F.bar[idx]}s</td>
                              <td className="p-4 text-sm text-slate-600">{EXERCISE_TABLES.F.pushUps[idx]}</td>
                              <td className="p-4 text-sm text-slate-600">{EXERCISE_TABLES.F.sitUps[idx]}</td>
                              {AGE_GROUPS.map(age => (
                                <td key={age} className={cn(
                                  "p-4 text-sm font-bold",
                                  SCORING_TABLES[age][idx] >= 6 ? "text-emerald-600" : "text-rose-500"
                                )}>
                                  {SCORING_TABLES[age][idx].toFixed(1)}
                                </td>
                              ))}
                            </tr>
                          )).reverse()}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- Helper Components ---

function SidebarItem({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
        active 
          ? "bg-gradient-to-r from-[#135bec] to-[#1a2a44] text-white shadow-lg shadow-blue-900/40" 
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon size={20} className={cn("transition-transform duration-300 group-hover:scale-110", active ? "text-white" : "text-slate-500 group-hover:text-blue-400")} />
      <span className="text-sm font-semibold tracking-wide">{label}</span>
      {active && (
        <motion.div 
          layoutId="active-pill"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-400 rounded-l-full"
        />
      )}
    </button>
  );
}

function InputGroup({ 
  label, 
  icon: Icon, 
  placeholder, 
  value, 
  onChange, 
  subtext,
  type = "text"
}: { 
  label: string; 
  icon: any; 
  placeholder: string; 
  value: string; 
  onChange: (val: string) => void;
  subtext?: string;
  type?: string;
}) {
  return (
    <div className="group bg-slate-50/50 hover:bg-white p-5 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-all duration-500 hover:shadow-xl hover:shadow-blue-900/5">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
          <Icon size={18} />
        </div>
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</label>
      </div>
      <div className="relative">
        <input 
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-2xl font-black text-slate-900 placeholder:text-slate-200 focus:outline-none transition-all tracking-tight"
        />
      </div>
      {subtext && (
        <div className="mt-3 flex items-center gap-2">
          <div className="w-1 h-1 bg-blue-400 rounded-full" />
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{subtext}</p>
        </div>
      )}
    </div>
  );
}
