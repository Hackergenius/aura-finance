from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# URL de la base de données (SQLite pour le développement local)
SQLALCHEMY_DATABASE_URL = "sqlite:///./aura.db"

# Création du moteur
# check_same_thread=False est nécessaire uniquement pour SQLite
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Création de la session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# C'est ici que l'on définit Base (ce qui manquait et causait l'erreur)
Base = declarative_base()
