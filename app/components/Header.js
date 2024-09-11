const Header = () => {
    return (
      <header className=" text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Discover Your Dream Home</h1>
        <p className="text-lg mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.
        </p>
        
        {/* Action Buttons */}
        <div className="space-x-4">
          <a href="/listings" className="bg-white text-stone-600 font-semibold px-6 py-3 rounded-md hover:bg-gray-100">Browse Listings</a>
        </div>
      </header>
    );
  }
  
  export default Header;
  