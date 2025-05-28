// src/hooks/useUserProfiles.js
import { useState, useEffect } from 'react';
import { getUserProfile } from '../services/api';

export const useUserProfiles = (userIds) => {
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!userIds || userIds.length === 0) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Get unique user IDs
        const uniqueIds = [...new Set(userIds.filter(id => id))];
        
        // Fetch profiles in parallel
        const profilePromises = uniqueIds.map(id => getUserProfile(id));
        const profileResults = await Promise.all(profilePromises);
        
        // Create mapping of user IDs to profiles
        const profilesMap = profileResults.reduce((acc, profile) => {
          if (profile && profile.id) acc[profile.id] = profile;
          return acc;
        }, {});

        setProfiles(profilesMap);
      } catch (err) {
        console.error('Error fetching user profiles:', err);
        setError('Failed to load some user profiles');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [userIds]);

  return { profiles, loading, error };
};