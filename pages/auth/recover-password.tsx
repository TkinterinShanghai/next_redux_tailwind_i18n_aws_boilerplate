import type { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RedirectFrontPage } from "../../components/Auth";
import { useRecoverPasswordError } from "../../hooks/errors/useRecoverPasswordError";
import { useConfirmPasswordMutation } from "../../state/auth/authQuery";
import { useAppSelector } from "../../state/store";

const RecoverPassword: NextPage = ({}) => {
  const [changePassword, { isSuccess, error }] = useConfirmPasswordMutation();
  const { email } = useAppSelector((store) => store.auth);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  useRecoverPasswordError(error, setErrorMessage);
  // TODO User should automatically be logged in then
  useEffect(() => {
    if (isSuccess) {
      router.push("/");
    }
  }, [isSuccess, router]);

  return (
    <RedirectFrontPage>
      <form
        className="h-screen flex flex-col content-center m-auto justify-center w-fit"
        onSubmit={(e) => {
          e.preventDefault();
          changePassword({ password, code, email });
        }}
      >
        <label htmlFor="code">
          <b>Code</b>
        </label>
        <input type="text" id="code" onChange={(e) => setCode(e.target.value)} />
        <label htmlFor="password">
          <b>Password</b>
        </label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter Password"
          name="password"
          id="password"
          required
        />
        <button type="submit">Send Password Recover Code</button>
        <div>{errorMessage}</div>
      </form>
    </RedirectFrontPage>
  );
};

export default RecoverPassword;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common", "footer"])),
    },
  };
};
