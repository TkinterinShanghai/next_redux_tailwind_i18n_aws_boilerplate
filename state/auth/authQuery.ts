import { createApi } from "@reduxjs/toolkit/query/react";
import {
  confirmRegister,
  getAttributes,
  getSession,
  resendConfirmationCode,
  signInWithEmail,
  signOutUser,
  signUpWithEmail,
  confirmNewEmail,
  changeEmail,
  sendPasswordRecoverCode,
  confirmNewPasswordWithCode,
} from "../../aws/cognito";

const base = async (fn: Function) => {
  try {
    await fn();
    return { data: {} };
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return { error: { name: e.name !== "Error" ? e.name : e.message } };
    } else {
      return { error: { name: "UNDEFINED" } };
    }
  }
};

export const api = createApi({
  reducerPath: "auth",
  baseQuery: base,
  tagTypes: ["Authenticated"],
  endpoints: (builder) => ({
    registerUser: builder.mutation<{}, { email: string; password: string }>({
      queryFn: async ({ email, password }) => {
        return base(() => signUpWithEmail(email, password));
      },
    }),
    confirmUser: builder.mutation<{}, { email: string; code: string }>({
      invalidatesTags: ["Authenticated"],
      queryFn: async ({ email, code }) => {
        return base(() => confirmRegister(email, code));
      },
    }),
    resendConfirmation: builder.mutation<{}, { email: string }>({
      queryFn: async ({ email }) => {
        return base(() => resendConfirmationCode(email));
      },
    }),
    logIn: builder.mutation<{}, { email: string; password: string }>({
      invalidatesTags: ["Authenticated"],
      queryFn: async ({ email, password }) => {
        return base(() => signInWithEmail(email, password));
      },
    }),
    logOut: builder.mutation({
      invalidatesTags: ["Authenticated"],
      queryFn: async () => {
        return base(() => signOutUser());
      },
    }),
    sendPasswordRecoverCode: builder.mutation<{}, { email: string }>({
      queryFn: async ({ email }) => {
        return base(() => sendPasswordRecoverCode(email));
      },
    }),
    confirmPassword: builder.mutation<{}, { email: string; code: string; password: string }>({
      queryFn: async ({ code, email, password }) => {
        return base(() => confirmNewPasswordWithCode(email, code, password));
      },
    }),
    changeEmail: builder.mutation<{}, { email: string }>({
      queryFn: async ({ email }) => {
        return base(() => changeEmail(email));
      },
    }),
    confirmNewEmail: builder.mutation<{}, { code: string }>({
      queryFn: async ({ code }) => {
        return base(() => confirmNewEmail(code));
      },
    }),
    getUserAttributes: builder.query<{ attr: string | undefined }, { attribute: string }>({
      providesTags: ["Authenticated"],
      queryFn: async ({ attribute }) => {
        try {
          const attributes = await getAttributes();
          const foundAttribute = attributes.find((element) => element.getName() === attribute);
          return { data: { attr: foundAttribute?.getValue() } };
        } catch (e) {
          return { data: { attr: undefined } };
        }
      },
    }),
    isAuth: builder.query({
      providesTags: ["Authenticated"],
      queryFn: async () => {
        try {
          console.log("isAuth function gets triggered");
          const session = await getSession();
          return { data: session?.isValid() ? true : false };
        } catch (e) {
          return { data: false };
        }
      },
    }),
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  useRegisterUserMutation,
  useConfirmUserMutation,
  useResendConfirmationMutation,
  useLogInMutation,
  useLogOutMutation,
  useChangeEmailMutation,
  useConfirmNewEmailMutation,
  useConfirmPasswordMutation,
  useSendPasswordRecoverCodeMutation,
  useIsAuthQuery,
  useGetUserAttributesQuery,
} = api;
