const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-3.5-flash-lite';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

async function generateTasksForProject({ projectName, projectDescription }) {
  if (!GEMINI_API_KEY) {
    throw new Error('AI feature is not configured. Add GEMINI_API_KEY to your .env file.');
  }

  const prompt = `You are helping a software team plan work for a project.

Project name: "${projectName}"
Project description: "${projectDescription || 'No description provided.'}"

Suggest 5 concrete, actionable tasks a developer could start working on for this project.
Respond ONLY with a JSON array, no other text, in this exact shape:
[
  { "title": "short task title", "priority": "Low" | "Medium" | "High" }
]`;

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`AI request failed: ${errorBody}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('AI did not return any suggestions.');
  }

  return JSON.parse(rawText);
}

module.exports = { generateTasksForProject };