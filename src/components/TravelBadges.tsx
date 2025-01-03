import React from 'react';
import { Award } from "lucide-react";

const TravelBadges = () => {
  const badges = [
    { name: "Explorer", level: "Gold", description: "Visited 25+ countries" },
    { name: "Photographer", level: "Silver", description: "500+ photos shared" },
    { name: "Guide", level: "Bronze", description: "Helped 50+ travelers" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {badges.map((badge) => (
        <div key={badge.name} className="flex flex-col items-center text-center p-4 rounded-lg bg-accent/50">
          <Award className="w-8 h-8 text-primary mb-2" />
          <h3 className="font-semibold">{badge.name}</h3>
          <span className="text-sm text-muted-foreground">{badge.level}</span>
          <p className="text-xs mt-2 text-muted-foreground">{badge.description}</p>
        </div>
      ))}
    </div>
  );
};

export default TravelBadges;