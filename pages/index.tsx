import type { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { Counter } from "../components/counter";
import { Language } from "../components/Language";

const Home: NextPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>Boilerplate</title>
        <meta name="description" content="Boilerplate" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen flex flex-col justify-center content-center w-fit mx-auto">
        <Language />
        <Counter />
      </main>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common", "footer"])),
    },
  };
};
