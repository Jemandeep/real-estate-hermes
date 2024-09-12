import NavBar from './components/NavBar';
import Header from './components/Header';

<<<<<<< Updated upstream

export default function HomePage() {
  return (
    <div>
      {/* Navigation Bar */}
      <NavBar />

      {/* Header with Buttons */}
      <Header />


    </div>
=======
export default function HomePage() {
  return (
    <>
      <div></div>
      <NavBar />
      <Header />

      {/* About Section */}
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold mb-6">Welcome to Real Estate Hero</h2>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet lacus enim. In hac habitasse platea dictumst. 
            Nullam tincidunt arcu vel arcu fermentum, non tristique enim scelerisque. Aliquam erat volutpat. Morbi nec bibendum 
            libero. Suspendisse potenti. Phasellus ac vulputate nulla. Etiam commodo metus et purus dictum hendrerit.
          </p>
        </div>
      </section>
    </>
>>>>>>> Stashed changes
  );
}