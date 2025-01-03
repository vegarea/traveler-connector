import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Flag, Star, Trophy, Plane } from "lucide-react";
import ProfileMap from '@/components/ProfileMap';
import ProfileStats from '@/components/ProfileStats';
import TravelBadges from '@/components/TravelBadges';
import PublishedTrips from '@/components/PublishedTrips';

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Cover Photo */}
      <div className="relative h-[300px] w-full">
        <img
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e"
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/60" />
      </div>

      {/* Profile Info */}
      <div className="container relative max-w-6xl mx-auto px-4">
        <div className="relative -mt-24">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col items-center">
            <Avatar className="w-32 h-32 border-4 border-background">
              <AvatarImage src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <h1 className="mt-4 text-3xl font-bold">Jane Doe</h1>
            <Badge variant="secondary" className="mt-2">Premium Member</Badge>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>2.5k followers</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>1.2k following</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <ProfileStats />
            
            {/* Travel Map */}
            <Card className="col-span-full">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Visited Countries
                </h2>
                <div className="h-[400px] rounded-lg overflow-hidden">
                  <ProfileMap />
                </div>
              </CardContent>
            </Card>

            {/* Bucket List */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Flag className="w-5 h-5" />
                  Travel Bucket List
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Japan</Badge>
                  <Badge variant="outline">New Zealand</Badge>
                  <Badge variant="outline">Iceland</Badge>
                  <Badge variant="outline">Peru</Badge>
                  <Badge variant="outline">Thailand</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Travel Interests */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Travel Interests
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Badge>Adventure</Badge>
                  <Badge>Photography</Badge>
                  <Badge>Culture</Badge>
                  <Badge>Food</Badge>
                  <Badge>Nature</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Community Badges */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Community Badges
                </h2>
                <TravelBadges />
              </CardContent>
            </Card>
          </div>

          {/* Published Trips */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Plane className="w-6 h-6" />
              Published Trips
            </h2>
            <PublishedTrips />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;