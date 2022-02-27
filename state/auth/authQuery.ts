import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import {
  confirmRegister,
  getAttributes,
  resendConfirmationCode,
  signInWithEmail,
  signOutUser,
  signUpWithEmail,
  confirmNewEmail,
  changeEmail,
  sendPasswordRecoverCode,
  confirmNewPasswordWithCode,
} from "../../aws/cognito";

const catchError = (e: unknown) => {
  console.log(e);
  if (e instanceof Error) {
    return { error: { name: e.name !== "Error" ? e.name : e.message } };
  } else {
    return { error: { name: "UNDEFINED" } };
  }
};

const base: BaseQueryFn<
  (...args: any) => any, // Args
  {}, // Result
  { name: string } // Error
> = async (fn: Function) => {
  try {
    await fn();
    return { data: {} };
  } catch (e) {
    return catchError(e);
  }
};

export const authQuery = createApi({
  reducerPath: "authQueries",
  baseQuery: base,
  tagTypes: ["Authenticated"],
  endpoints: (builder) => ({
    registerUser: builder.mutation<{}, { email: string; password: string }>({
      query:
        ({ email, password }) =>
        () =>
          signUpWithEmail(email, password),
    }),
    confirmUser: builder.mutation<{}, { email: string; code: string }>({
      invalidatesTags: ["Authenticated"],
      query:
        ({ email, code }) =>
        () =>
          confirmRegister(email, code),
    }),
    resendConfirmation: builder.mutation<{}, { email: string }>({
      query:
        ({ email }) =>
        () =>
          resendConfirmationCode(email),
    }),
    sendPasswordRecoverCode: builder.mutation<{}, { email: string }>({
      query:
        ({ email }) =>
        () =>
          sendPasswordRecoverCode(email),
    }),
    confirmPassword: builder.mutation<{}, { email: string; code: string; password: string }>({
      query:
        ({ email, code, password }) =>
        () =>
          confirmNewPasswordWithCode(email, code, password),
    }),
    changeEmail: builder.mutation<{}, { email: string }>({
      query:
        ({ email }) =>
        () =>
          changeEmail(email),
    }),
    confirmNewEmail: builder.mutation<{}, { code: string }>({
      query:
        ({ code }) =>
        () =>
          confirmNewEmail(code),
    }),
    getUserAttributes: builder.query<{ attr: string | undefined }, { attribute: string }>({
      providesTags: ["Authenticated"],
      query:
        ({ attribute }) =>
        async () => {
          const attributes = await getAttributes();
          return attributes.find((element) => element.getName() === attribute)?.getValue();
        },
    }),
    logIn: builder.mutation<{ jwt: string }, { email: string; password: string }>({
      invalidatesTags: ["Authenticated"],
      query:
        ({ email, password }) =>
        () =>
          signInWithEmail(email, password),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useConfirmUserMutation,
  useResendConfirmationMutation,
  useLogInMutation,
  useChangeEmailMutation,
  useConfirmNewEmailMutation,
  useConfirmPasswordMutation,
  useSendPasswordRecoverCodeMutation,
  useGetUserAttributesQuery,
} = authQuery;
