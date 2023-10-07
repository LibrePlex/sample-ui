import { FC, useEffect, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import React, { useState } from "react";

import { NetworkSwitcherDynamic } from  "@libreplex/shared-ui";
import { NavElement } from "@libreplex/shared-ui";
import { Box, Button, Text, VStack, useColorMode } from "@chakra-ui/react";
import { useAutoConnect } from  "@libreplex/shared-ui";
import queryString from 'query-string';
import { useRouter } from "next/router";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export const AppBar = ({
  isNavOpen,
  setIsNavOpen,
}: {
  isNavOpen: boolean;
  setIsNavOpen: (b: boolean) => any;
}) => {
  const { autoConnect, setAutoConnect } = useAutoConnect();
  // const { colorMode, toggleColorMode, setColorMode } = useColorMode();

 

  const router = useRouter();

  const query = useMemo(()=>queryString.stringify(router.query),[router.query])
  // const url = query ? `${router.pathname}?${query}` : router.pathname

  return (
    <div>
      {/* NavBar / Header */}
      <div className="navbar flex h-20 flex-row shadow-xl bg-[#0000005b]">
        <div className="navbar-start align-items-center">
          <div className="hidden sm:inline w-22 h-22 md:p-2 ml-10">
            <Link
              href="/"
              rel="noopener noreferrer"
              passHref
              className="text-secondary hover:text-white"
            >
              <Box display={"flex"} h={"100%"} mt={7} mb={6}>
                <img
                  src="LibrePlexLongLogo.png"
                  height={"35px"}
                  style={{ maxHeight: "35px" }}
                />
              </Box>
            </Link>
          </div>
          {/* <WalletMultiButtonDynamic className="btn-ghost btn-sm relative flex md:hidden text-lg " /> */}
        </div>
        {/* <Text color='white'>{colorMode}</Text>
        <Button size="sm" colorScheme="blue" onClick={toggleColorMode}>
          Toggle Mode
        </Button> */}

        {/* Nav Links */}
        {/* Wallet & Settings */}
        <div className="navbar-end">
          <div className="hidden md:inline-flex align-items-center justify-items gap-8 font-bold text-lg mt-2">
            <NavElement
              label="Features"
              href={`/features?${query}`}
              navigationStarts={() => setIsNavOpen(false)}
            />
            <NavElement
              label="Costs"
              href={`/costs?${query}`}
              navigationStarts={() => setIsNavOpen(false)}
            />
            <NavElement
              label="Tools"
              href={`/tools?${query}`}
              navigationStarts={() => setIsNavOpen(false)}
            />
            <NavElement
              label="Scanner"
              href={`/scanner?${query}`}
              navigationStarts={() => setIsNavOpen(false)}
            />
            <NavElement
              label="Demo"
              href={`/demo?${query}`}
              navigationStarts={() => setIsNavOpen(false)}
            />
            <WalletMultiButtonDynamic className="btn-ghost btn-sm rounded-btn text-lg mr-6 " />
          </div>
          <label
            htmlFor="my-drawer"
            className="btn-gh items-center justify-between md:hidden mr-6"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            <div className="HAMBURGER-ICON space-y-2.5 ml-5">
              <div
                className={`h-0.5 w-8 bg-purple-600 ${
                  isNavOpen ? "hidden" : ""
                }`}
              />
              <div
                className={`h-0.5 w-8 bg-purple-600 ${
                  isNavOpen ? "hidden" : ""
                }`}
              />
              <div
                className={`h-0.5 w-8 bg-purple-600 ${
                  isNavOpen ? "hidden" : ""
                }`}
              />
            </div>
            <div
              className={`absolute block h-0.5 w-8 animate-pulse bg-purple-600 ${
                isNavOpen ? "" : "hidden"
              }`}
              style={{ transform: "rotate(45deg)" }}
            ></div>
            <div
              className={`absolute block h-0.5 w-8 animate-pulse bg-purple-600 ${
                isNavOpen ? "" : "hidden"
              }`}
              style={{ transform: "rotate(135deg)" }}
            ></div>
          </label>
          {/* <div>
        <span className="absolute block h-0.5 w-12 bg-zinc-600 rotate-90 right-14"></span>
      </div> */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              className="btn btn-square btn-ghost text-right mr-4"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="p-2 shadow menu dropdown-content bg-base-100 rounded-box sm:w-52"
              style={{zIndex: 100}}
            >
              <li>
                <div className="form-control bg-opacity-100">
                  <VStack>
                    <label className="cursor-pointer label">
                      <a>Autoconnect</a>
                      <input
                        type="checkbox"
                        checked={autoConnect}
                        onChange={(e) => setAutoConnect(e.target.checked)}
                        className="toggle"
                      />
                    </label>
                    <NetworkSwitcherDynamic />
                  </VStack>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
