import { cn } from '@/lib/utils'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Placeholder from '@tiptap/extension-placeholder'

import { FC, useEffect, useState } from 'react'
// define your extension array

interface TextEditorProps {
  className?: string
  onChange?: (value: string) => void
  onkeydown?: (event: React.KeyboardEvent<HTMLDivElement>) => void
  value?: string
  placeholder?: string
}

const extensions = [
  StarterKit,
  Image.configure({
    HTMLAttributes: {
      class: 'rounded-md',
    },
  }),
  Table.configure({
    resizable: true, // có thể kéo thay đổi kích thước cột
    HTMLAttributes: {
      class: 'table',
    },
  }),
  TableRow,
  TableHeader,
  TableCell,
]

const TextEditor: FC<TextEditorProps> = ({
  className,
  onChange,
  value,
  placeholder,
  onkeydown,
}) => {
  const [checkInit, setCheckInit] = useState(false)

  const editor = useEditor({
    extensions: [
      ...extensions,
      Placeholder.configure({
        placeholder: placeholder || '',
      }),
    ],
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      if (onChange) {
        onChange(html)
      }
    },
    content: value || '',
  })

  if (!editor) {
    return null
  }

  useEffect(() => {
    if (value == '') {
      editor.commands.setContent(value)
    }

    if (value && !checkInit) {
      editor.commands.setContent(value)
      setCheckInit(true)
    }
  }, [editor, value, checkInit])

  return (
    <>
      <EditorContent
        onKeyDown={onkeydown}
        editor={editor}
        className={cn(
          'dark:bg-input/30 border-input rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          className
        )}
      />
    </>
  )
}

export default TextEditor
