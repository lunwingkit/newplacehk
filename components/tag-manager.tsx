import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { X } from "lucide-react"

interface TagManagerProps {
  tags: string[]
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
  predefinedOptions: string[]
  placeholder: string
  error?: string
}

export function TagManager({ tags, onAddTag, onRemoveTag, predefinedOptions, placeholder, error }: TagManagerProps) {
  return (
    <div className={`space-y-2 ${error ? "border border-red-500 rounded-md p-2" : ""}`}>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
            <Button variant="ghost" size="sm" className="ml-1 h-auto p-0" onClick={() => onRemoveTag(tag)}>
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      <Combobox
        items={predefinedOptions.map((option) => ({ label: option, value: option }))}
        onSelect={onAddTag}
        onAddCustom={onAddTag}
        placeholder={placeholder}
        className={`w-full ${error ? "border-red-500" : ""}`}
        selectedItems={tags}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

