import fetch from "node-fetch";

export const generateRFPWithAI = async (userPrompt) => {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
    process.env.GEMINI_API_KEY;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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
    }),
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
};
