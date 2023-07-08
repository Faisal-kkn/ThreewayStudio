import { useCallback, useEffect, useState } from 'react';
import Layout from "./Layout";

function Manufacturer({ userRole }) {

    const [orderRequests, setOrderRequests] = useState([])
    const [search, setSearch] = useState('')

    const fetchTransporters = useCallback(async () => {
        try {
            const res = await fetch(`api/getOrders`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem("userToken")
                }
            });

            const response = await res.json();
            if (res.status === 200) {
                if (response.status === false) {
                    // setResponseError(response.msg);
                } else {
                    if (response.auth === false) router.push('/login')
                    setOrderRequests(response);
                }
            } else {
                console.log('error');
            }
        } catch (error) {
            console.log('error');
        }
    }, []);

    useEffect(() => {
        fetchTransporters();
    }, [fetchTransporters]);

    const searchOrder = async (e) => {
        try {
            e.preventDefault()

            const res = await fetch(`api/searchOrder?search=${search}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem("userToken")
                }
            });

            const response = await res.json();
            if (res.status === 200) {
                if (response.status === false) {
                    // setResponseError(response.msg);
                } else {
                    if (response.auth === false) router.push('/login')
                    setOrderRequests(response)
                }
            } else {
                console.log('search error');
            }
        } catch (error) {
            console.log('error');
        }
    }


    return (
        <Layout role={userRole}>
            <div className="block md:ml-[250px] p-4 w-full">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <form className='mb-2' onSubmit={(e) => searchOrder(e)}>
                        <label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input type="search" id="default-search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." onKeyUp={(e) => setSearch(e.target.value)} />
                            <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                        </div>
                    </form>
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Order ID
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    From
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    To
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Quantity
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Transporter
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orderRequests?.map((request, index) => {
                                    return (
                                        <tr key={index + 'request'} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="px-6 py-4">{request.OrderID}</td>
                                            <td className="px-6 py-4">{request.from}</td>
                                            <td className="px-6 py-4">{request.to}</td>
                                            <td className="px-6 py-4">{request.quantity}</td>
                                            <td className="px-6 py-4">{request.transporter?.username}</td>
                                            <td className="px-6 py-4">{request?.status}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>

    );
}

export default Manufacturer;