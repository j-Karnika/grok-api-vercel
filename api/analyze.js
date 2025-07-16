const { Groq } = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { body } = req.body;

  if (!body || body.trim() === "") {
    return res.status(400).json({ error: "Missing 'body' field in request" });
  }

  const prompt = `
You will be given a piece of text. If the text appears to be source code (in any programming language), do the following:

1. Briefly describe what the code does in simple terms.
2. Rewrite the same code with inline comments explaining each important line or block.

If the input is NOT code (e.g., plain text, HTML content, or natural language), respond only with:
NO

Here is the input:

"""
${body}
"""
`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8
    });

    return res.status(200).json({
      result: response.choices[0].message.content.trim()
    });
  } catch (error) {
    console.error("Groq API error:", error);
    return res.status(500).json({ error: "Groq API call failed" });
  }
};