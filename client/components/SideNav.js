import React, { useState, useEffect, useCallback } from 'react'
import { GiHamburgerMenu } from "react-icons/gi";
import { Disclosure } from "@headlessui/react";
import { useRouter } from 'next/router';
import { ComputerDesktopIcon, UserIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import Link from 'next/link';
import jwt from 'jwt-decode'


const SideNav = ({ userRole }) => {

    const router = useRouter();

    const [layouts, setLayouts] = useState([])

    const transporterLayout = [
        {
            Icon: 'ComputerDesktopIcon',
            title: 'Dashboard',
            link: '/'
        },
        {
            Icon: '',
            title: 'Order',
            link: '/createorder'
        },
        {
            Icon: '',
            title: 'Chats',
            link: '/chats'
        },
    ]

    const manufacturerLayout = [
        {
            Icon: 'ComputerDesktopIcon',
            title: 'Dashboard',
            link: '/'
        },
        {
            Icon: '',
            title: 'Create Order',
            link: '/createorder'
        },
        {
            Icon: '',
            title: 'Chats',
            link: '/chats'
        },
    ]

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (userRole === "transporter") {
                setLayouts(transporterLayout)
            } else if (userRole === "manufacturer") {
                setLayouts(manufacturerLayout)
            }
        }
    }, [userRole])

    const logout = () => {
        localStorage.removeItem('userToken');
        router.push("/login");
    };


    const jwtValidation = useCallback(async () => {
        try {
            const res = await fetch(`api/authentication`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem("userToken")
                }
            });

            const response = await res.json()
            if (res.status === 200) {
                if (!response.auth) {
                    router.push("/login");
                }
            } else {
                console.log('nav error');
            }
        } catch (error) {
            console.log('error');
        }
    }, []);

    useEffect(() => {
        jwtValidation();
    }, [jwtValidation]);


    return (
        <Disclosure as="nav">
            <Disclosure.Button className="md:hidden absolute top-4 right-4 inline-flex items-center peer justify-center rounded-md p-2 text-gray-800 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white group">
                <GiHamburgerMenu
                    className="block md:hidden h-6 w-6"
                    aria-hidden="true"
                />
            </Disclosure.Button>
            <div className="p-6 w-1/2 h-screen bg-white z-20 fixed top-0 -left-96 lg:left-0 lg:w-60  peer-focus:left-0 peer:transition ease-out delay-150 duration-200">
                <div className="flex flex-col justify-start item-center">
                    <h1 className="capitalize text-base text-center cursor-pointer font-bold text-blue-900 border-b border-gray-100 pb-4 w-full">
                        {userRole} <br /> Dashboard
                    </h1>
                    <div className=" my-4 border-b border-gray-100 pb-4">
                        {
                            layouts?.map((menu, index) => {
                                return (
                                    <div key={index} className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                                        <ComputerDesktopIcon className="text-dark m-2 h-6 w-6 group-hover:text-white" />
                                        <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                                            <Link href={menu.link} legacyBehavior><a>{menu.title}</a></Link>
                                        </h3>
                                    </div>
                                )
                            })
                        }
                    </div>

                    {/* logout */}
                    <div className=" my-4">
                        <div className="flex mb-2 justify-start items-center gap-4 pl-5 border border-gray-200  hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                            <ArrowLeftOnRectangleIcon className="text-dark m-2 h-6 w-6 group-hover:text-white" />
                            <button onClick={logout}>
                                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                                    Logout
                                </h3>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Disclosure>
    )
}

export default SideNav;