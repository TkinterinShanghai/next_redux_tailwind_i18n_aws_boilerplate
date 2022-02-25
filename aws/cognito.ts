import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
  ISignUpResult,
} from "amazon-cognito-identity-js";

const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USERPOOL_ID;
const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;

// console.log(`userpool id=${userPoolId}`);
// console.log(`client id=${clientId}`);

const poolData = {
  UserPoolId: `${userPoolId}`,
  ClientId: `${clientId}`,
};

export const userPool: CognitoUserPool = new CognitoUserPool(poolData);

let currentUser = userPool.getCurrentUser();

export function getCurrentUser() {
  return currentUser;
}

function getCognitoUser(username: string) {
  const userData = {
    Username: username,
    Pool: userPool,
  };
  const cognitoUser = new CognitoUser(userData);

  return cognitoUser;
}

export async function getSession() {
  if (!currentUser) {
    currentUser = userPool.getCurrentUser();
  }

  return new Promise<CognitoUserSession | null>(function (resolve, reject) {
    if (currentUser === null) return null;
    currentUser.getSession(function (err: Error | null, session: CognitoUserSession | null) {
      if (err) {
        console.log("Auth Checker gets called");
        reject(err);
      } else {
        resolve(session);
      }
    });
  }).catch((err) => {
    throw err;
  });
}

export async function signUpWithEmail(email: string, password: string) {
  return new Promise<ISignUpResult | undefined>(function (resolve, reject) {
    const attributeList = [
      new CognitoUserAttribute({
        Name: "email",
        Value: email,
      }),
    ];

    userPool.signUp(email, password, attributeList, [], function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  }).catch((err) => {
    throw err;
  });
}

export async function resendConfirmationCode(email: string) {
  return new Promise(function (resolve, reject) {
    const cognitoUser = getCognitoUser(email);
    cognitoUser.resendConfirmationCode(function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

export async function changeEmail(email: string) {
  await setAttribute({ Name: "email", Value: email });
  return new Promise(function (resolve, reject) {
    if (!currentUser) throw Error("User not logged in");
    currentUser.getAttributeVerificationCode("email", {
      onSuccess: function (res) {
        resolve(res);
      },
      onFailure: function (err) {
        reject(err);
      },
    });
  });
}

export async function confirmNewEmail(verificationCode: string) {
  return new Promise(function (resolve, reject) {
    if (!currentUser) throw Error("User not logged in");
    currentUser.verifyAttribute("email", verificationCode, {
      onSuccess: function (res) {
        resolve(res);
      },
      onFailure: function (err) {
        reject(err);
      },
    });
  });
}

export async function confirmRegister(email: string, code: string) {
  return new Promise(function (resolve, reject) {
    const cognitoUser = getCognitoUser(email);

    cognitoUser.confirmRegistration(code, true, function (err, result) {
      if (err) {
        reject(err);
      } else {
        console.log("confirmation result:", result);
        resolve(result);
      }
    });
  }).catch((err) => {
    throw err;
  });
}

export async function signInWithEmail(email: string, password: string) {
  return new Promise<CognitoUserSession>(function (resolve, reject) {
    const authenticationData = {
      Username: email,
      Password: password,
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    currentUser = getCognitoUser(email);
    currentUser.setAuthenticationFlowType("USER_PASSWORD_AUTH");
    currentUser.authenticateUser(authenticationDetails, {
      onSuccess: function (res) {
        resolve(res);
      },
      onFailure: function (err) {
        reject(err);
      },
    });
  }).catch((err) => {
    throw err;
  });
}

export function signOutUser() {
  if (currentUser) {
    currentUser.signOut();
  }
}

export async function getAttributes() {
  return new Promise<{ getName(): string; getValue(): string }[]>(function (resolve, reject) {
    if (currentUser != null) {
      currentUser.getUserAttributes(function (err: any, attributes: any) {
        if (err) {
          reject(err);
        } else {
          resolve(attributes);
        }
      });
    }
  }).catch((err) => {
    throw err;
  });
}

export async function setAttribute(attribute: { Name: string; Value: any }) {
  return new Promise(function (resolve, reject) {
    if (currentUser != null) {
      const attributeList = [];
      const res = new CognitoUserAttribute(attribute);
      attributeList.push(res);

      currentUser.updateAttributes(attributeList, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    } else {
      throw Error("Custom User is not authenticated");
    }
  }).catch((err) => {
    throw err;
  });
}

export async function sendPasswordRecoverCode(email: string) {
  return new Promise(function (resolve, reject) {
    const cognitoUser = getCognitoUser(email);

    if (!cognitoUser) {
      reject(`could not find ${email}`);
      return;
    }

    cognitoUser.forgotPassword({
      onSuccess: function (res) {
        resolve(res);
      },
      onFailure: function (err) {
        reject(err);
      },
    });
  }).catch((err) => {
    throw err;
  });
}

export async function confirmNewPasswordWithCode(
  email: string,
  code: string,
  password: string
) {
  return new Promise(function (resolve, reject) {
    const cognitoUser = getCognitoUser(email);

    if (!cognitoUser) {
      reject(`could not find ${email}`);
      return;
    }

    cognitoUser.confirmPassword(code, password, {
      onSuccess: function () {
        resolve("password updated");
      },
      onFailure: function (err) {
        reject(err);
      },
    });
  });
}

export async function changePassword(oldPassword: string, newPassword: string) {
  return new Promise(function (resolve, reject) {
    if (currentUser != null) {
      currentUser.changePassword(oldPassword, newPassword, function (err: any, res: any) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    }
  });
}
