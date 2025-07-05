
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Cow, 
  Calendar,
  MapPin,
  Activity,
  Heart,
  Scale
} from "lucide-react";

// Mock livestock data
const livestock = [
  {
    id: 1,
    name: "Bessie",
    type: "Cattle",
    breed: "Holstein",
    tag: "C001",
    gender: "Female",
    birthDate: "2022-03-15",
    shelter: "Barn A",
    weight: "1200 lbs",
    status: "healthy",
    productivity: "28L/day",
    lastCheckup: "2024-06-15",
    image: "photo-1472396961693-142e6e269027"
  },
  {
    id: 2,
    name: "Charlie",
    type: "Pig",
    breed: "Yorkshire",
    tag: "P001",
    gender: "Male",
    birthDate: "2024-01-10",
    shelter: "Pen B",
    weight: "180 lbs",
    status: "healthy",
    productivity: "Growing",
    lastCheckup: "2024-06-20",
    image: "photo-1465379944081-7f47de8d74ac"
  },
  {
    id: 3,
    name: "Henrietta",
    type: "Chicken",
    breed: "Rhode Island Red",
    tag: "H001",
    gender: "Female",
    birthDate: "2023-08-22",
    shelter: "Coop C",
    weight: "6 lbs",
    status: "needs-attention",
    productivity: "5 eggs/week",
    lastCheckup: "2024-06-10",
    image: "photo-1535268647677-300dbf3d78d1"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy': return 'bg-green-100 text-green-800';
    case 'needs-attention': return 'bg-yellow-100 text-yellow-800';
    case 'sick': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'cattle': return '🐄';
    case 'pig': return '🐷';
    case 'chicken': return '🐔';
    case 'sheep': return '🐑';
    default: return '🐾';
  }
};

export function Livestock() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredLivestock = livestock.filter(animal =>
    animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Livestock Management</h1>
          <p className="text-muted-foreground">Monitor and care for your animals</p>
        </div>
        <Button className="bg-farm-barn hover:bg-farm-barn/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add New Animal
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, tag, type, or breed..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">All Types</Button>
              <Button variant="outline" size="sm">Health Status</Button>
              <Button variant="outline" size="sm">Location</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Livestock Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Animals</p>
                <p className="text-2xl font-bold">{livestock.length}</p>
              </div>
              <Cow className="h-8 w-8 text-farm-barn" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Healthy Animals</p>
                <p className="text-2xl font-bold text-green-600">
                  {livestock.filter(a => a.status === 'healthy').length}
                </p>
              </div>
              <Heart className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Need Attention</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {livestock.filter(a => a.status === 'needs-attention').length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Weight</p>
                <p className="text-2xl font-bold">462 lbs</p>
              </div>
              <Scale className="h-8 w-8 text-farm-sage" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Livestock Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLivestock.map((animal) => (
          <Card key={animal.id} className="hover:shadow-lg transition-shadow group">
            <div className="relative h-48 bg-gradient-to-br from-farm-earth to-farm-sage rounded-t-lg overflow-hidden">
              <img 
                src={`https://images.unsplash.com/${animal.image}?w=400&h=200&fit=crop`}
                alt={animal.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 text-2xl">
                  {getTypeIcon(animal.type)}
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <Badge className={getStatusColor(animal.status)}>
                  {animal.status === 'healthy' ? 'Healthy' : 'Needs Attention'}
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{animal.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{animal.breed} {animal.type}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  #{animal.tag}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{calculateAge(animal.birthDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <span>{animal.weight}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{animal.shelter}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span>{animal.productivity}</span>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Last Checkup:</span>
                  <span className="font-medium">
                    {new Date(animal.lastCheckup).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Health Log
                </Button>
                <Button size="sm" className="flex-1 bg-farm-barn hover:bg-farm-barn/90 text-white">
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLivestock.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Cow className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No animals found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first animal"}
            </p>
            <Button className="bg-farm-barn hover:bg-farm-barn/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add New Animal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
