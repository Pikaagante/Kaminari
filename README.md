# Kaminari

Kaminari est un bot Discord basé sur un système de gacha autour des Pokémon.

Le principe est simple on parle sur le serveur, on effectue des jobs pour gagner de l'argent, puis on utilise cet argent pour acheter des Pokéballs. Chaque Pokéball contient différents Pokémon avec des probabilités d'apparition propres.

Le but est de compléter son Pokédex en capturant tous les Pokémon disponibles.

Chaque Pokéball nécessite également un certain nombre de points pour pouvoir être achetée. Il faut donc progresser dans les différentes balls afin d'accéder à des Pokémon de plus en plus intéressants.

## Commandes

### Balls.js

Contient actuellement le dictionnaire de tous les Pokémon présents dans chaque Pokéball ainsi que leurs probabilités.

Ce système fonctionne mais mériterait d'être refait afin de déplacer les données dans un fichier JSON séparé. Cela permettrait de rendre les données plus faciles à modifier et de séparer les données du code.

### `/beta.js`

Affiche un message permettant de prévenir les utilisateurs de l'état actuel du bot, notamment lorsqu'il est encore en développement ou en phase de test.

### `/buy.js`

Permet d'acheter des Pokéballs avec l'argent du joueur.

### `/classement.js`

Affiche le classement des joueurs selon différentes statistiques du bot.

### color.txt

Contient les informations utilisées pour afficher la couleur correspondant au type d'un Pokémon.

Ce fichier devrait également être déplacé ou réorganisé afin de centraliser les données liées aux Pokémon.

### `/daily.js`

Permet de récupérer une récompense en argent une fois par jour.

### `/help.js`

Affiche la liste des commandes disponibles et leur fonctionnement.

### `/info.js`

Permet d'obtenir les informations réelles d'un Pokémon, comme sa taille, son poids et différentes informations présentes dans la base de données Pokémon.

### `/inventory.js`

Affiche l'inventaire du joueur et le nombre de Pokéballs qu'il possède.

### `/job.js`

Permet d'effectuer un job toutes les 5 minutes afin de gagner de l'argent.

### `/loterie.js`

Permet de miser de l'argent dans un système de loterie.

### `/natsumi.js`

Commande permettant de remercier l'artiste ayant réalisé le logo de Kaminari.

### `/open.js`

Permet d'ouvrir une ou plusieurs Pokéballs afin d'obtenir des Pokémon.
Plusieurs Pokéballs peuvent être ouvertes en même temps.

### `/pokedex.js`

Affiche le Pokédex du joueur.
Plusieurs filtres sont disponibles afin de consulter sa collection :
* Pokémon capturés
* Pokémon non capturés
* Tous les Pokémon
* Pokéball permettant de voir où obtenir un Pokémon manquant
* Pokémon shiny

### `/profil.js`

Affiche les informations principales du joueur, notamment son argent et ses points.

### `/shop.js`

Permet de consulter le contenu d'une Pokéball avant de l'acheter.

### `/start.js`

Commande obligatoire à utiliser au début de l'utilisation du bot.
Elle permet de commencer avec :
* 1 point
* 600 P$
* 1 Carnivoball
* 1 Rattata

Cette commande sert également de première introduction au fonctionnement du bot et permet notamment de commencer le tutoriel.

### `/tuto.js`

Affiche un tutoriel expliquant le fonctionnement de Kaminari et les différentes commandes disponibles.

### `/vendre.js`

Permet de vendre des Pokémon en sélectionnant notamment leur rareté.
Le système est principalement prévu pour vendre les doublons afin de récupérer de l'argent.

## Base de données

Kaminari n'utilise actuellement pas de véritable base de données.
Les données sont stockées localement dans différents fichiers JSON. Ce fonctionnement est volontairement simple à mettre en place et permet de facilement sauvegarder les données du bot.

### argent.json

Stocke l'argent de chaque joueur.

Exemple :

```json
{
    "365039602882445312": 600
}
```

### balls.json

Contient les informations relatives aux différentes Pokéballs.
Chaque ball contient notamment :
* son prix
* le nombre de points minimum nécessaire
* les Pokémon disponibles
* les probabilités selon la rareté
* sa description

Exemple :

```json
{
    "CARNIVOBALL": {
        "price": 600,
        "MinPoint": 0,
        "PokemonC": "Magikarp\nRoucool\nPoissirene\nKrabby\nBargantua\nTiboudet\nFlingouste\nGourmelet\nCraparoi\nGruikui\nMoumouton",
        "PokemonPC": "Poissoroy\nLovdisc\nKrabboss\nCanarticho\nGamblast\nFragroin\nGrotichon\nMoumouflon",
        "PokemonR": "Tauros\nEcremeuh\nFrison\nPalarticho\nRoitiflam",
        "PokemonE": "Aucun",
        "Description": "Une ball parfaite pour vos barbecues"
    }
}
```

Le fichier contient également d'autres informations utilisées par le bot, les prix des Pokémon selon leur rareté et les différents messages utilisés pour les jobs.

### dresseur.json

Contient les Pokémon possédés par chaque joueur.
Pour chaque Pokémon, le fichier conserve :
* son statut shiny
* son nombre d'exemplaires
* sa rareté

Exemple :

```json
{
    "365039602882445312": {
        "NOEUNOEUF": {
            "shiny": true,
            "nbr": 1,
            "rarity": "P"
        },
        "ARBOLIVA": {
            "shiny": false,
            "nbr": 1,
            "rarity": "P"
        }
    }
}
```

### inventory.json

Contient les Pokéballs possédées par chaque joueur ainsi que leur quantité.
Exemple :

```json
{
    "365039602882445312": {
        "CARNIVOBALL": {
            "nbr": 43
        }
    }
}
```

### point.json

Stocke les points des joueurs.
Le fonctionnement est similaire à argent.json, mais pour les points utilisés afin de débloquer les différentes Pokéballs.
Il pourrait être fusionné avec argent.json dans un fichier profil regroupant les informations principales du joueur, notamment son argent et ses points.

### pokemon.json

Contient la base de données générale des Pokémon utilisés par Kaminari.
Elle contient les informations relatives aux Pokémon ainsi que les informations permettant notamment de savoir dans quelles Pokéballs ils peuvent apparaître.

## Assets

Les assets du bot sont stockés localement.
Nous avons tout d'abord les gifs puis les png au cas ou le gif n'existe pas.

## Technologies

* Node.js
* JavaScript
* Discord.js
* JSON
* Git

## État du projet

Kaminari est un bot développé autour d'un système de collection et de progression.

Certaines parties du projet fonctionnent actuellement avec des structures de données assez anciennes, notamment Balls.js. Une partie du travail futur pourrait donc consister à mieux séparer les données du code et à améliorer la structure des fichiers JSON.

---

# Installation

## Prérequis

Le bot nécessite :

* Node.js
* npm
* Un bot Discord créé sur le Discord Developer Portal

---

## Installation des dépendances

Les dépendances :

```bash
npm install
npm install discord.js@latest
```

---

# Configuration

Le fichier :

```text
config.js
```

n'est volontairement pas présent sur GitHub.
Il contient des informations sensibles nécessaires au fonctionnement du bot, notamment le token du bot Discord.

---