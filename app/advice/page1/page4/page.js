// pages/smart-home-technology.js
import Head from "next/head";
import Layout from "../../../components/Layout";

export default function SmartHomeTechnology() {
    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <Layout>
                <Head>
                    <title>Smart Home Technology - Home Trends</title>
                    <meta
                        name="description"
                        content="Explore how smart thermostats, security systems, and other technologies are transforming homes into connected living spaces."
                    />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>

                <header className="text-center py-6">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Smart Home Technology
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">
                        The growing trend of integrating technology into homes
                    </p>
                </header>

                <main className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">Introduction</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            The rise of smart home technology has revolutionized the way we live. From energy efficiency to enhanced security, smart devices are not just conveniences—they are becoming essential features for modern homes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">Smart Thermostats</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            Smart thermostats, like Nest and Ecobee, allow homeowners to control their home’s temperature remotely. These devices learn user preferences and optimize energy usage, reducing utility bills while maintaining comfort.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">Advanced Security Systems</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            Home security has been transformed by technology. Smart locks, video doorbells, and app-controlled surveillance cameras provide peace of mind and allow homeowners to monitor their property from anywhere. Features like facial recognition and motion detection add extra layers of security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">Voice Assistants and Automation</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            Integrating voice assistants like Amazon Alexa, Google Assistant, or Apple Siri makes managing smart home devices seamless. From turning on lights to setting reminders, these systems bring unparalleled convenience and connectivity to daily life.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800">Conclusion</h2>
                        <p className="text-gray-700 mt-2 leading-relaxed">
                            Smart home technology is shaping the future of real estate. Buyers are increasingly seeking homes equipped with connected devices that enhance comfort, security, and energy efficiency. As technology evolves, the demand for smart homes will only continue to grow.
                        </p>
                    </section>
                </main>


            </Layout>
        </div>
    );
}
