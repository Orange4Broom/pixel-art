import { Canvas } from "./components/blocks/canvas/Canvas"
import { Pallete } from "./components/blocks/pallete/Pallete"
import { Tools } from "./components/blocks/tools/Tools"
import { Icon } from "./components/elements/icon/Icon"
import { ColorProvider } from "./contexts/ColorContext"
import { ToolProvider } from "./contexts/ToolContext"
import { MultiplayerProvider } from "./contexts/MultiplayerContext"
import { MultiplayerPanel } from "./components/blocks/multiplayer/MultiplayerPanel"

export const App = () => {
  return (
    <MultiplayerProvider>
      <ColorProvider>
        <ToolProvider>
          <Canvas />
          <div className="tools-container">
            <div className="arrow-container">
              <Icon name="arrow-left" type="fas" color="white" />
            </div>
            <div className="arrow-container">
              <Icon name="arrow-right" type="fas" color="white" />
            </div>
            <Tools />
            <Pallete />
          </div>
          <MultiplayerPanel />
        </ToolProvider>
      </ColorProvider>
    </MultiplayerProvider>
  )
}
