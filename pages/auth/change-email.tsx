import type { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AuthStatus } from "../../components/Auth";
import { useEmailChangeErrors } from "../../hooks/errors/useEmailChangeErrors";
import { useChangeEmailMutation } from "../../state/auth/authQuery";
import { useAppDispatch, useAppSelector } from "../../state/store";
import { setEmail } from "../../state/user/userSlice";

export const ChangeEmail: NextPage = ({}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const { email } = useAppSelector((state) => state.user);
  const [changeEmail, { isSuccess, error }] = useChangeEmailMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEmailChangeErrors(error, setErrorMessage);

  useEffect(() => {
    if (isSuccess) {
      router.push("/auth/confirm-email-change");
    }
  }, [router, isSuccess]);

  return (
    <form
      className="h-screen flex flex-col content-center m-auto justify-center w-fit"
      onSubmit={(e) => {
        e.preventDefault();
        setErrorMessage("");
        changeEmail({ email });
      }}
    >
      <AuthStatus />
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
      <button type="submit">Change Email</button>
      <div>{errorMessage}</div>
    </form>
  );
};

export default ChangeEmail;



export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common", "footer"])),
    },
  };
};