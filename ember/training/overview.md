---
layout: ember-training
title: Formation Ember
permalink:  overview/
prev: ember/training/
next: ember/training/object-model
---

{% raw %}

## Overview

[Ember](http://emberjs.com) se définit comme : "A framework for creating **ambitious** web applications". Deux mots sont à appuyer particulièrement :

* **web** : l'une des caractéristiques majeures d'[Ember](http://emberjs.com) est son attachement au web et aux URLs en particulier. **Les URLs et donc le routeur sont au cœur d'Ember** là ou bien d'autres frameworks les considèrent au mieux comme un addon important.

* **framework** : [Ember](http://emberjs.com) est réellement un framework. Pas une lib, pas une colonne vertébrale, pas une boîte à outils : un framework avec un véritable modèle de développement qu'il est nécessaire d'adopter.

### Conventions de nommage - Conventions Over Configuration

Ce modèle de développement commence par les conventions de nommage. [Ember](http://emberjs.com) applique en effet le principe de "*conventions over configuration*" et repose sur un nommage cohérent des différents composants de votre application.

Typiquement pour une URL `test`, [Ember](http://emberjs.com) s'attend à trouver une `TestRoute`, un `TestController`, un template `test`.

-> [doc officielle](http://emberjs.com/guides/concepts/naming-conventions/).


### Modèles

Un modèle est un objet avec des propriétés contenant des données métier. Le modèle est ensuite passé au template pour être rendu par lui
en HTML. Typiquement, les modèles peuvent être récupérés d'un back end via une API REST JSON via [Ember Data](https://github.com/emberjs/data) abordé plus loin mais pas uniquement. Dans le premier cas, il s'agit d'un objet de type ``DS.Model``, ``DS`` étant le namespace commun à tous les éléments d'[Ember Data](https://github.com/emberjs/data).

```js
var Book = DS.Model.extend({
    title               : DS.attr('string'),
    publicationDate     : DS.attr('date'),
    author              : DS.attr('string'),
    publisher           : DS.attr('string'),
    summary             : DS.attr('string')
});
```

Cependant, l'ensemble des mécanismes décrits plus bas (les *bindings* notamment) peuvent parfaitement fonctionner en s'appuyant directement sur le modèle objet d'ember et la classe ``Ember.Object`` [en détail](http://eviltrout.com/2013/03/23/ember-without-data.html).

-> [doc officielle](http://guides.emberjs.com/v2.0.0/models/).

### Routeur

Le routeur permet de faire correspondre à une URL un ensemble de templates imbriqués permettant le rendu des modèles associés à
chacun de ces templates.

L'exemple suivant permet le rendu des URLs :

* `/books`
* `/books/:book_id`
* `/books/:book_id/edit`
* `/books/create`

```js
App.Router.map(function() {
  this.resource('books', function() {
      this.resource('book', { path: '/:book_id' }, function () {
          this.route('edit');
      });
      this.route('create');
  });
});
```

### Routes

Les routes associent un modèle à un template et sont également impliquées dans les transitions entre les différentes URLs (et donc les différents états) de l'application. Elles gèrent notamment un certain nombre d'opérations sur un modèle lors de ces transitions.

```js
App.BooksRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('book');
    }
});
```

-> [doc officielle](http://guides.emberjs.com/v2.0.0/routing/).


### Contrôleurs

Le contrôleur gère l'état de l'application. Il est situé entre la route dont il récupère le modèle et le template dont il répond aux appels. Le template accède aux données du contrôleur et le contrôleur accède aux données du modèle. Le contrôleur est par exemple responsable du traitement des actions effectuées par l'utilisateur sur l'interface rendue par le template :

```html
<button {{action "sort"}}></button>
```

```js
App.BooksController = Ember.ArrayController.extend({
  actions: {
    // appelé lors du clic sur le bouton
    sort: function () {
        ...
    }
  }
});
```

-> [doc officielle](http://guides.emberjs.com/v2.0.0/controllers/).


### Templates

Un template est un fragment de code HTML permettant, via des expressions, d'afficher les données du modèle associé. Les templates d'[Ember](http://emberjs.com) sont des templates [Handlebars](http://handlebarsjs.com/). Les expressions Handlebars sont délimitées par `{{` et `}}`.

L'exemple suivant permet d'afficher le titre d'une app composé d'un prénom et d'un nom pour peu que l'on ait passé au template un
modèle contenant les deux propriétés `firstname` et `lastname`.

```html
<h1>{{firstname}} {{lastname}} Library</h1>
```

[Handlebars](http://handlebarsjs.com/) vient avec de nombreux outils (helpers) permettant de dynamiser nos templates : `{{#if isActive}} ... {{/if}}`, `{{#each users}} ... {{/each}}`, etc.

Dans [Ember](http://emberjs.com), les templates peuvent contenir un élément très important : un `{{outlet}}`. Cet outlet définit un emplacement pour un autre gabarit permettant ainsi de multiples imbrications à mesure que les routes de l'application sont activées.

```html
<h1>{{firstname}} {{lastname}} Library</h1>

<div>
  {{outlet}}
</div>
```

Tout élément de modèle injecté dans un template sera **automatiquement mis à jour** (binding) par [Ember](http://emberjs.com) lorsque le modèle associé au template sera modifié. Évidemment, seul cet élément sera rafraîchit et non le template entier. De la même manière, lorsque l'on agit sur le template (en remplissant un champ de formulaire, par exemple, le modèle est automatiquement mis à jour. Ce **binding bi-directionnel** est au coeur du fonctionnement d'[Ember](http://emberjs.com).

-> [doc officielle](http://guides.emberjs.com/v2.0.0/templates/handlebars-basics/).


### Composants

Un composant [Ember](http://emberjs.com) permet de définir une balise HTML personnalisée, permettant ainsi de partager de puissants
éléments réutilisables au sein de votre application.

-> [doc officielle](http://emberjs.com/guides/components/).


### Géneration d'objets

Pour qu'un template soit rendu lorsqu'une URL est demandée, il faut donc que le routeur définisse cette URL, qu'elle soit implémentée par une route qui récupèrera un modèle qu'elle mettra à disposition du contrôleur et du template. Le contrôleur écoutera les
évènements en provenance du template et y apportera la réponse adaptée. À noter que l'évènement peut également remonter jusqu'à la route. Le template est quant à lui encapsulé dans une vue gérée en propre par Ember.

Un principe important d'[Ember](http://emberjs.com) est cependant qu'il n'est **pas nécessaire de créer systématiquement tous ces objets** si aucune logique spécifique n'a besoin d'y être définie. En effet, [Ember](http://emberjs.com) s'appuie sur les [conventions de nommage](#conventions-de-nommage) pour retrouver successivement, à partir d'une URL, la route, le contrôleur, la vue et le gabarit associés. Si l'un de ces objet n'est pas trouvé, [Ember](http://emberjs.com) va en générer un par défaut.

Donc si l'on crée dans le routeur la route suivante sans créer aucun autre objet :

```js
App.Router.map(function() {
  this.route("about", { path: "/about" });
});
```

[Ember](http://emberjs.com) va générer les objets suivants :

* **route** : `AboutRoute`
* **contrôleur** : `AboutController`
* **gabarit** : `about`

Dans une application [Ember](http://emberjs.com), **il est donc nécessaire de ne définir que ce dont on a besoin !**.

-> [doc officielle](http://emberjs.com/guides/routing/generated-objects/).

Un bon moyen de se rendre compte de ça consiste à installer le debugger Ember sur votre navigateur préféré. Vous aurez, entre autres, la liste de l'ensemble des objets impliqués dans le rendu d'une URL donnée. Cette liste distingue de manière claire les objets créés par vous et ceux générés par Ember.

Ce module s'appelle **Ember Inspector** et est disponible pour [Chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi?hl=en)
et [Firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/). C'est absolument indispensable lorsqu'on développe en Ember.


### Conclusion

[Ember](http://emberjs.com) est donc un framework très riche et extrêmement plaisant à pratiquer.
**Un vrai framework avec un vrai parti pris et des vrais choix structurants.**

Il est résolument tourné vers le web et les URLs. Ses créateurs sont également ceux de son moteur de templates [Handlebars](http://handlebarsjs.com/) et sont très impliqués dans diverses initiatives autour de la standardisation et de l'évolution du web. Pour n'en citer que deux : [JSON API](http://jsonapi.org/) et [Web Components](https://gist.github.com/wycats/9144666b0c606d1838be), notamment au travers du compilateur de templates [HTMLBars](https://github.com/tildeio/htmlbars).

Ils embrassent très rapidement les nouveaux standards tels que [ES6 Harmony](https://people.mozilla.org/~jorendorff/es6-draft.html) à l'image des travaux effectués autour d'[ember-cli](http://www.ember-cli.com/).

Enfin, contrairement aux *a priori*, la courbe d'apprentissage d'[Ember](http://emberjs.com) est progressive et il est très simple à prendre en main une fois les concepts de base appréhendés.

{% endraw %}
