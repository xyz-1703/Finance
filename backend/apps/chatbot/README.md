# Chatbot Implementation Details

The chatbot in this project is designed to act as an expert financial advisor and stock market assistant. It leverages a combination of Large Language Models (LLMs), vector databases, and Retrieval-Augmented Generation (RAG) to provide informed and personalized responses.

## Core Components

1.  **Large Language Model (LLM):**
    *   **Provider:** Groq
    *   **Model:** `llama-3.1-8b-instant`
    *   **Integration:** Handled by `ChatGroq` from the `langchain_groq` library.
    *   **Purpose:** Generates human-like text responses based on the provided context and prompts.

2.  **Vector Database:**
    *   **Technology:** Chroma (`langchain_chroma`)
    *   **Embeddings:** Generated using `HuggingFaceEmbeddings` (`langchain_huggingface`).
    *   **Location:** The vector store data is persisted in the `backend/chroma_db` directory.
    *   **Purpose:** Stores vectorized representations of the stock database content, enabling efficient semantic search and retrieval of relevant information.

3.  **Retrieval-Augmented Generation (RAG) Chain:**
    *   **Framework:** LangChain Expression Language (LCEL)
    *   **Workflow:**
        1.  **Retrieval:** When a user submits a query, the system first retrieves the top 5 most relevant documents from the Chroma vector store based on the query's semantic similarity.
        2.  **Context Formatting:** The retrieved documents are formatted into a concise context string.
        3.  **Prompt Construction:** The formatted context is then combined with a predefined system prompt and the user's original question.
        4.  **LLM Invocation:** The complete prompt is sent to the `llama-3.1-8b-instant` LLM via `ChatGroq`.
        5.  **Output Parsing:** The LLM's raw output is parsed into a clean string response.

## Prompting Strategy

The chatbot uses a `ChatPromptTemplate` to guide the LLM's behavior and ensure relevant, safe, and personalized interactions.

### System Prompt

The system prompt defines the chatbot's persona, capabilities, and constraints:

```
"You are QuantVista AI, an expert financial advisor and stock market assistant. "
"Use the provided context from our stock database to answer the user's questions. "
"If you don't know the answer, say so honestly. Be polite, professional, and concise. "
"Do not give explicit financial advice to buy/sell without appropriate risk warnings.\n\n"
"Stock Database Context:\n{context}\n\n"
```

**Key Directives:**
*   **Persona:** "expert financial advisor and stock market assistant."
*   **Knowledge Source:** "Use the provided context from our stock database."
*   **Honesty:** "If you don't know the answer, say so honestly."
*   **Tone:** "Be polite, professional, and concise."
*   **Safety:** "Do not give explicit financial advice to buy/sell without appropriate risk warnings."

### Personalized Context

If the user is authenticated, their specific portfolio data is dynamically injected into the system prompt, allowing the chatbot to provide tailored advice and insights:

```
f"The user is authenticated. Here is their portfolio data:\n"
f"{portfolio_info}\n\n"
```

### Human Prompt

This is a placeholder for the user's input:

```
"{question}"
```

## File Location

The core logic for the chatbot, including the RAG chain and prompting, is located in:
`backend/apps/chatbot/services.py`

The API endpoints for interacting with the chatbot are defined in:
`backend/apps/chatbot/views.py`
