---
layout: ember-training
title: Formation Ember - Principes généraux
permalink:  ember/training/overview/
prev: ember/training/
next: ember/training/underlyings
description: formation / tutoriel emberjs - Principes généraux & fondamentaux ember
---

<div id="toc"></div>

{% raw %}

[Ember][ember] se définit comme : "A framework for creating **ambitious** web applications". Deux mots sont à appuyer particulièrement :

* **web** : l'une des caractéristiques majeures d'[Ember][ember] est son attachement au web et aux URLs en particulier. **Les URLs et donc le routeur sont au cœur d'Ember** là où bien d'autres frameworks les considèrent au mieux comme un add-on important.

* **framework** : [Ember][ember] est réellement un framework. Pas une lib, pas une colonne vertébrale, pas une boîte à outils : un framework avec un véritable modèle de développement qu'il est nécessaire d'adopter.

## Conventions de nommage - Conventions Over Configuration

Ce modèle de développement commence par les conventions de nommage. [Ember][ember] applique en effet le principe de "*conventions over configuration*" et repose sur un nommage cohérent des différents composants de votre application.

Ces conventions de nommage prennent la forme d'une structure d'application normalisée utilisant des noms de dossiers et des noms de fichiers particuliers, que le `Resolver` d'[Ember][ember] s'attend à retrouver.

-> [doc officielle](https://ember-cli.com/user-guide/#naming-conventions).

## Application

La figure suivante, extraite de la [Documentation officielle](http://guides.emberjs.com/v2.13.0/getting-started/core-concepts/), montre une vue générale du fonctionnement d'une application [Ember][ember] et des différents objets impliqués :

![Application Ember](http://guides.emberjs.com/v2.13.0/images/ember-core-concepts/ember-core-concepts.png)

## Routeur

Le routeur permet de faire correspondre à une URL un ensemble de templates imbriqués permettant le rendu des modèles associés à chacun de ces templates.

L'exemple suivant permet le rendu des URLs :

* `/books`
* `/books/:book_id`
* `/books/:book_id/edit`
* `/books/create`

```javascript
// app/router.js

Router.map(function() {
  this.route('books', function() {
    this.route('book', { path: '/:book_id' }, function () {
      this.route('edit');
    });
    this.route('create');
  });
});
```

## Routes

Les routes sont en charge de la récupération d'un modèle associé à la requête de l'utilisateur puis de l'association avec un contrôleur (et de son initialisation) et un template (ainsi que de son rendu).
La récupération du modèle ainsi que l'association entre un (ou plusieurs) modèle(s) et un (ou plusieurs) template(s) implique également la gestion des transitions entre les différentes URLs de l'application. 

```javascript
// app/routes/books.js

import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return this.store.findAll('book');
  }
});
```

-> [doc officielle](http://guides.emberjs.com/v2.13.0/routing/).


## Templates

Un template est un fragment de code HTML permettant, via des expressions, d'afficher les données du modèle associé. Les templates d'[Ember][ember] sont des templates [Handlebars](http://handlebarsjs.com/). 
Les expressions Handlebars sont délimitées par `{{` et `}}`.

L'exemple suivant permet d'afficher le titre d'une app composé d'un prénom et d'un nom pour peu que l'on ait passé au template un modèle contenant les deux propriétés `firstname` et `lastname`.

```html
<h1>{{firstname}} {{lastname}} Library</h1>
```

[Handlebars](http://handlebarsjs.com/) vient avec de nombreux outils (helpers) permettant de dynamiser nos templates : `{{#if isActive}} ... {{/if}}`, `{{#each users}} ... {{/each}}`, etc.

Dans [Ember][ember], les templates peuvent contenir un élément très important : un `{{outlet}}`. Cet outlet définit un emplacement pour un autre template permettant ainsi de multiples 
imbrications à mesure que les routes de l'application sont activées.

```html
<h1>{{firstname}} {{lastname}} Library</h1>

<div>
  {{outlet}}
</div>
```

Tout élément de modèle injecté dans un template sera **automatiquement mis à jour** (binding) par [Ember][ember] lorsque le modèle associé au template sera modifié. 
Évidemment, seul cet élément sera rafraîchi et non le template entier. Ce *binding*, qu'il soit unidirectionnel ou bidirectionnel est au coeur du fonctionnement d'[Ember][ember].

-> [doc officielle](http://guides.emberjs.com/v2.13.0/templates/handlebars-basics/).


## Modèles

Un modèle est un objet avec des propriétés contenant des données métier. Le modèle est ensuite passé au template pour être rendu par celui-ci
en HTML. Typiquement, les modèles peuvent être récupérés d'un back end via une API REST JSON via [Ember Data](https://github.com/emberjs/data) abordé plus loin, mais pas uniquement. 
Dans le premier cas, il s'agit d'un objet de type ``DS.Model``, ``DS`` étant le namespace commun à tous les éléments d'[Ember Data](https://github.com/emberjs/data).

```js
// app/models/book.js

import DS from 'ember-data';

export default DS.Model.extend({
  title               : DS.attr('string'),
  publicationDate     : DS.attr('date'),
  author              : DS.attr('string'),
  publisher           : DS.attr('string'),
  summary             : DS.attr('string')
});
```

Cependant, l'ensemble des mécanismes décrits plus bas (les *bindings* notamment) peuvent parfaitement fonctionner en s'appuyant directement sur le modèle objet d'ember et la 
classe ``Ember.Object`` [en détail](http://eviltrout.com/2013/03/23/ember-without-data.html).

-> [doc officielle](http://guides.emberjs.com/v2.13.0/models/).

## Contrôleurs

Le contrôleur, qui n'apparaît pas sur la figure ci-dessus, gère l'état de l'application. Il est situé entre la route dont il récupère le modèle et le template dont il répond aux appels. 
Le template accède aux données du contrôleur et le contrôleur accède aux données du modèle. Le contrôleur est par exemple responsable du traitement des actions effectuées par 
l'utilisateur sur l'interface rendue par le template :

```html
<button {{action "sort"}}></button>
```

```js
// app/controllers/books.js

import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {

    // appelé lors du clic sur le bouton
    sort: function () {
      ...
    }
  }
});
```

-> [doc officielle](http://guides.emberjs.com/v2.13.0/controllers/).

**Note**: Les contrôleurs [Ember][ember] sont appelés à disparaître progressivement au profit de l'utilisation de [composants routables](https://github.com/ef4/rfcs/blob/routeable-components/active/0000-routeable-components.md). 
Ce qui explique l'absence des contrôleurs sur la figure ci-dessus.


## Composants

Un composant [Ember][ember] permet de partager de puissants éléments réutilisables au sein d'une application [Ember][ember]. 
Depuis toujours [Ember][ember] met fortement en avant son approche composants. Avec la version 2, celle-ci s'est encore renforcée avec la disparition des *vues* remplacées par des composants.
Les composants [Ember][ember] s'articulent autour d'une partie template et/ou d'une partie logique. Dans les prochaines versions à venir, l'apparition de [composants routables](https://github.com/ef4/rfcs/blob/routeable-components/active/0000-routeable-components.md)
devrait rendre l'utilisation de contrôleurs seuls obsolète.

-> [doc officielle](https://guides.emberjs.com/v2.13.0/components/defining-a-component/).


## Génération d'objets

Pour qu'un template soit rendu lorsqu'une URL est demandée, il faut donc que le routeur définisse cette URL, qu'elle soit implémentée par une route qui récupèrera un modèle qu'elle mettra à disposition du 
contrôleur et du template. Le contrôleur écoutera les évènements en provenance du template et y apportera la réponse adaptée. 
À noter que l'évènement peut également remonter jusqu'à la route.

Un principe important d'[Ember][ember] est cependant qu'il n'est **pas nécessaire de créer systématiquement tous ces objets** si aucune logique spécifique n'a besoin d'y être définie. 
En effet, [Ember][ember] s'appuie sur les [conventions de nommage](#conventions-de-nommage) pour retrouver successivement, à partir d'une URL, la route, le contrôleur et le template associés. 
Si l'un de ces objet n'est pas trouvé, [Ember][ember] va en générer un par défaut.

Donc si l'on crée dans le routeur la route suivante sans créer aucun autre objet :

```js
Router.map(function() {
  this.route("about", { path: "/about" });
});
```

[Ember][ember] va générer les objets suivants :

* **route** : `AboutRoute`
* **contrôleur** : `AboutController`
* **template** : `about`

Dans une application [Ember][ember], **il n'est donc nécessaire de définir que ce dont on a besoin !**

-> [doc officielle](https://guides.emberjs.com/v1.13.0/routing/generated-objects/).

Un bon moyen de se rendre compte de ça consiste à installer le plugin Ember le navigateur de votre choix. Vous aurez, entre autres, la liste de l'ensemble des objets impliqués dans le rendu d'une URL 
donnée. Cette liste distingue de manière claire les objets créés par vous et ceux générés par Ember.

Ce module s'appelle **Ember Inspector** et est disponible pour [Chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi?hl=en)
et [Firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/). C'est absolument indispensable lorsqu'on développe en Ember.


## Conclusion

[Ember][ember] est donc un framework très riche et extrêmement plaisant à pratiquer. C'est aussi et surtout **un vrai framework avec un vrai parti pris et des vrais choix structurants.**

Il est résolument tourné vers le web et les URLs. Ses créateurs sont également ceux de son moteur de templates [Handlebars](http://handlebarsjs.com/) et sont très impliqués dans diverses initiatives 
autour de la standardisation et de l'évolution du web. Pour n'en citer que deux : [JSON API](http://jsonapi.org/) et [Web Components](https://gist.github.com/wycats/9144666b0c606d1838be), 
notamment au travers de son moteur de rendu [Glimmer](https://glimmerjs.com).

Ils embrassent très rapidement les nouveaux standards tels que [ES6 Harmony](https://tc39.github.io/ecma262/) à l'image des travaux effectués autour 
d'[ember-cli](http://www.ember-cli.com/).

Enfin, contrairement aux *a priori*, la courbe d'apprentissage d'[Ember][ember] est progressive et il est très simple à prendre en main une fois les concepts de base appréhendés.

{% endraw %}

[ember]: http://emberjs.com