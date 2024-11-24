// pages/buying-a-home-start-with-a-budget.js
import Head from "next/head";
import Layout from "../../../components/Layout";

export default function BuyingAHomeStartWithABudget() {
    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <Layout>
                <Head>
                    <title>Buying a Home: Start with a Budget</title>
                    <meta
                        name="description"
                        content="Learn the importance of determining your budget before house hunting, including tips on factoring in income, expenses, and mortgage rates."
                    />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>

                <header className="text-center py-6">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Buying a Home: Start with a Budget
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">
                        Essential tips to help you plan your finances before purchasing a home.
                    </p>
                </header>

                <main className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">Introduction</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            Buying a home is one of the most significant financial decisions you will make in your lifetime. Before you dive into house hunting, it's crucial to set a clear budget. This helps you avoid overspending and ensures that your dream home is within your financial reach.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">Assess Your Income</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            Start by evaluating your monthly income. Include all reliable sources of income, such as salaries, investments, and passive earnings. This gives you a clear picture of your financial capacity and helps set realistic expectations for your home purchase.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">Factor in Expenses</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            Review your regular expenses, including utilities, groceries, transportation, and leisure activities. Don't forget to account for any outstanding debts, such as credit card bills or student loans. A clear understanding of your expenses will help you calculate how much you can allocate to a mortgage payment.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">Understand Mortgage Rates</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            Mortgage rates significantly impact your monthly payments. Research current rates and consider getting pre-approved by a lender to understand what you qualify for. This step also helps you set a realistic price range for your home search.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">Conclusion</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            Setting a budget is a crucial first step in the home-buying process. By understanding your income, managing expenses, and researching mortgage options, you can make informed decisions and find a home that meets both your needs and your financial goals.
                        </p>
                    </section>
                </main>


            </Layout>
        </div>
    );
}
