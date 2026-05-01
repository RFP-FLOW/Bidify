import fetch from "node-fetch";

/* =====================================================
   🔥 OPENROUTER FALLBACK
===================================================== */
const callOpenRouter = async (prompt) => {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/auto", // ✅ safe fallback
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    }
  );

  const data = await response.json();

  const text = data?.choices?.[0]?.message?.content;

  if (!text) {
    console.error("OpenRouter raw response:", data);
    throw new Error("No response from OpenRouter");
  }

  return text;
};

/* =====================================================
   GENERATE RFP (UNCHANGED LOGIC + FALLBACK)
===================================================== */
export const generateRFPWithAI = async (userPrompt) => {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
    process.env.GEMINI_API_KEY;

  const body = {
    contents: [
      {
        parts: [
          {
            text: `
You are an enterprise procurement assistant.

Return ONLY valid JSON.
No markdown.
No explanation.

{
  "title": "",
  "items": [
    {
      "name": "",
      "quantity": number,
      "specification": ""
    }
  ],
  "budget": null,
  "deadline": null,
  "paymentTerms": null,
  "warranty": null
}

User requirement:
${userPrompt}
`,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("Gemini raw response:", data);
      throw new Error("No response from Gemini");
    }

    const json = text.slice(
      text.indexOf("{"),
      text.lastIndexOf("}") + 1
    );

    return JSON.parse(json);

  } catch (err) {
    console.log("⚠️ Gemini failed → switching to OpenRouter");

    const fallbackText = await callOpenRouter(userPrompt);

    const json = fallbackText.slice(
      fallbackText.indexOf("{"),
      fallbackText.lastIndexOf("}") + 1
    );

    return JSON.parse(json);
  }
};


/* =====================================================
   COMPARE VENDORS (UNCHANGED LOGIC + FALLBACK)
===================================================== */
export const compareVendorsWithAI = async (prompt) => {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
    process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("Gemini raw response:", data);
      throw new Error("No response from Gemini");
    }

    let cleaned = text.trim();

    // Remove markdown if present
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/```json|```/g, "");
    }

    const jsonStart = cleaned.indexOf("{");
    const jsonEnd = cleaned.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      console.error("Invalid AI response:", cleaned);
      throw new Error("Invalid JSON from AI");
    }

    const finalJson = cleaned.substring(jsonStart, jsonEnd + 1);

    return JSON.parse(finalJson);

  } catch (err) {
    console.log("⚠️ Gemini failed → switching to OpenRouter");

    const fallbackText = await callOpenRouter(prompt);

    let cleaned = fallbackText.trim();

    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/```json|```/g, "");
    }

    const jsonStart = cleaned.indexOf("{");
    const jsonEnd = cleaned.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      console.error("Invalid OpenRouter response:", cleaned);
      throw new Error("Invalid JSON from OpenRouter");
    }

    const finalJson = cleaned.substring(jsonStart, jsonEnd + 1);

    return JSON.parse(finalJson);
  }
};