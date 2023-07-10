import React, { useState, useEffect, useCallback } from 'react'
import jwt from 'jwt-decode'
import { useRouter } from 'next/router';
import { EnvelopeIcon, LockClosedIcon, UserCircleIcon, HomeIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";

import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import Layout from '../../components/Layout';
import { useSocketContext } from '../../context/socket'


const CreateOrder = () => {

    const { socket } = useSocketContext();
    const router = useRouter();

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const [orderData, setOrderData] = useState({ from: '', to: '', quantity: '1ton', transporter: '' });
    const [dropError, setDropError] = useState({});
    const [responseError, setResponseError] = useState('');
    const [transporters, setTransporters] = useState([])

    const [userRoleData, setUserRoleData] = useState('');
    const [userData, setUserData] = useState({
        id: '',
        name: '',
        email: ''
    })



    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem("userToken")) {
                const jwtDecode = jwt(localStorage.getItem("userToken"));
                const userValue = jwtDecode.user;
                const [email, name, userRole, userId] = userValue.split(' ');
                setUserRoleData(userRole)
                setUserData({ ...userData, email, name, id: userId })
            } else {
                router.push("/login")
            }
        }
    }, [])

    const fetchTransporters = useCallback(async () => {
        try {
            const res = await fetch(`api/getTransporters`, {
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
                    setTransporters(response);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrderData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCreateOrderSubmit = async () => {
        if (orderData.transporter == '') {
            setDropError({ ...dropError, transporterError: 'Please select a Transporter' })
            return
        }

        setDropError('')
        const res = await fetch(`api/createOrder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem("userToken")
            },
            body: JSON.stringify({ data: orderData })
        });
        const response = await res.json()

        socket?.emit('send-message', {
            senderId: userData.id,
            receiverId: orderData.transporter,
            text: `You have a New Order. Order id: ${response?.OrderID}`,
        });

        const singleConversation = await fetch(`api/getSingleConversation?senderId=${userData.id}&receiverId=${orderData.transporter}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem("userToken")
            },
        });
        const singleConversationResponse = await singleConversation.json()

        const message = {
            sender: userData?.id,
            text: `You have a New Order. Order id: ${response?.OrderID}`,
            conversationId: singleConversationResponse._id
        }

        const newMsgRes = await fetch(`api/newMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem("userToken")
            },
            body: JSON.stringify(message)
        });

        if (res.status === 200) {
            if (response.status === false) {
                setResponseError(response.msg)
            } else {
                if (response.auth === false) router.push('/login')
                setOrderData({ from: '', to: '', quantity: '1ton', transporter: '' });
            }
        } else {
            console.log('CreateOrder error', res);
        }
    };

    return (
        <Layout role={userRoleData}>
            <div className="block md:ml-[250px] p-4 w-full">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white py-6">
                    <form className='w-full' onSubmit={handleSubmit(handleCreateOrderSubmit)}>
                        <div className='mx-auto w-[75%]'>
                            <FormInput
                                icon={UserCircleIcon}
                                type='text'
                                id='from'
                                name='from'
                                placeholder='From'
                                value={orderData?.from}
                                errors={errors.from}
                                handleChangeForm={handleChange}
                                {...register('from', { required: { value: true, message: 'From is Required' }, minLength: { value: 3, message: 'From should have at least 3 characters' } })}
                            />
                            <FormInput
                                icon={EnvelopeIcon}
                                type='text'
                                name='to'
                                id='to'
                                placeholder='To'
                                value={orderData?.to}
                                errors={errors.to}
                                handleChangeForm={handleChange}
                                {...register('to', { required: { value: true, message: 'To is Required' }, minLength: { value: 3, message: 'To should have at least 3 characters' } })}
                            />
                            <div className='bg-gray-100 p-2 flex items-center mb-2'>
                                <UserGroupIcon className='text-gray-400 m-2 h-6 w-6' />
                                <select
                                    className='bg-gray-100 outline-none text-sm flex-1'
                                    value={orderData?.quantity}
                                    onInput={handleChange}
                                    name='quantity'
                                    {...register('quantity', { required: true })}>
                                    <option value="1ton" defaultValue={'1'}>1 Ton</option>
                                    <option value="2ton">2 Ton</option>
                                    <option value="3ton">3 Ton</option>
                                </select>
                            </div>
                            <div className='bg-gray-100 p-2 flex items-center mb-2'>
                                <UserGroupIcon className='text-gray-400 m-2 h-6 w-6' />
                                <select
                                    className='bg-gray-100 outline-none text-sm flex-1'
                                    value={orderData.transporter}
                                    onInput={handleChange}
                                    name='transporter'
                                    {...register('transporter', { required: true })}

                                >
                                    <option hidden defaultValue> Select Transporter </option>
                                    {Array.isArray(transporters)
                                        ? transporters.map((transporter, index) => (
                                            <option value={transporter?._id} key={index}>{transporter?.username}</option>
                                        ))
                                        : <option value="">No transporters available</option>
                                    }
                                </select>
                            </div>
                            {dropError?.transporterError && <p className='font-normal text-xs m-0 mb-3 text-left text-red-600'>{dropError?.transporterError}</p>}
                            <div className='mx-auto w-fit'>
                                <Button text='Create Order' classname={'text-white bg-primary hover:border-primary hover:text-white px-6 py-4'} />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default CreateOrder;