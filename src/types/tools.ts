import type { IconName } from "@fortawesome/fontawesome-svg-core";

export type ToolType = "paintbrush" | "eraser" | "fill";

export interface Tool {
  id: ToolType;
  icon: IconName;
  name: string;
}
