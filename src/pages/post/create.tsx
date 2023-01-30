import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Router from 'next/router';
import { useState } from 'react';
import Layout from '../../components/Layout';
import { api } from '../../utils/api';

export default function CreatePost() {
  const [error, setError] = useState<string | null>(null);
  const { mutate, isLoading } = api.post.create.useMutation({
    onSuccess: async (data) => {
      await Router.push(`/post/${data}`);
    },
    onError: (data) => {
      setError('Invalid post');
    }
  });
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4]
        }
      })
    ],
    editorProps: {
      attributes: {
        class: 'prose'
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
          onChange={(e) => setTitle(e.target.value)}
        />
        <EditorContent editor={editor} />
        <button
          onClick={() => {
            mutate({ content: editor?.getHTML() ?? '', title });
          }}
        >
          {isLoading ? 'Loading...' : 'Publish'}
        </button>
        {error && <div>Error happened</div>}
      </div>
    </Layout>
  );
}
