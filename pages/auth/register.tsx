import type { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRegisterUserMutation } from "../../state/auth/authQuery";
import { useAppDispatch, useAppSelector } from "../../state/store";
import { setEmail } from "../../state/user/userSlice";

export const Register: NextPage = ({}) => {
  const [password, setPassword] = useState("");
  const { email } = useAppSelector((store) => store.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  // TODO log in user after registration
  // TODO handle error
  const [registerUser, { isSuccess }] = useRegisterUserMutation();

  useEffect(() => {
    if (isSuccess) {
      router.push("/auth/verify-email");
    }
  }, [router, isSuccess]);

  return (
    <form
      className="h-screen flex flex-col content-center m-auto justify-center w-fit"
      onSubmit={(e) => {
        e.preventDefault();
        registerUser({ email, password });
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
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common", "footer"])),
    },
  };
};
