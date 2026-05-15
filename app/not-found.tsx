import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl mb-4">🌿</p>
        <h1 className="text-4xl font-bold text-[#1C1C1C] mb-3">Page Not Found</h1>
        <p className="text-[#6B6B6B] mb-8">
          Looks like this page moved or doesn&apos;t exist. Let&apos;s get you back to the good stuff.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="bg-[#2D5016] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#3A6B1E] transition-colors"
          >
            Shop All Products
          </Link>
          <Link
            href="/"
            className="border border-[#2D5016] text-[#2D5016] px-8 py-3 rounded-full font-semibold hover:bg-[#2D5016] hover:text-white transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
