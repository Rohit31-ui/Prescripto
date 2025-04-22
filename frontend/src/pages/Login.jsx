import React, { useState } from 'react'

const Login = () => {
  const [state, setState] = useState('Sign Up')

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    // Form submission logic here
  }

  return (
    <form onSubmit={onSubmitHandle} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-3xl font-semibold'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
        <p>Please {state === 'Sign Up' ? "sign up" : "log in"} to book appointment</p>


        {/*------------- Name input for signup -------------------------*/}
        {state === 'Sign Up' && (
          <div className='w-full'>
            <p>Full Name</p>
            <input
              type="text"
              className='border border-zinc-300 rounded w-full p-2 mt-1'
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}
      {/*----------------- Email input----------------------- */}
        <div className='w-full'>
          <p>Email</p>
          <input
            type="email"
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        {/*------------------ Password ----------------------*/}
        <div className='w-full'>
          <p>Password</p>
          <input
            type="password"
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <button
          type="submit"
          className='bg-blue-500 text-white cursor-pointer w-full py-2 rounded-md text-base'>
          {state === 'Sign Up' ? "Create Account" : "Login"}
        </button>

        {state === "Sign Up" ? (
          <p>
            Already have an account?{' '}
            <span
              onClick={() => setState('Login')}
              className='text-blue-500 underline cursor-pointer'>
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{' '}
            <span
              onClick={() => setState('Sign Up')}
              className='text-blue-500 underline cursor-pointer'>
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  )
}

export default Login
