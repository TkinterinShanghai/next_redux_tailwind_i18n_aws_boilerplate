import type { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import { Auth, NotAuth } from "../components/Auth";
import { Language } from "../components/Language";
import { Logout } from "../components/Logout";
import { useGetUserAttributesQuery } from "../state/auth/authQuery";

const Home: NextPage = () => {
  const { data: email } = useGetUserAttributesQuery({ attribute: "email" });

  return (
    <>
      <Head>
        <title>Boilerplate</title>
        <meta name="description" content="Boilerplate" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen flex flex-col justify-center content-center w-fit mx-auto">
        <nav className="flex justify-between">
          <Auth>
            <Logout />
            <Link href="/auth/change-email">Change Email</Link>
            <Link href="/auth/change-password">Change Password</Link>
          </Auth>
          <NotAuth>
            <Link href="/auth/register">register</Link>
            <Link href="/auth/login">login</Link>
          </NotAuth>
        </nav>
        <Language />
        <h1>{email?.attr && `Logged in as: ${email?.attr}`}</h1>
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
