import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const { applicantId } = useParams();
  console.log("Applicant ID from useParams:", applicantId);
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!applicantId) {
      console.error("Applicant ID is undefined. Cannot fetch applicant data.");
      setLoading(false);
      return;
    }

    const fetchApplicant = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/applicants/${applicantId}`);
        console.log("API Response:", response.data); // Debugging
        setApplicant(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching applicant data:", error);
        setLoading(false);
      }
    };

    fetchApplicant();
  }, [applicantId]);

  if (loading) return <p>Loading...</p>;
  if (!applicant) return <p>Applicant not found.</p>;

  return (
    <div className="profile-container">
      <h2>Applicant Profile</h2>
      <div className="profile-card">
        <div className="profile-details">
          <p><strong>Username:</strong> {applicant.username}</p>
          <p><strong>Email:</strong> {applicant.email}</p>
          <p><strong>Institute:</strong> {applicant.institute}</p>
          <p><strong>End Year:</strong> {applicant.endYear}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
