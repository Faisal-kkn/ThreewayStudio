import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router';
import { EnvelopeIcon, LockClosedIcon, UserCircleIcon, HomeIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";

import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import LoginRightBar from '../../components/LoginRightBar';

export default function Register() {

    const router = useRouter();

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const [registerData, setRegisterData] = useState({ username: '', email: '', password: '', userType: '', address: '' });
    const [userTypeError, setUserTypeError] = useState('');
    const [responseError, setResponseError] = useState('');

    const jwtValidation = useCallback(async () => {
        try {
            const res = await fetch(`api/authentication`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem("userToken")
                },
            });

            const response = await res.json()
            if (res.status === 200) {
                if (response.auth) router.push('/')
                else router.push("/register");
            } else {
                console.log('signup error');
            }
        } catch (error) {
            console.log('error');
        }
    }, []);

    useEffect(() => {
        jwtValidation();
    }, [jwtValidation]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegisterData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleRegisterSubmit = async () => {
        if (registerData.userType == '') {
            setUserTypeError('Please select a valid User Type')
            return
        }

        setUserTypeError('')
        const res = await fetch(`api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: registerData })
        });

        const response = await res.json()
        console.log({response});
        if (res.status === 200) {
            if (response.status === false) {
                setResponseError(response.msg)
            } else {
                router.push(`/login`)
                setRegisterData({ username: '', email: '', password: '', userType: '', address: '' });
            }
        } else {
            console.log('signup error 2');
        }
    };

    return (
        <main className='flex justify-center items-center w-full min-h-screen'>
            <div className="bg-white rounded-2xl shadow-2xl md:flex lg:w-2/3 w-full max-w-4xl ">
                <div className='p-5 w-12/12 md:w-6/12 lg:w-6/12'>
                    <div className='text-left font-bold'>
                        <span className="text-primary">Threeway</span>Studio
                    </div>
                    <div className="py-10 text-center">
                        <h2 className='text-3xl font-bold text-primary mb-2'> Register Your Account </h2>
                        <div className='w-fit mx-auto'>
                            <div className=' bg-primary border-2 w-10 border-primary inline-block mb-2'></div>
                        </div>
                        <div className='flex flex-col items-center'>
                            <form className='w-full' onSubmit={handleSubmit(handleRegisterSubmit)}>
                                <div className='mx-auto w-[75%]'>

                                    <FormInput
                                        icon={UserCircleIcon}
                                        type='text'
                                        id='username'
                                        placeholder='User Name'
                                        value={registerData.username}
                                        errors={errors.username}
                                        handleChangeForm={handleChange}
                                        {...register('username', { required: { value: true, message: 'User name is Required' }, minLength: { value: 3, message: 'Username should have at least 3 characters' } })}
                                    />
                                    <FormInput
                                        icon={EnvelopeIcon}
                                        type='email'
                                        name='email'
                                        id='email'
                                        placeholder='Email'
                                        value={registerData.email}
                                        errors={errors.email}
                                        handleChangeForm={handleChange}
                                        {...register('email', { required: { value: true, message: 'Email is Required' }, pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' } })}
                                    />
                                    {responseError && <p className='font-normal text-xs m-0 mb-3 text-left text-red-600'>{responseError}</p>}
                                    <FormInput
                                        icon={LockClosedIcon}
                                        type='password'
                                        name='password'
                                        id='password'
                                        placeholder='Password'
                                        value={registerData.password}
                                        errors={errors.password}
                                        handleChangeForm={handleChange}
                                        {...register('password', { required: { value: true, message: 'Password is Required' }, minLength: { value: 8, message: 'Min length is 8', } })}
                                    />
                                    <div className='bg-gray-100 p-2 flex items-center mb-2'>
                                        <UserGroupIcon className='text-gray-400 m-2 h-6 w-6' />
                                        <select
                                            className='bg-gray-100 outline-none text-sm flex-1'
                                            value={registerData.userType}
                                            onInput={handleChange}
                                            name='userType'
                                            {...register('userType', { required: true })}

                                        >
                                            <option hidden defaultValue>
                                                User Type
                                            </option>
                                            <option value="manufacturer">Manufacturer</option>
                                            <option value="transporter">Transporter</option>
                                        </select>
                                    </div>
                                    {userTypeError && <p className='font-normal text-xs m-0 mb-3 text-left text-red-600'>{userTypeError}</p>}
                                    <FormInput
                                        icon={HomeIcon}
                                        type='text'
                                        name='address'
                                        id='address'
                                        placeholder='Address'
                                        value={registerData.address}
                                        errors={errors.address}
                                        handleChangeForm={handleChange}
                                        {...register('address', { required: { value: true, message: 'Address is Required' }, minLength: { value: 10, message: 'Min length is 10', } })}
                                    />
                                    <Button text='Register' classname={'text-primary border-primary hover:bg-primary hover:text-white'} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <LoginRightBar title={'Hello, Friends!'} subParagraph={'Create new account. Already A Member?'} linkUrl={'login'} linkTittle={'Login'} />
            </div>
        </main>
    );
}
