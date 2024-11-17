// pages/eco-friendly-features.js
import Head from "next/head";
import Layout from "../../../components/Layout";

export default function EcoFriendlyFeatures() {
    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <Layout>
                <Head>
                    <title>Eco-Friendly Features - Home Trends</title>
                    <meta
                        name="description"
                        content="Learn how sustainable features like solar panels and energy-efficient appliances are influencing homebuyers' decisions."
                    />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>

                <header className="text-center py-6">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Eco-Friendly Features
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">
                        Sustainable features are reshaping the real estate market
                    </p>
                </header>

                <main className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">Introduction</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            As environmental awareness grows, homebuyers are prioritizing properties that promote sustainability. Features like solar panels, energy-efficient appliances, and eco-friendly designs are no longer optional—they're becoming essential.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">Solar Panels</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            Solar panels are one of the most sought-after features for eco-conscious buyers. They reduce reliance on non-renewable energy sources, lower electricity bills, and increase the overall value of a property. Governments often offer incentives, making solar adoption more attractive.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">Energy-Efficient Appliances</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            Modern homebuyers look for appliances with high energy efficiency ratings. Refrigerators, washing machines, and HVAC systems designed to use less energy not only help the environment but also save homeowners money in the long run.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">Eco-Friendly Designs</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            Homes with eco-friendly designs, such as proper insulation, rainwater harvesting systems, and sustainable building materials, are becoming increasingly popular. These features reduce the carbon footprint while enhancing the home's livability and durability.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">Conclusion</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            The demand for eco-friendly homes is reshaping the housing market. Builders and developers who incorporate sustainable features are more likely to attract modern buyers. Investing in environmentally responsible housing is not just a trend—it's the future.
                        </p>
                    </section>
                </main>


            </Layout>
        </div>
    );
}
