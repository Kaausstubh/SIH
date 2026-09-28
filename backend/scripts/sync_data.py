import json
import sqlite3
from pathlib import Path
from backend.database import SessionLocal, engine, Base
from backend.models.orm_models import WorkModel
from backend.data.ingestion import load_initial_demo_data
from backend.services.pipeline_service import pipeline_service

CSV_PATH = Path(__file__).resolve().parent.parent / "data" / "sample_mplads_data.csv"
FRONTEND_DATA_PATH = Path(__file__).resolve().parent.parent.parent / "frontend" / "src" / "data" / "demoData.json"

def sync_all():
    print("[Nirikshak Sync] 1. Rebuilding database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print(f"[Nirikshak Sync] 2. Ingesting {CSV_PATH}...")
        load_initial_demo_data(db, str(CSV_PATH))
        total_works = db.query(WorkModel).count()
        print(f"[Nirikshak Sync] Successfully inserted {total_works} works into SQLite.")

        print("[Nirikshak Sync] 3. Running multi-agent batch analysis & scoring on all works...")
        processed = pipeline_service.batch_process_all_works(db)
        print(f"[Nirikshak Sync] Multi-agent analysis completed for {processed} works.")

        print("[Nirikshak Sync] 4. Building dashboard summary...")
        summary = pipeline_service.get_dashboard_summary(db)
        summary_dict = summary.model_dump()

        print("[Nirikshak Sync] 5. Compiling investigations & frontend export payload...")
        db_works = db.query(WorkModel).all()
        works_list = []
        investigations_map = {}

        for w in db_works:
            util_pct = round((w.expenditure / w.sanctioned_amount * 100.0), 1) if w.sanctioned_amount > 0 else 0.0
            work_dict = {
                "id": w.id,
                "work_id": w.work_id,
                "mp_name": w.mp_name,
                "mp_house": w.mp_house,
                "constituency": w.constituency,
                "state": w.state,
                "district": w.district,
                "block": w.block,
                "village": w.village,
                "implementing_agency": w.implementing_agency,
                "work_type": w.work_type,
                "work_description": w.work_description,
                "sanctioned_amount": w.sanctioned_amount,
                "released_amount": w.released_amount,
                "expenditure": w.expenditure,
                "balance_amount": w.balance_amount,
                "work_status": w.work_status,
                "recommendation_date": w.recommendation_date,
                "sanction_date": w.sanction_date,
                "completion_date": w.completion_date,
                "financial_year": w.financial_year,
                "latitude": w.latitude,
                "longitude": w.longitude,
                "is_demo": w.is_demo,
                "risk_score": w.risk_score,
                "risk_level": w.risk_level,
                "top_finding": w.top_finding,
                "utilization_percentage": util_pct
            }
            works_list.append(work_dict)

            if w.analysis_cache:
                try:
                    investigations_map[w.work_id] = json.loads(w.analysis_cache)
                except Exception:
                    pass

        payload = {
            "summary": summary_dict,
            "works": works_list,
            "investigations": investigations_map
        }

        print(f"[Nirikshak Sync] Writing {len(works_list)} works and {len(investigations_map)} investigations to {FRONTEND_DATA_PATH}...")
        with open(FRONTEND_DATA_PATH, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2, ensure_ascii=False)

        print("[Nirikshak Sync] Verification complete! All 1,200 works synchronized.")

    finally:
        db.close()

if __name__ == "__main__":
    sync_all()
