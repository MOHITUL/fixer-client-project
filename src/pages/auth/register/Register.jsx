import { useForm } from "react-hook-form";
import { useContext } from "react";
import { Link, useNavigate } from "react-router";
import { updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { uploadImage } from "../../../utils/uploadImage";
import { AuthContext } from "../../../contexts/authcontexts/AuthContext";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
    const { registerUser, googleSignIn } = useContext(AuthContext);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const { name, email, password, photo } = data;

        try {
            // Upload image to ImgBB
            const imageUrl = await uploadImage(photo[0]);

            // Create Firebase user
            const result = await registerUser(email, password);

            // Update profile
            await updateProfile(result.user, {
                displayName: name,
                photoURL: imageUrl,
            });

            toast.success("Account created successfully");
            reset();
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.message || "Registration failed");
        }
    };

    const handleGoogleRegister = async () => {
        try {
            const result = await googleSignIn();
            console.log(result);
            toast.success("Logged in with Google");
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.message || "Google login failed");
        }
    };


    return (
        <section className="min-h-screen flex items-center justify-center px-4 py-12 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
            <div className="w-full max-w-md bg-white/95 rounded-3xl shadow-2xl p-10">

                <h2 className="text-3xl font-bold text-center mb-6">
                    Create Account
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Name */}
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="input input-bordered w-full"
                        {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}

                    {/* Email */}
                    <input
                        type="email"
                        placeholder="Email"
                        className="input input-bordered w-full"
                        {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}

                    {/* Password */}
                    <input
                        type="password"
                        placeholder="Password"
                        className="input input-bordered w-full"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Minimum 6 characters" },
                        })}
                    />
                    {errors.password && (
                        <p className="text-red-500">{errors.password.message}</p>
                    )}

                    {/* Photo Upload */}
                    <input
                        type="file"
                        accept="image/*"
                        className="file-input file-input-bordered w-full"
                        {...register("photo", { required: "Photo is required" })}
                    />
                    {errors.photo && <p className="text-red-500">{errors.photo.message}</p>}

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
