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
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Header Sticky */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 py-4">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-3 text-left group focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none rounded-xl p-1 transition"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="m15.5 8.5-2 5-5 2 2-5z" />
              </svg>
            </span>
            <span>
              <span className="block font-[family-name:var(--font-fraunces)] text-2xl font-bold tracking-tight text-slate-900">
                SmartTravel
              </span>
              <span className="block text-xs font-medium text-slate-500">
                Recomendação inteligente com KNN
              </span>
            </span>
          </button>

          {results.length > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-400 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              Nova consulta
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-col items-center px-4 sm:px-6 py-8 sm:py-16">
        {/* Hero do Início */}
        {!loading && results.length === 0 && (
          <div className="mb-8 sm:mb-12 text-center max-w-2xl">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80 mb-4">
              Descubra em {questions.length} passos
            </span>
            <h1 className="font-[family-name:var(--font-fraunces)] text-3xl sm:text-5xl font-extrabold leading-[1.15] tracking-tight text-slate-900">
              Para onde vamos na sua{' '}
              <span className="text-blue-600 italic">próxima viagem?</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Nosso modelo analisa clima, orçamento, relevo e cultura em centenas de destinos mundiais para encontrar o seu match perfeito.
            </p>
          </div>
        )}

        {/* Card do Questionário */}
        {!loading && results.length === 0 && (
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/60 transition-all">
            {/* Header e Barra de Progresso */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span className="uppercase tracking-wider text-blue-600">
                  {currentQuestion.badge}
                </span>
                <span>
                  Passo {currentQuestionIndex + 1} de {questions.length}
                </span>
              </div>
              <div
                className="mt-3 flex gap-1.5"
                role="progressbar"
                aria-label="Progresso do questionário"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                {questions.map((q, i) => (
                  <span
                    key={q.id}
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                      i <= currentQuestionIndex ? 'bg-blue-600' : 'bg-slate-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Conteúdo da Pergunta */}
            <div key={currentQuestion.id} className="animate-fadeIn">
              <h2 className="font-[family-name:var(--font-fraunces)] text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                {currentQuestion.text}
              </h2>
              <p className="mt-2 text-sm text-slate-600">{currentQuestion.subtitle}</p>

              <div className="mt-8">
                {/* Pergunta do Tipo Temperatura */}
                {currentQuestion.type === 'temperature' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {tempPresets.map((preset) => {
                        const isSelected = Number(answers.temp_target) === preset.temp;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => setAnswers((prev) => ({ ...prev, temp_target: preset.temp }))}
                            className={`flex flex-col items-center rounded-2xl border p-4 text-center transition-all cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue-600 ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-600/20'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-3xl">{preset.icon}</span>
                            <span className="mt-2 text-sm font-bold text-slate-900">{preset.label}</span>
                            <span className="mt-0.5 text-xs text-slate-500">{preset.desc}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                      <div className="flex items-center justify-between">
                        <label htmlFor="temp-range" className="text-sm font-semibold text-slate-700">
                          Temperatura escolhida
                        </label>
                        <span className="font-[family-name:var(--font-fraunces)] text-3xl font-bold text-blue-600">
                          {answers.temp_target ?? 24}°C
                        </span>
                      </div>
                      <input
                        id="temp-range"
                        type="range"
                        min={-5}
                        max={38}
                        step={1}
                        value={answers.temp_target ?? 24}
                        onChange={(e) =>
                          setAnswers((prev) => ({ ...prev, temp_target: Number(e.target.value) }))
                        }
                        className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
                      />
                      <div className="mt-3 flex justify-between text-xs font-medium text-slate-500">
                        <span>-5°C (Neve)</span>
                        <span>15°C (Ameno)</span>
                        <span>25°C (Quente)</span>
                        <span>38°C (Intenso)</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleNextStep('temp_target', answers.temp_target ?? 24)}
                      className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 text-base font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
                    >
                      Confirmar temperatura →
                    </button>
                  </div>
                )}

                {/* Pergunta do Tipo Orçamento */}
                {currentQuestion.type === 'budget' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {budgetPresets.map((preset) => {
                        const isSelected = Number(answers.budget_target) === preset.amount;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() =>
                              setAnswers((prev) => ({ ...prev, budget_target: preset.amount }))
                            }
                            className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue-600 ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-600/20'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-3xl">{preset.icon}</span>
                            <span className="mt-2 text-sm font-bold text-slate-900">{preset.label}</span>
                            <span className="mt-1 text-xs text-slate-500">{preset.desc}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                      <label htmlFor="budget-input" className="block text-sm font-semibold text-slate-700">
                        Ou digite o valor aproximado (R$)
                      </label>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-lg font-bold text-slate-400">R$</span>
                        <input
                          id="budget-input"
                          type="number"
                          min={200}
                          step={100}
                          value={answers.budget_target ?? 2500}
                          onChange={(e) =>
                            setAnswers((prev) => ({ ...prev, budget_target: e.target.value }))
                          }
                          className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-lg font-bold text-slate-900 shadow-sm transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleNextStep('budget_target', answers.budget_target ?? 2500)}
                      className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 text-base font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
                    >
                      Confirmar orçamento →
                    </button>
                  </div>
                )}

                {/* Pergunta do Tipo Radio */}
                {currentQuestion.type === 'radio' && currentQuestion.options && (
                  <div className="grid grid-cols-1 gap-3.5">
                    {currentQuestion.options.map((option) => {
                      const isSelected = answers[currentQuestion.field] === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => handleNextStep(currentQuestion.field, option.value)}
                          className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition-all cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue-600 ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-600/20'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl group-hover:scale-105 transition-transform">
                            {option.icon}
                          </span>
                          <span className="flex-1">
                            <span className="block text-base font-bold text-slate-900">{option.label}</span>
                            {option.subtitle && (
                              <span className="mt-0.5 block text-xs text-slate-500">{option.subtitle}</span>
                            )}
                          </span>
                          <span
                            className="text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600 font-bold"
                            aria-hidden="true"
                          >
                            →
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Pergunta do Tipo Checkbox (Meses) */}
                {currentQuestion.type === 'checkbox' && currentQuestion.options && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">
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
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline-offset-2 hover:underline cursor-pointer"
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
                            aria-pressed={checked}
                            onClick={() => toggleMonth(option.value)}
                            className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all cursor-pointer active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-blue-600 ${
                              checked
                                ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            {checked && <span aria-hidden="true">✓</span>}
                            <span>{option.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleNextStep('months', answers.months || [])}
                      className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 text-base font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
                    >
                      Descobrir meus destinos ideais →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Botão de Voltar Passo */}
            {currentQuestionIndex > 0 && (
              <div className="mt-8 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={handleBackStep}
                  className="text-sm font-semibold text-slate-500 transition hover:text-slate-900 cursor-pointer"
                >
                  ← Voltar para a pergunta anterior
                </button>
              </div>
            )}

            {/* Alerta de Erro */}
            {error && (
              <div
                role="alert"
                className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
              >
                {error}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div role="status" className="my-16 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            <h3 className="mt-6 font-[family-name:var(--font-fraunces)] text-2xl font-bold text-slate-900">
              Calculando os melhores destinos para o seu perfil...
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Comparando clima, custo e atrações com nosso modelo KNN.
            </p>
          </div>
        )}

        {/* Resultados */}
        {!loading && results.length > 0 && (
          <div className="w-full space-y-10">
            <div className="text-center max-w-2xl mx-auto">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200/80 mb-3">
                Recomendações prontas
              </span>
              <h2 className="font-[family-name:var(--font-fraunces)] text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                Seus melhores destinos
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600">
                Ordenados por compatibilidade com a temperatura de{' '}
                <strong className="text-slate-900 font-bold">{answers.temp_target}°C</strong> e orçamento de{' '}
                <strong className="text-slate-900 font-bold">R$ {answers.budget_target}</strong>.
              </p>
            </div>

            <div className="space-y-6">
              {results.map((result, index) => {
                const matchPercent = Math.min(99, Math.max(55, Math.round(result.score * 100 + 35)));
                const isTopMatch = index === 0;

                const chipStyle = isTopMatch
                  ? 'border-white/20 bg-white/10 text-white'
                  : 'border-slate-200 bg-slate-100 text-slate-700';

                const ringColor = isTopMatch ? '#38bdf8' : '#2563eb';
                const ringTrack = isTopMatch ? 'rgba(255,255,255,0.15)' : '#e2e8f0';

                return (
                  <article
                    key={`${result.cidade}-${result.mes}-${index}`}
                    className={`overflow-hidden rounded-3xl border p-6 sm:p-8 transition-all hover:shadow-lg ${
                      isTopMatch
                        ? 'border-blue-600 bg-gradient-to-br from-blue-900 to-slate-900 text-white shadow-xl shadow-blue-950/20'
                        : 'border-slate-200 bg-white text-slate-900 shadow-sm'
                    }`}
                  >
                    {isTopMatch && (
                      <span className="mb-4 inline-block rounded-full bg-blue-500 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                        ⭐ Melhor opção para você
                      </span>
                    )}

                    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
                      <div>
                        <p className={`text-xs font-bold ${isTopMatch ? 'text-blue-300' : 'text-slate-400'}`}>
                          #{index + 1} RECOMENDAÇÃO
                        </p>
                        <h3 className="mt-1 font-[family-name:var(--font-fraunces)] text-3xl sm:text-4xl font-extrabold leading-tight">
                          {result.cidade}
                          <span
                            className={`block text-lg sm:text-xl font-normal italic ${
                              isTopMatch ? 'text-slate-300' : 'text-slate-500'
                            }`}
                          >
                            {result.pais}
                          </span>
                        </h3>

                        <div className="mt-5 flex flex-wrap gap-2">
                          <span className={`rounded-full border px-3 py-1 text-xs font-medium ${chipStyle}`}>
                            Melhor mês: <strong>{result.mes}</strong>
                          </span>
                          {result.temp_min !== undefined && result.temp_max !== undefined && (
                            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${chipStyle}`}>
                              {result.temp_min}°C a {result.temp_max}°C
                            </span>
                          )}
                          {result.custo && (
                            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${chipStyle}`}>
                              Custo: {result.custo}
                            </span>
                          )}
                          {result.tem_historia &&
                            result.tem_historia.toLowerCase().startsWith('s') && (
                              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${chipStyle}`}>
                                Histórico
                              </span>
                            )}
                          {result.tem_montanha &&
                            result.tem_montanha.toLowerCase().startsWith('s') && (
                              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${chipStyle}`}>
                                Montanha
                              </span>
                            )}
                        </div>
                      </div>

                      {/* Anel de Match / Score */}
                      <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:gap-2">
                        <div
                          role="img"
                          aria-label={`Compatibilidade de ${matchPercent}%`}
                          className="flex h-20 w-20 items-center justify-center rounded-full p-1"
                          style={{
                            background: `conic-gradient(${ringColor} ${matchPercent}%, ${ringTrack} 0)`,
                          }}
                        >
                          <div
                            className={`flex h-[68px] w-[68px] items-center justify-center rounded-full ${
                              isTopMatch ? 'bg-slate-900' : 'bg-white'
                            }`}
                          >
                            <span className="font-[family-name:var(--font-fraunces)] text-xl font-bold">
                              {matchPercent}%
                            </span>
                          </div>
                        </div>
                        <div className="text-xs sm:text-center">
                          <span className="block font-semibold">Compatibilidade</span>
                          <span className="block opacity-60">Score: {result.score.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <p
                      className={`mt-6 border-t pt-4 text-sm sm:text-base leading-relaxed ${
                        isTopMatch ? 'border-white/10 text-slate-200' : 'border-slate-100 text-slate-600'
                      }`}
                    >
                      {buildFallbackDescription(result)}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-8 text-base font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
              >
                ↻ Refazer com novas preferências
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}