import Router from 'next/router';
import { useState } from 'react';
import Layout from '../../components/Layout';
import PostEditor from '../../features/editor/PostEditor';
import { api } from '../../utils/api';

export default function CreatePost() {
  const { mutate, isLoading } = api.post.create.useMutation({
    onSuccess: async (data) => {
      if (data) {
        await Router.push(`/post/${data}`);
      }
    }
  });
  const [content, setContent] = useState('');

  return (
    <Layout className='flex justify-center'>
      <div className='flex w-prose flex-col'>
        <PostEditor />
        <button
          onClick={() => {
            mutate({ content, title: content.split('\n').at(0) ?? 'Untitled' });
          }}
        >
          {isLoading ? 'Loading...' : 'Publish'}
        </button>
      </div>
    </Layout>
  );
}
