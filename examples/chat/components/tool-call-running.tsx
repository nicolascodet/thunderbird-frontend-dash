import { LoaderCircle } from "lucide-react"
import { prettifyToolName } from "@/lib/utils"

export const ToolCallRunning = ({ name, toolCallId }: { name: string; toolCallId?: string }) => {
  return (
    <div className="flex gap-2 items-center">
      <LoaderCircle 
        className="size-4 text-slate-500 dark:text-slate-400 animate-spin" 
        style={{ 
          animationDuration: '1.5s', 
          animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' 
        }}
      />
      <p className="text-sm text-slate-500 dark:text-slate-400">{prettifyToolName(name, toolCallId)}</p>
    </div>
  )
}
