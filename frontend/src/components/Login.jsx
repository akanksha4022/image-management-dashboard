import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { handleError, handleSuccess } from '../utils'
const LogIn = () => {
    const [logInInfo, setLogInInfo] = useState({        
        email:"",
        password:""
    });

    const navigate = useNavigate();

    const handleChange = (e)=>{
        const {name, value} = e.target;
        console.log(name, value);
        const copyLogInInfo= {...logInInfo};
        copyLogInInfo[name] = value;
        setLogInInfo(copyLogInInfo);
    }
    console.log('Login info', logInInfo)
    
    const handleLogIn = async(e)=>{
        e.preventDefault();
        const { email, password } = logInInfo;
        if(!email || !password){
            return handleError('All field  email and passwrd is required');
        }
        try {
            const url =`${import.meta.env.VITE_API_URL}/auth/login`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(logInInfo)
            });
            const result = await response.json();
            

            const  {success, message, jwtToken, name, error} = result;
            if(success){
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);

                setTimeout(()=>{
                    navigate('/dashboard')
                },1000)
            }else if(error){
                const details = error?.details[0].message;
                handleError(details);
            }else if(!success){
                handleError(message);
            }

            console.log(result);
        } catch (error) {
            
            handleError(error);
        }
    }

  return (
    <div className='container p-7 border-2 border-[#ffcfca] w-[30vw] mt-[8rem] rounded-3xl'>
      <h1 className='font-bold text-3xl text-center p-4'>Logz In</h1>
      <div className='flex items-center justify-center w-[100%]'>
        <form onSubmit={handleLogIn}>
        
            <div className='p-2 flex flex-col '>
                <label htmlFor="email">Email</label>
                <input  
                    onChange={handleChange}
                    className='border-2 rounded-lg p-2 border-[#ffcfca]'          
                    type='email'
                    name='email'
                    value={logInInfo.email}
                    autoFocus
                    placeholder='Enter your email...' 
                />
            </div>
            <div className='p-2 flex flex-col '>
                <label htmlFor="password">Password</label>
                <input 
                    onChange={handleChange}
                    className='border-2 rounded-lg p-2 border-[#ffcfca]'        
                    type='password'
                    name='password'
                    value={logInInfo.password}
                    autoFocus
                    placeholder='Enter your password...' 
                />
            </div>
            <div className='flex flex-col p-2 gap-1'>
                <button type='submit' className='w-[100%] bg-[#ffcfca] text-black font-semibold p-2 rounded-3xl cursor-pointer'>LogIn</button>
                <span>Want to Create an Account?
                    <Link className="text-brown font-bold" to="/signup"> SignUp</Link>
                </span>
            </div>
        
        </form>
      </div>
      
    <ToastContainer />
    </div>
  )
}

export default LogIn
