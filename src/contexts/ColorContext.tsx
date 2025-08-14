import { createContext, useContext, useState, ReactNode } from "react";

interface ColorContextType {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  colors: string[];
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

interface ColorProviderProps {
  children: ReactNode;
}

export const ColorProvider = ({ children }: ColorProviderProps) => {
  const [selectedColor, setSelectedColor] = useState<string>("#000000");

  // Základní paleta barev
  const colors = [
    "#000000", // Černá
    "#FFFFFF", // Bílá
    "#e73c3c", // Červená
    "#6cee6c", // Zelená
    "#5353ff", // Modrá
    "#f39c12", // Oranžová
    "#9b59b6", // Fialová
    "#34495e", // Šedá
    "#1abc9c", // Tyrkysová
    "#f1c40f", // Žlutá
  ];

  const value = {
    selectedColor,
    setSelectedColor,
    colors,
  };

  return (
    <ColorContext.Provider value={value}>{children}</ColorContext.Provider>
  );
};

export const useColor = () => {
  const context = useContext(ColorContext);
  if (context === undefined) {
    throw new Error("useColor must be used within a ColorProvider");
  }
  return context;
};
