#!/usr/bin/env python
import os
import sys
import django

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.portfolio.models import Portfolio

portfolios_data = [
    {
        'name': 'Conservative Growth',
        'description': 'Low-risk portfolio focused on dividend-paying stocks and stable growth. Ideal for risk-averse investors.',
        'is_default': True,
        'target_allocation': {
            'Large Cap': 50,
            'Mid Cap': 30,
            'Small Cap': 10,
            'Bonds': 10
        }
    },
    {
        'name': 'Balanced Portfolio',
        'description': 'A balanced mix of growth and value stocks with moderate risk. Recommended for most investors.',
        'is_default': True,
        'target_allocation': {
            'Large Cap': 40,
            'Mid Cap': 35,
            'Small Cap': 20,
            'International': 5
        }
    },
    {
        'name': 'Aggressive Growth',
        'description': 'High-growth portfolio focused on emerging sectors and small-cap stocks. For experienced, risk-tolerant investors.',
        'is_default': True,
        'target_allocation': {
            'Tech & Innovation': 40,
            'Mid Cap': 35,
            'Small Cap': 20,
            'Emerging Markets': 5
        }
    },
    {
        'name': 'Index Tracker',
        'description': 'Follows market indices with low fees. Passive investment strategy for long-term wealth building.',
        'is_default': True,
        'target_allocation': {
            'Nifty 50': 50,
            'Nifty Next 50': 30,
            'Bank Nifty': 20
        }
    },
    {
        'name': 'Dividend Harvester',
        'description': 'Portfolio of high dividend-yielding stocks for regular income. Suitable for investors seeking cash flow.',
        'is_default': True,
        'target_allocation': {
            'Blue Chip': 50,
            'Dividend Stocks': 40,
            'REITs & InvITs': 10
        }
    },
]

print("Seeding default portfolios...")
for pdata in portfolios_data:
    p, created = Portfolio.objects.get_or_create(
        name=pdata['name'],
        user=None,
        defaults={
            'description': pdata['description'],
            'is_default': pdata['is_default'],
            'target_allocation': pdata['target_allocation'],
        }
    )
    status = 'Created' if created else 'Already exists'
    print(f"✓ {status}: {p.name}")

print("\n✓ All default portfolios seeded successfully!")
