import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
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

type CustomErrorType = { name: string };

const baseMutation = async (fn: () => any) => {
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
  baseQuery: fakeBaseQuery<CustomErrorType>(),
  tagTypes: ["Authenticated"],
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      queryFn: async ({ email, password }) => {
        return baseMutation(() => signUpWithEmail(email, password));
      },
    }),
    confirmUser: builder.mutation<{}, { email: string; code: string }>({
      invalidatesTags: ["Authenticated"],
      queryFn: async ({ email, code }) => {
        return baseMutation(() => confirmRegister(email, code));
      },
    }),
    resendConfirmation: builder.mutation<{}, { email: string }>({
      queryFn: async ({ email }) => {
        return baseMutation(() => resendConfirmationCode(email));
      },
    }),
    logIn: builder.mutation<{}, { email: string; password: string }>({
      invalidatesTags: ["Authenticated"],
      queryFn: async ({ email, password }) => {
        return baseMutation(() => signInWithEmail(email, password));
      },
    }),
    logOut: builder.mutation({
      invalidatesTags: ["Authenticated"],
      queryFn: async () => {
        return baseMutation(() => signOutUser());
      },
    }),
    sendPasswordRecoverCode: builder.mutation<{}, { email: string }>({
      queryFn: async ({ email }) => {
        return baseMutation(() => sendPasswordRecoverCode(email));
      },
    }),
    confirmPassword: builder.mutation<{}, { email: string; code: string; password: string }>({
      queryFn: async ({ code, email, password }) => {
        return baseMutation(() => confirmNewPasswordWithCode(email, code, password));
      },
    }),
    changeEmail: builder.mutation<{}, { email: string }>({
      queryFn: async ({ email }) => {
        return baseMutation(() => changeEmail(email));
      },
    }),
    confirmNewEmail: builder.mutation<{}, { code: string }>({
      queryFn: async ({ code }) => {
        return baseMutation(() => confirmNewEmail(code));
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
