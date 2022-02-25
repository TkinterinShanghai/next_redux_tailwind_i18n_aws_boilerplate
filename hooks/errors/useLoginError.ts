import { SerializedError } from "@reduxjs/toolkit";
import { useTranslation } from "next-i18next";
import { Dispatch, SetStateAction, useEffect } from "react";
import { genericErrors } from "./genericErrors";

export const useLogInErrors = (
  error: SerializedError | undefined,
  setErrorMessage: Dispatch<SetStateAction<string>>
) => {
  const { t } = useTranslation();
  useEffect(() => {
    if (error) {
      switch (error.name) {
        case "NotAuthorizedException":
          setErrorMessage("Incorrect username or password.");
          break;
        case "":
          setErrorMessage("");
          break;
        default:
          genericErrors(error, setErrorMessage, t);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, setErrorMessage]);
};
