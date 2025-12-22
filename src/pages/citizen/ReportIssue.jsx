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
            Swal.fire("Success!", "Issue reported successfully", "success");
            navigate("/citizen/issues");
        },
        onError: () => {
            Swal.fire("Error!", "Could not save the issue. Try again.", "error");
        }
    });

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
            Swal.fire("Error!", "Image upload failed. Check your API key.", "error");
        } finally {
            setUploading(false);
        }
    };

    if (statsLoading) return <div className="text-center p-20 font-bold">Loading...</div>;

    // Limit Logic
    const isPremium = userData?.role === 'premium'; 
    const totalIssues = stats?.totalSubmitted || 0;
    const isLimitReached = !isPremium && totalIssues >= 3;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl my-10 border border-gray-100">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 text-center">Report an Issue</h2>
                <div className="h-1 w-20 bg-gray-900 mx-auto mt-2 rounded-full"></div>
            </header>

            {isLimitReached ? (
                <div className="bg-amber-50 border-2 border-amber-200 p-8 rounded-2xl text-center">
                    <div className="text-5xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold text-amber-900">Limit Reached!</h3>
                    <p className="text-amber-700 mt-2 mb-6">
                        Free users can report up to 3 issues. You have already reported {totalIssues} issues.
                    </p>
                    <button 
                        onClick={() => navigate("/citizen/profile")}
                        className="bg-amber-600 text-white px-8 py-3 rounded-full font-bold hover:bg-amber-700 transition shadow-lg"
                    >
                        Upgrade to Premium for Unlimited Reports
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-control">
                            <label className="label font-bold text-gray-700">Issue Title</label>
                            <input type="text" name="title" className="input input-bordered w-full p-3 border rounded-xl focus:ring-2 focus:ring-gray-900 outline-none" placeholder="e.g. Broken pipe" required />
                        </div>
                        <div className="form-control">
                            <label className="label font-bold text-gray-700">Category</label>
                            <select name="category" className="select select-bordered w-full p-3 border rounded-xl outline-none" required>
                                <option value="Roads">Roads & Transport</option>
                                <option value="Waste">Waste Management</option>
                                <option value="Lighting">Street Lighting</option>
                                <option value="Water">Water & Sewage</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label font-bold text-gray-700">Location</label>
                        <input type="text" name="location" className="input input-bordered w-full p-3 border rounded-xl" placeholder="Full address or Area" required />
                    </div>

                    <div className="form-control">
                        <label className="label font-bold text-gray-700">Issue Photo</label>
                        <input 
                            type="file" 
                            name="image" 
                            className="file-input file-input-bordered w-full border rounded-xl" 
                            accept="image/*" 
                            required 
                        />
                        <p className="text-xs text-gray-400 mt-1">Upload a clear photo of the problem.</p>
                    </div>

                    <div className="form-control">
                        <label className="label font-bold text-gray-700">Description</label>
                        <textarea name="description" className="textarea textarea-bordered w-full p-3 border rounded-xl h-32" placeholder="Tell us more about the issue..." required></textarea>
                    </div>

                    <button 
                        type="submit" 
                        disabled={uploading || mutation.isPending}
                        className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl disabled:bg-gray-400"
                    >
                        {uploading ? "Uploading Image..." : mutation.isPending ? "Submitting Issue..." : "Submit Report"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default ReportIssue;