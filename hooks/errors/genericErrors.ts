import { SerializedError } from "@reduxjs/toolkit";
import { TFunction } from "next-i18next";
import { Dispatch, SetStateAction } from "react";

export const genericErrors = (
  error: SerializedError,
  setErrorMessage: Dispatch<SetStateAction<string>>,
  t: TFunction
) => {
  console.log("in the generic errors")
  switch (error.name) {
    case "LimitExceededException":
      setErrorMessage("Too many requests, try again later");
      break;
    case "":
      setErrorMessage("");
      break;
    default:
      setErrorMessage(t("errors.testError"));
  }
};
