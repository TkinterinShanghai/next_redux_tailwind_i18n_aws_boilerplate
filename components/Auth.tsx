import { useIsAuthQuery } from "../state/auth/authQuery";

export const Auth: React.FC = ({ children }) => {
  const { data: isAuth } = useIsAuthQuery({});
  return <>{isAuth ? children : null} </>;
};

export const NotAuth: React.FC = ({ children }) => {
  const { data: isAuth } = useIsAuthQuery({});
  return <>{isAuth ? null : children}</>;
};

export const AuthStatus: React.FC = () => {
  return (
    <>
      <Auth>User is authenticated</Auth>
      <NotAuth>User is not authenticated</NotAuth>
    </>
  );
};
