import React from 'react';
import { useAppContext } from '../../context/AppContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const { profile, loading, error } = useAppContext();

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!profile) return <div>No profile data available</div>;

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      
      <div className="profile-details">
        <div className="profile-row">
          <label>Your Name</label>
          <div>{profile.name}</div>
        </div>
        
        <div className="profile-row">
          <label>Email</label>
          <div>{profile.email}</div>
        </div>
        
        <div className="profile-row">
          <label>Date of Birth</label>
          <div>{profile.date_of_birth || 'N/A'}</div>
        </div>
        
        <div className="profile-row">
          <label>Permanent Address</label>
          <div>{profile.permanent_address || 'N/A'}</div>
        </div>
        
        <div className="profile-row">
          <label>Postal Code</label>
          <div>{profile.postal_code || 'N/A'}</div>
        </div>
        
        <div className="profile-row">
          <label>Present Address</label>
          <div>{profile.present_address || 'N/A'}</div>
        </div>
        
        <div className="profile-row">
          <label>City</label>
          <div>{profile.city || 'N/A'}</div>
        </div>
        
        <div className="profile-row">
          <label>Country</label>
          <div>{profile.country || 'N/A'}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;