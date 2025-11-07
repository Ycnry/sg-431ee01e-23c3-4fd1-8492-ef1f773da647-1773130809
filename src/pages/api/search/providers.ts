import type { NextApiRequest, NextApiResponse } from "next";
import { subscriptionDb } from "@/lib/subscriptionDb";
import { mockFundis, mockShops } from "@/lib/mockData";
import { Fundi, Shop } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { type, city, specialty } = req.query;

    let providers: (Fundi | Shop)[] = type === "shop" ? [...mockShops] : [...mockFundis];

    if (city && city !== "all") {
      providers = providers.filter(p => p.city === city);
    }

    if (type === "fundi" && specialty && specialty !== "all") {
      providers = (providers as Fundi[]).filter(p => p.specialty === specialty);
    }

    const verifiedProviders = providers.filter(provider => {
      const isActive = subscriptionDb.isUserActiveAndValid(provider.id);
      if (!isActive) {
        console.log(`Filtering out provider ${provider.id}: subscription inactive or expired`);
      }
      return isActive;
    });

    const sortedProviders = verifiedProviders.map(provider => ({
      ...provider,
      isPromoted: subscriptionDb.isUserPromoted(provider.id),
    })).sort((a, b) => {
      if (a.isPromoted && !b.isPromoted) return -1;
      if (!a.isPromoted && b.isPromoted) return 1;
      // Use optional chaining for rating in case it's not present on all types
      return (b.rating ?? 0) - (a.rating ?? 0);
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
