# API_securisee
API Sécurisée pour application Piiquante
Prérequis :

Environnement Node.js

Angular CLI

dotenV


Mise en route de l'application:

Cloner ce repository.

Pour démarrer le front-end : Se placer dans Web-Developer-P6, installer le package 'npm install' et executer 'npm run start'.

Pour le back-end : Se placer dans le dossier backend, exécuter 'nodemon server.js'.

Copier et créer un fichier .env pour renseigner les variables d'environnement pour pouvoir se connecter à la base de données

API DOCUMENTATION:

Présentation:

Dans le cadre du développement d’une application web de critique des sauces piquantes appelée « Hot Takes » pour l’entreprise Piiquante, nous implémentons une première version représentant une « galerie de sauces » permettant aux utilisateurs de télécharger leurs sauces piquantes préférées et de liker ou disliker les sauces que d'autres partagent. A terme, le site passera d 'application d'évaluation en une boutique en ligne. Cette présentation décrit le travail sur la partie “backend” du projet.
API référence
L'API Stripe est organisée sur les bases de REST. Notre API comporte des URL prévisibles orientées ressources, accepte les corps de requête codés par formulaire, renvoie des réponses codées JSON et utilise des codes de réponse HTTP standard, une authentification et des verbes.

Authentification 

Le plugin Mongoose, uniqueValidator, et la valeur unique du modèle de schéma User assurent l’authentification de l’adresse email avant son envoi sur la base de données MongoDB, les variables d’environnement pour cacher les informations sensibles dans un fichier dotenv.

Authentification basique
https://www.localhost:3000/api/auth/signup
Body
{
“email” : “string”, required,
“password”: “string”, required
}

Avec TOKEN envoyé dans les headers .

$ curl -H "Authorization: Bearer TOKEN" https://localhost:3000/api/auth/signup

Le mot de passe est hashé et salé avec bcrypt.

Endpoints

POST/api/auth/signup
Authentification : Bearer TOKEN
Ajout de l’utilisateur à la base de donnée après avoir procédé à sa sécurisation via TOKEN, hachage et salage du mot de passe.

POST/api/auth/login
Body:
{email: string, password: string}
Vérifie les informations d’authentification de l’utilisateur, renvoie l’_id de l’utilisateur depuis la base de données et un TOKEN signé.

GET/api/sauces
Authentification : Bearer TOKEN
Body:
{email: string, password: string}
Renvoie le tableau de toutes les sauces

GET/api/sauces/:id


renvoie la sauce avec l’id fourni

POST/api/sauces


renvoi le tableau de toutes les sauces

PUT/api/sauces/:id


Met à jour la sauce avec l’id fourni.

DELETE/api/sauces/:id


Supprime la sauce avec l’id fourni.

POST/api/sauces/:id/like


Définit le statut “like” et garde une trace de l’id de l’user qui a liké ou disliké.

Exemples de requêtes:
Get/api/sauces/:id 

{
    "_id": "636153c7b21d2a923c3157da",
    "userId": "63615383b21d2a923c3157cf",
    "name": "Piri-Piri",
    "manufacturer": "Maison Brémont",
    "description": "La sauce Piri Piri est une sauce pimentée pouvant servir de marinade!!!",
    "mainPepper": "Piment rouge piquant",
    "imageUrl": "http://localhost:3000/images/s_a_u_c_e_-_p_i_r_i_-_p_i_r_i_-_2_5_0_g_._j_p_g1667322823092.jpeg",
    "heat": 6,
    "likes": 2,
    "dislikes": 0,
    "usersLiked": [
        "63615383b21d2a923c3157cf",
        "636291e6fcfac9de010278ac"
    ],
    "usersDisliked": [],
    "__v": 2
}

Erreurs

200 OK
Demande acceptée, la réponse contient le résultat. Demandes PUT: “Sauce modifiée”, demandes DELETE: “Sauce supprimé”, demande POST “Sauce notée”.

201 CREATED
Code réponse renvoyé par les opérations  POST et indique qu’une nouvelle ressource a été créée.

304 ConditionNotMet
La condition spécifiée dans les en-têtes conditionnels n'a pas été remplie pour une opération de lecture. Non modifié.

400 EmptyMetaDataKey
Demande incorrecte. La clé pour l’une des paires clé-valeur de métadonnées et vide: problème d’identification. Un des paramètres de la requête spécifiés dans l’URI de la demande n’est pas pris en charge.

401 NoAuthenticationInfo or InvalidAuthenticationInfo
Non autorisé: le serveur n’a pas pu authentifier la requête: se reporter aux informations de l’entête.

403 InsufficientAccountPermissions or AccountIsDisabled
Interdit: Ce compte n’a pas d’autorisations suffisantes ou les opérations d’écriture ne sont pas autorisées. Le client a tenté d’accéder à une ressource à laquelle il n’a pas accès..

404 ResourceNotFound
Introuvable: la ressource spécifiée n’existe pas.

500 OperationTimeOut
Erreur interne au serveur: impossible d’exécuter l’opération dans le temps imparti.


