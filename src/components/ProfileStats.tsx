import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Star } from "lucide-react";

const ProfileStats = () => {
  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-2xl font-bold">42</h3>
              <p className="text-muted-foreground">Countries Visited</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-2xl font-bold">156</h3>
              <p className="text-muted-foreground">Days Traveled</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-2xl font-bold">4.9</h3>
              <p className="text-muted-foreground">Rating</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileStats;