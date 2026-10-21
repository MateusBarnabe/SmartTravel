'use client';

import { useState } from 'react';

interface Option {
  label: string;
  subtitle?: string;
  icon: string;
  value: string;
}

interface Question {
  id: string;
  badge: string;
  text: string;
  subtitle: string;
  type: 'temperature' | 'budget' | 'radio' | 'checkbox';
  field: string;
  options?: Option[];
}

interface TravelResult {
  pais: string;
  cidade: string;
  mes: string;
  temp_min?: number;
  temp_max?: number;
  chuva?: number;
  neve?: string;
  tem_montanha?: string;
  tem_historia?: string;
  custo?: string;
  score: number;
  descricao?: string;
}

const questions: Question[] = [
  {
    id: 'temp_target',
    badge: 'Clima & Conforto',
    text: 'Qual a sua temperatura ideal para viajar?',
    subtitle: 'Escolha uma faixa climática ou ajuste o controle deslizante em °C.',
    type: 'temperature',
    field: 'temp_target',
  },
  {
    id: 'budget_target',
    badge: 'Planejamento Financeiro',
    text: 'Qual o seu orçamento estimado para a viagem?',
    subtitle: 'Selecione uma faixa de investimento por pessoa (em R$).',
    type: 'budget',
    field: 'budget_target',
  },
  {
    id: 'chuva_preference',
    badge: 'Precipitação',
    text: 'Como você lida com dias chuvosos?',
    subtitle: 'Isso nos ajuda a filtrar a estação ideal em cada destino.',
    type: 'radio',
    field: 'chuva_preference',
    options: [
      {
        label: 'Prefiro tempo seco e ensolarado',
        subtitle: 'Priorizar destinos e meses com baixa precipitação',
        icon: '☀️',
        value: 'pouca',
      },
      {
        label: 'Não me importo com chuva',
        subtitle: 'Aceito climas úmidos ou tropicais sem restrições',
        icon: '🌧️',
        value: 'muita',
      },
    ],
  },
  {
    id: 'neve_preference',
    badge: 'Experiência de Inverno',
    text: 'Você gostaria de ver neve na viagem?',
    subtitle: 'Destinos alpinos ou de inverno rigoroso vs. destinos sem neve.',
    type: 'radio',
    field: 'neve_preference',
    options: [
      {
        label: 'Não faço questão de neve',
        subtitle: 'Prefiro destinos sem nevascas ou clima congelante',
        icon: '🌴',
        value: 'pouca',
      },
      {
        label: 'Sim, quero ver neve!',
        subtitle: 'Busco paisagens brancas, estações de esqui ou inverno europeu/andino',
        icon: '❄️',
        value: 'muita',
      },
    ],
  },
  {
    id: 'quer_montanha',
    badge: 'Geografia & Paisagem',
    text: 'Você gosta de destinos de montanha?',
    subtitle: 'Trilhas, mirantes naturais, serras e cordilheiras.',
    type: 'radio',
    field: 'quer_montanha',
    options: [
      {
        label: 'Sim, adoro montanhas e altitude',
        subtitle: 'Paisagens serranas, vales e picos panorâmicos',
        icon: '🏔️',
        value: 'true',
      },
      {
        label: 'Prefiro litoral, planícies ou metrópoles',
        subtitle: 'Praias, centros urbanos planos ou ilhas',
        icon: '🏖️',
        value: 'false',
      },
    ],
  },
  {
    id: 'gosta_historia',
    badge: 'Cultura & Patrimônio',
    text: 'Você curte roteiros históricos e culturais?',
    subtitle: 'Museus, arquitetura clássica, sítios arqueológicos e centros antigos.',
    type: 'radio',
    field: 'gosta_historia',
    options: [
      {
        label: 'Sim, amo história e cultura',
        subtitle: 'Monumentos históricos, gastronomia tradicional e museus',
        icon: '🏛️',
        value: 'true',
      },
      {
        label: 'Prefiro modernidade ou natureza pura',
        subtitle: 'Foco em lazer, compras, praias ou aventura ao ar livre',
        icon: '🌆',
        value: 'false',
      },
    ],
  },
  {
    id: 'months',
    badge: 'Calendário',
    text: 'Em quais meses você pretende viajar?',
    subtitle: 'Selecione um ou mais meses (ou deixe em branco para pesquisar o ano todo).',
    type: 'checkbox',
    field: 'months',
    options: [
      { label: 'Janeiro', icon: '🗓️', value: 'Janeiro' },
      { label: 'Fevereiro', icon: '🗓️', value: 'Fevereiro' },
      { label: 'Março', icon: '🗓️', value: 'Março' },
      { label: 'Abril', icon: '🗓️', value: 'Abril' },
      { label: 'Maio', icon: '🗓️', value: 'Maio' },
      { label: 'Junho', icon: '🗓️', value: 'Junho' },
      { label: 'Julho', icon: '🗓️', value: 'Julho' },
      { label: 'Agosto', icon: '🗓️', value: 'Agosto' },
      { label: 'Setembro', icon: '🗓️', value: 'Setembro' },
      { label: 'Outubro', icon: '🗓️', value: 'Outubro' },
      { label: 'Novembro', icon: '🗓️', value: 'Novembro' },
      { label: 'Dezembro', icon: '🗓️', value: 'Dezembro' },
    ],
  },
];

const tempPresets = [
  { label: 'Frio Europeu', temp: 8, desc: '5°C a 12°C', icon: '🧥' },
  { label: 'Clima Ameno', temp: 18, desc: '15°C a 20°C', icon: '🍂' },
  { label: 'Agradável / Sol', temp: 24, desc: '21°C a 26°C', icon: '🌤️' },
  { label: 'Verão Tropical', temp: 30, desc: '27°C a 34°C', icon: '🌺' },
];

const budgetPresets = [
  { label: 'Econômico / Mochilão', amount: 800, desc: 'Até R$ 1.000 (Custo Baixo)', icon: '🎒' },
  { label: 'Conforto Moderado', amount: 2200, desc: 'R$ 1.000 a R$ 3.000 (Custo Médio)', icon: '🧳' },
  { label: 'Premium / Internacional', amount: 5000, desc: 'Acima de R$ 3.000 (Custo Alto)', icon: '✈️' },
];

export default function Home() {
  const [answers, setAnswers] = useState<Record<string, any>>({
    temp_target: 24,
    budget_target: 2500,
    months: [],
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<TravelResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  const handleNextStep = (field: string, value: any) => {
    const updated = { ...answers, [field]: value };
    setAnswers(updated);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmit(updated);
    }
  };

  const handleBackStep = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setResults([]);
    setError(null);
    setCurrentQuestionIndex(0);
  };

  const handleSubmit = async (finalAnswers: Record<string, any>) => {
    setLoading(true);
    setError(null);

    const payload = {
      temp_target:
        finalAnswers.temp_target !== undefined && finalAnswers.temp_target !== ''
          ? parseFloat(String(finalAnswers.temp_target))
          : null,
      chuva_preference: finalAnswers.chuva_preference || 'pouca',
      neve_preference: finalAnswers.neve_preference || 'pouca',
      quer_montanha: finalAnswers.quer_montanha === 'true',
      gosta_historia: finalAnswers.gosta_historia === 'true',
      budget_target:
        finalAnswers.budget_target !== undefined && finalAnswers.budget_target !== ''
          ? parseFloat(String(finalAnswers.budget_target))
          : null,
      months: Array.isArray(finalAnswers.months) ? finalAnswers.months : [],
    };

    try {
      // Uses internal Next.js API route first (works on Vercel and locally without CORS issues),
      // with automatic fallback to external FastAPI if needed
      let response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok && process.env.NEXT_PUBLIC_API_URL) {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recommend/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        throw new Error('Não foi possível obter as recomendações no momento.');
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao buscar destinos.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMonth = (month: string) => {
    const existing: string[] = answers.months || [];
    const updated = existing.includes(month)
      ? existing.filter((m) => m !== month)
      : [...existing, month];
    setAnswers((prev) => ({ ...prev, months: updated }));
  };

  const buildFallbackDescription = (r: TravelResult) => {
    if (r.descricao && r.descricao.trim().length > 0) {
      return r.descricao;
    }
    return `Destino encantador em ${r.pais}, ideal para visitar em ${r.mes} com temperaturas entre ${r.temp_min ?? 15}°C e ${r.temp_max ?? 26}°C e perfil de custo ${r.custo?.toLowerCase() || 'moderado'}.`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Ambient Background Glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-600/25 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

      {/* Top Navbar */}
      <header className="relative z-10 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-3 text-left transition hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-xl shadow-lg shadow-indigo-500/30">
              ✈️
            </div>
            <div>
              <span className="bg-gradient-to-r from-white via-indigo-200 to-cyan-300 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
                SmartTravel
              </span>
              <span className="block text-xs text-slate-400">Recomendação Inteligente via IA (KNN)</span>
            </div>
          </button>

          {results.length > 0 && (
            <button
              onClick={handleReset}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-indigo-400/50 hover:bg-indigo-500/20"
            >
              ↻ Nova Consulta
            </button>
          )}
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 py-10 md:py-14">
        {/* Hero Header when in Quiz Mode */}
        {!loading && results.length === 0 && (
          <div className="mb-8 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300">
              ✨ Descubra seu destino ideal em 7 passos
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Para onde vamos na sua{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                próxima viagem?
              </span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400 sm:text-base">
              Nosso modelo analisa clima, orçamento, relevo e cultura em centenas de destinos mundiais para encontrar o seu match perfeito.
            </p>
          </div>
        )}

        {/* Quiz Card */}
        {!loading && results.length === 0 && (
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-10">
            {/* Progress Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs font-medium text-slate-400">
                <span className="text-indigo-300 font-semibold uppercase tracking-wider">
                  {currentQuestion.badge}
                </span>
                <span>
                  Passo {currentQuestionIndex + 1} de {questions.length} ({progress}%)
                </span>
              </div>
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Title */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">{currentQuestion.text}</h2>
              <p className="mt-2 text-sm text-slate-400">{currentQuestion.subtitle}</p>
            </div>

            {/* Question Input Types */}
            {currentQuestion.type === 'temperature' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {tempPresets.map((preset) => {
                    const isSelected = Number(answers.temp_target) === preset.temp;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setAnswers((prev) => ({ ...prev, temp_target: preset.temp }))}
                        className={`flex flex-col items-center rounded-2xl border p-3.5 text-center transition ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-500/15 text-white shadow-lg shadow-cyan-500/10'
                            : 'border-white/10 bg-slate-800/60 text-slate-300 hover:border-white/25 hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-2xl">{preset.icon}</span>
                        <span className="mt-1.5 text-sm font-semibold">{preset.label}</span>
                        <span className="text-xs text-slate-400">{preset.desc}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-300">Temperatura escolhida:</span>
                    <span className="rounded-xl bg-indigo-500/20 px-3.5 py-1 text-xl font-extrabold text-cyan-300 border border-indigo-400/30">
                      {answers.temp_target ?? 24}°C
                    </span>
                  </div>
                  <input
                    type="range"
                    min={-5}
                    max={38}
                    step={1}
                    value={answers.temp_target ?? 24}
                    onChange={(e) =>
                      setAnswers((prev) => ({ ...prev, temp_target: Number(e.target.value) }))
                    }
                    className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-cyan-400"
                  />
                  <div className="mt-2 flex justify-between text-xs text-slate-500">
                    <span>-5°C (Neve)</span>
                    <span>15°C (Ameno)</span>
                    <span>25°C (Quente)</span>
                    <span>38°C (Intenso)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleNextStep('temp_target', answers.temp_target ?? 24)}
                  className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 py-4 text-base font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-400 hover:to-cyan-400"
                >
                  Confirmar Temperatura →
                </button>
              </div>
            )}

            {currentQuestion.type === 'budget' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {budgetPresets.map((preset) => {
                    const isSelected = Number(answers.budget_target) === preset.amount;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, budget_target: preset.amount }))
                        }
                        className={`flex flex-col items-start rounded-2xl border p-4 text-left transition ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-500/15 text-white shadow-lg shadow-cyan-500/10'
                            : 'border-white/10 bg-slate-800/60 text-slate-300 hover:border-white/25 hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-2xl">{preset.icon}</span>
                        <span className="mt-2 text-sm font-bold">{preset.label}</span>
                        <span className="mt-1 text-xs text-slate-400">{preset.desc}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                  <label className="block text-sm font-medium text-slate-300">
                    Ou digite o valor aproximado (R$):
                  </label>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-lg font-bold text-slate-400">R$</span>
                    <input
                      type="number"
                      min={200}
                      step={100}
                      value={answers.budget_target ?? 2500}
                      onChange={(e) =>
                        setAnswers((prev) => ({ ...prev, budget_target: e.target.value }))
                      }
                      className="w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-2.5 text-lg font-bold text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleNextStep('budget_target', answers.budget_target ?? 2500)}
                  className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 py-4 text-base font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-400 hover:to-cyan-400"
                >
                  Confirmar Orçamento →
                </button>
              </div>
            )}

            {currentQuestion.type === 'radio' && currentQuestion.options && (
              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[currentQuestion.field] === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleNextStep(currentQuestion.field, option.value)}
                      className={`group flex items-center gap-4 rounded-2xl border p-5 text-left transition ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-500/15 shadow-lg shadow-cyan-500/10'
                          : 'border-white/10 bg-slate-800/60 hover:border-indigo-400/50 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900/90 text-3xl shadow-inner">
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                          {option.label}
                        </div>
                        {option.subtitle && (
                          <div className="mt-1 text-xs text-slate-400 sm:text-sm">
                            {option.subtitle}
                          </div>
                        )}
                      </div>
                      <span className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-300">
                        →
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === 'checkbox' && currentQuestion.options && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {(answers.months || []).length === 0
                      ? 'Nenhum mês específico selecionado (busca em todos os meses)'
                      : `${(answers.months || []).length} mês(es) selecionado(s)`}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        months:
                          (prev.months || []).length === 12
                            ? []
                            : currentQuestion.options!.map((o) => o.value),
                      }))
                    }
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    {(answers.months || []).length === 12 ? 'Limpar seleção' : 'Selecionar todos'}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                  {currentQuestion.options.map((option) => {
                    const checked = (answers.months || []).includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => toggleMonth(option.value)}
                        className={`flex items-center justify-center gap-2 rounded-xl border py-3 px-3 text-sm font-semibold transition ${
                          checked
                            ? 'border-cyan-400 bg-cyan-500/20 text-white shadow-md shadow-cyan-500/10'
                            : 'border-white/10 bg-slate-800/50 text-slate-300 hover:border-white/25 hover:bg-slate-800'
                        }`}
                      >
                        <span>{checked ? '✓' : ''}</span>
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => handleNextStep('months', answers.months || [])}
                  className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 py-4 text-base font-extrabold text-white shadow-xl shadow-indigo-500/30 transition hover:opacity-95"
                >
                  🔍 Descobrir Meus Destinos Ideais
                </button>
              </div>
            )}

            {/* Footer Navigation inside Quiz Card */}
            {currentQuestionIndex > 0 && (
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={handleBackStep}
                  className="text-sm font-medium text-slate-400 transition hover:text-white"
                >
                  ← Voltar para a pergunta anterior
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-300">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="my-16 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-500/30 border-t-cyan-400" />
            <h3 className="mt-6 text-2xl font-bold text-white">
              Calculando os melhores destinos para o seu perfil...
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Comparando clima, custo e atrações com nosso modelo KNN.
            </p>
          </div>
        )}

        {/* Results View */}
        {!loading && results.length > 0 && (
          <div className="w-full space-y-8">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-300">
                🎯 Recomendações Personalizadas Prontas
              </span>
              <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
                Seus Melhores Destinos de Viagem
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Ordenados por compatibilidade com a temperatura de{' '}
                <strong className="text-slate-200">{answers.temp_target}°C</strong> e orçamento de{' '}
                <strong className="text-slate-200">R$ {answers.budget_target}</strong>.
              </p>
            </div>

            <div className="space-y-6">
              {results.map((result, index) => {
                const matchPercent = Math.min(99, Math.max(55, Math.round(result.score * 100 + 35)));
                const isTopMatch = index === 0;

                return (
                  <div
                    key={`${result.cidade}-${result.mes}-${index}`}
                    className={`relative overflow-hidden rounded-3xl border p-6 transition sm:p-8 ${
                      isTopMatch
                        ? 'border-cyan-400/50 bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-900 shadow-2xl shadow-cyan-500/15'
                        : 'border-white/10 bg-slate-900/75 hover:border-white/20'
                    }`}
                  >
                    {isTopMatch && (
                      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-slate-950">
                        🏆 Top #1 Match para Você
                      </div>
                    )}

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-cyan-300">
                            #{index + 1}
                          </span>
                          <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
                            {result.cidade},{' '}
                            <span className="font-semibold text-indigo-300">{result.pais}</span>
                          </h3>
                        </div>

                        {/* Metadata Badges */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
                            🗓️ Melhor mês: <strong>{result.mes}</strong>
                          </span>
                          {result.temp_min !== undefined && result.temp_max !== undefined && (
                            <span className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
                              🌡️ {result.temp_min}°C a {result.temp_max}°C
                            </span>
                          )}
                          {result.custo && (
                            <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
                              💰 Custo: {result.custo}
                            </span>
                          )}
                          {result.tem_historia &&
                            result.tem_historia.toLowerCase().startsWith('s') && (
                              <span className="inline-flex items-center gap-1 rounded-xl border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
                                🏛️ Histórico
                              </span>
                            )}
                          {result.tem_montanha &&
                            result.tem_montanha.toLowerCase().startsWith('s') && (
                              <span className="inline-flex items-center gap-1 rounded-xl border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-200">
                                🏔️ Montanha
                              </span>
                            )}
                        </div>
                      </div>

                      {/* Score Box */}
                      <div className="flex shrink-0 flex-col items-start rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 sm:items-end">
                        <span className="text-xs font-medium text-slate-400">Compatibilidade</span>
                        <span className="text-2xl font-black text-cyan-300">{matchPercent}%</span>
                        <span className="text-[11px] text-slate-500">
                          Score KNN: {result.score.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <p className="mt-5 leading-relaxed text-slate-300 text-sm sm:text-base border-t border-white/10 pt-4">
                      {buildFallbackDescription(result)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-500/25 transition hover:from-indigo-400 hover:to-cyan-400"
              >
                ↻ Refazer com Novas Preferências
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
