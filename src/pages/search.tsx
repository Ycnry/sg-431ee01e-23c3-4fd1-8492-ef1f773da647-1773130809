
import { useState } from "react";
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

export default function SearchPage() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [activeTab, setActiveTab] = useState("fundis");

  const cities = ["Dar es Salaam", "Arusha", "Mwanza", "Dodoma", "Mbeya"];
  const specialties = ["Electrician", "Plumber", "Carpenter", "Mechanic", "Mason", "Painter"];

  const filteredFundis = mockFundis.filter((fundi) => {
    const matchesSearch = fundi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fundi.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === "all" || fundi.city === selectedCity;
    const matchesSpecialty = selectedSpecialty === "all" || fundi.specialty === selectedSpecialty;
    return matchesSearch && matchesCity && matchesSpecialty;
  });

  const filteredShops = mockShops.filter((shop) => {
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shop.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCity = selectedCity === "all" || shop.city === selectedCity;
    return matchesSearch && matchesCity;
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
        
        <main className="container mx-auto px-4 py-8">
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

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="fundis">
                {language === "en" ? "Technicians" : "Mafundi"} ({filteredFundis.length})
              </TabsTrigger>
              <TabsTrigger value="shops">
                {language === "en" ? "Shops" : "Maduka"} ({filteredShops.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="fundis">
              {filteredFundis.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFundis.map((fundi) => (
                    <FundiCard key={fundi.id} fundi={fundi} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">
                      {language === "en" 
                        ? "No technicians found matching your criteria"
                        : "Hakuna mafundi waliopatikana kulingana na vigezo vyako"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="shops">
              {filteredShops.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredShops.map((shop) => (
                    <ShopCard key={shop.id} shop={shop} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">
                      {language === "en"
                        ? "No shops found matching your criteria"
                        : "Hakuna maduka yaliyopatikana kulingana na vigezo vyako"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
