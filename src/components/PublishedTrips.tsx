import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";

const PublishedTrips = () => {
  const trips = [
    {
      id: 1,
      title: "Exploring Japan's Hidden Temples",
      date: "March 2024",
      location: "Japan",
      image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3",
      tags: ["Cultural", "Historical", "Photography"],
    },
    {
      id: 2,
      title: "Amazon Rainforest Adventure",
      date: "January 2024",
      location: "Brazil",
      image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
      tags: ["Adventure", "Nature", "Wildlife"],
    },
    {
      id: 3,
      title: "Northern Lights in Iceland",
      date: "December 2023",
      location: "Iceland",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
      tags: ["Photography", "Nature", "Adventure"],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip) => (
        <Card key={trip.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
          <div className="relative h-48 overflow-hidden">
            <img
              src={trip.image}
              alt={trip.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2">{trip.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Calendar className="w-4 h-4" />
              <span>{trip.date}</span>
              <MapPin className="w-4 h-4 ml-2" />
              <span>{trip.location}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {trip.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PublishedTrips;