import logging
from pathlib import Path
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

# Assuming travel_knn_assets is in a module named ml
from travel_app.ml.travel_knn_assets import recommend_knn

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:3000",  # Allow frontend origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST"],  # Allow only POST method for the recommend endpoint
    allow_headers=["Content-Type"],  # Allow only Content-Type header
)

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent
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

class RecommendPayload(BaseModel):
    temp_target: Optional[float] = None
    chuva_preference: Optional[str] = None
    neve_preference: Optional[str] = None
    quer_montanha: Optional[bool] = None
    gosta_historia: Optional[bool] = None
    budget_target: Optional[float] = None
    months: Optional[List[str]] = None

@app.post("/api/recommend/")
def recommend_view(payload: RecommendPayload):
    results = recommend_knn(payload.dict(), top_k=10)
    if results:
        results = sorted(results, key=lambda r: r["score"], reverse=True)[:2]
        for item in results:
            item["descricao"] = _city_description(item.get("pais"), item.get("cidade"))
    
    return {"results": results}
