import Link from 'next/link';

const NavBar = () => {
  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Link the "Calgary Real Estate" text to the home page */}
        <Link href="/" className="text-xl font-bold text-gray-800">
          Calgary Real Estate
        </Link>
        
        <div className="space-x-4">
          {/* Analysis Button */}
          <Link href="/analysis" className="bg-blue-500 text-white font-bold px-6 py-3 rounded-md hover:bg-blue-600">
            Analysis Dashboard
          </Link>

          <a href="/login" className="bg-stone-300 text-stone-600 font-bold px-11 py-3 rounded-md hover:bg-gray-100">Login</a>
        </div>
      </div>
    </nav>
  );
};export default NavBar;
