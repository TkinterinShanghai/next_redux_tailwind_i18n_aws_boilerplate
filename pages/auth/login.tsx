import type { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useState } from "react";
import { RedirectFrontPage } from "../../components/Auth";
import { useLogInErrors } from "../../hooks/errors/useLoginError";
import { useLogInMutation } from "../../state/auth/authQuery";
import { setEmail } from "../../state/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../state/store";

export const LogIn: NextPage = ({}) => {
  const [password, setPassword] = useState("");
  const { email } = useAppSelector((state) => state.auth);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useAppDispatch();

  const [LogInUser, { error }] = useLogInMutation();
  useLogInErrors(error, setErrorMessage);

  return (
    <RedirectFrontPage>
      <form
        className="h-screen flex flex-col content-center m-auto justify-center w-fit"
        onSubmit={(e) => {
          e.preventDefault();
          LogInUser({ email, password });
        }}
      >
        <label htmlFor="email">
          <b>Email</b>
        </label>
        <input
          value={email}
          onChange={(e) => dispatch(setEmail(e.target.value))}
          type="text"
          placeholder="Enter Email"
          name="email"
          id="email"
          required
        />
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

        <button type="submit">LogIn</button>
        <div>{errorMessage}</div>
        <Link href="/auth/forgot-password">Forgot Password?</Link>
      </form>
    </RedirectFrontPage>
  );
};

export default LogIn;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common", "footer"])),
    },
  };
};
