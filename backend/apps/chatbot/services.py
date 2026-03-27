import os
from openai import OpenAI

def ask_llm(prompt: str) -> str:
    """
    Sends a prompt to Groq (using Llama-3.3-70b) via the OpenAI-compatible API.
    """
    # Look for Groq API Key
    groq_key = os.getenv("Groq_API_Key") or os.getenv("GROQ_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")

    if groq_key:
        try:
            # Groq uses an OpenAI-compatible client
            client = OpenAI(
                base_url="https://api.groq.com/openai/v1",
                api_key=groq_key
            )
            
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are a professional financial assistant for QuantVista. Always be concise and limit your responses to a maximum of 3 sentences."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            if response and response.choices:
                return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Groq API Error: {str(e)}")
            # Fallback to OpenAI if Groq fails
            if openai_key:
                print("Falling back to OpenAI...")
            else:
                return f"Groq Service Error: {str(e)}"

    # Secondary Fallback to OpenAI (GPT-4o-mini)
    if openai_key:
        try:
            client = OpenAI(api_key=openai_key)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a professional financial assistant for QuantVista. Always be concise and limit your responses to a maximum of 3 sentences."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"Dual API Error: Both Groq and OpenAI failed. Details: {str(e)}"

    return "API Key Error: No valid Groq_API_Key or OPENAI_API_KEY found in .env."
