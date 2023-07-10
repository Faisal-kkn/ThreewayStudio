import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router';
import jwt from 'jwt-decode'

import Layout from '../../components/Layout'
import Conversation from '../../components/Chat/Conversation';
import MsgContent from '../../components/Chat/MsgContent';
import { useSocketContext } from '../../context/socket';


const CreateOrder = () => {
    const { socket } = useSocketContext();

    const router = useRouter();

    const [userRoleData, setUserRoleData] = useState('');
    const [userData, setUserData] = useState({
        id: '',
        name: '',
        email: ''
    })

    const [conversations, setConversations] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [arrivalMessages, setArrivalMessages] = useState(null)

    useEffect(() => {
        socket?.on('getMessage', (data) => {
            console.log(data, 'get msg');
            setArrivalMessages({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            })
        })
    }, [socket, messages, arrivalMessages])

    useEffect(() => {
        socket?.emit("addUser", userData.id)
    }, [socket])

    useEffect(() => {
        arrivalMessages && currentChat?.members.includes(arrivalMessages.sender) &&
            setMessages((prev) => [...prev, arrivalMessages])
    }, [arrivalMessages, currentChat])

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

    const fetchConversations = useCallback(async () => {
        try {
            const res = await fetch(`api/conversation?userId=${userData.id}`, {
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
                    setConversations(response);
                }
            } else {
                console.log('error');
            }
        } catch (error) {
            console.log('error');
        }
    }, [userData]);

    const fetchMessages = useCallback(async () => {
        try {
            const res = await fetch(`api/getChat?userId=${currentChat._id}`, {
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
                    console.log(response, 'messsages response');
                    setMessages(response);
                }
            } else {
                console.log('error');
            }
        } catch (error) {
            console.log('error');
        }
    }, [currentChat, arrivalMessages]);

    useEffect(() => {
        fetchMessages();
    }, [currentChat, arrivalMessages]);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations, userData]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        const message = {
            sender: userData?.id,
            text: newMessage,
            conversationId: currentChat._id
        }

        const receiverId = currentChat.members.find(member => member !== userData.id)

        socket?.emit('send-message', {
            senderId: userData.id,
            receiverId: receiverId,
            text: newMessage,
        });

        const res = await fetch(`api/newMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem("userToken")
            },
            body: JSON.stringify(message)
        });

        const response = await res.json()
        if (res.status === 200) {
            if (response.status === false) {

            } else {
                if (response.auth === false) router.push('/login')
                setNewMessage('')
                setMessages([...messages, response])
            }
        } else {
            console.log('CreateOrder error', res);
        }

    }

    return (
        <Layout role={userRoleData}>
            <div className="block md:ml-[250px] p-4 w-full">
                <div className="flex gap-4">
                    <div className='flex flex-col gap-3 bg-white p-3 h-[95vh] overflow-y-scroll'>
                        {
                            conversations?.map((user) => {
                                return (
                                    <div onClick={() => setCurrentChat(user)} className='cursor-pointer'>
                                        <Conversation conversation={user} userId={userData.id} />
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className='flex-1 bg-white p-3 overflow-y-scroll relative'>
                        {
                            currentChat ? <>
                                <div className='flex gap-2 bg-gray-100 p-2 items-center rounded-md mb-4'>
                                    <img src="https://img.freepik.com/free-icon/user_318-563642.jpg?q=10&h=200" alt="" className='w-10 h-10 rounded-full overflow-hidden' />
                                    <div>
                                        <h2><strong></strong></h2>
                                    </div>
                                </div>
                                <div className='h-[75vh] overflow-y-scroll'>
                                    {
                                        messages?.map((msg) => {
                                            return (
                                                <MsgContent message={msg} own={msg.sender === userData.id} />
                                            )
                                        })
                                    }
                                </div>
                                <div className='absolute bottom-4 left-5 w-[96%]'>
                                    <form onSubmit={handleSubmit}>
                                        <div className='bg-gray-100 p-2 flex items-center mb-2'>
                                            <input type="text" className='bg-gray-100 outline-none text-sm flex-1' value={newMessage} onChange={(e) => setNewMessage(e.target.value)} required />
                                            <button type='submit' className='bg-black text-white p-1 px-2'>Send</button>
                                        </div>
                                    </form>
                                </div>
                            </> : <h2>Open a conversation to start a chat.</h2>
                        }
                    </div>

                </div>
            </div>
        </Layout>
    )
}

export default CreateOrder;