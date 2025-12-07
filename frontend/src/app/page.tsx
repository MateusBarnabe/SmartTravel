
'use client';

import { useState } from 'react';

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function Home() {
  const [results, setResults] = useState<any[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      temp_target: formData.get('temp_target'),
      chuva_preference: formData.get('chuva_preference'),
      neve_preference: formData.get('neve_preference'),
      quer_montanha: formData.get('quer_montanha'),
      gosta_historia: formData.get('gosta_historia'),
      budget_target: formData.get('budget_target'),
      months: formData.getAll('months'),
    };

    const response = await fetch('/api/recommend/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    setResults(result.results);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="temp_target">Temperatura Desejada (°C)</label>
            <input type="number" id="temp_target" name="temp_target" />
          </div>
          <div>
            <label htmlFor="chuva_preference">Preferência de Chuva</label>
            <select id="chuva_preference" name="chuva_preference">
              <option value="nao_importa">Não Importa</option>
              <option value="pouca">Pouca</option>
              <option value="muita">Muita</option>
            </select>
          </div>
          <div>
            <label htmlFor="neve_preference">Preferência de Neve</label>
            <select id="neve_preference" name="neve_preference">
              <option value="nao_importa">Não Importa</option>
              <option value="pouca">Pouca</option>
              <option value="muita">Muita</option>
            </select>
          </div>
          <div>
            <label htmlFor="quer_montanha">Quer Montanha?</label>
            <input type="checkbox" id="quer_montanha" name="quer_montanha" value="true" />
          </div>
          <div>
            <label htmlFor="gosta_historia">Gosta de História?</label>
            <input type="checkbox" id="gosta_historia" name="gosta_historia" value="true" />
          </div>
          <div>
            <label htmlFor="budget_target">Orçamento</label>
            <input type="number" id="budget_target" name="budget_target" />
          </div>
          <div>
            <label>Meses</label>
            <div className="grid grid-cols-3 gap-2">
              {MONTHS.map(month => (
                <div key={month}>
                  <input type="checkbox" id={month} name="months" value={month} />
                  <label htmlFor={month}>{month}</label>
                </div>
              ))}
            </div>
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Recomendar
          </button>
        </form>

        <div className="mt-8">
          {results && results.map((result, index) => (
            <div key={index} className="border p-4 my-4">
              <h2 className="text-xl font-bold">{result.cidade}, {result.pais}</h2>
              <p>{result.descricao}</p>
              <p className="font-mono">Score: {result.score.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
