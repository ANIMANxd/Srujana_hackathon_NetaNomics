import enum
import datetime
from sqlalchemy import Column, Integer, String, Float, Date, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class TransparencyStatus(str, enum.Enum):
    CURRENT = "Current"
    OUTDATED = "Outdated"
    MISSING = "Missing"

class AISeverity(str, enum.Enum):
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

# New table to store the evidence for each finding
class Evidence(Base):
    __tablename__ = "evidence"
    id = Column(Integer, primary_key=True)
    insight_id = Column(Integer, ForeignKey("ai_insights.id", ondelete="CASCADE"))
    project_id = Column(Integer, ForeignKey("projects.id"))
    reasoning = Column(Text) # The AI's explanation for why this is evidence

class Constituency(Base):
    __tablename__ = "constituencies"
    id = Column(Integer, primary_key=True, index=True)
    mp_name = Column(String, index=True)
    constituency_name = Column(String, unique=True, index=True)
    state = Column(String, index=True)
    transparency_status = Column(Enum(TransparencyStatus), default=TransparencyStatus.MISSING)
    last_report_date = Column(Date, nullable=True)
    mp_email = Column(String, nullable=True)
    mp_image_url = Column(String, nullable=True)
    projects = relationship("Project", back_populates="constituency", cascade="all, delete-orphan")
    ai_insights = relationship("AIInsight", back_populates="constituency", cascade="all, delete-orphan")

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    constituency_id = Column(Integer, ForeignKey("constituencies.id"))
    project_description = Column(Text)
    allocated_amount = Column(Float)
    expenditure_date = Column(Date, nullable=True)
    location = Column(String)
    contractor_ngo_name = Column(String, index=True)
    category = Column(String, index=True)
    constituency = relationship("Constituency", back_populates="projects")
    evidence_pieces = relationship("Evidence", backref="project")

class AIInsight(Base):
    __tablename__ = "ai_insights"
    id = Column(Integer, primary_key=True, index=True)
    constituency_id = Column(Integer, ForeignKey("constituencies.id"))
    title = Column(String)
    finding = Column(Text)
    severity = Column(Enum(AISeverity))
    constituency = relationship("Constituency", back_populates="ai_insights")
    evidence_pieces = relationship("Evidence", backref="insight", cascade="all, delete-orphan")