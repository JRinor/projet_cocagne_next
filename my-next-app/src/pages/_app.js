import '../styles/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function App({ Component, pageProps }) {
  return (
    <div>
      <Header />
      <main className="min-h-[80vh] bg-gray-100 py-8 text-center">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}