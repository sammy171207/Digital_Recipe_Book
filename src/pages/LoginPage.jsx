import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../feature/auth/authThunk';

const LoginPage = () => {
  const[form,setForm]=useState({email:"",password:""});
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const {loading,error}=useSelector(state=>state.auth);

   const handleSubmit = async e => {
    e.preventDefault();
    const res = await dispatch(loginUser(form));
    if (res.meta.requestStatus === "fulfilled") {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card w-full max-w-md">
        <h2 className="heading-main">Welcome back</h2>
        {error && <p className='text-red-500 mb-2'>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={form.email}
            onChange={e=>setForm({...form,email:e.target.value})}
            required
          />
          <label className="block mb-1">Password</label>
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={form.password}
            onChange={e=>setForm({...form,password:e.target.value})}
            required
          />
          <button
            type="submit"
            className="btn-main"
            disabled={loading}
          >
            {loading?"Loggging in...":"Log in"}
          </button>
        </form>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm">Remember me</span>
          <Link to="/forgot" className="link-subtle">Forgot password?</Link>
        </div>
        <p className="text-center mt-4 text-sm">
          Don't have an account? <Link to="/signup" className="link-subtle">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage