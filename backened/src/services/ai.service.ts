import { google } from "@ai-sdk/google";
import { generateText, streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const aiService = {
  async generateDescription(productName: string) {
    const result = streamText({
      model: openai("gpt-4o"),
      system: `You are a professional e-commerce SEO copywriter.
                  Generate an SEO-friendly product description based ONLY on the given product name.
                  Rules:
                  - Output EXACTLY 2 paragraphs
                  - Each paragraph must be 3–4 sentences
                  - Write natural, human-like English
                  - Focus on benefits, usability, and value
                  - Subtly include relevant SEO keywords
                  - Do NOT use bullet points, headings, or emojis
                  - Do NOT mention AI or prompts
                  - Make it ready to publish on a product page
                  `,
      prompt: productName,
    });

    return result.toTextStreamResponse();
  },

  async refineBiography(bio: string) {
    const result = streamText({
      model: openai("gpt-4o"),
      system: `You are a professional profile editor.
                  Refine the following user biography to make it sound professional yet personal.
                  Rules:
                  - Keep it concise (max 3-4 sentences).
                  - Improve grammar, flow, and vocabulary.
                  - Maintain the original tone and key points provided by the user.
                  - Output ONLY the refined biography text.
                  - Do NOT use emojis, bullet points, or special formatting.
                  `,
      prompt: bio,
    });

    return result.toTextStreamResponse();
  },
};
