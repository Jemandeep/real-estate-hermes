"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; 
import { auth, db, storage } from "../../../firebase"; 
import Layout from "../../components/Layout"; 
import { FiMail, FiLock, FiPhone, FiUser, FiLinkedin, FiFileText, FiEye, FiEyeOff } from "react-icons/fi"; 

export default function AgentSignup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [linkedIn, setLinkedIn] = useState(""); 
  const [proofOfCertification, setProofOfCertification] = useState(null); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false); 

  const router = useRouter();

  const handleFileChange = (e) => {
    setProofOfCertification(e.target.files[0]); 
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Upload the proof of certification file to Firebase Storage
      let certificationURL = "";
      if (proofOfCertification) {
        const fileRef = ref(storage, `certifications/${user.uid}/${proofOfCertification.name}`);
        const uploadResult = await uploadBytes(fileRef, proofOfCertification);
        certificationURL = await getDownloadURL(uploadResult.ref);
      }

      // Add agent details to Firestore under the "users" collection
      await setDoc(doc(db, "users", email), {
        email: email,
        name: lastName ? `${firstName} ${lastName}` : firstName,
        licenseNumber: licenseNumber,
        agencyName: agencyName,
        phoneNumber: phoneNumber,
        linkedIn: linkedIn || null,
        certificationURL: certificationURL, 
        role: "pending_agent" // Initially set the role as "pending_agent"
      });

      setSuccess("Signup successful! Your account is pending approval.");
      setError("");
      setLoading(false);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      setError("Signup failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
          <h2 className="text-2xl font-semibold text-center mb-6">Sign Up - Agent</h2>
          
          {loading && (
            <p className="text-center text-blue-500 mb-4">Processing... Please wait</p>
          )}

          <form onSubmit={handleSignup} className="grid grid-cols-2 gap-6">
            {/* First Name */}
            <div className="flex items-center mb-4">
              <FiUser className="text-gray-500 text-xl mr-2" />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="First Name"
                required
              />
            </div>

            {/* Last Name (Optional) */}
            <div className="flex items-center mb-4">
              <FiUser className="text-gray-500 text-xl mr-2" />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Last Name (Optional)"
              />
            </div>

            {/* Email */}
            <div className="flex items-center mb-4">
              <FiMail className="text-gray-500 text-xl mr-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Email"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="flex items-center mb-4">
              <FiPhone className="text-gray-500 text-xl mr-2" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Phone Number"
                required
              />
            </div>

            {/* Password with Toggle */}
            <div className="flex items-center mb-4 relative">
              <FiLock className="text-gray-500 text-xl mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <FiEyeOff className="text-gray-500" /> : <FiEye className="text-gray-500" />}
              </button>
            </div>

            {/* Confirm Password with Toggle */}
            <div className="flex items-center mb-4 relative">
              <FiLock className="text-gray-500 text-xl mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Confirm Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <FiEyeOff className="text-gray-500" /> : <FiEye className="text-gray-500" />}
              </button>
            </div>

            {/* License Number */}
            <div className="flex items-center mb-4">
              <FiFileText className="text-gray-500 text-xl mr-2" />
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="License Number"
                required
              />
            </div>

            {/* Agency Name */}
            <div className="flex items-center mb-4">
              <FiFileText className="text-gray-500 text-xl mr-2" />
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Agency Name"
                required
              />
            </div>

            {/* LinkedIn Profile (Optional) */}
            <div className="flex items-center mb-4">
              <FiLinkedin className="text-gray-500 text-xl mr-2" />
              <input
                type="url"
                value={linkedIn}
                onChange={(e) => setLinkedIn(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="LinkedIn Profile (Optional)"
              />
            </div>

            {/* Proof of Certification */}
            <div className="flex flex-col mb-4">
              <label className="text-gray-700 mb-2">Proof of Certification</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Error and Success Messages */}
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg transition-transform transform hover:scale-105 duration-300"
              disabled={loading} 
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
