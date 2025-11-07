import { useEffect, useState } from "react";
import Head from "next/head";
import { Header } from "@/components/Header";
import { FundiCard } from "@/components/FundiCard";
import { ShopCard } from "@/components/ShopCard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search as SearchIcon, Filter, MapPin } from "lucide-react";
import { mockFundis, mockShops } from "@/lib/mockData";
import { subscriptionDb } from "@/lib/subscriptionDb";

export default function SearchPage() {
  const { language } = useLanguage();
  const [searchType, setSearchType] = useState<"fundi" | "shop">("fundi");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [providers, setProviders] = useState<(Fundi | Shop)[]>([]);
  const [loading, setLoading] = useState(false);
  const [filteredCount, setFilteredCount] = useState(0);

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
        setFilteredCount(data.filtered);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const metaTitle = language === "en" ? "Search - Smart Fundi" : "Tafuta - Smart Fundi";

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="min-h-screen bg-background pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-6">
                {language === "en" ? "Search for Fundis & Shops" : "Tafuta Mafundi na Maduka"}
              </h1>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder={language === "en" ? "Search by name or specialty..." : "Tafuta kwa jina au ujuzi..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

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

                      {activeTab === "fundis" && (
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
            </div>

            {filteredCount > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  {language === "en" 
                    ? `${filteredCount} provider(s) filtered due to inactive or expired subscription`
                    : `Watoaji huduma ${filteredCount} wameondolewa kwa sababu ya usajili usiofanya kazi au ulioisha`}
                </p>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">
                  {language === "en" ? "Loading..." : "Inapakia..."}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {providers.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">
                      {language === "en" ? "No providers found" : "Hakuna watoaji huduma waliopatikana"}
                    </p>
                  </div>
                ) : (
                  providers.map((provider) => (
                    searchType === "fundi" ? (
                      <FundiCard key={provider.id} fundi={provider as Fundi} />
                    ) : (
                      <ShopCard key={provider.id} shop={provider as Shop} />
                    )
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
