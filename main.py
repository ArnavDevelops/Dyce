# Standard Library
import os

import oneai
from dotenv import load_dotenv

# Third-Party
import requests
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from transformers import AutoModelForCausalLM, AutoTokenizer
import uvicorn
import languagemodels as lm
import oneai

load_dotenv()

app = FastAPI()
lm.set_max_ram(os.getenv("MAX_RAM"))  # Ex: 4g or 512m


@app.get("/", response_class=HTMLResponse)
def read_root():
    with open(os.path.join(os.path.dirname(__file__), 'index.html'), 'r') as f:
        return f.read()


# API endpoint for generating text with context
@app.get("/generate/{prompt}/{context}")
def generate(prompt: str, context: str):
    text = lm.do(f"You have been provided the following context: {context} | Respond as helpfully as you can, "
                 f"remember to be very friendly| This is the user's prompt {prompt}")

    return {"text": text}


# API endpoint for generating text without context
@app.get("/generate/{prompt}")
def generate(prompt: str):
    text = lm.do(f"Respond as helpfully as you can | Remember to be very friendly, greeting the user | This is the "
                 f"user's prompt {prompt}")
    return {"text": text}


model_name = os.getenv("V2_MODEL_NAME")  # Ex: microsoft/DialoGPT-large
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Initialize chat history as an empty list
chat_history_ids = []


@app.get("/generate/v2/")
def generate_with_context(prompt: str):
    global chat_history_ids  # Use the global chat history variable

    text = prompt
    input_ids = tokenizer.encode(text + tokenizer.eos_token, return_tensors='pt')

    # Generate the model's response
    response_ids = model.generate(
        input_ids,
        max_length=4096,
        do_sample=True,
        top_k=100,
        temperature=0.25,
        pad_token_id=tokenizer.eos_token_id
    )

    # Update the chat history with both the input and response
    chat_history_ids.extend(input_ids.tolist()[0])
    chat_history_ids.extend(response_ids.tolist()[0])

    # Decode the response and return
    output = tokenizer.decode(response_ids[:, input_ids.shape[-1]:][0], skip_special_tokens=True)
    return {"text": output}


@app.get("/generate/v3/")
def generate_with_context(prompt: str, context: str):
    # This uses OneAI's API (https://oneai.com/), using the GPT Skill.

    api_key = os.getenv("ONEAI_API_KEY")
    url = "https://api.oneai.com/api/v0/pipeline"

    if len(prompt) > int(os.getenv("MAX_PROMPT_LENGTH")):
        return {"text": "Prompt is too long, please keep it under 250 characters >:("}

    headers = {
        "api-key": api_key,
        "content-type": "application/json"
    }

    payload = {
        "input": prompt,
        "input_type": "article",
        "output_type": "json",
        "multilingual": {
            "enabled": True
        },
        "steps": [
            {
                "skill": "gpt",
                "params": {
                    "gpt_engine": "text-davinci-003",
                    "prompt_position": "start",
                    "temperature": 0,
                    "prompt": context
                }
            }
        ],
    }

    response = requests.post(url, headers=headers, json=payload)
    data = response.json()
    return {"text": data["output"][0]["contents"][0]["utterance"]}


@app.get("/generate/v3/nocontext/")
def generate_without_context(prompt: str):
    # This uses OneAI's API (https://oneai.com/), using the GPT Skill.

    api_key = os.getenv("ONEAI_API_KEY")
    url = "https://api.oneai.com/api/v0/pipeline"

    if len(prompt) > int(os.getenv("MAX_PROMPT_LENGTH")):
        return {"text": "Prompt is too long, please keep it under 250 characters >:("}

    headers = {
        "api-key": api_key,
        "content-type": "application/json"
    }

    payload = {
        "input": prompt,
        "input_type": "article",
        "output_type": "json",
        "multilingual": {
            "enabled": True
        },
        "steps": [
            {
                "skill": "gpt",
                "params": {
                    "gpt_engine": "text-davinci-003",
                    "prompt_position": "start",
                    "temperature": 0,
                    "prompt": "Respond as helpfully as you can | Remember to be very friendly, greeting the user"
                }
            }
        ],
    }

    response = requests.post(url, headers=headers, json=payload)
    data = response.json()
    return {"text": data["output"][0]["contents"][0]["utterance"]}


@app.get("/generate/v3/conversation/")  # conversation is provided in the body, rather than the URL
def generate_conversation(prompt: str, preprompt: str, context: str):
    api_key = os.getenv("ONEAI_API_KEY")
    oneai.api_key = api_key

    if len(prompt) > int(os.getenv("MAX_PROMPT_LENGTH")) or len(preprompt) > int(
            os.getenv("MAX_PROMPT_LENGTH")):
        return {"text": "Prompt is too long, please keep it under 250 characters >:("}

    pipeline = oneai.Pipeline(
        steps=[
            oneai.skills.GPT(
                prompt_position="start",
                prompt=context,
                gpt_engine="text-davinci-003",
                temperature=0
            )
        ]
    )

    conversation = f"""
    You: {preprompt}
    User: {prompt}
    You:"""

    response = pipeline.run(conversation)
    return {"text": response.gpt_text.text}

# Run the API
if __name__ == "__main__":
    print("Running API...")
    uvicorn.run(app, host="0.0.0.0", port=8000)