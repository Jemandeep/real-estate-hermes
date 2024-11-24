// pages/get-pre-approved-for-a-mortgage.js
import Head from "next/head";
import Layout from "../../../components/Layout";

export default function GetPreApprovedForMortgage() {
    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <Layout>
                <Head>
                    <title>Get Pre-Approved for a Mortgage</title>
                    <meta
                        name="description"
                        content="Learn how getting pre-approved for a mortgage can streamline your home-buying process and give you a clearer idea of what you can afford."
                    />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>

                <header className="text-center py-6">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Get Pre-Approved for a Mortgage
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">
                        Understand how pre-approval can simplify your home-buying journey.
                    </p>
                </header>

                <main className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">Introduction</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            Before you start house hunting, it's crucial to get pre-approved for a mortgage. A pre-approval helps you understand how much you can borrow, making your home search more focused and efficient. It also shows sellers that you're a serious buyer, which can give you a competitive edge.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">What is Mortgage Pre-Approval?</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            A mortgage pre-approval is a process where a lender evaluates your financial situation and determines how much money they are willing to lend you. Unlike pre-qualification, which gives you a general idea of what you may be able to borrow, pre-approval is more thorough and involves a detailed review of your finances, including your credit score, income, debt, and assets.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">Benefits of Mortgage Pre-Approval</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            Getting pre-approved for a mortgage has several advantages:
                            <ul className="list-disc ml-6 mt-2">
                                <li>Clarifies your budget, helping you avoid wasting time on homes outside your price range.</li>
                                <li>Strengthens your offer when you're ready to buy, as sellers prefer buyers with pre-approval.</li>
                                <li>Speeds up the closing process once you find the right home.</li>
                                <li>Gives you an advantage in a competitive market, especially in areas with high demand for homes.</li>
                            </ul>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">How to Get Pre-Approved</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            To get pre-approved for a mortgage, you’ll need to provide various documents to the lender, including:
                            <ul className="list-disc ml-6 mt-2">
                                <li>Proof of income (pay stubs, tax returns, etc.)</li>
                                <li>Proof of assets (bank statements, retirement accounts)</li>
                                <li>Credit history (the lender will run a credit check)</li>
                                <li>Employment details (current job, length of employment)</li>
                            </ul>
                            Once the lender reviews these documents, they will determine the loan amount you qualify for.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">Conclusion</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            Mortgage pre-approval is an essential step in the home-buying process. It gives you a clear idea of how much you can afford and makes your offer stronger when you're ready to make a move. Be sure to gather the necessary documents, shop around for the best rates, and take the time to get pre-approved before you begin your search for the perfect home.
                        </p>
                    </section>
                </main>


            </Layout>
        </div>
    );
}
