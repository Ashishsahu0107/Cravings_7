import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../config/ApiConfig";

const Register = () => {
  const userType = useParams().userType; // Get userType from URL params (if needed)
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userType: userType || "customer",
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUserTypeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      userType: e.target.value,
    }));
  };

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!data.email.trim()) newErrors.email = "Email is required";
    if (!data.phone.trim()) newErrors.phone = "Phone number is required";
    if (!data.gender) newErrors.gender = "Gender is required";
    if (!data.dob) newErrors.dob = "Date of birth is required";
    if (!data.password || data.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!data.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    if (data.password !== data.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!data.agreeTerms)
      newErrors.agreeTerms = "You must agree to terms and conditions";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    console.log("Form submitted:", formData);

    try {
      const res = await api.post("/auth/register", {
        ...formData,
        email: formData.email.toLowerCase(),
      });
      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unknown error occurred during registration. Please try again.",
      );
    } finally {
      setLoading(false);
    }
    // Handle registration here
  };

  return (
    <div className="h-[90vh] bg-[url('/foodTable.webp')] flex items-center justify-end bg-cover bg-center p-10 md:pe-30">
      <div className="bg-white rounded-lg shadow-md px-10 py-6 max-w-md w-full overflow-y-auto max-h-[85vh]">
        <h1 className="text-3xl font-bold text-primary mb-2 text-center">
          Create Account
        </h1>
        <p className="text-secondary text-center mb-4">
          Join us as a Customer, Restaurant, or Rider
        </p>

        {/* User Type Selection */}
        <div className="mb-6">
          <label className="block text-neutral font-semibold mb-3">
            Register as:
          </label>
          <div className="flex gap-5">
            {["customer", "restaurant", "rider"].map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="userType"
                  value={type}
                  checked={formData.userType === type}
                  onChange={handleUserTypeChange}
                  className="cursor-pointer"
                />
                <span className="text-neutral capitalize">
                  {type}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-4">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className={`w-full px-3 py-2 border rounded-md text-sm text-neutral placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.fullName
                  ? "border-error border-2"
                  : "border-base-300"
              }`}
            />
            {errors.fullName && (
              <span className="text-error text-xs mt-1 block">
                {errors.fullName}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className={`w-full px-3 py-2 border rounded-md text-sm text-neutral placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.email
                  ? "border-error border-2"
                  : "border-base-300"
              }`}
            />
            {errors.email && (
              <span className="text-error text-xs mt-1 block">
                {errors.email}
              </span>
            )}
          </div>

          {/* Phone */}
          <div className="mb-4">
           
            <input
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              className={`w-full px-3 py-2 border rounded-md text-sm text-neutral placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.phone
                  ? "border-error border-2"
                  : "border-base-300"
              }`}
            />
            {errors.phone && (
              <span className="text-error text-xs mt-1 block">
                {errors.phone}
              </span>
            )}
          </div>

          {/* Gender & Date of Birth */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.gender
                    ? "border-error border-2"
                    : "border-base-300"
                }`}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <span className="text-error text-xs mt-1 block">
                  {errors.gender}
                </span>
              )}
            </div>
            <div>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md text-sm text-neutral focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.dob
                    ? "border-error border-2"
                    : "border-base-300"
                }`}
              />
              {errors.dob && (
                <span className="text-error text-xs mt-1 block">
                  {errors.dob}
                </span>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
          
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className={`w-full px-3 py-2 border rounded-md text-sm text-neutral placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.password
                  ? "border-error border-2"
                  : "border-base-300"
              }`}
            />
            {errors.password && (
              <span className="text-error text-xs mt-1 block">
                {errors.password}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <input
              type="text"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              className={`w-full px-3 py-2 border rounded-md text-sm text-neutral placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.confirmPassword
                  ? "border-error border-2"
                  : "border-base-300"
              }`}
            />
            {errors.confirmPassword && (
              <span className="text-error text-xs mt-1 block">
                {errors.confirmPassword}
              </span>
            )}
          </div>
          <div className="mb-6">
            <label className="flex items-start gap-2 cursor-pointer text-secondary">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="mt-1 cursor-pointer"
              />
              <span className="text-sm">
                I agree to the{" "}
                <span className="text-primary hover:underline">
                  terms and conditions.
                </span>
              </span>
            </label>
            {errors.agreeTerms && (
              <span className="text-error text-xs mt-1 block ml-7">
                {errors.agreeTerms}
              </span>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-3 bg-primary text-white font-semibold rounded-md hover:bg-orange-700 transition-colors duration-300 mb-4"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-secondary text-sm">
          Already registered?{" "}
          <Link
            to="/login"
            className="text-primary font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
