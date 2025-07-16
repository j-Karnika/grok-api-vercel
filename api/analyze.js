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
You will be given some text input.
If the text is programming code, configuration files, markup language like XML, or hardware description/constraint files (like VHDL, Verilog, pin mappings), provide a brief description of its purpose and structure, and rewrite with inline comments. If the input is pure prose, return NO.

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