import React from 'react';
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const visitedCountries = [
  {
    name: "Spain",
    region: "Europe",
    visited: true,
  },
  {
    name: "France",
    region: "Europe",
    visited: true,
  },
  {
    name: "Italy",
    region: "Europe",
    visited: true,
  },
  {
    name: "Japan",
    region: "Asia",
    visited: true,
  },
  {
    name: "Thailand",
    region: "Asia",
    visited: true,
  },
  {
    name: "Brazil",
    region: "South America",
    visited: true,
  },
  {
    name: "Morocco",
    region: "Africa",
    visited: true,
  },
  {
    name: "Australia",
    region: "Oceania",
    visited: true,
  },
];

const ProfileMap = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {visitedCountries.map((country) => (
        <Card key={country.name} className="p-4 relative">
          <div className="absolute top-2 right-2">
            {country.visited && (
              <div className="bg-primary rounded-full p-1">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
          </div>
          <div className="space-y-1">
            <h3 className="font-medium">{country.name}</h3>
            <p className="text-sm text-muted-foreground">{country.region}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProfileMap;