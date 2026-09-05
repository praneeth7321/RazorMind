from ollama import chat
import json
import time


def analyze_payment(risk_score, risk_factors):
    print("Calling Ollama...")
    start = time.time()

    prompt = f"""
You are RazorMind AI, an expert fraud detection system.

Analyze the following payment.

Risk Score:
{risk_score}

Risk Factors:
{risk_factors}

Rules:
1. Choose one decision: APPROVE, REVIEW, or BLOCK.
2. Confidence must be an integer between 0 and 100.
3. Reason must explain WHY you chose the decision.
4. Recommended action must tell what to do next.
5. Return ONLY valid JSON.
6. Do NOT use markdown or code blocks.

Example:

{{
    "decision": "REVIEW",
    "confidence": 82,
    "reason": "Transaction originates from a new device at an unusual hour with medium fraud risk.",
    "recommended_action": "Request additional verification before approving."
}}
"""

    response = chat(
        model="llama3.2:latest",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    end = time.time()
    print(f"Ollama responded in {end-start:.2f} seconds")

    content = response["message"]["content"].strip()

    # Remove markdown if present
    if content.startswith("```json"):
        content = content.replace("```json", "", 1)

    if content.startswith("```"):
        content = content.replace("```", "", 1)

    if content.endswith("```"):
        content = content[:-3]

    content = content.strip()

    print("AI Response:")
    print(content)

    return json.loads(content)