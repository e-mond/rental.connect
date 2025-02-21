import { FaGoogle } from "react-icons/fa";

const LandlordAuth = ({ isSignUp }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 flex w-full max-w-4xl">
        {/* Image Section */}
        <div
          className="hidden md:block w-1/2 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://source.unsplash.com/600x600/?house,rent')",
          }}
        ></div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-6 flex flex-col">
          <h2 className="text-2xl font-semibold text-center mb-4">
            {isSignUp ? "Landlord Sign Up" : "Landlord Login"}
          </h2>

          <form className="space-y-4">
            {isSignUp && (
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 border rounded"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded"
            />
            {isSignUp && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-3 border rounded"
              />
            )}
            <button className="w-full bg-black text-white p-3 rounded-md">
              {isSignUp ? "Sign Up" : "Login"}
            </button>
          </form>

          <div className="text-center my-4">OR</div>

          <button className="w-full flex items-center justify-center gap-2 border p-3 rounded-md">
            <FaGoogle />{" "}
            {isSignUp ? "Sign Up with Google" : "Login with Google"}
          </button>

          <p className="text-center mt-4">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <a
              href={isSignUp ? "/landlord-login" : "/landlord-signup"}
              className="text-blue-500 underline"
            >
              {isSignUp ? "Login" : "Sign Up"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandlordAuth;
