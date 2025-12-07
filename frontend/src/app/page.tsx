
'use client';

import { useState } from 'react';

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function Home() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const temp_target = formData.get('temp_target');
    const budget_target = formData.get('budget_target');

    const data = {
      temp_target: temp_target ? parseFloat(temp_target.toString()) : null,
      chuva_preference: formData.get('chuva_preference'),
      neve_preference: formData.get('neve_preference'),
      quer_montanha: formData.get('quer_montanha') === 'true',
      gosta_historia: formData.get('gosta_historia') === 'true',
      budget_target: budget_target ? parseFloat(budget_target.toString()) : null,
      months: formData.getAll('months'),
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

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-100">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-800">SmartTravel</h1>
          <p className="text-gray-600 mt-2">Encontre o destino de viagem perfeito para você</p>
        </header>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <div>
                <label htmlFor="temp_target" className="block text-sm font-medium text-gray-700">Temperatura Desejada (°C)</label>
                <input type="number" id="temp_target" name="temp_target" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="budget_target" className="block text-sm font-medium text-gray-700">Orçamento</label>
                <input type="number" id="budget_target" name="budget_target" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="chuva_preference" className="block text-sm font-medium text-gray-700">Preferência de Chuva</label>
                <select id="chuva_preference" name="chuva_preference" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  <option value="nao_importa">Não Importa</option>
                  <option value="pouca">Pouca</option>
                  <option value="muita">Muita</option>
                </select>
              </div>
              <div>
                <label htmlFor="neve_preference" className="block text-sm font-medium text-gray-700">Preferência de Neve</label>
                <select id="neve_preference" name="neve_preference" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  <option value="nao_importa">Não Importa</option>
                  <option value="pouca">Pouca</option>
                  <option value="muita">Muita</option>
                </select>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input id="quer_montanha" name="quer_montanha" type="checkbox" value="true" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="quer_montanha" className="font-medium text-gray-700">Gosta de Montanhas?</label>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input id="gosta_historia" name="gosta_historia" type="checkbox" value="true" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="gosta_historia" className="font-medium text-gray-700">Gosta de História?</label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Meses de Preferência</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {MONTHS.map(month => (
                  <div key={month} className="flex items-center">
                    <input type="checkbox" id={month} name="months" value={month} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                    <label htmlFor={month} className="ml-2 block text-sm text-gray-900">{month}</label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-2 text-center mt-6">
              <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {loading ? 'Buscando...' : 'Recomendar'}
              </button>
            </div>
          </form>
        </div>

        {loading && (
          <div className="text-center mt-8">
            <p>Carregando recomendações...</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-10">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Resultados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {results.map((result, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-2xl font-bold text-gray-800">{result.cidade}, {result.pais}</h3>
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
