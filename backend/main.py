from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc
from pydantic import BaseModel, EmailStr
import os
import time
import json
import shutil
import uuid
from pathlib import Path
from dotenv import load_dotenv
from passlib.context import CryptContext
from datetime import datetime

# --- IMPORTS LOCAUX (Connexion BDD) ---
import models
from database import engine, SessionLocal

# 1. Chargement des variables d'environnement
dotenv_path = Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=dotenv_path)

# 2. Création automatique des tables
models.Base.metadata.create_all(bind=engine)

# 3. CONFIGURATION SÉCURITÉ (Mots de passe)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password[:72])

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password[:72], hashed_password)

# --- DÉPENDANCE BDD ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 4. INITIALISATION DU CERVEAU UHG (VERSION GEMINI 2.0)
client_gemini = None
mode_ia = "GEMINI"  # On tente le vrai mode par défaut

print("--- DÉMARRAGE DU SYSTÈME UHG ---")

try:
    import google.generativeai as genai
    api_key_google = os.getenv("GOOGLE_API_KEY")
    if api_key_google:
        genai.configure(api_key=api_key_google)
        try:
            # --- ALIGNEMENT SUR LE PROJET L'OMBRE ---
            client_gemini = genai.GenerativeModel('gemini-2.0-flash')
            print(f"✅ MOTEUR IA ACTIF : Gemini 2.0 Flash (Héritage L'Ombre)")
        except Exception as e:
            print(f"⚠️ Erreur initialisation modèle : {e}")
            print("👉 Passage en mode SIMULATION de secours.")
            mode_ia = "SIMULATION"
    else:
        print("⚠️ ERREUR : Clé GOOGLE_API_KEY introuvable.")
        mode_ia = "SIMULATION"
except ImportError:
    print("⚠️ Module Google non installé ou obsolète.")
    mode_ia = "SIMULATION"

# 5. CONFIGURATION API
app = FastAPI(
    title="AURA Financial Core",
    description="API du Directeur Financier Artificiel - Engineered by UHG-Tech Corp",
    version="2.5.0" # VERSION FINALE MVP (Partner Ready)
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SÉCURITÉ SENTINELLE ---
BANNED_IPS = ["1.2.3.4", "bad.actor.ip"]

class SentinelleMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        if client_ip in BANNED_IPS:
            return JSONResponse(status_code=403, content={"error": "Sentinelle Block: IP Banned"})
       
        response = await call_next(request)
        response.headers["X-Security-By"] = "UHG-Sentinelle-AI"
        return response

app.add_middleware(SentinelleMiddleware)

# --- MODÈLES DE DONNÉES ---

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class LoginRequest(BaseModel):
    email: str
    password: str

class TaxFreeRequest(BaseModel):
    amount_total: float
    merchant_name: str

# --- FONCTION D'ANALYSE (HYBRIDE) ---

def analyze_document_with_uhg_brain(file_path: str, mime_type: str):
    """
    Envoie le document à Gemini 2.0 avec les règles fiscales EAU 2025.
    Si échec (Quota), bascule en simulation.
    """
   
    # 1. TENTATIVE RÉELLE (GEMINI 2.0)
    if mode_ia == "GEMINI":
        try:
            print(f"⚡ Envoi au Cloud UHG (Gemini 2.0)...")
            uploaded_file = genai.upload_file(file_path, mime_type=mime_type)
           
            # Attente active si le fichier est gros
            while uploaded_file.state.name == "PROCESSING":
                time.sleep(1)
                uploaded_file = genai.get_file(uploaded_file.name)

            # --- PROMPT EXPERT FISCAL 2025 ---
            prompt = """
            You are AURA, the elite AI Tax Auditor for Dubai (UAE).
            Analyze this financial document.
           
            APPLY UAE TAX LAWS STRICTLY:
            1. VAT (Value Added Tax): Standard rate is 5%.
            2. CORPORATE TAX:
               - 0% on Net Profit up to 375,000 AED.
               - 9% on Net Profit exceeding 375,000 AED.
            3. EXCISE TAX (Sin Tax):
               - 50% on Carbonated drinks.
               - 100% on Energy drinks, Tobacco, Vapes.
            4. DEDUCTIBILITY: Only legitimate business expenses are deductible.
           
            Respond ONLY with this JSON format (no markdown):
            {
                "merchant": "Vendor Name",
                "date": "YYYY-MM-DD",
                "total": 0.00,
                "tax": 0.00,
                "currency": "AED",
                "category": "Category",
                "description": "Short description",
                "is_deductible": true/false,
                "tax_rule_applied": "e.g. 'Standard 5% VAT'",
                "justification": "Why based on UAE Law",
                "line_items": [{"name": "Product", "sku": "Ref", "quantity": 0, "unit_price": 0.00}]
            }
            """
           
            response = client_gemini.generate_content([prompt, uploaded_file])
            json_str = response.text.replace("```json", "").replace("```", "").strip()
            data = json.loads(json_str)
            print("✅ Analyse Fiscale Gemini 2.0 réussie.")
            return data

        except Exception as e:
            print(f"❌ Erreur Gemini 2.0 ({e}). Bascule automatique en Simulation.")
            pass

    # 2. FALLBACK SIMULATION
    print("⚡ Mode Simulation (Secours) activé.")
    time.sleep(1.5)
    return {
        "merchant": "Apple Store Dubai Mall (Sim)",
        "date": datetime.now().strftime("%Y-%m-%d"),
        "total": 8400.00,
        "tax": 400.00,
        "currency": "AED",
        "category": "Inventory",
        "description": "Achat Stock iPhone 15 Pro Max (Backup)",
        "is_deductible": True,
        "tax_rule_applied": "Standard 5% VAT",
        "justification": "Achat de marchandises (Mode Secours).",
        "line_items": [
            {"name": "iPhone 15 Pro Max 256GB", "quantity": 2, "unit_price": 4200.0, "sku": "IPH-15PM-256"}
        ]
    }

# --- MOTEUR 3 : GESTION DES STOCKS ---

def process_inventory_updates(db: Session, company_id: str, ai_data: dict):
    items_extracted = ai_data.get("line_items", [])
    if not items_extracted: return

    print(f"📦 MOTEUR 3 : Traitement de {len(items_extracted)} articles de stock...")

    for item in items_extracted:
        p_name = item.get("name")
        p_qty = item.get("quantity", 0)
        p_price = item.get("unit_price", 0.0)
        p_sku = item.get("sku")
        if not p_sku: p_sku = "GEN-" + str(uuid.uuid4())[:8].upper()

        if p_qty > 0 and p_name:
            existing_item = db.query(models.InventoryItem).filter(
                models.InventoryItem.company_id == company_id,
                models.InventoryItem.product_name == p_name
            ).first()

            if existing_item:
                existing_item.quantity_on_hand += p_qty
                existing_item.unit_price = p_price
            else:
                new_item = models.InventoryItem(
                    company_id=company_id,
                    product_name=p_name,
                    sku=p_sku,
                    quantity_on_hand=p_qty,
                    unit_price=p_price,
                    low_stock_threshold=5
                )
                db.add(new_item)
    db.commit()

# --- ROUTES API ---

@app.get("/")
def home():
    return {"system": "UHG-Tech AURA", "status": "Online", "ai_engine": mode_ia, "version": "2.5.0"}

# 1. INSCRIPTION
@app.post("/auth/register", status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        if user_data.email == "franck.abe@uhg-demo.com":
             return {"success": True, "message": "Demo User OK.", "user_id": existing_user.id}
        raise HTTPException(status_code=400, detail="Email exists.")

    custom_id = str(uuid.uuid4())
    if user_data.email == "franck.abe@uhg-demo.com":
        custom_id = "user_demo_franck_abe"

    new_user = models.User(
        id=custom_id,
        email=user_data.email,
        password_hash=get_password_hash(user_data.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    profile = models.Profile(id=new_user.id, full_name=user_data.full_name)
    db.add(profile)

    company = models.Company(
        owner_id=new_user.id,
        name=f"{user_data.full_name} Global Ltd",
        is_free_zone=True
    )
    db.add(company)
    db.commit()

    return {"success": True, "message": "Compte créé.", "user_id": new_user.id}

# 2. CONNEXION
@app.post("/auth/login")
def login(creds: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == creds.email).first()
    if not user or not verify_password(creds.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Accès refusé.")
    return {"success": True, "user_id": user.id, "name": user.profile.full_name}

# 3. UPLOAD & ANALYSE (BLACK BOX)
@app.post("/api/aura/scan/{user_id}")
async def scan_document(
    user_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    company = db.query(models.Company).filter(models.Company.owner_id == user_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Société introuvable.")

    upload_dir = Path("uploads")
    upload_dir.mkdir(exist_ok=True)
    filename = f"{user_id}_{int(time.time())}_{file.filename}"
    file_path = upload_dir / filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    doc_entry = models.FinancialDocument(
        company_id=company.id,
        filename=file.filename,
        file_path=str(file_path),
        file_type=file.content_type,
        status="ANALYZING"
    )
    db.add(doc_entry)
    db.commit()

    # APPEL CERVEAU
    ai_result = analyze_document_with_uhg_brain(str(file_path), file.content_type)

    if ai_result:
        entry_ref = f"J-{time.strftime('%Y')}-{doc_entry.id[:8].upper()}"
        try:
            tx_date = datetime.strptime(ai_result.get("date"), "%Y-%m-%d")
        except:
            tx_date = datetime.now()

        new_tx = models.Transaction(
            company_id=company.id,
            document_id=doc_entry.id,
            entry_number=entry_ref,
            date=tx_date,
            merchant_name=ai_result.get("merchant"),
            description=ai_result.get("description"),
            amount_total=ai_result.get("total"),
            amount_tax=ai_result.get("tax"),
            currency=ai_result.get("currency"),
            category=ai_result.get("category"),
            is_tax_deductible=ai_result.get("is_deductible"),
            deduction_justification=ai_result.get("justification")
        )
        db.add(new_tx)
       
        # Moteur 3
        if ai_result.get("line_items"):
            process_inventory_updates(db, company.id, ai_result)

        # BLACK BOX STRATEGY
        memory = models.AuraMemory(
            document_id=doc_entry.id,
            raw_text_input=f"Prompt: Expert Fiscal UAE 2025 | File: {filename}",
            ai_json_output=ai_result
        )
        db.add(memory)
        print(f"💎 BLACK BOX : Donnée d'entraînement sauvegardée (Ref: {doc_entry.id})")

        doc_entry.status = "COMPLETED"
        db.commit()

        return {"success": True, "data": ai_result}
    else:
        doc_entry.status = "FAILED"
        db.commit()
        raise HTTPException(status_code=500, detail="Erreur IA")

# 4. TABLEAU DE BORD
@app.get("/api/aura/dashboard/{user_id}")
def get_dashboard(user_id: str, db: Session = Depends(get_db)):
    company = db.query(models.Company).filter(models.Company.owner_id == user_id).first()
    if not company: return {"error": "No company"}

    transactions = db.query(models.Transaction)\
        .filter(models.Transaction.company_id == company.id)\
        .order_by(desc(models.Transaction.date))\
        .limit(20)\
        .all()
    return {"company": company.name, "transactions": transactions}

# 5. INVENTAIRE
@app.get("/api/aura/inventory/{user_id}")
def get_inventory(user_id: str, db: Session = Depends(get_db)):
    company = db.query(models.Company).filter(models.Company.owner_id == user_id).first()
    if not company: return []

    items = db.query(models.InventoryItem)\
        .filter(models.InventoryItem.company_id == company.id)\
        .filter(models.InventoryItem.quantity_on_hand > 0)\
        .order_by(desc(models.InventoryItem.quantity_on_hand))\
        .all()
    return items

# 6. MODULE TOURISTE (TAX FREE CALCULATOR)
@app.post("/api/aura/tax-free")
def calculate_tax_free(request: TaxFreeRequest):
    """
    Simule le calcul de remboursement Planet Tax Free UAE.
    Règle approx: 85% de la TVA est remboursée, moins frais admin (env. 4.80 AED par tag).
    """
    vat_rate = 0.05
    vat_amount = request.amount_total * (vat_rate / (1 + vat_rate)) # TVA incluse
   
    # Frais administratifs (Planet)
    admin_fee = 4.80
    refund_percentage = 0.85 # On récupère environ 85% de la TVA payée
   
    estimated_refund = (vat_amount * refund_percentage) - admin_fee
   
    if estimated_refund < 0:
        estimated_refund = 0

    # Génération d'un lien QR Code (API externe pour la démo)
    qr_data = f"TAXFREE|{request.merchant_name}|{request.amount_total}|{round(estimated_refund, 2)}|AED"
    qr_url = f"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={qr_data}&color=10b981&bgcolor=020617"

    return {
        "total_paid": request.amount_total,
        "vat_paid": round(vat_amount, 2),
        "estimated_refund": round(estimated_refund, 2),
        "admin_fees": round(vat_amount * (1-refund_percentage) + admin_fee, 2),
        "qr_code_url": qr_url,
        "status": "ELIGIBLE" if request.amount_total > 250 else "NOT_ELIGIBLE" # Seuil min 250 AED
    }

# 7. MODULE PARTENAIRE (B2B COMMISSION DASHBOARD)
@app.get("/api/aura/partner/stats/{partner_id}")
def get_partner_stats(partner_id: str):
    """
    Simule les stats pour une Agence Partenaire (ex: Virtuzone).
    Permet de montrer aux partenaires potentiels ce qu'ils gagnent en vendant Aura.
    """
    # Données simulées riches pour la démo commerciale
    return {
        "partner_name": "Virtuzone Corporate Services",
        "tier": "PLATINUM",
        "total_clients_referred": 142,
        "active_subscriptions": 128,
        "commission_rate": 0.20, # 20%
        "current_month_revenue": 12450.00, # Chiffre d'affaires généré par leurs clients
        "pending_commission": 2490.00, # Ce qui va dans leur poche (USDT)
        "recent_activity": [
            {"date": "2025-11-30", "client": "TechFlow FZ-LLC", "plan": "PRO Annual", "comm": "+$160"},
            {"date": "2025-11-29", "client": "DubAI Solutions", "plan": "PRO Monthly", "comm": "+$16"},
            {"date": "2025-11-29", "client": "CryptoKing Trading", "plan": "ENTERPRISE", "comm": "+$500"},
        ]
    }
