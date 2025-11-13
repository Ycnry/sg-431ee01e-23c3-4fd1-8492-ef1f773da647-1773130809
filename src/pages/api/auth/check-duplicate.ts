import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { 
      nationalIdNumber, 
      phone, 
      idDocumentHash,
      businessName,
      city,
      businessRegistrationNumber,
      storefrontPhotoHash,
      userType
    } = req.body;

    if (userType === "fundi") {
      if (!nationalIdNumber && !idDocumentHash) {
        return res.status(400).json({ 
          error: "Either nationalIdNumber or idDocumentHash is required for fundi registration" 
        });
      }

      const existingFundis = getExistingFundis();
      let isDuplicate = false;
      let duplicateReason = "";

      if (nationalIdNumber) {
        const idMatch = existingFundis.find(
          account => account.nationalIdNumber === nationalIdNumber
        );
        if (idMatch) {
          isDuplicate = true;
          duplicateReason = "National ID number already exists";
        }
      }

      if (phone && !isDuplicate) {
        const phoneMatch = existingFundis.find(
          account => account.phone === phone
        );
        if (phoneMatch) {
          isDuplicate = true;
          duplicateReason = "Phone number already exists";
        }
      }

      if (idDocumentHash && !isDuplicate) {
        const hashMatch = existingFundis.find(
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
    }

    if (userType === "shop") {
      const existingShops = getExistingShops();
      let isDuplicate = false;
      let duplicateReason = "";

      if (phone) {
        const phoneMatch = existingShops.find(
          shop => shop.phone === phone
        );
        if (phoneMatch) {
          isDuplicate = true;
          duplicateReason = "Phone number already exists";
        }
      }

      if (businessName && city && !isDuplicate) {
        const businessMatch = existingShops.find(
          shop => shop.businessName?.toLowerCase() === businessName.toLowerCase() && 
                  shop.city?.toLowerCase() === city.toLowerCase()
        );
        if (businessMatch) {
          isDuplicate = true;
          duplicateReason = "A shop with this business name already exists in this city";
        }
      }

      if (businessRegistrationNumber && !isDuplicate) {
        const brelaMatch = existingShops.find(
          shop => shop.businessRegistrationNumber === businessRegistrationNumber
        );
        if (brelaMatch) {
          isDuplicate = true;
          duplicateReason = "Business registration number already exists";
        }
      }

      if (storefrontPhotoHash && !isDuplicate) {
        const photoMatch = existingShops.find(
          shop => shop.storefrontPhotoHash === storefrontPhotoHash
        );
        if (photoMatch) {
          isDuplicate = true;
          duplicateReason = "Storefront photo with same hash already exists";
        }
      }

      return res.status(200).json({
        isDuplicate,
        duplicateReason: isDuplicate ? duplicateReason : null,
        message: isDuplicate 
          ? "A shop with this info already exists. Contact support if this is an error."
          : "No duplicate found"
      });
    }

    return res.status(400).json({ error: "Invalid user type" });
  } catch (error) {
    console.error("Duplicate check error:", error);
    return res.status(500).json({ error: "Duplicate check failed" });
  }
}

function getExistingFundis() {
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

function getExistingShops() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const data = localStorage.getItem("smartfundi_shop_accounts");
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}
