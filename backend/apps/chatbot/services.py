import os
import traceback
from django.conf import settings
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

VECTOR_STORE_DIR = os.path.join(settings.BASE_DIR, "chroma_db")

_vector_store = None
_llm = None


def get_vector_store():
    global _vector_store
    if _vector_store is None:
        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        _vector_store = Chroma(
            persist_directory=VECTOR_STORE_DIR,
            embedding_function=embeddings,
            collection_name="stocks",
        )
    return _vector_store


def get_llm():
    global _llm
    if _llm is None:
        groq_api_key = os.getenv("Groq_API_Key")
        if not groq_api_key:
            raise ValueError("Groq_API_Key not found in environment.")
        _llm = ChatGroq(
            temperature=0.2,
            groq_api_key=groq_api_key,
            model_name="llama-3.1-8b-instant",
        )
    return _llm


def format_docs(docs):
    """Format retrieved documents into a single context string."""
    return "\n\n".join(doc.page_content for doc in docs)


def get_user_portfolio_context(user):
    from apps.portfolio.models import Portfolio
    from apps.stocks.models import StockPrice

    portfolios = Portfolio.objects.filter(user=user).prefetch_related(
        "holdings__stock"
    )
    if not portfolios.exists():
        return "The user currently has no active portfolios."

    context = "User's Portfolios:\n"
    for p in portfolios:
        holdings = p.holdings.all()
        total_val = 0
        holding_details = ""
        for h in holdings:
            latest = StockPrice.objects.filter(stock=h.stock).first()
            price = float(latest.close) if latest else 0
            val = float(h.quantity) * price
            total_val += val
            holding_details += (
                f"    - {h.stock.symbol}: {h.quantity} shares @ ₹{price:.2f}\n"
            )
        context += (
            f"- Portfolio: {p.name}\n"
            f"  Goal: {p.description or 'None'}\n"
            f"  Total Value: ₹{total_val:,.2f}\n"
            f"  Holdings ({holdings.count()} stocks):\n{holding_details}"
        )
    return context


def process_chat_message(message: str, user=None) -> str:
    try:
        llm = get_llm()
        vector_store = get_vector_store()
        retriever = vector_store.as_retriever(search_kwargs={"k": 5})

        system_text = (
            "You are QuantVista AI, an expert financial advisor and stock market assistant. "
            "Use the provided context from our stock database to answer the user's questions. "
            "If you don't know the answer, say so honestly. Be polite, professional, and concise. "
            "Do not give explicit financial advice to buy/sell without appropriate risk warnings.\n\n"
            "Stock Database Context:\n{context}\n\n"
        )

        if user:
            portfolio_info = get_user_portfolio_context(user)
            system_text += (
                f"The user is authenticated. Here is their portfolio data:\n"
                f"{portfolio_info}\n\n"
            )

        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", system_text),
                ("human", "{question}"),
            ]
        )

        # Build LCEL chain: retrieve docs → format → prompt → llm → parse
        rag_chain = (
            {"context": retriever | format_docs, "question": RunnablePassthrough()}
            | prompt
            | llm
            | StrOutputParser()
        )

        response = rag_chain.invoke(message)
        return response
    except Exception:
        traceback.print_exc()
        return (
            "I'm sorry, I encountered an internal error connecting to my "
            "analytical engines. Please try again later."
        )
