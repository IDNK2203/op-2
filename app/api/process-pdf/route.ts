// app/api/process-pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import PdfParse from "pdf-parse";

// // Option A: Using PDF.co (has free tier)
// async function processWithPDFCo(fileBuffer: ArrayBuffer) {
//   const formData = new FormData();
//   const blob = new Blob([fileBuffer], { type: "application/pdf" });
//   formData.append("file", blob);

//   const response = await fetch("https://api.pdf.co/v1/pdf/convert/to/text", {
//     method: "POST",
//     headers: {
//       "x-api-key": process.env.PDFCO_API_KEY!, // Free tier available
//     },
//     body: formData,
//   });

//   if (!response.ok) {
//     throw new Error("PDF.co processing failed");
//   }

//   const result = await response.json();
//   return result.text;
// }

// // Option B: Using PDFShift (alternative free service)
// async function processWithPDFShift(fileBuffer: ArrayBuffer) {
//   const base64 = Buffer.from(fileBuffer).toString("base64");

//   const response = await fetch(
//     "https://api.pdfshift.io/v3/convert/pdf-to-text",
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Basic ${Buffer.from(process.env.PDFSHIFT_API_KEY + ":").toString("base64")}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         source: `data:application/pdf;base64,${base64}`,
//       }),
//     }
//   );

//   if (!response.ok) {
//     throw new Error("PDFShift processing failed");
//   }

//   const result = await response.json();
//   return result.text;
// }

// Option C: Using ILovePDF API (free tier)
// async function processWithILovePDF(fileBuffer: ArrayBuffer) {
//   // First, start a task
//   const startResponse = await fetch(
//     "https://api.ilovepdf.com/v1/start/pdftxt",
//     {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${process.env.ILOVEPDF_API_KEY}`,
//       },
//     }
//   );

//   const { server, task } = await startResponse.json();

//   // Upload file
//   const formData = new FormData();
//   const blob = new Blob([fileBuffer], { type: "application/pdf" });
//   formData.append("file", blob);

//   //   eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const uploadResponse = await fetch(`${server}/upload`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.ILOVEPDF_API_KEY}`,
//     },
//     body: formData,
//   });

//   //   const uploadResult = await uploadResponse.json();

//   // Process
//   //   eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const processResponse = await fetch(`${server}/process`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.ILOVEPDF_API_KEY}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       task: task,
//       tool: "pdftxt",
//     }),
//   });

//   //   const processResult = await processResponse.json();

//   // Download result
//   const downloadResponse = await fetch(`${server}/download/${task}`, {
//     headers: {
//       Authorization: `Bearer ${process.env.ILOVEPDF_API_KEY}`,
//     },
//   });

//   return await downloadResponse.text();
// }

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileBuffer = await Buffer.from(await file.arrayBuffer());

    // Try different services in order of preference
    const data = await PdfParse(fileBuffer);

    return NextResponse.json({
      text: data.text,
      success: true,
    });
  } catch (error) {
    console.error("PDF processing error:", error);
    return NextResponse.json(
      {
        error: "Failed to process PDF",
        success: false,
      },
      { status: 500 }
    );
  }
}
