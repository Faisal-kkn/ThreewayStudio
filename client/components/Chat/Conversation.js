import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link';

const Conversation = ({ conversation, userId }) => {

    const [user, setUser] = useState(null)

    const getUser = useCallback(async (Id) => {
        try {
            const res = await fetch(`api/getUser?userId=${Id}`, {
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
                    setUser(response);
                }
            } else {
                console.log('error');
            }
        } catch (error) {
            console.log('error');
        }
    }, []);

    useEffect(() => {
        const friendId = conversation.members.find(member => member !== userId)
        getUser(friendId)
    }, [getUser, conversation, userId])

    return (
        <div className='flex gap-2 bg-gray-200 p-4 items-center rounded-md'>
            <img src="https://img.freepik.com/free-icon/user_318-563642.jpg?q=10&h=200" alt="" className='w-10 h-10 rounded-full overflow-hidden' />
            <div>
                <h2 className='capitalize'><strong>{user?.username}</strong></h2>
                <h3>{user?.userType}</h3>
            </div>
        </div>
    )
};

export default Conversation;
