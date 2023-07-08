import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router';
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";

import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import LoginRightBar from '../../components/LoginRightBar';

export default function Login() {

    const router = useRouter();

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const [loginData, setLoginData] = useState({ email: '', password: '' });
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
                if (response.auth) router.push("/");
            } else {
                console.log('login error');
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
        setLoginData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleLoginSubmit = async () => {
        const res = await fetch(`api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: loginData })
        });

        const response = await res.json()

        if (res.status === 200) {
            if (response.status === false) {
                setResponseError(response.msg)
            } else {
                localStorage.setItem('userToken', 'Bearer ' + response.token);
                setLoginData({ email: '', password: '' });
                router.push(`/`)
            }
        } else {
            console.log('login error');
        }
    };

    return (
        <main className='flex justify-center items-center w-full min-h-screen'>
            <div className="bg-white rounded-2xl shadow-2xl  max-w-4xl flex w-2/3 ">
                <div className='p-5 w-12/12 md:w-6/12 lg:w-6/12'>
                    <div className='text-left font-bold'>
                        <span className="text-primary">Threeway</span>Studio
                    </div>
                    <div className="py-10 text-center">
                        <h2 className='text-3xl font-bold text-primary mb-2'> Login Your Account </h2>
                        <div className='w-fit mx-auto'>
                            <div className=' bg-primary border-2 w-10 border-primary inline-block mb-2'></div>
                        </div>
                        <div className='flex flex-col items-center'>
                            <form className='w-full' onSubmit={handleSubmit(handleLoginSubmit)}>
                                <div className='mx-auto w-[75%]'>
                                    {responseError && <p className='font-normal text-xs m-0 text-left text-red-600'>{responseError}</p>}
                                    <FormInput
                                        icon={EnvelopeIcon}
                                        type='email'
                                        name='email'
                                        id='email'
                                        placeholder='Email'
                                        value={loginData.email}
                                        errors={errors.email}
                                        handleChangeForm={handleChange}
                                        {...register('email', { required: { value: true, message: 'Email is Required' }, pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' } })}
                                    />
                                    <FormInput
                                        icon={LockClosedIcon}
                                        type='password'
                                        name='password'
                                        id='password'
                                        placeholder='Password'
                                        value={loginData.password}
                                        errors={errors.password}
                                        handleChangeForm={handleChange}
                                        {...register('password', { required: { value: true, message: 'Password is Required' }, minLength: { value: 8, message: 'Min length is 8', } })}
                                    />
                                    <Button text='Login' classname={'text-primary border-primary hover:bg-primary hover:text-white '} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <LoginRightBar title={'Hello, Friends!'} subParagraph={'Thanking consumers who created an account,  Greeting returning visitors'} linkUrl={'register'} linkTittle={'Register'} />
            </div>
        </main>
    );
}
