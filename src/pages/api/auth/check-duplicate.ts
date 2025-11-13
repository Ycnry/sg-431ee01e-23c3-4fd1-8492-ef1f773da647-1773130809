
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { nationalIdNumber, phone, idDocumentHash } = req.body;

    if (!nationalIdNumber && !idDocumentHash) {
      return res.status(400).json({ 
        error: "Either nationalIdNumber or idDocumentHash is required" 
      });
    }

    const existingAccounts = getExistingAccounts();

    let isDuplicate = false;
    let duplicateReason = "";

    if (nationalIdNumber) {
      const idMatch = existingAccounts.find(
        account => account.nationalIdNumber === nationalIdNumber
      );
      if (idMatch) {
        isDuplicate = true;
        duplicateReason = "National ID number already exists";
      }
    }

    if (phone && !isDuplicate) {
      const phoneMatch = existingAccounts.find(
        account => account.phone === phone
      );
      if (phoneMatch) {
        isDuplicate = true;
        duplicateReason = "Phone number already exists";
      }
    }

    if (idDocumentHash && !isDuplicate) {
      const hashMatch = existingAccounts.find(
        account => account.idDocumentHash === idDocumentHash
      );
      if (hashMatch) {
        isDuplicate = true;
        duplicateReason = "Document with same hash already exists";
      }
    }

    return res.status(200).json({
      isDuplicate,
      duplicateReason: isDuplicate ? duplicateReason : null,
      message: isDuplicate 
        ? "An account with this ID or phone number already exists. Please log in or contact support."
        : "No duplicate found"
    });
  } catch (error) {
    console.error("Duplicate check error:", error);
    return res.status(500).json({ error: "Duplicate check failed" });
  }
}

function getExistingAccounts() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const data = localStorage.getItem("smartfundi_fundi_accounts");
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}
