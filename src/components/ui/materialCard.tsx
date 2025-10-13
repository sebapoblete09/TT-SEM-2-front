import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

interface MaterialCardProps {
  material: {
    id: number;
    name: string;
    creator: string;
    category: string;
    image: string;
    tags: string[];
  };
}

export function MaterialCard({ material }: MaterialCardProps) {
  return (
    <Link href={`/material/${material.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={material.image || "/placeholder.svg"}
            alt={material.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-3 right-3 bg-primary">
            {material.category}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {material.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <User className="h-4 w-4" />
            <span>{material.creator}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {material.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
