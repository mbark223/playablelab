import React from "react";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Facebook, Ghost, Globe, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export type Channel = {
  id: string;
  name: string;
  slug: string;
  description: string;
  specs: {
    fileSize: { max: number; unit: string };
    dimensions: { width: number; height: number; aspectRatio?: string }[];
    format: string[];
    requirements: string[];
  };
  icon: string;
  color: string;
};

interface ChannelSelectorProps {
  channels: Channel[];
  selectedChannel: Channel | null;
  onSelectChannel: (channel: Channel) => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  facebook: Facebook,
  ghost: Ghost,
  globe: Globe,
  smartphone: Smartphone,
};

export function ChannelSelector({
  channels,
  selectedChannel,
  onSelectChannel,
}: ChannelSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {channels.map((channel) => {
        const Icon = iconMap[channel.icon || "globe"] || Globe;
        const isSelected = selectedChannel?.id === channel.id;

        return (
          <Card
            key={channel.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-lg",
              isSelected && "ring-2 ring-primary"
            )}
            onClick={() => onSelectChannel(channel)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className={cn("p-3 rounded-lg", channel.color)}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                {isSelected && (
                  <Badge variant="default">Selected</Badge>
                )}
              </div>
              <h3 className="text-xl font-semibold mt-4">{channel.name}</h3>
              <CardDescription>{channel.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    File Size Limit
                  </p>
                  <p className="text-sm">
                    {channel.specs.fileSize.max}{channel.specs.fileSize.unit}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Supported Dimensions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {channel.specs.dimensions.map((dim, index) => (
                      <Badge key={index} variant="secondary">
                        {dim.width}x{dim.height}
                        {dim.aspectRatio && ` (${dim.aspectRatio})`}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Format
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {channel.specs.format.map((format, index) => (
                      <Badge key={index} variant="outline">
                        {format}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Requirements
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {channel.specs.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}