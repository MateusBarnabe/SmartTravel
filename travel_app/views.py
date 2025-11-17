import logging
from pathlib import Path

import pandas as pd
from django.shortcuts import render

from .ml.travel_knn_assets import recommend_knn

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent
TEXTS_PATH = BASE_DIR / "textos.xlsx"


def _load_city_texts():
    if not TEXTS_PATH.exists():
        logger.warning("Arquivo de descrições %s não encontrado.", TEXTS_PATH)
        return {}
    try:
        df_textos = pd.read_excel(TEXTS_PATH)
    except Exception as exc:
        logger.exception("Não foi possível ler %s para carregar descrições: %s", TEXTS_PATH, exc)
        return {}

    mapping = {}
    for _, row in df_textos.iterrows():
        pais = str(row.get("País") or row.get("país") or "").strip().lower()
        cidade = str(row.get("Cidade") or row.get("cidade") or "").strip().lower()
        if pais and cidade:
            descricao = (
                row.get("Texto 1") or
                row.get("Texto 1 (Detalhado)") or
                row.get("texto 1") or
                row.get("texto1") or
                ""
            )
            mapping[(pais, cidade)] = str(descricao).strip()
    return mapping


CITY_TEXTS = _load_city_texts()


def _city_description(pais, cidade):
    if not pais or not cidade:
        return ""
    key = (str(pais).strip().lower(), str(cidade).strip().lower())
    return CITY_TEXTS.get(key, "")

MONTHS = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

def recommend_view(request):
    results = None
    selected_months = []

    if request.method == "POST":
        temp_target      = request.POST.get("temp_target") or None
        chuva_preference = request.POST.get("chuva_preference") or None
        neve_preference  = request.POST.get("neve_preference") or None
        quer_montanha    = request.POST.get("quer_montanha") or None
        gosta_historia   = request.POST.get("gosta_historia") or None
        budget_target    = request.POST.get("budget_target") or None
        selected_months  = request.POST.getlist("months")

        payload = {
            "temp_target": temp_target,
            "chuva_preference": chuva_preference,
            "neve_preference": neve_preference,
            "quer_montanha": quer_montanha,
            "gosta_historia": gosta_historia,
            "budget_target": budget_target,
            "months": selected_months,
        }

        results = recommend_knn(payload, top_k=10)
        if results:
            results = sorted(results, key=lambda r: r["score"], reverse=True)[:2]
            for item in results:
                item["descricao"] = _city_description(item.get("pais"), item.get("cidade"))
    
    context = {
        "results": results,
        "months": MONTHS,
        "selected_months": selected_months,
    }


    return render(request, "travel_app/recommend.html", context)
