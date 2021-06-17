import Image from "next/image";
import { FC, MouseEvent, useState } from "react";

import { useIsLoggedIn } from "../hooks/authentication";

import { LoginButton } from "./LoginButton";
import { Menu } from "./Menu";
import { RegisterButton } from "./RegisterButton";
import { Avatar } from "./common/Avatar";
import { OnlyDesktop } from "./common/OnlyDesktop";

export const Header: FC = () => {
  const isLoggedIn = useIsLoggedIn();
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [menuAnchorElement, setMenuAnchorElement] = useState<HTMLElement>();

  console.log("is logged in", isLoggedIn);

  const openMenu = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchorElement(event.currentTarget);
    setMenuVisible(true);
  };

  return (
    <header className="flex w-full p-4">
      <div className="flex w-full items-center">
        <div className="flex items-center">
          <Image
            src="/images/edu_logo.svg"
            alt="Edu Hub logo"
            width={34}
            height={34}
            priority
          />
        </div>
        <div className="flex items-center ml-2">
          <Image
            src="/images/EDU_HUB_name.svg"
            alt="Edu Hub name"
            width={46}
            height={33}
            priority
          />
        </div>
      </div>
      {isLoggedIn ? (
        <div className="flex bg-blue-400">
          <div className="cursor-pointer" onClick={openMenu}>
            <Avatar imageUrl="" />
          </div>
          {menuAnchorElement ? (
            <Menu
              isVisible={isMenuVisible}
              setVisible={setMenuVisible}
              anchorElement={menuAnchorElement}
            />
          ) : null}
        </div>
      ) : null}
      {isLoggedIn ? null : (
        <div className="flex bg-red-300">
          <div className="flex">
            <LoginButton />
          </div>
          <div className="ml-3">
            <OnlyDesktop>
              <RegisterButton />
            </OnlyDesktop>
          </div>
        </div>
      )}
    </header>
  );
};
