// "use node";

// "platform: 'node'";

import pdf from "pdf-parse";
export async function getFileText(file: Blob) {
  if (await isPdf(file)) {
    console.log("Processing PDF...");
    return await extractTextFromPdf(file);
  } else {
    console.log("Processing plain text...");
    const text = await file.text(); // No extraction needed
    return text;
  }
}

export async function extractTextFromPdf(file: Blob) {
  const buffer = await file.arrayBuffer();
  const data = await pdf(Buffer.from(buffer));
  return data.text; // This is only the plain text, no binary
}

async function isPdf(file: Blob) {
  // Check MIME type from File object
  if (file.type) {
    return file.type === "application/pdf";
  }

  // Otherwise, check first few bytes
  const firstBytes = await file.stream().getReader().read();
  const decoder = new TextDecoder();
  const header = decoder.decode(firstBytes.value).slice(0, 8);
  return header.startsWith("%PDF-");
}
