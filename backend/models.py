from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import uuid

# Générateur d'ID unique
def generate_uuid():
    return str(uuid.uuid4())

# --- 1. USERS & PROFILES ---

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
   
    # Relations
    profile = relationship("Profile", back_populates="user", uselist=False)
    companies = relationship("Company", back_populates="owner")

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(String, ForeignKey("users.id"), primary_key=True)
    full_name = Column(String)
    avatar_url = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    user_type = Column(String, default="BUSINESS")
    preferred_language = Column(String, default="en")
   
    user = relationship("User", back_populates="profile")

# --- 2. LEGAL ENTITIES ---

class Company(Base):
    __tablename__ = "companies"

    id = Column(String, primary_key=True, default=generate_uuid)
    owner_id = Column(String, ForeignKey("users.id"))
   
    name = Column(String)
    license_number = Column(String, nullable=True)
    tax_id = Column(String, nullable=True)
    is_free_zone = Column(Boolean, default=True)
    base_currency = Column(String, default="AED")
   
    owner = relationship("User", back_populates="companies")
   
    documents = relationship("FinancialDocument", back_populates="company")
    transactions = relationship("Transaction", back_populates="company")
    inventory_items = relationship("InventoryItem", back_populates="company")
    fixed_assets = relationship("FixedAsset", back_populates="company")

# --- 3. ACCOUNTING CORE ---

class FinancialDocument(Base):
    __tablename__ = "financial_documents"

    id = Column(String, primary_key=True, default=generate_uuid)
    company_id = Column(String, ForeignKey("companies.id"))
    filename = Column(String)
    file_path = Column(String)
    file_type = Column(String)
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="PENDING")
   
    transactions = relationship("Transaction", back_populates="document")
    company = relationship("Company", back_populates="documents")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, default=generate_uuid)
    company_id = Column(String, ForeignKey("companies.id"))
    document_id = Column(String, ForeignKey("financial_documents.id"), nullable=True)
    entry_number = Column(String, index=True, nullable=True)
    date = Column(DateTime)
    merchant_name = Column(String)
    description = Column(String)
    amount_total = Column(Float)
    amount_tax = Column(Float)  
    currency = Column(String, default="AED")
    category = Column(String)
    is_tax_deductible = Column(Boolean, default=False)
    deduction_justification = Column(String, nullable=True)
    is_tax_refundable = Column(Boolean, default=False)
   
    company = relationship("Company", back_populates="transactions")
    document = relationship("FinancialDocument", back_populates="transactions")

# --- 4. AI MEMORY (BLACK BOX STRATEGY) ---

class AuraMemory(Base):
    __tablename__ = "aura_memory"

    id = Column(Integer, primary_key=True, index=True)
    
    # --- MODIFICATION STRATÉGIQUE ---
    # Lien direct vers le document source (L'INPUT)
    document_id = Column(String, ForeignKey("financial_documents.id"), nullable=True)
    
    raw_text_input = Column(Text)
    ai_json_output = Column(JSON) # L'OUTPUT (Gemini)
    human_corrected_json = Column(JSON, nullable=True) # La VALEUR (Correction humaine future)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relation pour retrouver le fichier source facilement
    document = relationship("FinancialDocument")

# --- 5. ERP MODULES ---

class InventoryItem(Base):
    __tablename__ = "inventory_items"
    id = Column(String, primary_key=True, default=generate_uuid)
    company_id = Column(String, ForeignKey("companies.id"))
    product_name = Column(String)
    sku = Column(String)
    quantity_on_hand = Column(Integer, default=0)
    unit_price = Column(Float)
    low_stock_threshold = Column(Integer, default=5)
    company = relationship("Company", back_populates="inventory_items")

class FixedAsset(Base):
    __tablename__ = "fixed_assets"
    id = Column(String, primary_key=True, default=generate_uuid)
    company_id = Column(String, ForeignKey("companies.id"))
    asset_name = Column(String)
    purchase_date = Column(DateTime)
    purchase_price = Column(Float)
    lifespan_years = Column(Integer)
    current_value = Column(Float)
    company = relationship("Company", back_populates="fixed_assets")

