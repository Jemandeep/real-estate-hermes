import Link from 'next/link';

const NavBar = () => {
  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center">
<<<<<<< Updated upstream
        {/* Link the "Calgary Real Estate" text to the home page */}
        <Link href="/" className="text-xl font-bold text-gray-800">
          Calgary Real Estate
        </Link>

        <div className="space-x-4">
          <a href="/login" className="bg-stone-300 text-stone-600 font-bold px-11 py-3 rounded-md hover:bg-gray-100">Login</a>
        </div>
      </div>
    </nav>
  );
};
=======
      <Link href="/" className="text-xl font-bold text-gray-800">
          Calgary Real Estate
        </Link>
        <ul className="flex space-x-6">
          <li><Link href="/">Home</Link></li>
          
          <li><Link href="/login">Login</Link></li>
        </ul>
      </div>
    </nav>
  );
}
>>>>>>> Stashed changes

<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
export default NavBar;
