// pages/know-your-financing-options.js
import Head from "next/head";
import Layout from "../../../components/Layout";

export default function KnowYourFinancingOptions() {
    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <Layout>
                <Head>
                    <title>Know Your Financing Options</title>
                    <meta
                        name="description"
                        content="Explore different financing options for home buyers, including FHA loans and first-time buyer programs to help reduce costs."
                    />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>

                <header className="text-center py-6">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Know Your Financing Options
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">
                        Learn about various financing options available to home buyers, including FHA loans and first-time buyer programs.
                    </p>
                </header>

                <main className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">Introduction</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            When buying a home, understanding your financing options is crucial. There are several programs available that can help make homeownership more affordable, including FHA loans and other first-time buyer programs. By exploring these options, you can find the best fit for your financial situation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">FHA Loans</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            Federal Housing Administration (FHA) loans are government-backed mortgages that offer lower down payments and more lenient credit requirements. These loans are an excellent option for first-time homebuyers or those with less-than-perfect credit.
                        </p>
                        <ul className="list-disc pl-6 text-gray-700">
                            <li>Lower down payment (as low as 3.5%)</li>
                            <li>More flexible credit score requirements</li>
                            <li>Government-backed, making them more accessible</li>
                            <li>Available for both first-time and repeat buyers</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">VA Loans</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            If you're a veteran or an active-duty service member, you may qualify for a VA loan. These loans are backed by the U.S. Department of Veterans Affairs and offer excellent benefits, such as no down payment and no private mortgage insurance (PMI).
                        </p>
                        <ul className="list-disc pl-6 text-gray-700">
                            <li>No down payment required</li>
                            <li>No PMI (Private Mortgage Insurance)</li>
                            <li>Competitive interest rates</li>
                            <li>Available to veterans, active-duty service members, and some surviving spouses</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">First-Time Homebuyer Programs</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            First-time homebuyers can take advantage of several government programs designed to reduce the cost of buying a home. These programs may include down payment assistance, lower interest rates, and special tax incentives.
                        </p>
                        <ul className="list-disc pl-6 text-gray-700">
                            <li>Down payment assistance programs</li>
                            <li>First-time buyer tax credits</li>
                            <li>State and local homebuyer programs</li>
                            <li>Special interest rate discounts</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">Conventional Loans</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            Conventional loans are not backed by the government but are offered by private lenders. These loans usually require a higher credit score and a larger down payment compared to FHA or VA loans, but they can still be a good option for those with strong financial backgrounds.
                        </p>
                        <ul className="list-disc pl-6 text-gray-700">
                            <li>Higher credit score required</li>
                            <li>Typically requires a 5% to 20% down payment</li>
                            <li>Available to both first-time and repeat buyers</li>
                            <li>Private lenders offer these loans</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">Conclusion</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            Understanding your financing options is a key part of the home-buying process. Whether you're considering an FHA loan, a VA loan, or taking advantage of first-time buyer programs, there are many ways to reduce the upfront costs and make homeownership more affordable. Take the time to research all available options to ensure you're making the best financial decision for your future.
                        </p>
                    </section>
                </main>


            </Layout>
        </div>
    );
}
