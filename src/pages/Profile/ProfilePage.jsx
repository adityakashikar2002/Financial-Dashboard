import React, { useState, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { FiEdit2, FiCamera, FiSave, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import './ProfilePage.css';

const ProfilePage = () => {
  const { profile, loading, error, fetchData } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const fileInputRef = useRef(null);
  const [profilePic, setProfilePic] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Initialize form data when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        date_of_birth: profile.date_of_birth || '',
        permanent_address: profile.permanent_address || '',
        postal_code: profile.postal_code || '',
        present_address: profile.present_address || '',
        city: profile.city || '',
        country: profile.country || ''
      });
      setPreviewImage(profile.profile_pic_url || null);
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      // Here you would typically call an API to update the profile
      // await updateProfileApi(formData);
      // if (profilePic) {
      //   await uploadProfilePic(profilePic);
      // }
      setIsEditing(false);
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (loading) return (
    <div className="profile-loading">
      <div className="loading-spinner"></div>
      <p>Loading your profile...</p>
    </div>
  );

  if (error) return (
    <div className="profile-error">
      <div className="error-icon">!</div>
      <p>{error}</p>
      <button onClick={fetchData}>Retry</button>
    </div>
  );

  if (!profile) return (
    <div className="profile-empty">
      <FiUser size={48} />
      <p>No profile data available</p>
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-header">
        <motion.h1 
            className="profile-title"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            My Profile
          </motion.h1>
        {/* {isEditing ? (
          <button onClick={handleSaveClick} className="save-btn">
            <FiSave /> Save Changes
          </button>
        ) : (
          <button onClick={handleEditClick} className="edit-btn">
            <FiEdit2 /> Edit Profile
          </button>
        )} */}
      </div>

      <div className="profile-card">
        <div className="profile-pic-section">
          <div className="profile-pic-container">
            {previewImage ? (
              <img src={previewImage} alt="Profile" className="profile-pic" />
            ) : (
              <div className="profile-pic-placeholder">
                <FiUser size={48} />
              </div>
            )}
            {isEditing && (
              <>
                <button onClick={triggerFileInput} className="change-photo-btn">
                  <FiCamera /> Change Photo
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </>
            )}
          </div>
          <div className="profile-name">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="name-input"
              />
            ) : (
              <h2>{profile.name}</h2>
            )}
            <p className="profile-email">{profile.email}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-section">
            <h3>Personal Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{profile.date_of_birth || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Contact Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Present Address</label>
                {isEditing ? (
                  <textarea
                    name="present_address"
                    value={formData.present_address}
                    onChange={handleInputChange}
                    rows="3"
                  />
                ) : (
                  <p>{profile.present_address || 'Not specified'}</p>
                )}
              </div>

              <div className="detail-item">
                <label>Permanent Address</label>
                {isEditing ? (
                  <textarea
                    name="permanent_address"
                    value={formData.permanent_address}
                    onChange={handleInputChange}
                    rows="3"
                  />
                ) : (
                  <p>{profile.permanent_address || 'Not specified'}</p>
                )}
              </div>

              <div className="detail-item">
                <label>City</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{profile.city || 'Not specified'}</p>
                )}
              </div>

              <div className="detail-item">
                <label>Postal Code</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{profile.postal_code || 'Not specified'}</p>
                )}
              </div>

              <div className="detail-item">
                <label>Country</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{profile.country || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;