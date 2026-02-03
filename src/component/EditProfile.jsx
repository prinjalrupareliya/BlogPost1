import { useEffect, useState } from "react";
import "./EditProfile.css";
import { toast } from "react-toastify";

export default function EditProfile({ userId, onClose }) {
  const [loading, setLoading] = useState(false);

  const loginData = JSON.parse(localStorage.getItem("loginData")) || {};

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    otp: "",
    role: ""
  });

  useEffect(() => {
    if (userId) {
      fetchUserById();
    }
  }, [userId]);

  const fetchUserById = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://696f406ca06046ce6185dc65.mockapi.io/user/${userId}`
      );
      const data = await response.json();

      setFormData({
        fullName: data?.fullName || data?.name || "",
        mobile:
          loginData?.mobile ||
          loginData?.mobileNumber ||
          loginData?.phone ||
          loginData?.phoneNumber ||
          "",
        otp: loginData?.otp || "",
        role: loginData?.role || ""
      });
    } catch (error) {
      console.error("Fetch user error:", error);
      toast.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData.fullName.trim()) {
      toast.error("Full Name is required");
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }

    if (!userId) {
      toast.error("User ID missing");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `https://696f41b3a06046ce6185e454.mockapi.io/User/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: formData.fullName,
            fullName: formData.fullName,
            mobile: formData.mobile
          })
        }
      );

      if (!response.ok) throw new Error("Update failed");

      const updatedUser = await response.json();

      // update localStorage
      localStorage.setItem(
        "loginData",
        JSON.stringify({
          ...loginData,
          fullName: updatedUser.fullName || updatedUser.name,
          mobile: updatedUser.mobile || formData.mobile
        })
      );

      toast.success("Profile updated successfully");
      onClose();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-overlay">
      <div className="profile-modal">
        <h2>Edit Profile</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
            />

            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile Number"
            />

            <select value={formData.role} disabled>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>

            <input
              type="text"
              value={formData.otp}
              disabled
              placeholder="OTP"
            />

            <div className="btn-group">
              <button className="btn cancel" onClick={onClose}>
                Cancel
              </button>
              <button className="btn save" onClick={handleSave}>
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}