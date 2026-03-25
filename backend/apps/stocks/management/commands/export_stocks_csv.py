from django.core.management.base import BaseCommand
from django.db import transaction
import csv
from pathlib import Path
from apps.stocks.models import StockMaster, StockPrice


class Command(BaseCommand):
    help = "Export StockMaster and StockPrice data to CSV files."

    def add_arguments(self, parser):
        parser.add_argument(
            "--limit",
            type=int,
            default=0,
            help="Limit to first N stocks (0 = all)",
        )
        parser.add_argument(
            "--output-dir",
            type=str,
            default="./exports",
            help="Directory where CSV files will be written",
        )

    def handle(self, *args, **options):
        limit = options["limit"]
        out_dir = Path(options["output_dir"]).expanduser().resolve()
        out_dir.mkdir(parents=True, exist_ok=True)

        self.stdout.write(f"Exporting stocks to {out_dir} (limit={limit})...")

        # Export StockMaster
        qs = StockMaster.objects.all().order_by("symbol")
        if limit and limit > 0:
            qs = qs[:limit]

        master_file = out_dir / "stock_master.csv"
        with master_file.open("w", newline='', encoding="utf-8") as mf:
            writer = csv.writer(mf)
            writer.writerow(["id", "symbol", "name", "market", "sector", "pe_ratio", "high_52week", "low_52week"]) 
            for s in qs.iterator():
                writer.writerow([
                    s.id,
                    s.symbol,
                    s.name,
                    s.market,
                    s.sector or "",
                    str(s.pe_ratio) if s.pe_ratio is not None else "",
                    str(s.high_52week) if s.high_52week is not None else "",
                    str(s.low_52week) if s.low_52week is not None else "",
                ])

        self.stdout.write(self.style.SUCCESS(f"Wrote {master_file}"))

        # Export StockPrice for selected stocks
        stock_ids = list(qs.values_list("id", flat=True))
        prices_file = out_dir / "stock_prices.csv"
        with prices_file.open("w", newline='', encoding="utf-8") as pf:
            writer = csv.writer(pf)
            writer.writerow(["id", "stock_id", "symbol", "timestamp", "open", "high", "low", "close", "volume"]) 

            # Use iterator to avoid loading all rows at once
            price_qs = StockPrice.objects.filter(stock_id__in=stock_ids).select_related("stock").order_by("stock_id", "timestamp")
            for p in price_qs.iterator():
                writer.writerow([
                    p.id,
                    p.stock_id,
                    p.stock.symbol if p.stock_id else "",
                    p.timestamp.isoformat(),
                    str(p.open),
                    str(p.high),
                    str(p.low),
                    str(p.close),
                    str(p.volume),
                ])

        self.stdout.write(self.style.SUCCESS(f"Wrote {prices_file}"))

        self.stdout.write(self.style.SUCCESS("Export complete."))
