import { createContext, useState, type ReactNode } from "react";
import type { ToolType, Tool } from "../types/tools";

interface ToolContextType {
  selectedTool: ToolType;
  setSelectedTool: (tool: ToolType) => void;
  tools: Tool[];
}

export const ToolContext = createContext<ToolContextType | undefined>(undefined);

interface ToolProviderProps {
  children: ReactNode;
}

export const ToolProvider = ({ children }: ToolProviderProps) => {
  const [selectedTool, setSelectedTool] = useState<ToolType>('paintbrush');

  const tools: Tool[] = [
    {
      id: 'paintbrush',
      icon: 'paintbrush',
      name: 'Paintbrush',
    },
    {
      id: 'eraser',
      icon: 'eraser',
      name: 'Eraser',
    },
    {
      id: 'fill',
      icon: 'fill',
      name: 'Fill',
    },
  ];

  const value = {
    selectedTool,
    setSelectedTool,
    tools,
  };

  return (
    <ToolContext.Provider value={value}>{children}</ToolContext.Provider>
  );
};


