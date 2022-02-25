import type { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useLogInErrors } from "../hooks/errors/useLoginError";
import { useLogInMutation } from "../state/auth/authQuery";
import { useAppDispatch, useAppSelector } from "../state/store";
import { setEmail } from "../state/user/userSlice";

export const LogIn: NextPage = ({}) => {
  const [password, setPassword] = useState("");
  const { email } = useAppSelector((state) => state.user);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [LogInUser, { isSuccess, error }] = useLogInMutation();
  useLogInErrors(error, setErrorMessage);

  useEffect(() => {
    if (isSuccess) {
      router.push("/");
    }
  }, [router, isSuccess]);

  return (
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
      <Link href="/forgot-password">Forgot Password?</Link>
    </form>
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