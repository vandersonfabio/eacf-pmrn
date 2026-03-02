'use client';

import * as React from 'react';
import Image from 'next/image';
import { 
  Calculator, 
  User, 
  Activity, 
  Info, 
  ChevronRight, 
  Timer, 
  Zap, 
  Dumbbell, 
  CheckCircle2,
  AlertCircle,
  Gavel,
  Menu,
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
    const status = average >= 6 ? 'Aprovado' : 'Reprovado';

    setResult({ totalScore, average, status, details });
    
    // Scroll to result on mobile
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#f6f6f8] text-slate-900 font-sans overflow-hidden">
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-[#1a2a44] text-white p-4 flex items-center justify-between shadow-md z-50">
        <div className="flex items-center gap-3">
          <div className="relative size-8 rounded bg-white p-0.5">
            <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCUF1H9JXtwkyPLyvWfKpwC_mlyXN9w8upD8jiaAE-Z6mOIIinH01Uxq_0-OHTJcr9i2Enug5T0gftZ2881k_ff03Ylh5104Xx9nm_9HdddIIao9bZ0aKACz9iPLI99XxJuzyf_nJErtsv-8NX64kgivLJuesNdN9pVKR2ZvxAIapzdJbboLfYpvpuhy3pQPosDKNZP8zz0FNnj4WlW5_35UG-dFYwwPSUXsDXwjHshONP8wVeZpRIPUZ1d_DK4Gwtr004QC2pGg"
              alt="PM RN"
              fill
              className="object-contain"
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
              initial={{ x: -300 }}
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
                  <div className="relative size-12 rounded-lg bg-white flex items-center justify-center p-1 shadow-inner overflow-hidden">
                    <Image 
                      className="w-full h-full object-contain" 
                      alt="PM RN Logo" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCUF1H9JXtwkyPLyvWfKpwC_mlyXN9w8upD8jiaAE-Z6mOIIinH01Uxq_0-OHTJcr9i2Enug5T0gftZ2881k_ff03Ylh5104Xx9nm_9HdddIIao9bZ0aKACz9iPLI99XxJuzyf_nJErtsv-8NX64kgivLJuesNdN9pVKR2ZvxAIapzdJbboLfYpvpuhy3pQPosDKNZP8zz0FNnj4WlW5_35UG-dFYwwPSUXsDXwjHshONP8wVeZpRIPUZ1d_DK4Gwtr004QC2pGg"
                      fill
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold leading-tight">EACF-PMRN</h1>
                    <p className="text-xs text-slate-300">Simulador de Pontuação</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-2">
                <SidebarItem icon={Calculator} label="Calculadora" active />
                <SidebarItem icon={Gavel} label="Critérios de Avaliação" />
              </nav>

              <div className="p-6 border-t border-white/10">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4">Desenvolvimento</p>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="size-8 rounded-full bg-[#135bec] flex items-center justify-center text-[10px] font-bold">SV</div>
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
      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
        <div className="max-w-4xl mx-auto">
          <header className="mb-6 lg:mb-10">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl lg:text-3xl font-black tracking-tight text-[#1a2a44]"
            >
              Simulador de Pontuação EACF - PMRN
            </motion.h2>
            <p className="text-slate-500 mt-2 text-base lg:text-lg">
              Insira as métricas de desempenho para obter a pontuação oficial e classificação.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-6 lg:gap-8">
            {/* Calculator Card */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 lg:p-8">
              {/* Dados Cadastrais */}
              <div className="mb-8 lg:mb-10">
                <h3 className="flex items-center gap-2 text-[#135bec] font-bold uppercase tracking-wider text-xs lg:text-sm mb-6">
                  <User size={18} />
                  Dados Cadastrais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Gênero</label>
                    <div className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-100 p-1">
                      <button 
                        onClick={() => setFormData(prev => ({ ...prev, gender: 'M' }))}
                        className={cn(
                          "flex h-full grow items-center justify-center rounded-lg px-4 text-sm font-semibold transition-all",
                          formData.gender === 'M' ? "bg-white text-[#135bec] shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                      >
                        Masculino
                      </button>
                      <button 
                        onClick={() => setFormData(prev => ({ ...prev, gender: 'F' }))}
                        className={cn(
                          "flex h-full grow items-center justify-center rounded-lg px-4 text-sm font-semibold transition-all",
                          formData.gender === 'F' ? "bg-white text-[#135bec] shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                      >
                        Feminino
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Faixa Etária</label>
                    <select 
                      value={formData.ageGroup}
                      onChange={(e) => setFormData(prev => ({ ...prev, ageGroup: e.target.value as AgeGroup }))}
                      className="w-full h-12 rounded-xl border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-[#135bec] focus:border-transparent transition-all"
                    >
                      {AGE_GROUPS.map(group => (
                        <option key={group} value={group}>{group} anos</option>
                      ))}
                    </select>
                  </div>

                  {/* Choice for 35-49 - Moved here for better UX */}
                  {isAge35to49 && (
                    <div className="md:col-span-2 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-sm font-medium text-blue-800 mb-3">
                        Opção de Exercício (35-49 anos):
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="choice" 
                            checked={formData.barOrPushUpChoice === 'bar'}
                            onChange={() => setFormData(prev => ({ ...prev, barOrPushUpChoice: 'bar' }))}
                            className="text-[#135bec] focus:ring-[#135bec]"
                          />
                          <span className="text-sm text-slate-700">Barra Fixa / Suspensão</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="choice" 
                            checked={formData.barOrPushUpChoice === 'pushUp'}
                            onChange={() => setFormData(prev => ({ ...prev, barOrPushUpChoice: 'pushUp' }))}
                            className="text-[#135bec] focus:ring-[#135bec]"
                          />
                          <span className="text-sm text-slate-700">Flexão de Braço no Solo</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Métricas de Desempenho */}
              <div>
                <h3 className="flex items-center gap-2 text-[#135bec] font-bold uppercase tracking-wider text-xs lg:text-sm mb-6">
                  <Activity size={18} />
                  Métricas de Desempenho
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Corrida 2.4km */}
                  <InputGroup 
                    label="Corrida 2.4km (Min:Seg)" 
                    icon={Timer} 
                    placeholder="00:00"
                    value={formData.run2400}
                    onChange={(val) => setFormData(prev => ({ ...prev, run2400: formatMMSS(val) }))}
                  />

                  {/* Shuttle Run - Hidden for 50+ */}
                  {!isAge50Plus && (
                    <InputGroup 
                      label="Shuttle Run (Segundos)" 
                      icon={Zap} 
                      placeholder="00.00"
                      value={formData.shuttleRun}
                      onChange={(val) => setFormData(prev => ({ ...prev, shuttleRun: formatSSSS(val) }))}
                    />
                  )}

                  {/* Barra Fixa / Suspensão */}
                  {(!isAge50Plus && (!isAge35to49 || formData.barOrPushUpChoice === 'bar')) && (
                    <InputGroup 
                      label={isFemale ? "Suspensão na Barra (Segundos)" : "Barra Fixa (Repetições)"}
                      icon={Dumbbell} 
                      placeholder="0"
                      type="number"
                      value={formData.bar}
                      onChange={(val) => setFormData(prev => ({ ...prev, bar: val }))}
                      subtext={isFemale ? "* Suspensão para mulheres" : "* Repetições para homens"}
                    />
                  )}

                  {/* Flexão de Braços */}
                  {(isAge50Plus || (isAge35to49 && formData.barOrPushUpChoice === 'pushUp')) && (
                    <InputGroup 
                      label="Flexão de Braços (Repetições)" 
                      icon={Activity} 
                      placeholder="0"
                      type="number"
                      value={formData.pushUps}
                      onChange={(val) => setFormData(prev => ({ ...prev, pushUps: val }))}
                    />
                  )}

                  {/* Choice for 35-49 - Removed from here */}

                  {/* Abdominais */}
                  <div className="md:col-span-2">
                    <InputGroup 
                      label="Abdominais Tipo Remador (Repetições)" 
                      icon={Activity} 
                      placeholder="0"
                      type="number"
                      value={formData.sitUps}
                      onChange={(val) => setFormData(prev => ({ ...prev, sitUps: val }))}
                    />
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-10 lg:mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2 text-slate-400 text-xs lg:text-sm">
                  <Info size={16} />
                  <span>Preencha todos os campos obrigatórios</span>
                </div>
                <button 
                  onClick={handleCalculate}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-[#135bec] hover:bg-[#104ecb] text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-200 active:scale-95"
                >
                  <Calculator size={20} />
                  Calcular Resultado
                </button>
              </div>
            </section>

            {/* Results Section */}
            <div id="result-section">
              <AnimatePresence>
                {result && (
                  <motion.section 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
                  >
                    <div className={cn(
                      "p-6 lg:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4",
                      result.status === 'Aprovado' ? "bg-emerald-600" : "bg-rose-600"
                    )}>
                      <div className="text-center sm:text-left">
                        <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Resultado Final</p>
                        <h3 className="text-3xl lg:text-4xl font-black">{result.status}</h3>
                      </div>
                      <div className="text-center sm:text-right">
                        <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Média Geral</p>
                        <h3 className="text-3xl lg:text-4xl font-black">{result.average.toFixed(1)}</h3>
                      </div>
                    </div>

                    <div className="p-6 lg:p-8">
                      <h4 className="text-slate-900 font-bold mb-6 flex items-center gap-2">
                        <CheckCircle2 className="text-emerald-500" size={20} />
                        Detalhamento por Atividade
                      </h4>
                      <div className="space-y-4">
                        {result.details.map((detail, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div>
                              <p className="text-sm font-bold text-slate-900">{detail.name}</p>
                              <p className="text-xs text-slate-500">Desempenho: {detail.score}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-black text-[#135bec]">{detail.points.toFixed(1)} pts</p>
                              <div className="w-20 lg:w-24 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${detail.points * 10}%` }}
                                  className={cn(
                                    "h-full rounded-full",
                                    detail.points >= 6 ? "bg-emerald-500" : "bg-rose-500"
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                        <AlertCircle className="text-amber-600 shrink-0" size={20} />
                        <p className="text-sm text-amber-800">
                          <strong>Atenção:</strong> Para aprovação, o candidato deve atingir uma média mínima de 6,0 pontos e não zerar nenhuma atividade.
                        </p>
                      </div>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>
            </div>

            {/* Disclaimer */}
            <div className="p-5 lg:p-6 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col gap-4">
              <div className="flex gap-4">
                <Info className="text-[#135bec] shrink-0" size={24} />
                <p className="text-xs lg:text-sm text-slate-600 leading-relaxed">
                  Esta calculadora utiliza as tabelas oficiais de pontuação da Polícia Militar do Rio Grande do Norte (PMRN). 
                  Os resultados são estimativas baseadas nos critérios do último edital publicado. 
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 flex justify-center">
                <p className="text-[10px] lg:text-xs text-slate-400 font-medium">
                  Desenvolvido pelo <span className="text-slate-600 font-bold">Sargento PM Vanderson - 6º BPM</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Helper Components ---

function SidebarItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <a 
      href="#" 
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
        active ? "bg-[#135bec] text-white shadow-md shadow-blue-900/20" : "text-slate-300 hover:bg-white/10"
      )}
    >
      <Icon size={20} className={cn(active ? "text-white" : "text-slate-400 group-hover:text-white")} />
      <span className="text-sm font-medium">{label}</span>
      {active && <ChevronRight size={16} className="ml-auto opacity-50" />}
    </a>
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
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <div className="relative group">
        <input 
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-12 pl-12 pr-4 rounded-xl border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-[#135bec] focus:border-transparent transition-all placeholder:text-slate-300 text-base"
          placeholder={placeholder}
        />
        <Icon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#135bec] transition-colors" />
      </div>
      {subtext && <p className="text-[10px] text-slate-400 mt-1.5 font-medium">{subtext}</p>}
    </div>
  );
}
