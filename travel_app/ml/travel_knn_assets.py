# travel_app/ml/smart_travel_recommender.py
from pathlib import Path
import joblib
import numpy as np
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "travel_knn_assets.joblib"

# aqui assumo que você salvou um dicionário com tudo que precisa
# Ex: joblib.dump({"df": df, "scaler": scaler, "FEATS": FEATS, "nn": nn}, "smart_travel_model.joblib")
_artifacts = joblib.load(MODEL_PATH)

df     = _artifacts["df"]
scaler = _artifacts["scaler"]
FEATS  = _artifacts["feats"]

def _to_opt_float(v):
    if v is None or v == "" or str(v).lower() == "null":
        return None
    try:
        return float(v)
    except:
        return None

def _to_opt_int(v):
    if v is None or v == "" or str(v).lower() == "null":
        return None
    try:
        return int(v)
    except:
        return None

def _build_query_and_weights(payload: dict):
    feat_means = df[FEATS].mean().to_dict()
    q_vals = {f: feat_means[f] for f in FEATS}
    w_vals = {f: 0.0 for f in FEATS}

    # Mapeamento de preferências de chuva e neve
    chuva_map = {"pouca": 1, "muita": 3}
    neve_map = {"pouca": 1, "muita": 2}

    # temp
    v = _to_opt_float(payload.get("temp_target"))
    if v is not None and "temp_media" in FEATS:
        q_vals["temp_media"] = v
        w_vals["temp_media"] = 2.0

    # chuva (0..3)
    v_str = payload.get("chuva_preference")
    v = chuva_map.get(v_str)
    if v is not None and "chuva_level" in FEATS:
        q_vals["chuva_level"] = v
        w_vals["chuva_level"] = 1.0

    # neve (0..2)
    v_str = payload.get("neve_preference")
    v = neve_map.get(v_str)
    if v is not None and "neve_level" in FEATS:
        q_vals["neve_level"] = v
        w_vals["neve_level"] = 2.0

    # montanha (0/1)
    v = payload.get("quer_montanha")
    if v is not None and "montanha" in FEATS:
        q_vals["montanha"] = int(v)
        w_vals["montanha"] = 2.0

    # história (0/1)
    v = payload.get("gosta_historia")
    if v is not None and "historia" in FEATS:
        q_vals["historia"] = int(v)
        w_vals["historia"] = 1.0

    # custo (0..2)
    v = _to_opt_float(payload.get("budget_target"))
    if v is not None and "custo_level" in FEATS:
        if v < 1000:
            custo_level = 0
        elif v < 3000:
            custo_level = 1
        else:
            custo_level = 2
        q_vals["custo_level"] = custo_level
        w_vals["custo_level"] = 1.0

    if all(w == 0.0 for w in w_vals.values()):
        if "temp_media" in FEATS:
            q_vals["temp_media"] = 22.0
            w_vals["temp_media"] = 1.0
        if "chuva_level" in FEATS:
            q_vals["chuva_level"] = 1.0
            w_vals["chuva_level"] = 1.0
        if "custo_level" in FEATS:
            q_vals["custo_level"] = 1.0
            w_vals["custo_level"] = 1.0

    q_raw = np.array([[q_vals[f] for f in FEATS]], dtype=float)
    qz = scaler.transform(q_raw)
    w = np.array([w_vals[f] for f in FEATS], dtype=float)

    if w.sum() > 0:
        w = w / w.sum() * len(w)

    return qz, w

def recommend_knn(payload: dict, top_k: int = 10):
    """
    Função que você vai chamar nas views do Django.
    Retorna uma lista de dicionários com as cidades recomendadas.
    """

    submask = np.ones(len(df), dtype=bool)
    months = payload.get("months")
    if isinstance(months, str):
        months = [months]
    if months:
        submask &= df["Mes"].isin(months).values

    df_sub = df[submask].reset_index(drop=True)

    # matriz padronizada para subset
    Xz_sub = scaler.transform(df_sub[FEATS].astype(float).values)

    # query e pesos
    qz, w = _build_query_and_weights(payload)

    # aqui assumo que você treinou o nn com metric="wminkowski" e metric_params={"w": w}
    # Se você salvou o próprio nn no joblib, talvez precise recriar com os novos pesos.
    from sklearn.neighbors import NearestNeighbors
    nn_local = NearestNeighbors(
        n_neighbors=top_k,
        metric="minkowski",
        p=2,
        metric_params={"w": w},
    )
    nn_local.fit(Xz_sub)

    dists, idxs = nn_local.kneighbors(qz, return_distance=True)
    dists = dists[0]
    idxs = idxs[0]

    out = df_sub.loc[idxs, [
        "País", "Cidade", "Mes",
        "Temp mínima média", "Temp máxima média",
        "Preciptação chuva", "Preciptação neve",
        "Tem montanha?", "Tem história?", "Custo"
    ]].copy()
    out["score"] = 1.0 / (1.0 + dists)

    out = out.rename(columns={
    "País": "pais",
    "Cidade": "cidade",
    "Mes": "mes",
    "Temp mínima média": "temp_min",
    "Temp máxima média": "temp_max",
    "Preciptação chuva": "chuva",
    "Preciptação neve": "neve",
    "Tem montanha?": "tem_montanha",
    "Tem história?": "tem_historia",
    "Custo": "custo",
    })

    # retorna algo fácil de renderizar no template ou JSON
    return out.to_dict(orient="records")
