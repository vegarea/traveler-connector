import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const TravelGroups = () => {
  const groups = [
    {
      id: 1,
      name: "Aventureros del Mundo",
      members: 156,
      image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606"
    },
    {
      id: 2,
      name: "Mochileros Latinos",
      members: 89,
      image: "https://images.unsplash.com/photo-1488085061387-422e29b40080"
    },
    {
      id: 3,
      name: "Viajeros Fotógrafos",
      members: 234,
      image: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group) => (
        <Card key={group.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-32">
            <img 
              src={group.image} 
              alt={group.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2">{group.name}</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users2 className="w-4 h-4" />
                <span>{group.members} miembros</span>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                Ver grupo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TravelGroups;