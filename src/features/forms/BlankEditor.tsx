import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import Paragraph from '@tiptap/extension-paragraph';
import { EditorContent, useEditor, type Node } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import type { KeyboardEventHandler } from 'react';
export default function BlankEditor({
  defaultContent = '',
  onUpdate = () => {},
  className = '',
  placeholder = '',
  onKeyDown = () => {}
}: {
  defaultContent?: string;
  onUpdate?: (text: string) => void;
  className?: string;
  placeholder?: string;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
}) {
  const editor = useEditor({
    extensions: [
      Document.extend({
        content: 'block'
      }),
      Text,
      Paragraph,
      Placeholder.configure({
        placeholder
      })
    ],
    content: defaultContent,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getText());
    },
    editorProps: {
      attributes: {
        class: 'outline outline-none'
      }
    }
  });
  return (
    <EditorContent
      onKeyDown={onKeyDown}
      className={className}
      editor={editor}
    />
  );
}
