import os
from django.core.management.base import BaseCommand
from django.conf import settings
from apps.stocks.models import StockMaster, StockPrice
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document


class Command(BaseCommand):
    help = "Ingests StockMaster data into ChromaDB for LangChain RAG"

    def handle(self, *args, **options):
        self.stdout.write("Initializing embedding model (all-MiniLM-L6-v2)...")
        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

        VECTOR_STORE_DIR = os.path.join(settings.BASE_DIR, "chroma_db")
        vector_store = Chroma(
            persist_directory=VECTOR_STORE_DIR,
            embedding_function=embeddings,
            collection_name="stocks",
        )

        stocks = StockMaster.objects.all()
        documents = []

        self.stdout.write(f"Preparing {stocks.count()} stocks for ingestion...")
        for stock in stocks:
            # Get the latest price for this stock
            latest_price = StockPrice.objects.filter(stock=stock).first()
            price_str = f"{latest_price.close}" if latest_price else "N/A"
            volume_str = f"{latest_price.volume}" if latest_price else "N/A"

            content = (
                f"Stock Symbol: {stock.symbol}\n"
                f"Company Name: {stock.name}\n"
                f"Market/Exchange: {stock.market}\n"
                f"Sector: {stock.sector or 'Unknown'}\n"
                f"P/E Ratio: {stock.pe_ratio or 'N/A'}\n"
                f"52-Week High: {stock.high_52week or 'N/A'}\n"
                f"52-Week Low: {stock.low_52week or 'N/A'}\n"
                f"Latest Close Price: {price_str}\n"
                f"Latest Volume: {volume_str}\n"
            )
            doc = Document(
                page_content=content,
                metadata={
                    "symbol": stock.symbol,
                    "name": stock.name,
                    "sector": stock.sector or "Unknown",
                },
            )
            documents.append(doc)

        if documents:
            self.stdout.write(
                "Adding documents to ChromaDB... (This may take a moment)"
            )
            vector_store.add_documents(documents)
            self.stdout.write(
                self.style.SUCCESS(
                    f"Successfully ingested {len(documents)} stocks into local VectorDB!"
                )
            )
        else:
            self.stdout.write(
                self.style.WARNING("No stocks found in database to ingest.")
            )
