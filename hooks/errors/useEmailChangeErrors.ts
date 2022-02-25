import { SerializedError } from "@reduxjs/toolkit";
import { useTranslation } from "next-i18next";
import { Dispatch, SetStateAction, useEffect } from "react";
import { genericErrors } from "./genericErrors";

export const useEmailChangeErrors = (
  error: SerializedError | undefined,
  setErrorMessage: Dispatch<SetStateAction<string>>
) => {
  const { t } = useTranslation();
  useEffect(() => {
    if (error) {
      switch (error.name) {
        case "User is not authenticated":
          setErrorMessage("User is not logged in");
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
