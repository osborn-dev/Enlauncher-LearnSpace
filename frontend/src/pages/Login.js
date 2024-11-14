import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export default function Login() {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

        return (
            <div className='flex items-center justify-center min-h-screen bg-gray-50'>
                <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-md'>
                    <h2 className='text-2xl font-semibold text-center text-gray-800 mb-8'>Welcome Back</h2>
    
                    <form className='space-y-6'>
                        <div className='space-y-2'>
                            <label htmlFor='email' className='block text-sm font-medium text-gray-600'>Email</label>
                            <input 
                                type='email'
                                id='email'
                                name='email'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                                placeholder='Enter your email'
                            />
                        </div>
    
                        <div className='space-y-2'>
                            <label htmlFor='username' className='block text-sm font-medium text-gray-600'>Username</label>
                            <input 
                                type='text'
                                id='username'
                                name='username'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                                placeholder='Enter your username'
                            />
                        </div>
    
                        <div className='space-y-2'>
                            <label htmlFor='password' className='block text-sm font-medium text-gray-600'>password</label>
                            <div className='relative'>
                                <input 
                                    type={passwordVisible ? 'text' : 'password'}
                                    id='password'
                                    name='password'
                                    className='w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                                    placeholder='Enter your password'
                                />
                                <button 
                                    type='button'
                                    onClick={togglePasswordVisibility}
                                    className='absolute inset-y-0 right-3 flex items-center text-gray-600'
                                >
                                    {passwordVisible ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                </button>
                        </div>
                            </div>
                            
    
                        <button 
                            type='submit'
                            className='w-full py-3 mt-6 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition duration-150'
                        >
                            Login
                        </button>
    
                        <div className='relative my-6'>
                            <div className='absolute inset-0 flex items-center'>
                                <div className='w-full border-t border-gray-300'></div>
                            </div>
                            <div className='relative flex justify-center text-sm'>
                                <span className='px-2 bg-white text-gray-500'>Or continue with</span>
                            </div>
                        </div>
    
                        <button 
                            type='button'
                            className='flex items-center justify-center w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150'
                        >
                            <FcGoogle size={24} className='mr-2' />
                            Sign in with Google
                        </button>
                    </form>
                </div>
            </div>
        )
    }
