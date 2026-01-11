import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold font-heading mb-8">Terms of Service</h1>

                    <div className="prose prose-lg max-w-none space-y-6">
                        <p className="text-muted-foreground">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>

                        <section>
                            <h2 className="text-2xl font-semibold font-heading mt-8 mb-4">1. Acceptance of Terms</h2>
                            <p className="text-muted-foreground">
                                By accessing and using KwizHub, you accept and agree to be bound by these
                                Terms of Service. If you do not agree to these terms, please do not use
                                our service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold font-heading mt-8 mb-4">2. User Accounts</h2>
                            <p className="text-muted-foreground">
                                You are responsible for maintaining the confidentiality of your account
                                credentials and for all activities that occur under your account. You must
                                notify us immediately of any unauthorized use.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold font-heading mt-8 mb-4">3. Content and Materials</h2>
                            <p className="text-muted-foreground">
                                Authors retain ownership of their uploaded materials. By uploading content,
                                you grant KwizHub a license to display and distribute the materials through
                                our platform. You represent that you have the right to upload and sell
                                any materials you provide.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold font-heading mt-8 mb-4">4. Purchases and Refunds</h2>
                            <p className="text-muted-foreground">
                                All purchases are final. Due to the digital nature of our products, we
                                generally do not offer refunds. However, we may consider refund requests
                                on a case-by-case basis for technical issues or incorrect content.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold font-heading mt-8 mb-4">5. Prohibited Activities</h2>
                            <p className="text-muted-foreground">
                                You agree not to:
                            </p>
                            <ul className="list-disc pl-6 text-muted-foreground mt-2 space-y-1">
                                <li>Share or redistribute purchased materials without authorization</li>
                                <li>Upload copyrighted content without permission</li>
                                <li>Use the platform for illegal activities</li>
                                <li>Attempt to compromise the security of the platform</li>
                                <li>Create multiple accounts for fraudulent purposes</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold font-heading mt-8 mb-4">6. Author Payments</h2>
                            <p className="text-muted-foreground">
                                Authors receive earnings from sales in their wallet. Withdrawals are
                                processed according to our withdrawal policy and may take up to 5
                                business days to complete.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold font-heading mt-8 mb-4">7. Limitation of Liability</h2>
                            <p className="text-muted-foreground">
                                KwizHub is provided on an &quot;as is&quot; basis. We make no warranties
                                regarding the quality or accuracy of materials sold on our platform.
                                We are not liable for any indirect, incidental, or consequential damages.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold font-heading mt-8 mb-4">8. Changes to Terms</h2>
                            <p className="text-muted-foreground">
                                We reserve the right to modify these terms at any time. Continued use of
                                the service after changes constitutes acceptance of the new terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold font-heading mt-8 mb-4">9. Contact</h2>
                            <p className="text-muted-foreground">
                                For questions about these Terms of Service, please contact us at
                                support@kwizhub.com.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
