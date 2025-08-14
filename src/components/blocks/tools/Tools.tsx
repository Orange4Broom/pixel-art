import { useState } from "react"
import { Icon } from "../../elements/icon/Icon"
import { useTool } from "../../../hooks/useTool"
import type { ToolType } from "../../../types/tools"
import './tools.scss'

export const Tools = () => {
  const [openedTools, setOpenedTools] = useState<boolean>(false)
  const { selectedTool, setSelectedTool, tools } = useTool()

  const handleToolClick = (tool: ToolType, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setSelectedTool(tool)
  }


  return <div className={`tools ${openedTools ? 'opened' : ''}`} onMouseEnter={() => setOpenedTools(true)} onMouseLeave={() => setOpenedTools(false)}>
    {!openedTools && <Icon name={tools.find(t => t.id === selectedTool)?.icon || 'paintbrush'} type="fas" color="white" />}
    {openedTools && <div className="tools-content">
      {tools.map((tool) => (
        <button className={`tool-button ${selectedTool === tool.id ? 'selected' : ''}`} key={tool.id} onClick={(event) => handleToolClick(tool.id, event)}>
          <Icon name={tool.icon} type="fas" color="white" />
        </button>
      ))}

    </div>}
  </div>
}