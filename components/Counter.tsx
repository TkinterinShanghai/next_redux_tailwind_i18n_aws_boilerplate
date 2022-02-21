import { useTranslation } from "next-i18next";
import { clearState, decrement, increment } from "../state/counter/counterSlice";
import { useAppDispatch, useAppSelector } from "../state/store";

interface counterProps {}

export const Counter: React.FC<counterProps> = ({}) => {
  const { t } = useTranslation();
  const { count } = useAppSelector((state) => state.counter);
  const dispatch = useAppDispatch();
  return (
    <div className="p-4 rounded-lg border">
      <div className="flex flex-row items-center">
        <button className="border rounded-lg p-2" onClick={() => dispatch(decrement())}>
          -
        </button>
        <p className="p-3">
          {t("number.currentValue")}: {count}
        </p>
        <button className="border rounded-lg p-2" onClick={() => dispatch(increment())}>
          +
        </button>
      </div>
      <button
        className="w-full bg-red-400 rounded-lg p-3"
        onClick={() => dispatch(clearState())}
      >
        {" "}
        clear
      </button>
    </div>
  );
};
