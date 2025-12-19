import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../../contexts/authcontexts/AuthContext";
import { toast } from "react-toastify";
import { useContext } from "react";

const Login = () => {
  const { signInUser, googleLogin } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  // Email + Password Login
  const onSubmit = async ({ email, password }) => {
    try {
      await signInUser(email, password);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Login failed");
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      toast.success("Google login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Google login failed");
    }
  };

  return (
    <section className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-12">

      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950" />

      {/* Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200/20">

          
          <div className="p-10">

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900">
                Welcome Back
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                Sign in to continue
              </p>
            </div>

            {/* FORM */}
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
              <div>
                <div className="flex justify-between">
                  <label className="text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600"
                  >
                    Forgot?
                  </Link>
                </div>

                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full mt-2"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="divider my-6">OR</div>

            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              className="btn  w-full flex gap-2"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5"
                alt="Google"
              />
              Continue with Google
            </button>

            {/* Register */}
            <p className="text-center text-sm text-slate-600 mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-600"
              >
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
