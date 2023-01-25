import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { z } from 'zod';
import Layout from '../../components/Layout';
import { createSSRHelpers } from '../../server/helpers/ssr';
import { api } from '../../utils/api';

export default function Post() {
  const router = useRouter();
  const { id: idSlug } = router.query;
  const id = z.string().uuid().safeParse(idSlug).success
    ? z.string().parse(idSlug)
    : 'error';

  const { data } = api.post.read.useQuery(id, {
    enabled: id !== 'error'
  });
  if (id === 'error') {
    return <Layout>Invalid addr</Layout>;
  }
  if (data === undefined) {
    return <Layout>Loading...</Layout>;
  }
  if (data === null) {
    return <Layout>Post doesn&apos;t exist</Layout>;
  }
  return <Layout>{data.content}</Layout>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const ssr = await createSSRHelpers(context);
  if (z.string().uuid().safeParse(context.params?.id).success) {
    await ssr.post.read.prefetch(z.string().parse(context.params?.id));
  }

  return {
    props: {
      trpcState: ssr.dehydrate()
    }
  };
}
