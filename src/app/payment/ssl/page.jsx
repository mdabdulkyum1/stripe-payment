import Link from "next/link";

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f4f8] text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-[#014E4E] mb-6">
        SSL Commerce
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 mb-8">Coming Soon 🚀</p>
      <p className="text-md text-gray-500 max-w-xl">
        We're working hard to bring you a secure and smooth payment experience
        with SSL Commerce. Stay tuned!
      </p>
      <Link href={"/pricing"}>
        {" "}
        <button className="w-full border rounded-lg py-2 px-3 mt-6 bg-[#E0F7FA] hover:bg-[#B2EBF2] font-semibold text-[#014E4E] coursor-pointer cursor-pointer">
          Go Back to Plan
        </button>
      </Link>
    </div>
  );
};

export default Page;
