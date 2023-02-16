import { Placeholder } from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import SubmitButton from '../../features/forms/SubmitButton';
import { api } from '../../utils/api';
import ErrorsBlock from '../../features/forms/ErrorsBlock';
import BlankEditor from '../../features/forms/BlankEditor';
export default function CreatePost() {
  const [error, setError] = useState<string | null>(null);
  const { mutate, isLoading } = api.post.create.useMutation({
    onSuccess: async (data) => {
      localStorage.removeItem('title');
      localStorage.removeItem('content');
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
    content:
      typeof window !== 'undefined'
        ? localStorage.getItem('content') ?? ''
        : '',
    onUpdate: ({ editor }) => {
      localStorage.setItem('content', editor.getHTML());
    }
  });
  const [title, setTitle] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('title') ?? '' : ''
  );
  useEffect(() => {
    localStorage.setItem('title', title);
  }, [title]);
  console.log('title', title);
  return (
    <Layout className='flex justify-center'>
      <div className='flex w-prose flex-col'>
        <BlankEditor
          placeholder='Title'
          defaultContent={title}
          className={`mb-8 text-5xl font-extrabold ${
            error ? 'text-red-700' : ''
          }`}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              editor?.chain().focus().run();
            }
          }}
          onUpdate={(text) => {
            console.log('error', error);
            if (error) {
              setError(null);
            }
            setTitle(text);
          }}
        />
        <EditorContent editor={editor} />
        <SubmitButton
          className='mt-8 mb-4 self-start'
          onClick={() => {
            mutate({ content: editor?.getHTML() ?? '', title });
          }}
          disabled={
            isLoading ||
            !!error ||
            (editor?.getText().length ?? 0) < 5 ||
            title.length < 2
          }
        >
          {isLoading ? 'Loading...' : 'Publish'}
        </SubmitButton>
        <ErrorsBlock errors={[error ?? undefined]} />
      </div>
    </Layout>
  );
}
