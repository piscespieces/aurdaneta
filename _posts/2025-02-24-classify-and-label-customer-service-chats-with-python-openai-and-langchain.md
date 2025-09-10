---
layouts: post
title: Classify & Label Customer Service Chats with Python, OpenAI and Langchain
description: LLMs with Structured Outputs make classifying and labeling text incredibly easy. Today, we’ll write a script to do exactly that—classifying a customer service chat.
date: 2025-02-24 11:00:00 +0300
image: '/images/thumbnail-classify.png'
tags: [AI]
---

We’ll extract and label key details from the chat, including the user’s name, sentiment, language, and the topic of their conversation with a customer service representative.

Before jumping into the code, let’s review the tools and requirements:

1. Python installed locally
2. OpenAI API Key
3. A text file containing the conversation between the representative and the client

## Create The Project Directory
Now, let’s go ahead and create our project directory and `cd` into it.

```bash
mkdir text_classification && cd text_classification
```

Let’s make sure we’ve got our tools and project prepped. So let’s create the entry point file of the project within the root directory

```bash
touch main.py
```

Now, create a virtual environment to keep our dependencies contained so they don’t mess with system-wide Python packages, and then activate it.

```bash
python -m venv .venv
source .venv/bin/activate
```

## Installing Dependencies
With our virtual environment in place, let’s go ahead and install our dependencies. I’m using pipso I’ll run the following command in my project terminal

- `pydantic`, a widely used Python validation library. It will let us declare the schema of the structured output response we expect from the LLM.
- `langchain` , is a framework and package that makes it easier to work with LLMs in Python.
- `langchain-openai`, a Langchain package that provides seamless integration with OpenAI’s models.

I’m using `pip` to install these dependencies so I’ll run the following command in my project terminal:

```bash
pip install pydantic langchain langchain-openai
```

## ENVs & Chat Text File
Great! Now that we've installed our dependencies, let's create a .env file to store our OpenAI API key.

```
OPENAI_API_KEY=sk….
```

And before finally getting our hands dirty, let’s not forget about the chat data!

I exported a conversation between a customer service representative and a customer from WhatsApp into a text file.

You can use [my sample chat file](https://conversalo.nyc3.cdn.digitaloceanspaces.com/chat.txt) or bring your own.

I’ll drop the text file in the project’s root directory, so we can later pass the contents of that file to the LLM.

# Getting Started
Now that everything’s set up, it’s time to crack open `main.py` and get coding.

First things first, let’s make sure the OpenAI API key is actually set—otherwise we won’t get LLM responses.

```python
import os

if not os.getenv("OPENAI_API_KEY"):
   raise ValueError("OPENAI_API_KEY is not set")
```

Then, let’s run in our terminal the following command:

```
python main.py
```

If no errors pop up, you're good to go.

But in case you get an error, try closing and re-opening your terminal. A new terminal will load your variables in the `.env` file.

Next, let’s import the other modules we’re going to need for this script

```python
from pydantic import BaseModel, Field
from langchain.chat_models import init_chat_model
```

## The Classification Schema
Now let’s see the meat and potatoes of this classification and labeling script.

We’ll use Pydantic to define a Classification class that serves as the schema we’ll pass later on to the LLM so it knows what information to extract and label from the chat.

```python
class Classification(BaseModel):
   name: str = Field(description=“The name of the user”)
   sentiment: str = Field(
       description="The sentiment of the user",
       enum=["positive", "negative", "neutral"],
     )
   language: str = Field(
       description="The language of the user",
       enum=["spanish", "english"],
   )
   issue: str = Field(
       description="The issue of the user",
       enum=["technical", "billing", "account", "other"],
   )
```

As you can see, the schema’s `name` field only has a `description` attribute that specifies to get the client’s name. However, the other fields also include an `enum`.

The reason for adding enum to some fields is to make sure the model classifies only within predefined categories, reducing ambiguity and making the data easier to store and analyze.

## Structured Outputs
Now, let’s create a chat model. We’ll use the `with_structured_output` to pass our `Classification` schema.

Under the hood, Langchain’s with_structured_output method makes sure the LLM has Structured Output enabled.

```python
llm = init_chat_model("gpt-4o-mini", model_provider="openai").with_structured_output(Classification)
```

Next, we’ll save the chat contents from `chat.txt` and create a full prompt for the LLM.

```python
with open("chat.txt", "r") as f:
   chat_text = f.read()

prompt = """Extract the desired information from the following chat.
Only extract the properties mentioned in the 'Classification' function.
Conversation:\n"""
```

Finally, let’s invoke the LLM with our prompt and chat text contents and print the results

```python
response = llm.invoke(prompt + chat_text)
print(response)
```

In our terminal, let’s run the script

```bash
> python main.py
name='Andres Urdaneta' sentiment='neutral' language='spanish' issue='other'
```

## Wrap-up & Next Steps
And there you have it—a fully functional script that classifies and labels customer service chats using Python, OpenAI API, and Langchain!

With just a few lines of code, we structured an unorganized conversation into clear, actionable data.

This setup can serve as the foundation for automating customer insights, building smarter chatbots, or even integrating AI-driven analytics into your workflow.

Try tweaking the classification schema, adding more categories, or even chaining multiple prompts together, and have fun!
