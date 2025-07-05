
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Wheat, 
  Calendar,
  MapPin,
  DollarSign,
  TrendingUp,
  Droplets,
  Sun
} from "lucide-react";

// Mock crop data
const crops = [
  {
    id: 1,
    name: "Winter Wheat",
    variety: "Hard Red Winter",
    location: "Field A-1",
    plantingDate: "2024-10-15",
    harvestDate: "2024-07-20",
    stage: "Growing",
    area: "25 acres",
    expectedYield: "2,500 bushels",
    expenses: 1250,
    status: "healthy",
    image: "photo-1466721591366-2d5fba72006d"
  },
  {
    id: 2,
    name: "Sweet Corn",
    variety: "Golden Bantam",
    location: "Field B-2",
    plantingDate: "2024-05-01",
    harvestDate: "2024-08-15",
    stage: "Flowering",
    area: "15 acres",
    expectedYield: "1,800 dozen",
    expenses: 890,
    status: "needs-attention",
    image: "photo-1493962853295-0fd70327578a"
  },
  {
    id: 3,
    name: "Soybeans",
    variety: "Roundup Ready",
    location: "Field C-1",
    plantingDate: "2024-05-20",
    harvestDate: "2024-09-30",
    stage: "Pod Development",
    area: "40 acres",
    expectedYield: "2,000 bushels",
    expenses: 2100,
    status: "healthy",
    image: "photo-1485833077593-4278bba3f11f"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy': return 'bg-green-100 text-green-800';
    case 'needs-attention': return 'bg-yellow-100 text-yellow-800';
    case 'critical': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStageColor = (stage: string) => {
  switch (stage) {
    case 'Planted': return 'bg-blue-100 text-blue-800';
    case 'Growing': return 'bg-green-100 text-green-800';
    case 'Flowering': return 'bg-purple-100 text-purple-800';
    case 'Pod Development': return 'bg-orange-100 text-orange-800';
    case 'Ready to Harvest': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function Crops() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredCrops = crops.filter(crop =>
    crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crop.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crop.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Crop Management</h1>
          <p className="text-muted-foreground">Track and manage your crops</p>
        </div>
        <Button className="bg-farm-green hover:bg-farm-green/90">
          <Plus className="h-4 w-4 mr-2" />
          Add New Crop
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search crops, varieties, or locations..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">All Stages</Button>
              <Button variant="outline" size="sm">Status</Button>
              <Button variant="outline" size="sm">Location</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Crop Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Crops</p>
                <p className="text-2xl font-bold">{crops.length}</p>
              </div>
              <Wheat className="h-8 w-8 text-farm-green" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Area</p>
                <p className="text-2xl font-bold">80 acres</p>
              </div>
              <MapPin className="h-8 w-8 text-farm-sage" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Investment</p>
                <p className="text-2xl font-bold">$4,240</p>
              </div>
              <DollarSign className="h-8 w-8 text-farm-harvest" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expected Yield</p>
                <p className="text-2xl font-bold">95%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map((crop) => (
          <Card key={crop.id} className="hover:shadow-lg transition-shadow group">
            <div className="relative h-48 bg-gradient-to-br from-farm-earth to-farm-sage rounded-t-lg overflow-hidden">
              <img 
                src={`https://images.unsplash.com/${crop.image}?w=400&h=200&fit=crop`}
                alt={crop.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge className={getStatusColor(crop.status)}>
                  {crop.status === 'healthy' ? 'Healthy' : 'Needs Attention'}
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{crop.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{crop.variety}</p>
                </div>
                <Badge className={getStageColor(crop.stage)} variant="outline">
                  {crop.stage}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{crop.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-muted-foreground" />
                  <span>{crop.area}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(crop.plantingDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>${crop.expenses}</span>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Expected Yield:</span>
                  <span className="font-medium">{crop.expectedYield}</span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  View Details
                </Button>
                <Button size="sm" className="flex-1 bg-farm-green hover:bg-farm-green/90">
                  Add Entry
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCrops.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Wheat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No crops found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first crop"}
            </p>
            <Button className="bg-farm-green hover:bg-farm-green/90">
              <Plus className="h-4 w-4 mr-2" />
              Add New Crop
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
