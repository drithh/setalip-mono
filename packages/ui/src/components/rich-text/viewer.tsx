'use client';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Strikethrough, Italic, List, ListOrdered } from 'lucide-react';
import { Toggle } from '#dep/components/ui/toggle';
import { Separator } from '#dep/components/ui/separator';
import { cn } from '#dep/lib/utils';
import TextStyle from '@tiptap/extension-text-style';

const RichTextViewer = ({
  value,
  className,
}: {
  value: string;
  className?: string;
}) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: cn(
          'min-h-[150px] w-full rounded-md rounded-br-none rounded-bl-none border border-input bg-transparent px-3 py-2  ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto',
          className
        ),
      },
    },

    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-4',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-4',
          },
        },
      }),
      TextStyle,
    ],
    content: value, // Set the initial content with the provided value
    onUpdate: ({ editor }) => {},
    editable: false,
  });

  return (
    <div>
      <EditorContent editor={editor as Editor} />
    </div>
  );
};

export default RichTextViewer;
