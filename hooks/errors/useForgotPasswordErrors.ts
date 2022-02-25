import { SerializedError } from "@reduxjs/toolkit";
import { useTranslation } from "next-i18next";
import React, { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { genericErrors } from "./genericErrors";

export const useForgotPasswordErrors = (
  error: SerializedError | undefined,
  setErrorMessage: Dispatch<SetStateAction<string>>
) => {
  const { t } = useTranslation();
  useEffect(() => {
    if (error) {
      switch (error.name) {
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
