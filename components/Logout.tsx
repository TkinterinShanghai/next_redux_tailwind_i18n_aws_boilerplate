import { signOutUser } from "../aws/cognito";
import { logOut } from "../state/auth/authSlice";
import { useAppDispatch } from "../state/store";

interface LogoutProps {}

/**
Resets both the state and local storage
 */
export const Logout: React.FC<LogoutProps> = ({}) => {
  const dispatch = useAppDispatch();
  return (
    <button
      onClick={async () => {
        await signOutUser(); // Local Storage. Should be reset first, else the triggered fetch request by dispatch will succeed
        dispatch(logOut()); // State
      }}
    >
      Log Out
    </button>
  );
};
