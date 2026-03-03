import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900 p-4">
      <h2 className="text-4xl font-black mb-4">404</h2>
      <p className="text-xl text-slate-600 mb-8">Página não encontrada</p>
      <Link 
        href="/"
        className="px-6 py-3 bg-[#135bec] text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
      >
        Voltar para o Início
      </Link>
    </div>
  );
}
