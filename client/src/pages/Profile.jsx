import React, { useEffect, useState } from 'react';

const User = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseURL =
    window.location.hostname === "localhost"
      ? "http://localhost:4000"
      : "https://blog-hub-api-kow3.onrender.com";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${baseURL}/profile`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch user profile");
        }

        const data = await response.json();
        setUser(data.user); // Assuming the user data is under the 'user' key
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [baseURL]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>; // Display error message
  }

  return (
    <div className="max-w-md mx-auto bg-white p-5 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      {user ? (
        <>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email || 'N/A'}</p>
          <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          {/* Add more user fields as needed */}
        </>
      ) : (
        <div>No user information available.</div>
      )}
    </div>
  );
};

export default User;
