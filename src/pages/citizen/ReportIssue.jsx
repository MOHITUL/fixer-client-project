import { useContext, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../contexts/authcontexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const ReportIssue = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    // Limit check
    const { data: stats = {}, isLoading: statsLoading } = useQuery({
        queryKey: ['citizen-stats', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/citizen-stats/${user?.email}`);
            return res.data;
        }
    });

    // Premium check
    const { data: userData = {} } = useQuery({
        queryKey: ['user-role', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/role/${user?.email}`);
            return res.data;
        }
    });

    // Issue Submission Mutation
    const mutation = useMutation({
        mutationFn: (newIssue) => {
            return axios.post(`${import.meta.env.VITE_API_URL}/issues`, newIssue, {
                headers: { authorization: `Bearer ${localStorage.getItem('access-token')}` }
            });
        },
        onSuccess: () => {
            Swal.fire({
                title: "Success!",
                text: "Issue reported successfully",
                icon: "success",
                confirmButtonColor: "#3B82F6"
            });
            navigate("/citizen/issues");
        },
        onError: () => {
            Swal.fire({
                title: "Error!",
                text: "Could not save the issue. Try again.",
                icon: "error",
                confirmButtonColor: "#EF4444"
            });
        }
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        
        const form = e.target;
        const imageFile = form.image.files[0];

        try {
            // Image Upload to ImgBB
            const formData = new FormData();
            formData.append('image', imageFile);

            const image_hosting_api = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`;
            
            const res = await axios.post(image_hosting_api, formData, {
                headers: { 'content-type': 'multipart/form-data' }
            });

            if (res.data.success) {
                const imageUrl = res.data.data.display_url;

                // Prepare Data Object
                const issueData = {
                    title: form.title.value,
                    description: form.description.value,
                    category: form.category.value,
                    image: imageUrl, 
                    location: form.location.value,
                    userEmail: user?.email,
                    userName: user?.displayName,
                    status: 'pending',
                    createdAt: new Date(),
                    // Tracking timeline
                    timeline: [
                        {
                            status: 'pending',
                            message: 'Issue reported by citizen.',
                            updatedAt: new Date()
                        }
                    ]
                };

                // Submit to MongoDB
                mutation.mutate(issueData);
            }
        } catch (error) {
            console.error("Upload Error:", error);
            Swal.fire({
                title: "Error!",
                text: "Image upload failed. Check your API key.",
                icon: "error",
                confirmButtonColor: "#EF4444"
            });
        } finally {
            setUploading(false);
        }
    };

    if (statsLoading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-white to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-gray-700">Loading...</p>
                </div>
            </div>
        );
    }

    // Limit Logic
    const isPremium = userData?.role === 'premium'; 
    const totalIssues = stats?.totalSubmitted || 0;
    const isLimitReached = !isPremium && totalIssues >= 3;

    return (
        <div className="min-h-screen bg-linear-to-b from-white to-gray-50 px-4 py-8 lg:py-12">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
                <header className="text-center mb-12">
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Report an <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Issue</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Help improve your community by reporting infrastructure problems. We'll handle it from here.
                    </p>
                    
                    {/* Stats Bar */}
                    {!isPremium && (
                        <div className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">📊</span>
                                <span className="text-sm font-medium text-gray-700">
                                    Reports: <span className="font-bold text-blue-600">{totalIssues}/3</span>
                                </span>
                            </div>
                            <div className="h-4 w-px bg-gray-200"></div>
                            <button 
                                onClick={() => navigate("/citizen/profile")}
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Upgrade for Unlimited →
                            </button>
                        </div>
                    )}
                </header>

                {isLimitReached ? (
                    <div className="bg-white rounded-3xl p-10 lg:p-16 shadow-lg border border-amber-200 text-center">
                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-5xl">⚠️</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">Report Limit Reached</h3>
                        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                            Free users can report up to 3 issues. You've submitted {totalIssues} reports. Upgrade to Premium for unlimited reporting!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                                onClick={() => navigate("/citizen/profile")}
                                className="px-8 py-4 bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-200"
                            >
                                Upgrade to Premium
                            </button>
                            <button 
                                onClick={() => navigate("/citizen/issues")}
                                className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                            >
                                View My Issues
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-8 lg:p-12">
                            <div className="space-y-8">
                                
                                {/* Title & Category Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Issue Title *
                                        </label>
                                        <input 
                                            type="text" 
                                            name="title" 
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
                                            placeholder="e.g., Broken pipe leaking water" 
                                            required 
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Category *
                                        </label>
                                        <select 
                                            name="category" 
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white" 
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            <option value="Roads">🚗 Roads & Transport</option>
                                            <option value="Waste">🗑️ Waste Management</option>
                                            <option value="Lighting">💡 Street Lighting</option>
                                            <option value="Water">💧 Water & Sewage</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Location *
                                    </label>
                                    <input 
                                        type="text" 
                                        name="location" 
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
                                        placeholder="Full address or area (e.g., 123 Main St, Downtown)" 
                                        required 
                                    />
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Issue Photo *
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type="file" 
                                            name="image" 
                                            className="hidden" 
                                            id="image-upload"
                                            accept="image/*" 
                                            onChange={handleImageChange}
                                            required 
                                        />
                                        <label 
                                            htmlFor="image-upload"
                                            className="flex items-center justify-center w-full px-6 py-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                                        >
                                            {imagePreview ? (
                                                <div className="relative">
                                                    <img 
                                                        src={imagePreview} 
                                                        alt="Preview" 
                                                        className="max-h-64 rounded-lg shadow-md"
                                                    />
                                                    <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg">
                                                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <p className="mt-2 text-sm font-medium text-gray-700">
                                                        Click to upload or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        PNG, JPG, GIF up to 10MB
                                                    </p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        📸 Upload a clear photo showing the issue for faster resolution
                                    </p>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea 
                                        name="description" 
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none" 
                                        rows="5"
                                        placeholder="Provide detailed information about the issue. Include what happened, when you noticed it, and any safety concerns..." 
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={uploading || mutation.isPending}
                                        className="w-full px-8 py-4 bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-200 hover:shadow-xl disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                    >
                                        {uploading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Uploading Image...
                                            </>
                                        ) : mutation.isPending ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Submitting Issue...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Submit Report
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Info Box */}
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-blue-900 mb-1">What happens next?</h4>
                                            <ul className="text-sm text-blue-800 space-y-1">
                                                <li>✓ Your report is reviewed by our team</li>
                                                <li>✓ We'll notify you when action is taken</li>
                                                <li>✓ Track progress in your dashboard</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportIssue;