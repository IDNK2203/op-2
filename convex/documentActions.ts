"use node";

import { ConvexError, v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { GoogleGenAI } from "@google/genai";
import { createEmbedding } from "./notes";

// lib/pdf-processors.ts
export async function processWithGoogleDocumentAI(file: Blob) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // Call your custom API route that handles Google Document AI
    const response = await fetch(`${process.env.HOST}/api/process-pdf`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to process PDF with Google Document AI");
    }

    const result = await response.json();
    return result.text;
  } catch (error) {
    console.error("Google Document AI processing failed:", error);
    throw error;
  }
}

// Updated file handling helpers
export async function getFileText(file: Blob) {
  if (await isPdf(file)) {
    console.log("Processing PDF with external service...");
    return await extractTextFromPdf(file);
  } else {
    console.log("Processing plain text...");
    const text = await file.text();
    return text;
  }
}

export async function extractTextFromPdf(file: Blob) {
  try {
    // Try Google Document AI first
    return await processWithGoogleDocumentAI(file);
  } catch (error) {
    console.error("External PDF processing failed:", error);

    // Fallback message
    return `
      PDF File Uploaded (${Math.round(file.size / 1024)}KB)
      
      PDF processing temporarily unavailable.
      
      For immediate use:
      • Convert PDF to text format
      • Copy and paste content manually  
      • Upload as .txt file
      
      We'll process this PDF automatically once our service is restored.
    `;
  }
}

async function isPdf(file: Blob) {
  if (file.type) {
    return file.type === "application/pdf";
  }

  try {
    const firstBytes = await file.stream().getReader().read();
    if (firstBytes.value) {
      const decoder = new TextDecoder();
      const header = decoder.decode(firstBytes.value.slice(0, 8));
      return header.startsWith("%PDF-");
    }
  } catch (error) {
    console.error("Error checking file type:", error);
  }

  return false;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const createEmbeddingIntAction = internalAction({
  args: {
    storageId: v.id("_storage"),
    docId: v.id("document"),
  },
  handler: async (ctx, args) => {
    const file = await ctx.storage.get(args.storageId);

    if (!file) throw new ConvexError("file not found");

    const text = await getFileText(file);

    console.log("text-length", text.length);
    console.log("text", text);
    const embedding = await createEmbedding(text, "SEMANTIC_SIMILARITY");
    if (!embedding) {
      throw new ConvexError("Failed to create embedding");
    }
    await ctx.runMutation(internal.documents.updateDocwithEmbedding, {
      embedding,
      docId: args.docId,
    });
  },
});

export const generateDescription = internalAction({
  args: {
    storageId: v.id("_storage"),
    docId: v.id("document"),
  },
  handler: async (ctx, args) => {
    const file = await ctx.storage.get(args.storageId);

    if (!file) throw new ConvexError("file not found");

    const text = await getFileText(file);
    console.log("text", text);
    console.log("text-length", text.length);

    const contentParams = `using the content from the file below generate a short one sentence description for it

      File CONTENT:

      ${text},
      `;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contentParams,
    });

    const description = response.text;

    if (!description) {
      throw new ConvexError("Failed to generate description");
    }

    await ctx.runMutation(internal.documents.updateDocDescription, {
      id: args.docId,
      description: description,
    });
  },
});

export const askDocument = action({
  args: {
    documentId: v.id("document"),
    question: v.string(),
  },
  async handler(ctx, args) {
    const accessObj = await ctx.runQuery(
      internal.documents.hasAccessToDocumentQuery,
      { documentId: args.documentId }
    );

    if (!accessObj) return null;
    const { doc } = accessObj;
    if (!doc) throw new ConvexError("Document not found");

    const file = await ctx.storage.get(doc.storageId);

    if (!file) throw new ConvexError("file not found");

    const text = await getFileText(file);
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: [
        {
          role: "user",
          parts: [
            {
              text: `Answer the following questions using this text file as context
              `,
            },
          ],
        },
        {
          role: "model",
          parts: [{ text: `Here is a text file ${text}` }],
        },
      ],
    });

    const result = await chat.sendMessage({
      message: `question: ${args.question}`,
    });
    const textRes = result.text;

    if (!textRes) {
      throw new ConvexError("Failed to generate response");
    }

    // store user prompt as a chat record
    await ctx.runMutation(internal.chats.createChat, {
      documentId: args.documentId,
      role: "user",
      text: args.question,
    });

    // store model response as a chat record
    await ctx.runMutation(internal.chats.createChat, {
      documentId: args.documentId,
      role: "model",
      text: textRes,
    });

    return textRes;
  },
});
