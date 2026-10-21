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
    <div className="min-h-screen bg-sand text-ink selection:bg-terra selection:text-white">
      <header className="sticky top-0 z-20 border-b border-line bg-sand/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <button type="button" onClick={handleReset} className="flex items-center gap-3 text-left">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pine text-sand">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="m15.5 8.5-2 5-5 2 2-5z" />
              </svg>
            </span>
            <span>
              <span className="block font-display text-xl font-semibold leading-none tracking-tight">
                SmartTravel
              </span>
              <span className="mt-1 block text-xs text-muted">Recomendação inteligente com KNN</span>
            </span>
          </button>

          {results.length > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium transition hover:border-pine hover:text-pine"
            >
              Nova consulta
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-col items-center px-6 py-10 md:py-16">
        {!loading && results.length === 0 && (
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-terra">
              Descubra em {questions.length} passos
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
              Para onde vamos na sua{' '}
              <em className="font-medium italic text-terra">próxima viagem?</em>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted">
              Nosso modelo analisa clima, orçamento, relevo e cultura em centenas de destinos mundiais para encontrar o seu match perfeito.
            </p>
          </div>
        )}

        {!loading && results.length === 0 && (
          <div className="w-full max-w-2xl rounded-3xl border border-line bg-surface p-6 shadow-[0_20px_50px_-24px_rgba(27,42,41,0.3)] sm:p-10">
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-medium text-muted">
                <span className="font-semibold uppercase tracking-wider text-pine">
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
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                      i <= currentQuestionIndex ? 'bg-terra' : 'bg-line'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div key={currentQuestion.id} className="animate-rise">
              <h2 className="font-display text-2xl font-semibold leading-tight sm:text-3xl">
                {currentQuestion.text}
              </h2>
              <p className="mt-2 text-sm text-muted">{currentQuestion.subtitle}</p>

              <div className="mt-8">
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
                            className={`flex flex-col items-center rounded-2xl border p-3.5 text-center transition ${
                              isSelected
                                ? 'border-pine bg-pine-soft'
                                : 'border-line bg-surface hover:border-pine/40 hover:bg-sand/60'
                            }`}
                          >
                            <span className="text-2xl">{preset.icon}</span>
                            <span className="mt-1.5 text-sm font-semibold">{preset.label}</span>
                            <span className="text-xs text-muted">{preset.desc}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="rounded-2xl border border-line bg-sand/60 p-5">
                      <div className="flex items-center justify-between">
                        <label htmlFor="temp-range" className="text-sm font-medium text-muted">
                          Temperatura escolhida
                        </label>
                        <span className="font-display text-3xl font-semibold text-pine">
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
                        className="slider mt-4 w-full cursor-pointer"
                      />
                      <div className="mt-3 flex justify-between text-xs text-muted">
                        <span>-5°C (Neve)</span>
                        <span>15°C (Ameno)</span>
                        <span>25°C (Quente)</span>
                        <span>38°C (Intenso)</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleNextStep('temp_target', answers.temp_target ?? 24)}
                      className="w-full rounded-full bg-terra py-4 text-base font-semibold text-white transition hover:bg-terra-dark"
                    >
                      Confirmar temperatura →
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
                            aria-pressed={isSelected}
                            onClick={() =>
                              setAnswers((prev) => ({ ...prev, budget_target: preset.amount }))
                            }
                            className={`flex flex-col items-start rounded-2xl border p-4 text-left transition ${
                              isSelected
                                ? 'border-pine bg-pine-soft'
                                : 'border-line bg-surface hover:border-pine/40 hover:bg-sand/60'
                            }`}
                          >
                            <span className="text-2xl">{preset.icon}</span>
                            <span className="mt-2 text-sm font-semibold">{preset.label}</span>
                            <span className="mt-1 text-xs text-muted">{preset.desc}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="rounded-2xl border border-line bg-sand/60 p-5">
                      <label htmlFor="budget-input" className="block text-sm font-medium text-muted">
                        Ou digite o valor aproximado (R$)
                      </label>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-lg font-semibold text-muted">R$</span>
                        <input
                          id="budget-input"
                          type="number"
                          min={200}
                          step={100}
                          value={answers.budget_target ?? 2500}
                          onChange={(e) =>
                            setAnswers((prev) => ({ ...prev, budget_target: e.target.value }))
                          }
                          className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-lg font-semibold focus:border-pine"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleNextStep('budget_target', answers.budget_target ?? 2500)}
                      className="w-full rounded-full bg-terra py-4 text-base font-semibold text-white transition hover:bg-terra-dark"
                    >
                      Confirmar orçamento →
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
                          aria-pressed={isSelected}
                          onClick={() => handleNextStep(currentQuestion.field, option.value)}
                          className={`group flex items-center gap-4 rounded-2xl border p-5 text-left transition ${
                            isSelected
                              ? 'border-pine bg-pine-soft'
                              : 'border-line bg-surface hover:border-pine/50 hover:bg-sand/60'
                          }`}
                        >
                          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sand text-3xl">
                            {option.icon}
                          </span>
                          <span className="flex-1">
                            <span className="block text-base font-semibold">{option.label}</span>
                            {option.subtitle && (
                              <span className="mt-1 block text-sm text-muted">{option.subtitle}</span>
                            )}
                          </span>
                          <span
                            className="text-muted transition group-hover:translate-x-1 group-hover:text-terra"
                            aria-hidden="true"
                          >
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
                      <span className="text-xs text-muted">
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
                        className="text-xs font-semibold text-pine underline-offset-4 hover:underline"
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
                            className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-3 text-sm font-medium transition ${
                              checked
                                ? 'border-pine bg-pine text-white'
                                : 'border-line bg-surface hover:border-pine/40 hover:bg-sand/60'
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
                      className="w-full rounded-full bg-terra py-4 text-base font-semibold text-white transition hover:bg-terra-dark"
                    >
                      Descobrir meus destinos ideais →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {currentQuestionIndex > 0 && (
              <div className="mt-8 border-t border-line pt-4">
                <button
                  type="button"
                  onClick={handleBackStep}
                  className="text-sm font-medium text-muted transition hover:text-ink"
                >
                  ← Voltar para a pergunta anterior
                </button>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-terra/40 bg-terra/10 p-4 text-sm text-terra-dark"
              >
                {error}
              </div>
            )}
          </div>
        )}

        {loading && (
          <div role="status" className="my-20 flex flex-col items-center justify-center text-center">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-line border-t-terra" />
            <h3 className="mt-6 font-display text-2xl font-semibold">
              Calculando os melhores destinos para o seu perfil...
            </h3>
            <p className="mt-2 text-sm text-muted">
              Comparando clima, custo e atrações com nosso modelo KNN.
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="w-full space-y-10">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-terra">
                Recomendações prontas
              </span>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                Seus melhores destinos
              </h2>
              <p className="mt-3 text-sm text-muted">
                Ordenados por compatibilidade com a temperatura de{' '}
                <strong className="text-ink">{answers.temp_target}°C</strong> e orçamento de{' '}
                <strong className="text-ink">R$ {answers.budget_target}</strong>.
              </p>
            </div>

            <div className="space-y-6">
              {results.map((result, index) => {
                const matchPercent = Math.min(99, Math.max(55, Math.round(result.score * 100 + 35)));
                const isTopMatch = index === 0;
                const chip = isTopMatch
                  ? 'border-white/20 bg-white/10 text-sand'
                  : 'border-line bg-sand text-ink';
                const ringColor = isTopMatch ? '#e8875f' : '#c4552d';
                const ringTrack = isTopMatch ? 'rgba(255,255,255,0.18)' : '#e5dccb';

                return (
                  <article
                    key={`${result.cidade}-${result.mes}-${index}`}
                    className={`overflow-hidden rounded-3xl border p-6 transition sm:p-8 ${
                      isTopMatch
                        ? 'border-pine bg-pine text-sand shadow-[0_24px_50px_-24px_rgba(31,79,76,0.6)]'
                        : 'border-line bg-surface hover:border-pine/30'
                    }`}
                  >
                    {isTopMatch && (
                      <span className="mb-4 inline-block rounded-full bg-terra px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                        Melhor opção para você
                      </span>
                    )}

                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                      <div>
                        <p className={`text-sm font-semibold ${isTopMatch ? 'text-sand/70' : 'text-muted'}`}>
                          #{index + 1}
                        </p>
                        <h3 className="mt-1 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                          {result.cidade}
                          <span
                            className={`block text-lg font-normal italic sm:text-xl ${
                              isTopMatch ? 'text-sand/70' : 'text-muted'
                            }`}
                          >
                            {result.pais}
                          </span>
                        </h3>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className={`rounded-full border px-3 py-1 text-xs font-medium ${chip}`}>
                            Melhor mês: <strong>{result.mes}</strong>
                          </span>
                          {result.temp_min !== undefined && result.temp_max !== undefined && (
                            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${chip}`}>
                              {result.temp_min}°C a {result.temp_max}°C
                            </span>
                          )}
                          {result.custo && (
                            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${chip}`}>
                              Custo: {result.custo}
                            </span>
                          )}
                          {result.tem_historia &&
                            result.tem_historia.toLowerCase().startsWith('s') && (
                              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${chip}`}>
                                Histórico
                              </span>
                            )}
                          {result.tem_montanha &&
                            result.tem_montanha.toLowerCase().startsWith('s') && (
                              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${chip}`}>
                                Montanha
                              </span>
                            )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:gap-2">
                        <div
                          role="img"
                          aria-label={`Compatibilidade de ${matchPercent}%`}
                          className="flex h-20 w-20 items-center justify-center rounded-full"
                          style={{
                            background: `conic-gradient(${ringColor} ${matchPercent}%, ${ringTrack} 0)`,
                          }}
                        >
                          <div
                            className={`flex h-[60px] w-[60px] items-center justify-center rounded-full ${
                              isTopMatch ? 'bg-pine' : 'bg-surface'
                            }`}
                          >
                            <span className="font-display text-xl font-semibold">{matchPercent}%</span>
                          </div>
                        </div>
                        <div className="text-xs sm:text-center">
                          <span className="block font-medium">Compatibilidade</span>
                          <span className="block opacity-60">Score KNN: {result.score.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <p
                      className={`mt-6 border-t pt-4 text-sm leading-relaxed sm:text-base ${
                        isTopMatch ? 'border-white/15 text-sand/90' : 'border-line text-muted'
                      }`}
                    >
                      {buildFallbackDescription(result)}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-full bg-terra px-8 py-4 text-base font-semibold text-white transition hover:bg-terra-dark"
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