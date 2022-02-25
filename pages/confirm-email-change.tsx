import type { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useConfirmNewEmailMutation } from "../state/auth/authQuery";

const ConfirmEmailChange: NextPage = ({}) => {
  const [code, setCode] = useState<string>("");
  const [confirmEmail, { isSuccess: emailUpdateSuccess }] = useConfirmNewEmailMutation();
  const router = useRouter();
  useEffect(() => {
    if (emailUpdateSuccess) {
      router.push("/");
    }
  }, [emailUpdateSuccess, router]);
// TODO handle errors
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        confirmEmail({ code });
      }}
    >
      <input type="text" onChange={(e) => setCode(e.target.value)} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ConfirmEmailChange;



export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common", "footer"])),
    },
  };
};