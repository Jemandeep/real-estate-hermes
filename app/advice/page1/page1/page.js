// pages/rise-in-remote-work.js
import Head from "next/head";
import Layout from "../../../components/Layout"

export default function RiseInRemoteWork() {
    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <Layout>
            <Head>
                <title>Rise in Remote Work - Home Trends</title>
                <meta
                    name="description"
                    content="Explore how the rise in remote work is reshaping home-buying preferences with a focus on dedicated office spaces and internet connectivity."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <header className="text-center py-6">
                <h1 className="text-4xl font-bold text-gray-800">
                    The Rise in Remote Work
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                    How remote work is shaping home-buying preferences
                </p>
            </header>

            <main className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold text-gray-800">Introduction</h2>
                    <p className="text-gray-700 mt-2 leading-relaxed">
                        The shift to remote work has transformed the way people live and work. With an increasing number of companies embracing flexible work-from-home policies, homebuyers are rethinking their priorities.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-800">Dedicated Office Spaces</h2>
                    <p className="text-gray-700 mt-2 leading-relaxed">
                        For many, the ability to have a quiet, functional workspace at home is now a must. This has led to a surge in demand for homes with dedicated office spaces. Whether it’s a converted spare bedroom or a purpose-built home office, buyers want a space that can accommodate their work needs comfortably.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-800">Reliable Internet Connectivity</h2>
                    <p className="text-gray-700 mt-2 leading-relaxed">
                        Fast and reliable internet is no longer a luxury but a necessity. Remote workers rely heavily on video conferencing, file sharing, and cloud-based tools, making high-speed internet a top priority when choosing a home. Areas with poor connectivity are now less desirable for remote-working professionals.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-800">Conclusion</h2>
                    <p className="text-gray-700 mt-2 leading-relaxed">
                        As remote work continues to be a significant part of the modern workforce, homebuyers are focusing on features that support productivity and connectivity. Developers and real estate professionals must adapt to this trend, emphasizing homes that cater to the needs of the remote worker.
                    </p>
                </section>
            </main>


            </Layout>
        </div>
    );
}
