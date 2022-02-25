import type { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useConfirmUserMutation, useResendConfirmationMutation } from "../../state/auth/authQuery";
import { useAppDispatch, useAppSelector } from "../../state/store";
import { setEmail } from "../../state/user/userSlice";

export const ConfirmEmail: NextPage = ({}) => {
  const [code, setCode] = useState("");
  const { email } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  // Todo handle errors
  const [confirmUser, { isSuccess: confirmSuccess }] = useConfirmUserMutation();
  const [resendConfirmationCode, { isSuccess }] =
    useResendConfirmationMutation();

  useEffect(() => {
    if (confirmSuccess) {
      router.push("/");
    }
  }, [confirmSuccess, router]);

  return (
    <>
      <button
        onClick={() => {
          resendConfirmationCode({ email });
        }}
      >
        Request new code
      </button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          confirmUser({ email, code });
        }}
      >
        <>
          <label htmlFor="email">
            <b>Email</b>
          </label>
          <input
            value={email}
            id="email"
            type="text"
            onChange={(e) => dispatch(setEmail(e.target.value))}
          ></input>
        </>
        <label htmlFor="code">
          <b>code</b>
        </label>
        <input type="text" id="code" onChange={(e) => setCode(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default ConfirmEmail;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common", "footer"])),
    },
  };
};
