from typing import TypedDict, Optional, Any
from langgraph.graph import StateGraph, END
from .nodes import detect_intent_node, context_builder_node, llm_node

class ChatState(TypedDict):
    user_message: str
    is_authenticated: bool
    user: Optional[Any]
    intent: Optional[str]
    context: Optional[str]
    prompt: Optional[str]
    bot_reply: Optional[str]

def decide_flow(state: ChatState) -> str:
    if state.get("is_authenticated"):
        return "personalized"
    return "general"

def build_graph():
    graph = StateGraph(ChatState)
    
    # Add nodes
    graph.add_node("detect_intent", detect_intent_node)
    graph.add_node("context_builder", context_builder_node)
    graph.add_node("llm", llm_node)
    
    # Set entry point
    graph.set_entry_point("detect_intent")
    
    # Conditional Edges from detect_intent
    graph.add_conditional_edges(
        "detect_intent",
        decide_flow,
        {
            "personalized": "context_builder",
            "general": "llm"
        }
    )
    
    # Edges
    graph.add_edge("context_builder", "llm")
    graph.add_edge("llm", END)
    
    return graph.compile()

chatbot_graph = build_graph()
