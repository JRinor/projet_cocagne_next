import Head from 'next/head';

export default function Home() {
  return (
    <div>
      {/* Head section for metadata */}
      <Head>
        <title>Page d'Accueil</title>
        <meta name="description" content="Page d'accueil de mon projet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Main Content */}
      <h1 className="text-3xl font-bold text-blue-900">Bienvenue sur ma page d'accueil</h1>
      <p className="text-lg mt-4 text-gray-700">Explorez nos services et découvrez ce que nous proposons.</p>
    </div>
  );
}