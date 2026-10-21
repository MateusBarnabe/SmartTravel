import { NextResponse } from 'next/server';
import knnData from '@/data/travel_knn_data.json';

interface RecommendPayload {
  temp_target?: number | string | null;
  chuva_preference?: string | null;
  neve_preference?: string | null;
  quer_montanha?: boolean | null;
  gosta_historia?: boolean | null;
  budget_target?: number | string | null;
  months?: string[] | string | null;
}

function toOptFloat(v: unknown): number | null {
  if (v === null || v === undefined || v === '' || String(v).toLowerCase() === 'null') {
    return null;
  }
  const num = Number(v);
  return Number.isFinite(num) ? num : null;
}

export async function POST(request: Request) {
  try {
    const payload: RecommendPayload = await request.json();

    const { feats, mean, scale, feat_means, records } = knnData;
    const qVals: Record<string, number> = {};
    const wVals: Record<string, number> = {};

    feats.forEach((f, idx) => {
      qVals[f] = feat_means[idx];
      wVals[f] = 0.0;
    });

    const chuvaMap: Record<string, number> = { pouca: 1, muita: 3 };
    const neveMap: Record<string, number> = { pouca: 1, muita: 2 };

    const temp = toOptFloat(payload.temp_target);
    if (temp !== null && 'temp_media' in qVals) {
      qVals['temp_media'] = temp;
      wVals['temp_media'] = 2.0;
    }

    if (payload.chuva_preference && payload.chuva_preference in chuvaMap && 'chuva_level' in qVals) {
      qVals['chuva_level'] = chuvaMap[payload.chuva_preference];
      wVals['chuva_level'] = 1.0;
    }

    if (payload.neve_preference && payload.neve_preference in neveMap && 'neve_level' in qVals) {
      qVals['neve_level'] = neveMap[payload.neve_preference];
      wVals['neve_level'] = 2.0;
    }

    if (payload.quer_montanha !== null && payload.quer_montanha !== undefined && 'montanha' in qVals) {
      qVals['montanha'] = payload.quer_montanha ? 1 : 0;
      wVals['montanha'] = 2.0;
    }

    if (payload.gosta_historia !== null && payload.gosta_historia !== undefined && 'historia' in qVals) {
      qVals['historia'] = payload.gosta_historia ? 1 : 0;
      wVals['historia'] = 1.0;
    }

    const budget = toOptFloat(payload.budget_target);
    if (budget !== null && 'custo_level' in qVals) {
      const custoLevel = budget < 1000 ? 0 : budget < 3000 ? 1 : 2;
      qVals['custo_level'] = custoLevel;
      wVals['custo_level'] = 1.0;
    }

    const allZero = Object.values(wVals).every((w) => w === 0.0);
    if (allZero) {
      if ('temp_media' in qVals) {
        qVals['temp_media'] = 22.0;
        wVals['temp_media'] = 1.0;
      }
      if ('chuva_level' in qVals) {
        qVals['chuva_level'] = 1.0;
        wVals['chuva_level'] = 1.0;
      }
      if ('custo_level' in qVals) {
        qVals['custo_level'] = 1.0;
        wVals['custo_level'] = 1.0;
      }
    }

    const qz = feats.map((f, idx) => (qVals[f] - mean[idx]) / scale[idx]);
    let w = feats.map((f) => wVals[f]);
    const wSum = w.reduce((acc, v) => acc + v, 0);
    if (wSum > 0) {
      w = w.map((v) => (v / wSum) * w.length);
    }

    let monthsFilter: string[] = [];
    if (typeof payload.months === 'string' && payload.months.trim()) {
      monthsFilter = [payload.months.trim()];
    } else if (Array.isArray(payload.months)) {
      monthsFilter = payload.months;
    }

    const filtered = monthsFilter.length > 0
      ? records.filter((r) => monthsFilter.includes(r.mes))
      : records;

    const scored = filtered.map((rec) => {
      let sumSq = 0;
      for (let i = 0; i < feats.length; i++) {
        const xz = (rec.feats[i] - mean[i]) / scale[i];
        const diff = xz - qz[i];
        sumSq += w[i] * diff * diff;
      }
      const dist = Math.sqrt(sumSq);
      const score = 1.0 / (1.0 + dist);
      return {
        pais: rec.pais,
        cidade: rec.cidade,
        mes: rec.mes,
        temp_min: rec.temp_min,
        temp_max: rec.temp_max,
        chuva: rec.chuva,
        neve: rec.neve,
        tem_montanha: rec.tem_montanha,
        tem_historia: rec.tem_historia,
        custo: rec.custo,
        descricao: rec.descricao,
        score,
      };
    });

    scored.sort((a, b) => b.score - a.score);

    const uniqueResults = [];
    const seen = new Set<string>();
    for (const item of scored) {
      const key = `${item.pais.toLowerCase()}-${item.cidade.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueResults.push(item);
      }
      if (uniqueResults.length >= 5) break;
    }

    return NextResponse.json({ results: uniqueResults });
  } catch (error) {
    console.error('Erro na recomendação:', error);
    return NextResponse.json({ error: 'Falha ao processar recomendação' }, { status: 500 });
  }
}
