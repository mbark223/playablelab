import React, { createContext, useContext, useState, ReactNode } from "react";
import { Channel } from "@/components/create/ChannelSelector";

interface ChannelContextType {
  selectedChannel: Channel | null;
  setSelectedChannel: (channel: Channel | null) => void;
  channels: Channel[];
  setChannels: (channels: Channel[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ChannelContext = createContext<ChannelContextType | undefined>(undefined);

export function ChannelProvider({ children }: { children: ReactNode }) {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ChannelContext.Provider
      value={{
        selectedChannel,
        setSelectedChannel,
        channels,
        setChannels,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
}

export function useChannel() {
  const context = useContext(ChannelContext);
  if (context === undefined) {
    throw new Error("useChannel must be used within a ChannelProvider");
  }
  return context;
}