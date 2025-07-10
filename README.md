# Groq API Vercel Server

A simple Vercel-deployable serverless API to process code using Groq's LLaMA 3 model.

## Endpoint

`POST /api/analyze`

### Request body:

```json
{
  "body": "<your code or content>"
}
