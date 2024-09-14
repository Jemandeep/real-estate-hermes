import Link from 'next/link';

const NavBar = () => {
  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-4 lg:px-8">
        
        {/* Link the "Calgary Real Estate" text to the home page */}
        <Link href="/" className="text-xl font-bold text-gray-800">
          Calgary Real Estate
        </Link>
        
        <div className="flex space-x-4">
          {/* Analysis Button */}
          <Link href="/analysis" className="bg-stone-300 text-stone-600 font-bold px-11 py-3 rounded-md hover:bg-gray-100">
            Analysis Dashboard
          </Link>

          {/* Mortgage Calculator Button */}
          <Link href="/mortcalculator" className="bg-stone-300 text-stone-600 font-bold px-11 py-3 rounded-md hover:bg-gray-100">            Mortgage Calculator
          </Link>

          {/* Login Button */}
          <Link href="/login" className="bg-stone-300 text-stone-600 font-bold px-11 py-3 rounded-md hover:bg-gray-100">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
