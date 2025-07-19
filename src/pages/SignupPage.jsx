import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../feature/auth/authThunk';

const SignupPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await dispatch(signupUser(form));
    if (res.meta.requestStatus === 'fulfilled') {
      navigate('/login');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card w-full max-w-md">
        <h2 className="heading-main">Create your account</h2>
        {error && <p className='text-red-500 mb-2'>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="input"
            placeholder="Enter your email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <label className="block mb-1">Password</label>
          <input
            type="password"
            className="input"
            placeholder="Create a password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          <button
            type="submit"
            className="btn-main"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Already have an account? <Link to="/login" className="link-subtle">Log in</Link>
        </p>
      </div>
    </div>
  )
}

export default SignupPage