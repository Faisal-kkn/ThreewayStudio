import { useCallback, useEffect, useState } from 'react';
import Layout from "./Layout";

function Manufacturer({ userRole }) {

    const [orderRequests, setOrderRequests] = useState([])

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
                    console.log(response, 'response order get');
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

    return (
        <Layout role={userRole}>
            <div className="block md:ml-[250px] p-4 w-full">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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