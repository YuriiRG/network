import { Placeholder } from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Router from 'next/router';
import { useState } from 'react';
import Layout from '../../components/Layout';
import SubmitButton from '../../features/forms/SubmitButton';
import { api } from '../../utils/api';
import ErrorsBlock from '../../features/forms/ErrorsBlock';
export default function CreatePost() {
  const [error, setError] = useState<string | null>(null);
  const { mutate, isLoading } = api.post.create.useMutation({
    onSuccess: async (data) => {
      await Router.push(`/post/${data}`);
    },
    onError: ({ data }) => {
      if (data?.code === 'CONFLICT') {
        setError('A post with the same name already exists');
      }
    }
  });
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4]
        }
      }),
      Placeholder.configure({
        placeholder: 'Write something...'
      })
    ],
    editorProps: {
      attributes: {
        class: 'prose outline-none outline'
      }
    },
    content: '<p>Hello World!</p>'
  });
  const [title, setTitle] = useState('');
  return (
    <Layout className='flex justify-center'>
      <div className='flex w-prose flex-col'>
        <input
          type='text'
          placeholder='Title'
          value={title}
          className='mb-8 text-5xl font-extrabold outline-none outline'
          onChange={(e) => {
            if (error) {
              setError(null);
            }
            setTitle(e.target.value);
          }}
        />
        <EditorContent
          editor={editor}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              editor?.chain().focus().run();
            }
          }}
        />
        <SubmitButton
          className='mt-8 mb-4 self-start'
          onClick={() => {
            mutate({ content: editor?.getHTML() ?? '', title });
          }}
          disabled={isLoading || !!error}
        >
          {isLoading ? 'Loading...' : 'Publish'}
        </SubmitButton>
        <ErrorsBlock errors={[error ?? undefined]} />
      </div>
    </Layout>
  );
}
