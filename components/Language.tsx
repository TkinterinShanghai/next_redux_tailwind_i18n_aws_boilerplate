import { Menu } from "@headlessui/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Dropdown } from "./Dropdown";

interface LanguageProps {}

export const Language: React.FC<LanguageProps> = ({}) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="w-full border rounded-lg p-4 mb-4">
      <h2 className="text-lg">{t("language")} </h2>
      <Dropdown>
        {router.locales!.map((language, i) => (
          <Menu.Item key={i}>
            {({ active }) => (
              <button
                onClick={(e) =>
                  router.push(router.pathname, router.asPath, { locale: language })
                }
                className={`${
                  active ? "bg-violet-500 text-white" : "text-gray-900"
                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
              >
                {language}
              </button>
            )}
          </Menu.Item>
        ))}
      </Dropdown>
    </div>
  );
};
