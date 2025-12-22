import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../../contexts/authcontexts/AuthContext";
import { toast } from "react-toastify";
import { useContext, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const { signInUser, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // ================= EMAIL + PASSWORD LOGIN =================
  const onSubmit = async ({ email, password }) => {
    try {
      const result = await signInUser(email, password);

      // 🔐 SAVE TOKEN
      const token = await result.user.getIdToken();
      localStorage.setItem("access-token", token);

      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Login failed");
    }
  };

  // ================= GOOGLE LOGIN =================
  const handleGoogleLogin = async () => {
    try {
      const result = await googleLogin();

      // 🔐 SAVE TOKEN
      const token = await result.user.getIdToken();
      localStorage.setItem("access-token", token);

      toast.success("Google login successful");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Google login failed");
    }
  };

  return (
    <section className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-12">

      <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200/20">
          <div className="p-10">

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900">
                Welcome Back
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                Sign in to continue
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* Email */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered w-full mt-2"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <div className="flex justify-between">
                  <label className="text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm text-blue-600">
                    Forgot?
                  </Link>
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input input-bordered w-full mt-2"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="divider my-6">OR</div>

            <button
              onClick={handleGoogleLogin}
              className="btn w-full flex gap-2"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5"
                alt="Google"
              />
              Continue with Google
            </button>

            <p className="text-center text-sm text-slate-600 mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-blue-600">
                Create account
              </Link>
            </p>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
