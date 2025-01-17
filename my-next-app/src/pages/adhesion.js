import React, { useState } from 'react';
import Head from 'next/head';

const Adhesion = () => {
    const initialFormData = {
        nom: '',
        prenom: '',
        adresse: '',
        codePostal: '',
        ville: '',
        telephone: '',
        email: '',
        cotisation: '',
        legumes: '',
        frequenceLegumes: '',
        formuleLegumes: '',
        oeufs: '',
        frequenceOeufs: '',
        formuleOeufs: '',
        paiement: '',
        frequencePaiement: '',
        date: '',
        signature: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showRecap, setShowRecap] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = () => {
        let tempErrors = {};
        if (!/^[a-zA-Z]+$/.test(formData.nom)) tempErrors.nom = "Nom doit contenir uniquement des lettres.";
        if (!/^[a-zA-Z]+$/.test(formData.prenom)) tempErrors.prenom = "Prénom doit contenir uniquement des lettres.";
        if (!/^\d+$/.test(formData.telephone)) tempErrors.telephone = "Téléphone doit contenir uniquement des chiffres.";
        if (!formData.email.includes('@')) tempErrors.email = "Email invalide.";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setShowRecap(true);
        }
    };

    const handleConfirm = () => {
        setShowRecap(false);
        setIsSubmitted(true);
        resetForm();
    };

    const handleCancel = () => {
        setShowRecap(false);
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setErrors({});
    };

    return (
        <>
            <Head>
                <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
            </Head>
            <div className="bg-[#18321F] min-h-screen py-8 font-open-sans relative">
                <div className="absolute inset-0" style={{ backgroundImage: 'url(/img/fond_adhesion.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(8px) brightness(0.5)' }}></div>
                <div className="relative max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8 border border-green-700 font-open-sans z-10 mt-16">
                <div className="text-center mb-6">
                        <img src="/img/cocagne-vert.png" alt="Les Jardins de Cocagne" className="mx-auto mb-4 w-32 h-32 object-contain" />
                        <h1 className="text-4xl font-bold text-green-700">FORMULAIRE ABONNEMENT 2025</h1>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-semibold text-green-700 mb-2">Nom</label>
                                <input type="text" name="nom" value={formData.nom} onChange={handleChange} className="w-full border border-black rounded-lg p-3 focus:ring-2 focus:ring-green-400" placeholder="Nom" />
                                {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-green-700 mb-2">Prénom</label>
                                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="w-full border border-black rounded-lg p-3 focus:ring-2 focus:ring-green-400" placeholder="Prénom" />
                                {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-green-700 mb-2">Adresse</label>
                                <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} className="w-full border border-black rounded-lg p-3 focus:ring-2 focus:ring-green-400" placeholder="Adresse" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-green-700 mb-2">Code postal</label>
                                <input type="text" name="codePostal" value={formData.codePostal} onChange={handleChange} className="w-full border border-black rounded-lg p-3 focus:ring-2 focus:ring-green-400" placeholder="Code postal" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-green-700 mb-2">Ville</label>
                                <input type="text" name="ville" value={formData.ville} onChange={handleChange} className="w-full border border-black rounded-lg p-3 focus:ring-2 focus:ring-green-400" placeholder="Ville" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-green-700 mb-2">Téléphone</label>
                                <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} className="w-full border border-black rounded-lg p-3 focus:ring-2 focus:ring-green-400" placeholder="Téléphone" />
                                {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-green-700 mb-2">Mail</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-black rounded-lg p-3 focus:ring-2 focus:ring-green-400" placeholder="Email" />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-green-700 mb-4">FORMULES</h2>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-green-700 mb-2">J'adhère à l'association (obligatoire)</label>
                                <div className="flex items-center space-x-6">
                                    <label className="flex items-center">
                                        <input type="radio" name="cotisation" value="5" onChange={handleChange} className="mr-2" />
                                        Cotisation de 5 €
                                    </label>
                                </div>
                                <label className="flex items-center mt-2">
                                    <input type="radio" name="cotisation" value="don" onChange={handleChange} className="mr-2" />
                                    Cotisation de 5 € avec un don de
                                    <input type="number" name="don" value={formData.don} onChange={handleChange} className="ml-2 w-20 border border-black rounded-lg p-1" placeholder="€" />
                                </label>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-green-700 mb-2">Je souhaite recevoir des paniers de légumes</label>
                                <div className="flex items-center space-x-6">
                                    <label className="flex items-center">
                                        <input type="radio" name="legumes" value="oui" onChange={handleChange} className="mr-2" />
                                        Oui
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="legumes" value="non" onChange={handleChange} className="mr-2" />
                                        Non
                                    </label>
                                </div>
                                {formData.legumes === 'oui' && (
                                    <>
                                        <div className="mt-4">
                                            <label className="block text-sm font-semibold text-green-700 mb-2">Choisissez la fréquence</label>
                                            <div className="flex items-center space-x-6">
                                                <label className="flex items-center">
                                                    <input type="radio" name="frequenceLegumes" value="hebdomadaire" onChange={handleChange} className="mr-2" />
                                                    Hebdomadaire
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="radio" name="frequenceLegumes" value="bimensuelle" onChange={handleChange} className="mr-2" />
                                                    Bimensuelle
                                                </label>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-sm font-semibold text-green-700 mb-2">Choisissez la formule</label>
                                            <div className="flex items-center space-x-6">
                                                <label className="flex items-center">
                                                    <input type="radio" name="formuleLegumes" value="simple" onChange={handleChange} className="mr-2" />
                                                    Panier simple
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="radio" name="formuleLegumes" value="familial" onChange={handleChange} className="mr-2" />
                                                    Panier familial
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-green-700 mb-2">Je souhaite recevoir des boîtes d'œufs</label>
                            <div className="flex items-center space-x-6">
                                <label className="flex items-center">
                                    <input type="radio" name="oeufs" value="oui" onChange={handleChange} className="mr-2" />
                                    Oui
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="oeufs" value="non" onChange={handleChange} className="mr-2" />
                                    Non
                                </label>
                            </div>
                            {formData.oeufs === 'oui' && (
                                <>
                                    <div className="mt-4">
                                        <label className="block text-sm font-semibold text-green-700 mb-2">Choisissez la fréquence</label>
                                        <div className="flex items-center space-x-6">
                                            <label className="flex items-center">
                                                <input type="radio" name="frequenceOeufs" value="hebdomadaire" onChange={handleChange} className="mr-2" />
                                                Hebdomadaire
                                            </label>
                                            <label className="flex items-center">
                                                <input type="radio" name="frequenceOeufs" value="bimensuelle" onChange={handleChange} className="mr-2" />
                                                Bimensuelle
                                            </label>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-semibold text-green-700 mb-2">Choisissez la formule</label>
                                        <div className="flex items-center space-x-6">
                                            <label className="flex items-center">
                                                <input type="radio" name="formuleOeufs" value="1boite" onChange={handleChange} className="mr-2" />
                                                1 boîte de 6 œufs
                                            </label>
                                            <label className="flex items-center">
                                                <input type="radio" name="formuleOeufs" value="2boites" onChange={handleChange} className="mr-2" />
                                                2 boîtes de 6 œufs
                                            </label>
                                            <label className="flex items-center">
                                                <input type="radio" name="formuleOeufs" value="3boites" onChange={handleChange} className="mr-2" />
                                                3 boîtes de 6 œufs
                                            </label>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-green-700 mb-4">PAIEMENT</h2>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-green-700 mb-2">Je choisis le règlement par :</label>
                                <div className="flex items-center space-x-6">
                                    <label className="flex items-center">
                                        <input type="radio" name="paiement" value="prelevement" onChange={handleChange} className="mr-2" />
                                        Prélèvement
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="paiement" value="cheque" onChange={handleChange} className="mr-2" />
                                        Chèque
                                    </label>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-green-700 mb-2">Choisissez la fréquence de paiement :</label>
                                <div className="flex items-center space-x-6">
                                    <label className="flex items-center">
                                        <input type="radio" name="frequencePaiement" value="mensuel" onChange={handleChange} className="mr-2" />
                                        Mensuel
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="frequencePaiement" value="trimestriel" onChange={handleChange} className="mr-2" />
                                        Trimestriel
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="frequencePaiement" value="annuel" onChange={handleChange} className="mr-2" />
                                        Annuel
                                    </label>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-green-700 mb-2">Date :</label>
                                <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border border-black rounded-lg p-3 focus:ring-2 focus:ring-green-400" />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-green-700 mb-2">Signature :</label>
                                <input type="text" name="signature" value={formData.signature} onChange={handleChange} className="w-full border border-black rounded-lg p-3 focus:ring-2 focus:ring-green-400" placeholder="Signature" />
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-green-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600" disabled={isSubmitted}>
                            Envoyer
                        </button>
                    </form>
                </div>
            </div>

            {showRecap && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                        <h2 className="text-2xl font-bold text-green-700 mb-4">Récapitulatif</h2>
                        <ul className="mb-4 space-y-2">
                            {Object.entries(formData).map(([key, value]) => (
                                <li key={key} className="flex justify-between">
                                    <span className="font-semibold text-green-700">{key}:</span>
                                    <span>{value}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-end space-x-4">
                            <button onClick={handleCancel} className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-400">
                                Annuler
                            </button>
                            <button onClick={handleConfirm} className="bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-600">
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isSubmitted && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
                        <h2 className="text-2xl font-bold text-green-700 mb-4">Abonnement validé</h2>
                        <button onClick={() => setIsSubmitted(false)} className="bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-600">
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Adhesion;
