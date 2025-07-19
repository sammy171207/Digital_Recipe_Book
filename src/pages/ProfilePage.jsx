import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCloudinaryUpload } from '../utils/useCloudinaryUpload';
import { auth } from '../firebase/config';
import {
  updateProfile,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from 'firebase/auth';

const CLOUDINARY_UPLOAD_PRESET = 'unsigned_upload';

const ProfilePage = () => {
  const user = useSelector((state) => state.auth.user);
  const [form, setForm] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    password: '',
    image: user?.photoURL || '',
  });

  const fileInputRef = useRef();
  const { upload, uploading, error: uploadError, url: uploadedUrl } = useCloudinaryUpload(CLOUDINARY_UPLOAD_PRESET);

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {
    if (uploadedUrl) {
      setForm((f) => ({ ...f, image: uploadedUrl }));
    }
  }, [uploadedUrl]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await upload(file);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: form.name,
          photoURL: form.image,
        });
        // Force reload user info in Redux/localStorage
        localStorage.setItem('user', JSON.stringify(auth.currentUser));
      }

      if (form.email !== user.email) {
        if (!form.password) {
          setError('Enter your current password to change email.');
          return;
        }
        const credential = EmailAuthProvider.credential(user.email, form.password);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updateEmail(auth.currentUser, form.email);
      }

      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Update failed.');
    }
  };

  const handlePasswordInputChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, passwordForm.currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, passwordForm.newPassword);
      setPasswordSuccess('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setPasswordError(err.message || 'Password update failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Profile Form */}
        <form
          onSubmit={handleProfileUpdate}
          className="bg-white shadow-lg rounded-xl p-6 space-y-6 border border-gray-200"
        >
          <h2 className="text-2xl font-semibold text-gray-800">Update Profile</h2>

          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden shadow-inner">
              {form.image ? (
                <img src={form.image} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                <div className="flex items-center justify-center h-full text-4xl text-gray-400">👤</div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <button
              type="button"
              className="mt-3 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition"
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Change Photo'}
            </button>
            {uploadError && <p className="text-red-500 text-sm mt-1">{uploadError}</p>}
          </div>

          {success && <p className="text-green-600">{success}</p>}
          {error && <p className="text-red-600">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={form.name}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={form.email}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Current Password (for email change)</label>
            <input
              type="password"
              name="password"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={form.password}
              onChange={handleInputChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-full transition"
          >
            Save Changes
          </button>
        </form>

        {/* Password Form */}
        <form
          onSubmit={handlePasswordUpdate}
          className="bg-white shadow-lg rounded-xl p-6 space-y-6 border border-gray-200"
        >
          <h2 className="text-2xl font-semibold text-gray-800">Change Password</h2>

          {passwordError && <p className="text-red-600">{passwordError}</p>}
          {passwordSuccess && <p className="text-green-600">{passwordSuccess}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={passwordForm.currentPassword}
              onChange={handlePasswordInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              name="newPassword"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={passwordForm.newPassword}
              onChange={handlePasswordInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              name="confirmNewPassword"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={passwordForm.confirmNewPassword}
              onChange={handlePasswordInputChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-full transition"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
