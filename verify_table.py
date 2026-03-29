import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.db import connection

cursor = connection.cursor()
cursor.execute("SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='portfolio_holding')")
exists = cursor.fetchone()[0]
print(f"✓ portfolio_holding table exists: {exists}")

# Also check if we can count the holdings
try:
    cursor.execute("SELECT COUNT(*) FROM portfolio_holding")
    count = cursor.fetchone()[0]
    print(f"✓ Holding records in table: {count}")
except Exception as e:
    print(f"✗ Error checking holdings: {e}")
