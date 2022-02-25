import type { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Router, useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Language } from "../components/Language";
import { useForgotPasswordErrors } from "../hooks/errors/useForgotPasswordErrors";
import { useSendPasswordRecoverCodeMutation } from "../state/auth/authQuery";
import { useAppDispatch, useAppSelector } from "../state/store";
import { setEmail } from "../state/user/userSlice";

const ForgotPassword: NextPage = ({}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const { email } = useAppSelector((store) => store.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [sendPasswordRecoverCode, { error, isSuccess }] = useSendPasswordRecoverCodeMutation();
  useForgotPasswordErrors(error, setErrorMessage);
  console.log("is it a success?", isSuccess);
  useEffect(() => {
    console.log("this gets triggered");
    if (isSuccess) {
      console.log("success!!");
      router.push("/recover-password");
    }
  }, [isSuccess, router]);

  return (
    <form
      className="h-screen flex flex-col content-center m-auto justify-center w-fit"
      onSubmit={(e) => {
        e.preventDefault();
        sendPasswordRecoverCode({ email });
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
      <button type="submit">Send Password Recover Code</button>
      <div>{errorMessage}</div>
    </form>
  );
};

export default ForgotPassword;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common", "footer"])),
    },
  };
};
