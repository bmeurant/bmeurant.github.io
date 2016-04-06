---
layout: ember-training
title: Formation Ember - Ember Data
permalink:  ember/training/ember-data/
prev: ember/training/components
---

{% raw %}

[Ember Data][ember-data] est une librairie indépendante mais complémentaire d'[Ember][ember] qui propose une prise en charge complète de la définition des modèles
métiers au sein d'une application [Ember][ember] ainsi que de l'ensemble des fonctions de communication entre une application et un serveur REST. le développement 
d'[Ember Data][ember-data] est piloté par les mêmes équipes que celles d'[Ember][ember] et son versionning est lié à celui d'[Ember][ember]. Cela garantit une 
compatibilité totale et une intégration fine de cette librairie au sein d'[ember]. Néanmoins, son utilisation, si elle est conseillée dans la plupart des cas, n'est 
en aucun cas obligatoire et il est parfaitement possible de développer une application [Ember][ember] sans utiliser [Ember Data][ember-data].

Communiquer avec un serveur sans utiliser [Ember Data][ember-data] nécessite de s'appuyer sur des outils beaucoup plus bas niveau tels que les 
[fonctions ajax de jQuery](http://api.jquery.com/category/ajax/). Dans ce cas, il ser nécessaire de gérer par nous même ces appels, les formats, le retours et éventuelles
erreurs ainsi que les différents états des modèles, leur validation, etc. La manipulation des promesses nécessaires à la gestion de ces requêtes asynchrone est également à 
notre charge.

Il est, en règle générale, fortement conseillé de s'appuyer sur cette librairie majeure de l'écosystème [Ember][ember] pour l'ensemble des outils et abstractions qu'elle
fournir pour nous faciliter la tâche et qui sont présentées ci-dessous.

## Principes

[Ember Data][ember-data] s'appuie sur un concept central de **store**. L'application va interagir principalement avec trois types d'objets principaux : 
 
 * Les **modèles**
 
   Les modèles sont la définition des objets métier d'une application. Définir un modèle revient à définir les structures de données qui le composent, les types, les relations, etc.
   Ce sont des modèles qui seront retournés du serveur via le **store** lors des diférentes fonctions de recherche et de requêtage. Ce sont également les modèles qui sont modifiés 
   dans les différentes routes et composants de l'application et qui, en fonction de leur état, pourront être sauvegardés sur le serveur grâce aux **adapters**.
 
 * Le **store**
 
   Le store est l'objet central dans le fonctionnement d'[Ember Data][ember-data]. Il est la référence pour toutes les fonctions de manipulation des modèles (requêtage, sauvegarde, etc.). Le 
   store réalise ainsi l'interface entre l'application et le serveur REST. Ainsi, les différents composants d'une application [Ember][ember] ne manipuleront que le store qui, lorsque 
   nécessaire, effectuera les requêtes vers le serveur de manière à récupérer ou sauvegarder les données. Le store fonctionne également comme un cache en évitant d'inutiles requêtes
   vers le serveur lors que les modèles requêtés y sont déjà chargés. Dans ce cas, le store se contentera de renvoyer les objets déjà récupérés.
 
 * Les **adapters**
 
   Pour communiquer avec le serveur REST, [Ember Data][ember-data] s'appuie sur des **adapters**. Ceux-ci réalisent les transformations (sérialisations, désérialisations, apis, etc.)
   nécessaires pour communiquer avec le serveur dans son format spécifique. Cette approche permet à une application de communiquer avec n'importe quel serveur dans n'importe quel format
   via la manipulation exclusive du **store**. Des adapters spécifiques réaliseront les transformations nécessaires sans aucun impact sur l'application elle-même. L'adapter par défaut 
   s'appuie sur le format défini par [JSON API](http://jsonapi.org/).

Les deux schémas ci-dessous illustrent les principes de fonctionnement exprimés plus haut s'agissant des requêtes et réponses entre une application et un serveur.

<p class="text-center">
    <img src="https://guides.emberjs.com/v2.4.0/images/guides/models/finding-unloaded-record-step1-diagram.png" alt="Ember Data Request"/>
    <img src="https://guides.emberjs.com/v2.4.0/images/guides/models/finding-unloaded-record-step2-diagram.png" alt="Ember Data Response"/>
</p>

## Modèles

### Attributs & types

### Valeurs par défaut

-> Exo modification du model

## Alimentation JSON via push

 -> Exo modification route comics model & push

## Récupération & Recherche

### Objet seul

#### Accès direct

#### Requête filtrée

### Collection

#### Accès direct

#### Requête filtrée

-> Exo modification route comics avec peekAll + route comic & peekAll.findBy

## Ember CLI Mirage

-> Exo (ou providing) config pour Mirage
-> Exo modif vers find puis findId puis findBySlug 

## Création, Modification

### Modification

#### Gestion de l'état

## Sauvegarde

### Promesses & validation

-> addon ?

### Suppression

## Relations




{% endraw %}

[ember]: http://emberjs.com/
[ember-data]: https://guides.emberjs.com/v2.4.0/models/