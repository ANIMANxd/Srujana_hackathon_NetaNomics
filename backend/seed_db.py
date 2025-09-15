import datetime
import os
import re
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import models

# This command ensures all tables are created based on your models.
models.Base.metadata.create_all(bind=engine)

# Get a new database session
db = SessionLocal()

print("Seeding constituencies for 16th Lok Sabha (2014-2019)...")

# --- MASTER DATA LIST ---
# The `transparency_status` is now EXPLICITLY set here based on your available PDF files.
# This is the single source of truth.
constituencies_data = [
    {"mp_name": "P. C. Gaddigoudar", "constituency_name": "Bagalkot", "state": "Karnataka", "transparency_status": "Current", "mp_email": "pc.gaddigoudar@nic.in", "mp_image_url": "http://loksabhaph.nic.in/writereaddata/biodata/16/4009.jpg"},
    {"mp_name": "B. Sreeramulu", "constituency_name": "Bellary (ST)", "state": "Karnataka", "transparency_status": "Current", "mp_email": "sreeramulu@nic.in", "mp_image_url": "http://loksabhaph.nic.in/writereaddata/biodata/16/4859.jpg"},
    {"mp_name": "V. Srinivas Prasad", "constituency_name": "Chamarajanagar (SC)", "state": "Karnataka", "transparency_status": "Current", "mp_email": "v.prasad@nic.in", "mp_image_url": "http://loksabhaph.nic.in/writereaddata/biodata/16/3391.jpg"},
    {"mp_name": "M. Veerappa Moily", "constituency_name": "Chikkaballapur", "state": "Karnataka", "transparency_status": "Current", "mp_email": "m.moily@nic.in", "mp_image_url": "http://loksabhaph.nic.in/writereaddata/biodata/16/4437.jpg"},
    {"mp_name": "B. N. Chandrappa", "constituency_name": "Chitradurga (SC)", "state": "Karnataka", "transparency_status": "Current", "mp_email": "bn.chandrappa@nic.in", "mp_image_url": "http://loksabhaph.nic.in/writereaddata/biodata/16/4741.jpg"},
    {"mp_name": "Nalin Kumar Kateel", "constituency_name": "Dakshina Kannada", "state": "Karnataka", "transparency_status": "Current", "mp_email": "nalinkumar.kateel@nic.in", "mp_image_url": "http://loksabhaph.nic.in/writereaddata/biodata/16/4444.jpg"},
    {"mp_name": "P. C. Mohan", "constituency_name": "Bangalore Central", "state": "Karnataka", "transparency_status": "Missing", "mp_email": "pc.mohan@nic.in", "mp_image_url": "http://loksabhaph.nic.in/writereaddata/biodata/16/4447.jpg"},
    {"mp_name": "D. V. Sadananda Gowda", "constituency_name": "Bangalore North", "state": "Karnataka", "transparency_status": "Missing", "mp_email": "dvsadananda.gowda@nic.in", "mp_image_url": "http://loksabhaph.nic.in/writereaddata/biodata/16/4397.jpg"},
    {"mp_name": "D. K. Suresh", "constituency_name": "Bangalore Rural", "state": "Karnataka", "transparency_status": "Missing", "mp_email": "dk.suresh@nic.in", "mp_image_url": "http://loksabhaph.nic.in/writereaddata/biodata/16/4726.jpg"},
    {"mp_name": "Ananth Kumar", "constituency_name": "Bangalore South", "state": "Karnataka", "transparency_status": "Missing", "mp_email": "ananth.kumar@nic.in", "mp_image_url": "http://loksabhaph.nic.in/writereaddata/biodata/16/298.jpg"},
    {"mp_name": "Bhagwanth Khuba", "constituency_name": "Bidar", "state": "Karnataka", "transparency_status": "Missing", "mp_email": "bhagwanth.khuba@nic.in", "mp_image_url": "http://loksabhaph.nic.in/writereaddata/biodata/16/4736.jpg"},
    {"mp_name": "Ramesh Jigajinagi", "constituency_name": "Bijapur (SC)", "state": "Karnataka", "transparency_status": "Missing", "mp_email": "ramesh.jigajinagi@nic.in", "mp_image_url": "http://loksabhaph.nic.in/writereaddata/biodata/16/233.jpg"},
    {"mp_name": "Prakash Babanna Hukkeri", "constituency_name": "Chikkodi", "state": "Karnataka", "transparency_status": "Missing", "mp_email": "prakash.hukkeri@nic.in", "mp_image_url": "http://loksabhaph.nic.in/writereaddata/biodata/16/4738.jpg"},
    {"mp_name": "G. Mallikarjunappa", "constituency_name": "Davanagere", "state": "Karnataka", "transparency_status": "Current", "mp_email": "gm.mallikarjunappa@nic.in", "mp_image_url": "http://loksabhaph.nic.in/writereaddata/biodata/16/2753.jpg"},
    {"mp_name": "Prahlad Joshi", "constituency_name": "Dharwad", "state": "Karnataka", "transparency_status": "Current", "mp_email": "prahlad.joshi@nic.in", "mp_image_url": "http://loksabhaph.nic.in/writereaddata/biodata/16/4009.jpg"},
    {"mp_name": "H. D. Devegowda", "constituency_name": "Hassan", "state": "Karnataka", "transparency_status": "Current", "mp_email": "hd.devegowda@nic.in", "mp_image_url": "http://loksabhaph.nic.in/writereaddata/biodata/16/192.jpg"},

]

# --- Corrected Seeding Logic ---
try:
    for data in constituencies_data:
        existing_const = db.query(models.Constituency).filter(
            models.Constituency.constituency_name == data["constituency_name"]
        ).first()

        report_date = datetime.date.today() if data["transparency_status"] == "Current" else None

        if not existing_const:
            new_const = models.Constituency(
                mp_name=data["mp_name"],
                constituency_name=data["constituency_name"],
                state=data["state"],
                transparency_status=data["transparency_status"],
                last_report_date=report_date,
                mp_email=data["mp_email"],
                mp_image_url=data["mp_image_url"]
            )
            db.add(new_const)
            # --- THIS LINE IS FIXED ---
            print(f"  -> ADDING '{data['constituency_name']}' with status: {data['transparency_status']}")
        else:
            existing_const.mp_name = data["mp_name"]
            existing_const.mp_image_url = data["mp_image_url"]
            existing_const.mp_email = data["mp_email"]
            existing_const.transparency_status = data["transparency_status"]
            existing_const.last_report_date = report_date
            # --- THIS LINE IS FIXED ---
            print(f"  -> UPDATING '{data['constituency_name']}' with status: {data['transparency_status']}")
    
    db.commit()
    print("\nSeeding complete!")

except Exception as e:
    print(f"\nAN ERROR OCCURRED: {e}")
    print("-> Rolling back all changes.")
    db.rollback()
finally:
    db.close()