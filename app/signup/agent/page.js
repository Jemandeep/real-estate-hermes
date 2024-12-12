"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../../firebase";
import { FiMail, FiLock, FiPhone, FiUser, FiLinkedin, FiFileText } from "react-icons/fi";

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

  const router = useRouter();

  const handleFileChange = (e) => {
    setProofOfCertification(e.target.files[0]);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate inputs
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Upload certification file if provided
      let certificationURL = "";
      if (proofOfCertification) {
        const fileRef = ref(storage, `certifications/${user.uid}/${proofOfCertification.name}`);
        console.log("Uploading file to:", fileRef.fullPath);
        const uploadResult = await uploadBytes(fileRef, proofOfCertification);
        certificationURL = await getDownloadURL(uploadResult.ref);
        console.log("File uploaded. URL:", certificationURL);
      }

      // Save user details to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        name: lastName ? `${firstName} ${lastName}` : firstName,
        licenseNumber: licenseNumber,
        agencyName: agencyName,
        phoneNumber: phoneNumber,
        linkedIn: linkedIn || null,
        certificationURL: certificationURL,
        role: "pending_agent",
      });
      console.log("User document created in Firestore.");

      // Success feedback
      setSuccess("Signup successful! Your account is pending approval.");
      setError("");
      setLoading(false);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      console.error("Signup error:", error.code, error.message);
      setError(error.message || "Signup failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up - Agent</h2>

        {loading && <p className="text-center text-blue-500 mb-4">Processing... Please wait</p>}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

        <form onSubmit={handleSignup} className="grid grid-cols-2 gap-6">
          <div>
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

          <div>
            <FiUser className="text-gray-500 text-xl mr-2" />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Last Name (Optional)"
            />
          </div>

          <div>
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

          <div>
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

          <div>
            <FiLock className="text-gray-500 text-xl mr-2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Password"
              required
            />
          </div>

          <div>
            <FiLock className="text-gray-500 text-xl mr-2" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Confirm Password"
              required
            />
          </div>

          <div>
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

          <div>
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

          <div>
            <FiLinkedin className="text-gray-500 text-xl mr-2" />
            <input
              type="url"
              value={linkedIn}
              onChange={(e) => setLinkedIn(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="LinkedIn Profile (Optional)"
            />
          </div>

          <div>
            <label className="text-gray-700 mb-2">Proof of Certification</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg"
            disabled={loading}
          >
            {loading ? "Processing..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
