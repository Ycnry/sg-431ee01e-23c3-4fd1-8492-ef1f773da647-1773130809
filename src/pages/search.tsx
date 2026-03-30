import { useEffect, useState } from "react";
import Head from "next/head";
import { Header } from "@/components/Header";
import { FundiCard } from "@/components/FundiCard";
import { ShopCard } from "@/components/ShopCard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search as SearchIcon, MapPin, Briefcase, Loader2 } from "lucide-react";
import { mockFundis, mockShops } from "@/lib/mockData";
import { Fundi, Shop } from "@/types";

export default function SearchPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"fundi" | "shop">("fundi");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [providers, setProviders] = useState<(Fundi | Shop)[]>([]);
  const [loading, setLoading] = useState(false);

  const cities = [...new Set([...mockFundis.map(f => f.city), ...mockShops.map(s => s.city)])];
  const specialties = [...new Set(mockFundis.map(f => f.specialty))];

  useEffect(() => {
    fetchProviders();
  }, [searchType, selectedCity, selectedSpecialty]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: searchType,
        city: selectedCity,
        ...(searchType === "fundi" && selectedSpecialty !== "all" ? { specialty: selectedSpecialty } : {})
      });

      const response = await fetch(`/api/search/providers?${params}`);
      const data = await response.json();

      if (data.success) {
        setProviders(data.providers);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = providers.filter((provider) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    if (searchType === "fundi") {
      const fundi = provider as Fundi;
      return (
        fundi.name.toLowerCase().includes(query) ||
        fundi.specialty.toLowerCase().includes(query)
      );
    } else {
      const shop = provider as Shop;
      return (
        shop.name.toLowerCase().includes(query) ||
        shop.categories.some(cat => cat.toLowerCase().includes(query))
      );
    }
  });

  const metaTitle = language === "en" ? "Search - Smart Fundi" : "Tafuta - Smart Fundi";

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="min-h-screen bg-background pt-20 pb-32">
          <div className="container mx-auto px-4">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                {language === "en" ? "Search" : "Tafuta"}
              </h1>
              <p className="text-muted-foreground">
                {language === "en" 
                  ? "Find skilled technicians and hardware shops near you" 
                  : "Tafuta mafundi na maduka ya vifaa karibu nawe"}
              </p>
            </div>

            {/* Search Filters Card */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Fundi/Shop Toggle */}
                  <Tabs value={searchType} onValueChange={(value) => setSearchType(value as "fundi" | "shop")}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="fundi" className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        {language === "en" ? "Technicians" : "Mafundi"}
                      </TabsTrigger>
                      <TabsTrigger value="shop" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {language === "en" ? "Shops" : "Maduka"}
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {/* Search Input */}
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder={language === "en" ? "Search by name or specialty..." : "Tafuta kwa jina au ujuzi..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Filter Dropdowns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {language === "en" ? "City" : "Jiji"}
                      </label>
                      <Select value={selectedCity} onValueChange={setSelectedCity}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            {language === "en" ? "All Cities" : "Miji Yote"}
                          </SelectItem>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {searchType === "fundi" && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {language === "en" ? "Specialty" : "Ujuzi"}
                        </label>
                        <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">
                              {language === "en" ? "All Specialties" : "Ujuzi Wote"}
                            </SelectItem>
                            {specialties.map((specialty) => (
                              <SelectItem key={specialty} value={specialty}>
                                {specialty}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 text-orange-500 animate-spin mb-4" />
                <p className="text-lg font-medium text-foreground">
                  {language === "en" ? "Searching..." : "Inatafuta..."}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === "en" ? "Finding the best matches for you" : "Tunapata matokeo bora kwako"}
                </p>
              </div>
            ) : filteredProviders.length === 0 ? (
              /* Empty State - Friendly User Message */
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-6">
                  <SearchIcon className="h-10 w-10 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  No Results Found
                </h3>
                <p className="text-muted-foreground mb-1">
                  {searchType === "fundi" 
                    ? "Hakuna mafundi waliopatikana"
                    : "Hakuna maduka yaliyopatikana"}
                </p>
                <p className="text-sm text-muted-foreground max-w-md">
                  {language === "en"
                    ? "Try changing the city or specialty you're searching for"
                    : "Jaribu kubadilisha mji au ujuzi unaotafuta"}
                </p>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    {language === "en" 
                      ? `Found ${filteredProviders.length} ${searchType === "fundi" ? "technician" : "shop"}${filteredProviders.length !== 1 ? "s" : ""}`
                      : `${searchType === "fundi" ? "Mafundi" : "Maduka"} ${filteredProviders.length} wamepatikana`}
                  </p>
                </div>

                {/* Results Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProviders.map((provider) => (
                    searchType === "fundi" ? (
                      <FundiCard key={provider.id} fundi={provider as Fundi} />
                    ) : (
                      <ShopCard key={provider.id} shop={provider as Shop} />
                    )
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}