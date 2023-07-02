import { FC, ReactNode } from "react";
import Link from "next/link";
import React from "react";
import { Text } from "@chakra-ui/react";
import { NavElement } from "./navelement";

interface Props {
  children: ReactNode;
  isNavOpen?: boolean;
  setIsNavOpen?: (b: boolean) => any;
}

export const ContentContainer: React.FC<Props> = ({
  isNavOpen,
  setIsNavOpen,
  children,
}: Props) => {
  return (
    <div className="flex-1 drawer h-52">
      <input
        id="my-drawer"
        type="checkbox"
        className="grow drawer-toggle"
        onClick={() => setIsNavOpen && setIsNavOpen(!isNavOpen)}
      />
      <div className="items-center  drawer-content">{children}</div>
      {/* SideBar / Drawer */}
      <div className="drawer-side">
        <label htmlFor="my-drawer" className={`drawer-overlay gap-6`}></label>

        <ul className="p-4 overflow-y-auto menu w-80 bg-base-100 gap-10 sm:flex items-center">
          <li>
            <Text
              variant="heading"
              className="font-extrabold tracking-tighter text-center text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10"
            >
              Menu
            </Text>
          </li>
          <li>
            <NavElement label="Home" href="/" />
          </li>

          <li>
            <NavElement label="Mission" href="/mission" />
          </li>
          <li>
            <NavElement label="Design" href="/design" />
          </li>
          <li>
            <NavElement label="Why" href="/why" />
          </li>
          <li>
            <NavElement label="Costs" href="/costs" />
          </li>
          <li>
            <NavElement label="Demo" href="/demo" />
          </li>
        </ul>
      </div>
    </div>
  );
};
