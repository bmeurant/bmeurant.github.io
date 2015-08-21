---
layout: ember-training
title: Formation Ember
permalink:  structure/
prev: ember/training/object-model
next: ember/training/ember-data
---

{% raw %}

## Structure d'une application Ember

On a déjà évoqué le fait qu'``Ember`` était un framework avec des partis pris forts et un modèle de développement structurant. 

Historiquement, cependant, ``Ember`` **ne faisait aucun choix particulier du point de vue de l'organisation de nos applications**.

Il existe donc différentes manières de structurer une application ``Ember``, de la plus basique à la plus complète.


### À la mano

De base, avec ``Ember`` on peut donc déclarer nos routes, contrôleurs, modèles, etc. dans un seul fichier JavaScript ou dans une balise `<script>`.
On doit par contre impérativement respecter les conventions de nommage et enregistrer nos objets dans une variable globale :

```js
App = Ember.Application.create();

App.Router.map(function() {
  ...
});

App.BookRoute = Ember.Route.extend({
  ...
});
```

De la même manière, on peut déclarer nos gabarits [Handlebars](http://handlebarsjs.com/) via des balises `<script>` :

```html
<script type="text/x-handlebars">
  <div>
    {{outlet}}
  </div>
</script>
```

### Outillé

Comme on peut trouver ça un peu limité, on peut essayer d'organiser nous-même notre application, nos fichiers, gérer des modules, etc. Tout ça va passer par l'utilisation d'un outil de build
javascript de type [Grunt](http://gruntjs.com/), [Gulp](http://gulpjs.com/), [Broccoli][broccoli]. Ces outils vont nous permettre
de concaténer nos différents fichiers JavaScript en un seul, de sortir les gabarits dans des fichiers `.hbs` et de les précompiler. On n'aura ensuite qu'à importer ces fichiers dans notre index.html :

```html
...
<script src="dist/libs/handlebars.min.js"></script>
<script src="dist/libs/ember.js"></script>
<script src="dist/application.js"></script>
<script src="dist/templates.js"></script>
...
```

### Ember CLI

La solution précédente peut suffire dans un certain nombre de cas. Cependant, la complexité et la richesse des applications ``Ember`` augmentant, le besoin de disposer d'un outillage plus complet
et plus adapté s'est rapidement fait sentir. C'est suite à ce besoin que le projet [Ember CLI][ember-cli] est né, porté par une partie de la core team ``Ember``. Depuis, [Ember CLI][ember-cli] est
devenu un standard *de facto* dans la communauté ``Ember`` et s'apprête à être officiellement supporté par l'équipe ``Ember``.

[Ember CLI][ember-cli] est une **interface en ligne de commande** pour ``Ember``. Elle repose
sur l'outil de build [Broccoli][broccoli] et permet : 

* d'initialiser une application Ember avec, cette fois, une [structure de fichiers][folder-layout] et des
  [conventions de nommage](http://www.ember-cli.com/#naming-conventions)
* de générer différents objets en mode scaffolding via des [commandes](http://www.ember-cli.com/#using-ember-cli). Autant le dire tout de suite, je ne suis pas fan du scaffolding mais on va regarder quand même pour ne pas mourir idiots.
* d'utiliser des outils de build basés sur [Broccoli][broccoli] pour le prétraitement des pré-processeurs CSS par exemple
* d'utiliser les [modules ES6](https://people.mozilla.org/~jorendorff/es6-draft.html) plutôt 
  qu'[AMD](http://en.wikipedia.org/wiki/Asynchronous_module_definition) ou 
  [CommonJS](http://en.wikipedia.org/wiki/CommonJS) pour la modularisation. Cette question a été
  largement débattue. Si ça vous intéresse, je vous laisse découvrir un 
  [article très intéressant](http://tomdale.net/2012/01/amd-is-not-the-answer/) à ce sujet.
* ...

Je ne vais pas vous détailler davantage le truc, vous trouverez vous-même la [doc officielle][ember-cli]. Et puis, on va tout de suite le mettre en pratique.

_Note : là encore, [Ember CLI][ember-cli], c'est un parti pris. Ce sera probablement très bien accueilli par certains pour qui cela offre un cadre de travail structuré et structurant. Mais ce sera aussi rejeté par d'autres qui le verront comme une grosse machine inutile.
Ici encore, question de goût, question de contexte, question de besoins._

Trèves de bavardages, on s'y met sérieusement :

On installe [Node][node], [Ember CLI][ember-cli], [Bower](http://bower.io/) :

```console
$ npm install -g ember-cli
$ npm install -g bower
```

Ça y est, on peut maintenant demander gentiment à [Ember CLI][ember-cli] de nous créer notre application grâce à la 
commande `ember` et voir ensuite une magnifique page de bienvenue sur http://localhost:4200/ :

```console
$ ember new ember-articles
$ cd ember-articles
$ ember server
```

Je ne vous fais pas l'affront de détailler ici la structure de l'application, tout est décrit dans la 
[documentation][folder-layout].

{% endraw %}

[ember]: http://emberjs.com
[ember-cli]: http://www.ember-cli.com/
[node]: http://nodejs.org/
[broccoli]: https://github.com/broccolijs/broccoli
[computed-prop]: http://emberjs.com/guides/object-model/computed-properties/
[folder-layout]: http://www.ember-cli.com/#folder-layout
[html-bars]: https://github.com/tildeio/htmlbars
[ember-data]: https://github.com/emberjs/data
