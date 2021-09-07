import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type Image = {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
};

type Response = {
  data: Image[];
  after: string;
};

export default function Home(): JSX.Element {
  async function fetchPages({ pageParam = null }): Promise<Response> {
    if (pageParam) {
      const response = await api.get(`/api/images`, {
        params: {
          after: pageParam,
        },
      });
      console.log(response.data);
      return response.data;
    }
    const response = await api.get(`/api/images`);
    console.log(response.data);
    return response.data;
  }
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchPages, {
    getNextPageParam: lastPage => lastPage.after,
  });

  const formattedData = useMemo(() => {
    return data ? data.pages.map(page => page.data).flat() : [];
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button bg="yellow.400" onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
