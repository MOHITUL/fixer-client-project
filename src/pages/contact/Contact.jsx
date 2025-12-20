import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    toast.success("Message sent successfully!");
    reset();
  };

  return (
    <section className="min-h-screen bg-linear-to-b from-white to-gray-50 px-4 py-20">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-semibold mb-6 tracking-tight">
            Contact{" "}
            <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Us
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have a question or suggestion? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          
          {/* Contact Info Sidebar */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Get in Touch Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Get in Touch</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We're here to help and answer any questions you might have. We look forward to hearing from you!
              </p>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-lg">📧</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Email</div>
                    <div className="text-gray-600 text-sm">support@civicfix.com</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-lg">📞</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Phone</div>
                    <div className="text-gray-600 text-sm">+880123456789</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-lg">📍</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Office</div>
                    <div className="text-gray-600 text-sm">123, Dhaka, Bangladesh</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time Card */}
            <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-3xl p-8 shadow-lg text-white">
              <h3 className="text-xl font-bold mb-3">Quick Response</h3>
              <p className="text-blue-50 text-sm">
                We typically respond within 24 hours during business days.
              </p>
            </div>

          </div>

          {/* Form */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-8 text-gray-900">Send us a Message</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Name"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none`}
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span>⚠</span> {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none`}
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span>⚠</span> {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.message ? 'border-red-500' : 'border-gray-200'
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none`}
                    placeholder="Tell us how we can help you..."
                    rows="5"
                    {...register("message", { 
                      required: "Message is required",
                      minLength: {
                        value: 10,
                        message: "Message must be at least 10 characters"
                      }
                    })}
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span>⚠</span> {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Button */}
                <button 
                  type="submit" 
                  className="w-full bg-linear-to-r from-blue-600 to-blue-500 text-white font-semibold py-4 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-200 hover:shadow-xl"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;