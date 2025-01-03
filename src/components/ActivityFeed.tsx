import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, MessageSquare } from "lucide-react";
import { useState } from "react";

// Datos de ejemplo para simular actividades
const mockActivities = [
  {
    id: 1,
    user: {
      name: "María García",
      avatar: "https://i.pravatar.cc/150?img=1",
      initials: "MG"
    },
    content: "¡Acabo de unirme a un nuevo grupo de viajeros!",
    timestamp: "Hace 5 minutos",
    likes: 5,
    comments: 2,
  },
  {
    id: 2,
    user: {
      name: "Carlos López",
      avatar: "https://i.pravatar.cc/150?img=2",
      initials: "CL"
    },
    content: "Compartió fotos de su viaje a Barcelona",
    timestamp: "Hace 2 horas",
    likes: 12,
    comments: 4,
  },
  {
    id: 3,
    user: {
      name: "Ana Martínez",
      avatar: "https://i.pravatar.cc/150?img=3",
      initials: "AM"
    },
    content: "Publicó una nueva reseña sobre el Hotel Marina",
    timestamp: "Hace 1 día",
    likes: 8,
    comments: 1,
  }
];

const ActivityFeed = () => {
  const [activities, setActivities] = useState(mockActivities);

  const handleLike = (activityId: number) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        return { ...activity, likes: activity.likes + 1 };
      }
      return activity;
    }));
  };

  return (
    <ScrollArea className="h-[600px] w-full rounded-md border p-4">
      <div className="space-y-4">
        {activities.map((activity) => (
          <Card key={activity.id} className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center gap-4 p-4">
              <Avatar>
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h3 className="font-semibold">{activity.user.name}</h3>
                <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="mb-4">{activity.content}</p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleLike(activity.id)}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  <span>{activity.likes}</span>
                </button>
                <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <MessageSquare className="h-4 w-4" />
                  <span>{activity.comments}</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ActivityFeed;