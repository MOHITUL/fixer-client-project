import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { uploadImage } from "../../../utils/uploadImage";
import { AuthContext } from "../../../contexts/authcontexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Register = () => {
  const { registerUser, googleLogin } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  // NORMAL REGISTER
  const onSubmit = async (data) => {
    const { name, email, password, photo } = data;

    try {
      // Upload image
      const imageUrl = await uploadImage(photo[0]);

      // Firebase register
      const result = await registerUser(email, password);

      // Save token
      const token = await result.user.getIdToken();
      localStorage.setItem("access-token", token);

      // Update Firebase profile
      await updateProfile(result.user, {
        displayName: name,
        photoURL: imageUrl,
      });

      // Save user to MongoDB
      const userInfo = {
        name,
        email,
        image: imageUrl,
        role: "citizen",
      };

      await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(userInfo),
      });

      toast.success("Account created successfully");
      reset();
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Registration failed");
    }
  };

  // GOOGLE REGISTER
  const handleGoogleRegister = async () => {
    try {
      const result = await googleLogin(); // 
      const user = result.user;

      // Save token
      const token = await user.getIdToken();
      localStorage.setItem("access-token", token);

      const userInfo = {
        name: user.displayName,
        email: user.email,
        image: user.photoURL,
        role: "citizen",
      };

      await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(userInfo),
      });

      toast.success("Logged in with Google");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Google login failed");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md bg-white/95 rounded-3xl shadow-2xl p-10">

        <h2 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            className="input input-bordered w-full"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            {...register("photo", { required: "Photo is required" })}
          />
          {errors.photo && <p className="text-red-500 text-sm">{errors.photo.message}</p>}

          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input input-bordered w-full"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Minimum 8 characters" },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                  message: "Uppercase, lowercase, number & special char required",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full mt-4"
          >
            {isSubmitting ? "Creating..." : "Register"}
          </button>
        </form>

        <div className="divider my-6">OR</div>

        <button
          onClick={handleGoogleRegister}
          className="btn w-full flex items-center justify-center gap-3"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>

      </div>
    </section>
  );
};

export default Register;
