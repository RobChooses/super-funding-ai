import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

export default function Header() {
  const [hideConnectBtn, setHideConnectBtn] = useState(false);
  const { connect } = useConnect();

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      setHideConnectBtn(true);
      connect({ connector: injected({ target: "metaMask" }) });
    }
  }, []);

  return (
    <Disclosure
      as="nav"
      className="bg-black border-b border-black w-screen py-2"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-white focus:outline-none focus:ring-1 focus:ring-inset focus:rounded-none focus:ring-black">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  {/* <Image
                    className="block h-8 w-auto sm:block lg:block"
                    src="/logo.svg"
                    width="24"
                    height="24"
                    alt="Celo Logo"
                  /> */}
                  <h3 className="text-white ">Super Funding-AI</h3>
                </div>
              </div>
            
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {!hideConnectBtn && (
                  <ConnectButton
                    showBalance={{
                      smallScreen: false,
                      largeScreen: true,
                    }}
                    
                  />
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-4">
              <Disclosure.Button
                as="a"
                href="#"
                className="block border-l-4 border-white py-2 pl-3 pr-4 text-base font-medium text-white"
              >
                Home
              </Disclosure.Button>
              {/* Add here your custom menu elements */}
              <Disclosure.Button
                as="a"
                href="create-project"
                className="block border-l-4 border-white py-2 pl-3 pr-4 text-base font-medium text-white"
              >
                Create project
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="attest-prompt"
                className="block border-l-4 border-white py-2 pl-3 pr-4 text-base font-medium text-white"
              >
                Attest prompt
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
