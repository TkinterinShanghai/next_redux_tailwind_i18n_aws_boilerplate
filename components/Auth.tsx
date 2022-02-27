import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppSelector } from "../state/store";

export const Auth: React.FC = ({ children }) => {
  const { loggedIn } = useAppSelector((store) => store.auth);
  console.log("loggedIn:", loggedIn);
  return <>{loggedIn ? children : null} </>;
};

export const NotAuth: React.FC = ({ children }) => {
  const { loggedIn } = useAppSelector((store) => store.auth);
  return <>{loggedIn ? null : children}</>;
};

export const AuthStatus: React.FC = () => {
  return (
    <>
      <Auth>User is authenticated</Auth>
      <NotAuth>User is not authenticated</NotAuth>
    </>
  );
};
/**
 * Redirects authenticated User to the front page because the route the user is currently in is only meant to be used by logged out users
 */
export const RedirectFrontPage: React.FC = ({ children }) => {
  const router = useRouter();
  const { loggedIn } = useAppSelector((store) => store.auth);
  useEffect(() => {
    if (loggedIn) {
      router.push("/");
    }
  }, [loggedIn, router]);
  return <>{children}</>;
};
