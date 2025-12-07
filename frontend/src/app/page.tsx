
'use client';

import { useState } from 'react';

const questions = [
  { id: 'temp_target', text: 'Qual a sua temperatura ideal para viajar?', type: 'number', field: 'temp_target' },
  { id: 'budget_target', text: 'Qual o seu orçamento?', type: 'number', field: 'budget_target' },
  { id: 'chuva_preference', text: 'Você se importa com chuva?', type: 'radio', field: 'chuva_preference', options: [{label: 'Não', value: 'pouca'}, {label: 'Sim', value: 'muita'}]},
  { id: 'neve_preference', text: 'Você gostaria de ver neve?', type: 'radio', field: 'neve_preference', options: [{label: 'Não', value: 'pouca'}, {label: 'Sim', value: 'muita'}]},
  { id: 'quer_montanha', text: 'Gosta de montanhas?', type: 'radio', field: 'quer_montanha', options: [{label: 'Sim', value: 'true'}, {label: 'Não', value: 'false'}] },
  { id: 'gosta_historia', text: 'Gosta de história?', type: 'radio', field: 'gosta_historia', options: [{label: 'Sim', value: 'true'}, {label: 'Não', value: 'false'}] },
  { id: 'months', text: 'Quais meses você prefere viajar?', type: 'checkbox', field: 'months', options: [
    {label: "Janeiro", value: "Janeiro"}, {label: "Fevereiro", value: "Fevereiro"}, {label: "Março", value: "Março"}, {label: "Abril", value: "Abril"}, {label: "Maio", value: "Maio"}, {label: "Junho", value: "Junho"},
    {label: "Julho", value: "Julho"}, {label: "Agosto", value: "Agosto"}, {label: "Setembro", value: "Setembro"}, {label: "Outubro", value: "Outubro"}, {label: "Novembro", value: "Novembro"}, {label: "Dezembro", value: "Dezembro"},
  ]},
];

export default function Home() {
  const [answers, setAnswers] = useState<any>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAnswer = (field: string, value: any) => {
    setAnswers((prev: any) => ({ ...prev, [field]: value }));
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Last question answered, submit the form
      handleSubmit({ ...answers, [field]: value });
    }
  };

  const handleSubmit = async (finalAnswers: any) => {
    setLoading(true);
    const data = {
      temp_target: finalAnswers.temp_target ? parseFloat(finalAnswers.temp_target.toString()) : null,
      chuva_preference: finalAnswers.chuva_preference,
      neve_preference: finalAnswers.neve_preference,
      quer_montanha: finalAnswers.quer_montanha === 'true',
      gosta_historia: finalAnswers.gosta_historia === 'true',
      budget_target: finalAnswers.budget_target ? parseFloat(finalAnswers.budget_target.toString()) : null,
      months: finalAnswers.months,
    };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/api/recommend/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    setResults(result.results);
    setLoading(false);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100">
      <div className="w-full max-w-md">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-800">SmartTravel</h1>
          <p className="text-gray-600 mt-2">Encontre o destino de viagem perfeito para você</p>
        </header>

        {!loading && !results.length && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{currentQuestion.text}</h2>
            <div className="flex flex-col items-center gap-4">
              {currentQuestion.type === 'number' && (
                <input
                  type="number"
                  onBlur={(e) => handleAnswer(currentQuestion.field, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              )}
              {currentQuestion.type === 'radio' && currentQuestion.options && currentQuestion.options.map((option:any) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQuestion.field, option.value)}
                  className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700"
                >
                  {option.label}
                </button>
              ))}
              {currentQuestion.type === 'checkbox' && currentQuestion.options && (
                <div className="grid grid-cols-3 gap-2">
                  {currentQuestion.options.map((option: any) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        id={option.value}
                        name={currentQuestion.field}
                        value={option.value}
                        onChange={(e) => {
                          const existing = answers[currentQuestion.field] || [];
                          const newMonths = e.target.checked
                            ? [...existing, option.value]
                            : existing.filter((m: string) => m !== option.value);
                          setAnswers((prev: any) => ({ ...prev, [currentQuestion.field]: newMonths }));
                        }}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                      <label htmlFor={option.value} className="ml-2 block text-sm text-gray-900">
                        {option.label}
                      </label>
                    </div>
                  ))}
                   <button
                    onClick={() => handleAnswer(currentQuestion.field, answers[currentQuestion.field])}
                    className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 mt-4 col-span-3"
                  >
                    Próximo
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {loading && <p className="text-center">Carregando recomendações...</p>}

        {results.length > 0 && (
          <div className="mt-10">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Resultados</h2>
            <div className="grid grid-cols-1 gap-8">
              {results.map((result, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-800">{result.cidade}, {result.pais}</h3>
                  <p className="text-gray-600 mt-2">Mês: {result.mes}</p>
                  <p className="text-gray-600 mt-2">{result.descricao}</p>
                  <p className="text-indigo-500 font-semibold mt-4">Score: {result.score.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
