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
You will be given a piece of text. Determine its type and act accordingly:

If the text is source code (any programming, scripting, or hardware description language), provide:

A brief explanation of what the code does.

The same code rewritten with inline comments explaining key parts.

If the text is configuration, markup, or metadata (like XML, JSON, YAML, or hardware configuration), provide:

A brief description of its structure and purpose.

The annotated configuration/markup with inline comments for important fields.

If the text is neither of the above (e.g., plain text, general descriptions, etc.), simply respond with: NO, 
Here is the input.
"""
${body}
"""
`;

  try {
    const response = await groq.chat.completions.create({
      // model: "llama3-70b-8192",
      model: "moonshotai/kimi-k2-instruct",
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