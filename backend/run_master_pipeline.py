"""
Master script to:
1. Fetch 5 years of historical news for all 50 stocks
2. Calculate impact scores for all events
"""
import subprocess
import sys
import time
from datetime import datetime

print("=" * 80)
print("MASTER PIPELINE: Historical News Fetch + Impact Score Calculation")
print("=" * 80)
print(f"Start time: {datetime.now()}")
print("\nThis will take several hours (estimated: 6-10 hours)")
print("\n" + "=" * 80)

# Step 1: Fetch historical news
print("\nSTEP 1/2: Fetching 5 years of historical news for 50 stocks")
print("-" * 80)
start_time = time.time()

result = subprocess.run(
    [sys.executable, "fetch_all_historical.py"],
    cwd=r"D:\DSFM\dashboard\backend"
)

fetch_time = time.time() - start_time
print(f"\nFetch completed in {fetch_time/3600:.2f} hours")

if result.returncode != 0:
    print("❌ Fetch failed! Check fetch_error.txt for details")
    sys.exit(1)

# Step 2: Calculate impact scores
print("\n" + "=" * 80)
print("STEP 2/2: Calculating impact scores for all events")
print("-" * 80)
start_time = time.time()

result = subprocess.run(
    [sys.executable, "calculate_impact_scores.py"],
    cwd=r"D:\DSFM\dashboard\backend"
)

impact_time = time.time() - start_time
print(f"\nImpact calculation completed in {impact_time/3600:.2f} hours")

if result.returncode != 0:
    print("❌ Impact calculation failed!")
    sys.exit(1)

# Done!
print("\n" + "=" * 80)
print("✅ PIPELINE COMPLETE!")
print("=" * 80)
print(f"Total time: {(fetch_time + impact_time)/3600:.2f} hours")
print(f"End time: {datetime.now()}")
print("\nYou can now view news markers on the charts!")
print("=" * 80)
