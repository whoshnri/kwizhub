import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

                    <div className="prose prose-lg max-w-none space-y-6">
                        <p className="text-muted-foreground">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>

                        <section>
                            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
                            <p className="text-muted-foreground">
                                We collect information you provide directly to us, such as when you create
                                an account, make a purchase, or contact us for support. This includes:
                            </p>
                            <ul className="list-disc pl-6 text-muted-foreground mt-2 space-y-1">
                                <li>Name and email address</li>
                                <li>Username and password</li>
                                <li>Payment information (processed securely)</li>
                                <li>Purchase and download history</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
                            <p className="text-muted-foreground">
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc pl-6 text-muted-foreground mt-2 space-y-1">
                                <li>Provide, maintain, and improve our services</li>
                                <li>Process transactions and send related information</li>
                                <li>Send technical notices and support messages</li>
                                <li>Respond to your comments and questions</li>
                                <li>Protect against fraudulent or illegal activity</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Information Sharing</h2>
                            <p className="text-muted-foreground">
                                We do not sell, trade, or otherwise transfer your personal information
                                to outside parties except as described in this policy. We may share
                                information with trusted third parties who assist us in operating our
                                website and conducting our business.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
                            <p className="text-muted-foreground">
                                We implement appropriate security measures to protect your personal
                                information. However, no method of transmission over the Internet is
                                100% secure, and we cannot guarantee absolute security.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights</h2>
                            <p className="text-muted-foreground">
                                You have the right to access, correct, or delete your personal information.
                                You can manage your account settings or contact us for assistance with
                                these requests.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact Us</h2>
                            <p className="text-muted-foreground">
                                If you have any questions about this Privacy Policy, please contact us
                                at support@kwizhub.com.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
