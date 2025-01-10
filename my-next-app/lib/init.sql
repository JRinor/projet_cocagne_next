-- Connexion à la base de données jardins_cocagne
\c jardins_cocagne;

-- Supprimer les tables existantes si elles existent
DROP TABLE IF EXISTS Facture_Abonnement;
DROP TABLE IF EXISTS Commande_Tournee;
DROP TABLE IF EXISTS Commande;
DROP TABLE IF EXISTS Adhesion;
DROP TABLE IF EXISTS Facturation;
DROP TABLE IF EXISTS Abonnement;
DROP TABLE IF EXISTS Tournee_PointDeDepot;
DROP TABLE IF EXISTS Tournee;
DROP TABLE IF EXISTS PointDeDepot;
DROP TABLE IF EXISTS Panier_Frequence;
DROP TABLE IF EXISTS Frequence;
DROP TABLE IF EXISTS Panier;
DROP TABLE IF EXISTS Adherent;
DROP TABLE IF EXISTS Structure;
DROP TABLE IF EXISTS AppUser;
DROP TABLE IF EXISTS Role;

-- Table pour les rôles
CREATE TABLE Role (
    ID_Role SERIAL PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE
);

-- Table pour les utilisateurs
CREATE TABLE AppUser (
    ID_User SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    ID_Role INT NOT NULL,
    FOREIGN KEY (ID_Role) REFERENCES Role(ID_Role) ON DELETE CASCADE
);

-- Insertion des rôles, avec gestion de duplication
INSERT INTO Role (nom) 
VALUES ('admin'), ('user')
ON CONFLICT (nom) DO NOTHING;

-- Table pour la structure
CREATE TABLE Structure (
    ID_Structure SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    coordonnees_bancaires VARCHAR(255),
    SIRET VARCHAR(14) NOT NULL UNIQUE
);

-- Table pour les adhérents
CREATE TABLE Adherent (
    ID_Adherent SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telephone VARCHAR(20),
    adresse VARCHAR(255),
    date_naissance DATE
);

-- Table pour les paniers (produits)
CREATE TABLE Panier (
    ID_Panier SERIAL PRIMARY KEY,
    ID_Structure INT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    unite VARCHAR(50) NOT NULL,
    photo VARCHAR(255),
    image VARCHAR(255),
    FOREIGN KEY (ID_Structure) REFERENCES Structure(ID_Structure) ON DELETE CASCADE
);

-- Table pour les fréquences
CREATE TABLE Frequence (
    ID_Frequence SERIAL PRIMARY KEY,
    type_frequence VARCHAR(50) NOT NULL
);

-- Table pour l'association entre paniers et fréquences
CREATE TABLE Panier_Frequence (
    ID_Panier INT,
    ID_Frequence INT,
    PRIMARY KEY (ID_Panier, ID_Frequence),
    FOREIGN KEY (ID_Panier) REFERENCES Panier(ID_Panier) ON DELETE CASCADE,
    FOREIGN KEY (ID_Frequence) REFERENCES Frequence(ID_Frequence) ON DELETE CASCADE
);

-- Table pour les points de dépôt
CREATE TABLE PointDeDepot (
    ID_PointDeDepot SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    ID_Structure INT NOT NULL,
    FOREIGN KEY (ID_Structure) REFERENCES Structure(ID_Structure) ON DELETE CASCADE
);

-- Table pour les tournées
CREATE TABLE Tournee (
    ID_Tournee SERIAL PRIMARY KEY,
    jour_preparation DATE NOT NULL,
    jour_livraison DATE NOT NULL,
    statut_tournee VARCHAR(20) DEFAULT 'préparée'
);

-- Table pour l'association entre tournées et points de dépôt
CREATE TABLE Tournee_PointDeDepot (
    ID_Tournee INT,
    ID_PointDeDepot INT,
    numero_ordre INT NOT NULL,
    statut_etape VARCHAR(20) DEFAULT 'planifiée',
    PRIMARY KEY (ID_Tournee, ID_PointDeDepot),
    FOREIGN KEY (ID_Tournee) REFERENCES Tournee(ID_Tournee) ON DELETE CASCADE,
    FOREIGN KEY (ID_PointDeDepot) REFERENCES PointDeDepot(ID_PointDeDepot) ON DELETE CASCADE
);

-- Table pour les abonnements
CREATE TABLE Abonnement (
    ID_Abonnement SERIAL PRIMARY KEY,
    ID_Adherent INT NOT NULL,
    ID_Panier INT NOT NULL,
    ID_Frequence INT NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE DEFAULT NULL,
    statut VARCHAR(20) DEFAULT 'actif',
    FOREIGN KEY (ID_Adherent) REFERENCES Adherent(ID_Adherent) ON DELETE CASCADE,
    FOREIGN KEY (ID_Panier) REFERENCES Panier(ID_Panier) ON DELETE CASCADE,
    FOREIGN KEY (ID_Frequence) REFERENCES Frequence(ID_Frequence) ON DELETE CASCADE
);

-- Table pour les commandes
CREATE TABLE Commande (
    ID_Commande SERIAL PRIMARY KEY,
    ID_Abonnement INT NOT NULL,
    ID_PointDeDepot INT NOT NULL,
    quantite INT NOT NULL CHECK (quantite > 0),
    date_commande TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'en attente',
    FOREIGN KEY (ID_Abonnement) REFERENCES Abonnement(ID_Abonnement) ON DELETE CASCADE,
    FOREIGN KEY (ID_PointDeDepot) REFERENCES PointDeDepot(ID_PointDeDepot) ON DELETE CASCADE
);

-- Table pour l'association entre commandes et tournées
CREATE TABLE Commande_Tournee (
    ID_Commande INT,
    ID_Tournee INT,
    statut_livraison VARCHAR(20) DEFAULT 'non livrée',
    PRIMARY KEY (ID_Commande, ID_Tournee),
    FOREIGN KEY (ID_Commande) REFERENCES Commande(ID_Commande) ON DELETE CASCADE,
    FOREIGN KEY (ID_Tournee) REFERENCES Tournee(ID_Tournee) ON DELETE CASCADE
);

-- Table pour la facturation
CREATE TABLE Facturation (
    ID_Facture SERIAL PRIMARY KEY,
    ID_Adherent INT NOT NULL,
    montant DECIMAL(10, 2) NOT NULL CHECK (montant >= 0),
    date_facture TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_Adherent) REFERENCES Adherent(ID_Adherent) ON DELETE CASCADE
);

-- Table pour le lien entre factures et abonnements
CREATE TABLE Facture_Abonnement (
    ID_Facture INT,
    ID_Abonnement INT,
    PRIMARY KEY (ID_Facture, ID_Abonnement),
    FOREIGN KEY (ID_Facture) REFERENCES Facturation(ID_Facture) ON DELETE CASCADE,
    FOREIGN KEY (ID_Abonnement) REFERENCES Abonnement(ID_Abonnement) ON DELETE CASCADE
);

-- Table pour les adhésions
CREATE TABLE Adhesion (
    ID_Adhesion SERIAL PRIMARY KEY,
    ID_Adherent INT NOT NULL,
    type VARCHAR(20) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE DEFAULT NULL,
    statut VARCHAR(20) DEFAULT 'actif',
    UNIQUE (ID_Adherent, type, statut),
    FOREIGN KEY (ID_Adherent) REFERENCES Adherent(ID_Adherent) ON DELETE CASCADE
);

-- Insertion des rôles, avec gestion de duplication
INSERT INTO Role (nom) 
VALUES ('admin'), ('user')
ON CONFLICT (nom) DO NOTHING;

-- Insertion des utilisateurs avec mot de passe haché
INSERT INTO AppUser (nom, prenom, email, mot_de_passe, ID_Role)
VALUES 
    ('Dupont', 'Jean', 'jean.dupont@example.com', '$2b$10$goW7/1/idp1Q1Bo.EXS/A.gPQq7DyDzm30dXA.vWT1PXPc7nHpgWO', 1), 
    ('Martin', 'Marie', 'marie.martin@example.com', '$2b$10$goW7/1/idp1Q1Bo.EXS/A.gPQq7DyDzm30dXA.vWT1PXPc7nHpgWO', 2);


-- Insertion de la structure
INSERT INTO Structure (nom, adresse, coordonnees_bancaires, SIRET)
VALUES 
    ('Cocagne Jardin', '1 Rue de la Terre, Paris', '1234567890', '12345678901234');

-- Insertion d'un adhérent avec une adresse corrigée
INSERT INTO Adherent (nom, prenom, email, telephone, adresse, date_naissance)
VALUES 
    ('Durand', 'Pierre', 'pierre.durand@example.com', '0102030405', '5 Rue de l''Eau, Paris', '1990-05-15');

-- Insertion d'un panier
INSERT INTO Panier (ID_Structure, nom, description, unite, photo, image)
VALUES 
    (1, 'Panier de légumes', 'Panier contenant divers légumes frais', 'kg', 'photo_légumes.jpg', 'image_légumes.jpg');

-- Insertion d'une fréquence
INSERT INTO Frequence (type_frequence)
VALUES 
    ('hebdomadaire');

-- Insertion dans la table de liaison Panier_Frequence
INSERT INTO Panier_Frequence (ID_Panier, ID_Frequence)
VALUES 
    (1, 1);

-- Insertion d'un point de dépôt
INSERT INTO PointDeDepot (nom, adresse, latitude, longitude, ID_Structure)
VALUES 
    ('Point de dépôt 1', '10 Avenue des Champs-Élysées, Paris', 48.8566, 2.3522, 1);

-- Insertion d'une tournée
INSERT INTO Tournee (jour_preparation, jour_livraison, statut_tournee)
VALUES 
    ('2025-01-15', '2025-01-16', 'préparée');

-- Insertion dans la table de liaison Tournee_PointDeDepot
INSERT INTO Tournee_PointDeDepot (ID_Tournee, ID_PointDeDepot, numero_ordre, statut_etape)
VALUES 
    (1, 1, 1, 'planifiée');

-- Insertion d'un abonnement
INSERT INTO Abonnement (ID_Adherent, ID_Panier, ID_Frequence, date_debut, date_fin, statut)
VALUES 
    (1, 1, 1, '2025-01-01', NULL, 'actif');

-- Insertion d'une commande
INSERT INTO Commande (ID_Abonnement, ID_PointDeDepot, quantite, date_commande, statut)
VALUES 
    (1, 1, 1, CURRENT_TIMESTAMP, 'en attente');

-- Insertion d'une commande associée à une tournée
INSERT INTO Commande_Tournee (ID_Commande, ID_Tournee, statut_livraison)
VALUES 
    (1, 1, 'non livrée');

-- Insertion d'une facturation
INSERT INTO Facturation (ID_Adherent, montant, date_facture)
VALUES 
    (1, 100.00, CURRENT_TIMESTAMP);

-- Insertion dans la table de liaison Facture_Abonnement
INSERT INTO Facture_Abonnement (ID_Facture, ID_Abonnement)
VALUES 
    (1, 1);

-- Insertion d'une adhésion
INSERT INTO Adhesion (ID_Adherent, type, date_debut, date_fin, statut)
VALUES 
    (1, 'annuelle', '2025-01-01', NULL, 'actif');
