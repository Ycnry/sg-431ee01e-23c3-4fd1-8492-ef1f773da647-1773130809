
import type { NextApiRequest, NextApiResponse } from "next";
import { subscriptionDb } from "@/lib/subscriptionDb";
import { mockFundis, mockShops } from "@/lib/mockData";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { type, city, specialty } = req.query;

    let providers = type === "shop" ? [...mockShops] : [...mockFundis];

    if (city && city !== "all") {
      providers = providers.filter(p => p.city === city);
    }

    if (specialty && specialty !== "all" && type === "fundi") {
      providers = providers.filter(p => "specialty" in p && p.specialty === specialty);
    }

    const verifiedProviders = providers.filter(provider => {
      const isActive = subscriptionDb.isUserActiveAndValid(provider.id);
      const hasValidSubscription = isActive;

      if (!hasValidSubscription) {
        console.log(`Filtering out provider ${provider.id}: subscription inactive or expired`);
        return false;
      }

      return true;
    });

    const sortedProviders = verifiedProviders.map(provider => {
      const isPromoted = subscriptionDb.isUserPromoted(provider.id);
      return {
        ...provider,
        isPromoted
      };
    }).sort((a, b) => {
      if (a.isPromoted && !b.isPromoted) return -1;
      if (!a.isPromoted && b.isPromoted) return 1;
      return b.rating - a.rating;
    });

    return res.status(200).json({
      success: true,
      providers: sortedProviders,
      total: sortedProviders.length,
      filtered: providers.length - verifiedProviders.length
    });
  } catch (error) {
    console.error("Provider search error:", error);
    return res.status(500).json({ error: "Search failed" });
  }
}
