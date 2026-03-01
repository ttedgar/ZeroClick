import { Footer } from "../components/Footer.js"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-dvh flex flex-col bg-gray-950">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-3">Introduction</h2>
            <p>
              ZeroClick ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-3">Information We Collect</h2>
            <p>
              We may collect information about you in a variety of ways. The information we may collect on the Site includes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Personal Data:</strong> Name and email address when you contact us or create a room.
              </li>
              <li>
                <strong>Game Data:</strong> Your gameplay statistics, scores, and usernames within game sessions.
              </li>
              <li>
                <strong>Browser Data:</strong> IP address, browser type, operating system, and device information (automatically collected).
              </li>
              <li>
                <strong>Cookies & Tracking:</strong> We use cookies and similar technologies for functionality and analytics (including Google Analytics and Google AdSense).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-3">How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide and maintain our services</li>
              <li>Process your contact form submissions</li>
              <li>Generate and display leaderboards</li>
              <li>Improve user experience and troubleshoot issues</li>
              <li>Comply with legal obligations</li>
              <li>Deliver personalized advertising via Google AdSense</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-3">Third-Party Services</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Google AdSense:</strong> We use Google AdSense to display advertisements. Google may use cookies and similar technologies to serve ads based on your prior visits to our site and other sites.
              </li>
              <li>
                <strong>Google Analytics:</strong> We use Google Analytics to understand site traffic and user behavior.
              </li>
              <li>
                <strong>Formspree:</strong> Contact forms are processed through Formspree. See their privacy policy at formspree.io.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-3">Data Retention</h2>
            <p>
              Game scores and leaderboard data are retained indefinitely to maintain historical gameplay records. You may request deletion by contacting us, though this may affect leaderboard functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-3">Security</h2>
            <p>
              We implement reasonable security measures to protect your information. However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-3">Your Rights</h2>
            <p>
              Depending on your jurisdiction, you may have the right to access, correct, or delete your personal data. Contact us to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-3">Contact Us</h2>
            <p>
              For privacy concerns or questions, please contact us via our <a href="/contact" className="text-indigo-400 hover:underline">contact page</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-3">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.
            </p>
          </section>

          <p className="text-gray-500 text-sm pt-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
