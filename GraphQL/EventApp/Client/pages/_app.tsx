import '../styles/globals.css'
import { AppProps } from 'types/AppProps';
import MainLayout from 'layouts/MainLayout'
import { ApolloProvider } from "@apollo/client";
import apolloClient from 'utils/apolloClient';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <MainLayout pageTitle={Component.Title}>
        <Component {...pageProps} />
      </MainLayout>
    </ApolloProvider>
  );
}

export default MyApp
