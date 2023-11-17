import { FC, ReactNode, useMemo } from "react";
import Link from "next/link";
import React from "react";
import { Text } from "@chakra-ui/react";

import { useRouter } from "next/router";
import queryString from 'query-string'
import { NavElement } from "@libreplex/shared-ui";

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


  const router = useRouter();

  const query = useMemo(()=>queryString.stringify(router.query),[router.query])

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
            <NavElement label="Home" href={`/?${query}`} />
          </li>

          <li>
            <NavElement label="Mission" href={`/mission?${query}`} />
          </li>
          <li>
            <NavElement label="Design" href={`/design?${query}`} />
          </li>
          <li>
            <NavElement label="Why" href={`/why?${query}`} />
          </li>
          <li>
            <NavElement label="Tools" href={`/tools?${query}`} />
          </li>
          {/* <li>
            <NavElement label="Costs" href={`/costs?${query}`} />
          </li> */}
          <li>
            <NavElement label="Demo" href={`/demo?${query}`}/>
          </li>
        </ul>
      </div>
    </div>
  );
};
