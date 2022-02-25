import { useLogOutMutation } from "../state/auth/authQuery";

interface LogoutProps {}

export const Logout: React.FC<LogoutProps> = ({}) => {
  const [triggerLogOut] = useLogOutMutation();
  return <button onClick={triggerLogOut}>Log Out</button>;
};
