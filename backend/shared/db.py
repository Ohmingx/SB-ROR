import os
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sb_ror.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


class BacktestResult(Base):
    __tablename__ = "backtest_results"
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True)
    strategy = Column(String)
    run_at = Column(DateTime, default=datetime.utcnow)
    metrics = Column(JSON)
    payload = Column(JSON)


class TradeLog(Base):
    __tablename__ = "trade_logs"
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True)
    side = Column(String)
    qty = Column(Float)
    price = Column(Float)
    executed_at = Column(DateTime, default=datetime.utcnow)


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Integer, default=1)


class MarketData(Base):
    __tablename__ = "market_data"
    # For a hypertable, we don't necessarily use a single primary key, but SQLAlchemy expects one.
    # We can use a composite primary key.
    time = Column(DateTime, primary_key=True, index=True)
    symbol = Column(String, primary_key=True, index=True)
    open = Column(Float)
    high = Column(Float)
    low = Column(Float)
    close = Column(Float)
    volume = Column(Float)


class Portfolio(Base):
    __tablename__ = "portfolios"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    cash = Column(Float, default=100000.0)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Position(Base):
    __tablename__ = "positions"
    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, index=True)
    symbol = Column(String, index=True)
    qty = Column(Float, default=0.0)
    avg_price = Column(Float, default=0.0)


def create_tables():
    Base.metadata.create_all(bind=engine)
    # If using postgresql (timescaledb), try converting market_data to a hypertable
    if "postgresql" in DATABASE_URL:
        from sqlalchemy import text
        try:
            with engine.begin() as conn:
                conn.execute(text("SELECT create_hypertable('market_data', 'time', if_not_exists => TRUE);"))
        except Exception as e:
            print("Failed to create hypertable:", e)


def create_demo_user(username: str = "demo", password_hash: str = ""):
    from sqlalchemy.exc import IntegrityError
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.username == username).first()
        if existing:
            return existing
        user = User(username=username, hashed_password=password_hash)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    except IntegrityError:
        db.rollback()
        return db.query(User).filter(User.username == username).first()
    finally:
        db.close()
