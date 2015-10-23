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

Il est donc tout à fait possible d'organiser son application ``Ember`` comme on le souhaite : 

- dans un seul fichier JavaScript ou dans une balise `<script>`. On doit par contre impérativement respecter les conventions de 
  nommage et enregistrer nos objets dans une variable globale
- on peut essayer d'organiser nous-même notre application, nos fichiers, gérer des modules, etc. Tout ça va passer par l'utilisation 
  d'un outil de build javascript de type [Grunt](http://gruntjs.com/), [Gulp](http://gulpjs.com/), [Broccoli][broccoli]. 
  Ces outils vont nous permettre de concaténer nos différents fichiers JavaScript en un seul, de sortir les gabarits dans des fichiers
  `.hbs` et de les précompiler. On n'aura ensuite qu'à importer ces fichiers dans notre index.html :

Cependant, la complexité et la richesse des applications ``Ember`` augmentant, le besoin de disposer d'un outillage plus complet
et plus adapté s'est rapidement fait sentir. C'est suite à ce besoin que le projet [Ember CLI][ember-cli] est né, porté par une partie de la core team ``Ember``. Depuis, [Ember CLI][ember-cli] est
devenu un standard *de facto* dans la communauté ``Ember`` et a été ensuite officiellement supporté par l'équipe ``Ember``.

### Ember CLI

[Ember CLI][ember-cli] est une **interface en ligne de commande** pour ``Ember``. Elle repose
sur l'outil de build [Broccoli][broccoli] et permet : 

* d'initialiser une application Ember avec, cette fois, une [structure de fichiers][folder-layout] et des
  [conventions de nommage](http://www.ember-cli.com/#naming-conventions)
* de générer différents objets en mode scaffolding via des [commandes](http://www.ember-cli.com/#using-ember-cli).
* d'utiliser des outils de build basés sur [Broccoli][broccoli] pour le prétraitement des pré-processeurs CSS par exemple
* d'utiliser les [modules ES6](https://people.mozilla.org/~jorendorff/es6-draft.html) plutôt 
  qu'[AMD](http://en.wikipedia.org/wiki/Asynchronous_module_definition) ou 
  [CommonJS](http://en.wikipedia.org/wiki/CommonJS) pour la modularisation. Cette question a été
  largement débattue. ici un [article très intéressant](http://tomdale.net/2012/01/amd-is-not-the-answer/) à ce sujet.
* ...

Pour le reste, se reporter à la [doc officielle][ember-cli].


* On installe [Node][node] : https://nodejs.org/en/
 
```console
$ node -v
v4.2.1
```

Puis [Ember CLI][ember-cli] : 

```console
$ npm install -g ember-cli
$ ember -v
version: 1.13.8
node: 4.2.1
npm: 2.13.4
```

Créer une nouvelle application ``ember-training`` via [Ember CLI][ember-cli] et la ligne de commande `ember` :

```console
$ ember new ember-training
$ cd ember-training
version: 1.13.8
installing app
  create .bowerrc
  ...
  create vendor\.gitkeep
Installed packages for tooling via npm.
Installed browser packages via Bower.
Successfully initialized git.
```

Ouvrir le dossier de l'application et le fichier ``bower.json``. Dans les dépendances, changer les versions 
d' ``ember`` et d' ``ember-data`` pour ``^2.0.0`` si ce n'est pas déjà le cas : 

```javascript
{
  "name": "ember-training",
  "dependencies": {
    "ember": "^2.1.0",
    ...
    "ember-data": "^2.1.0",
    ...
}
```

Mettre à jour les dépendances via ``bower install``

Lancer enfin cette nouvelle application via la ligne de commande : 

```console
$ cd ember-training
$ ember serve
version: 1.13.8
Livereload server on http://localhost:49156
Serving on http://localhost:4200/
```

Ouvrir le navigateur à l'adresse http://localhost:4200/ et constater que l'application est lancée en ouvrant la console :

```console
DEBUG: -------------------------------
DEBUG: Ember      : 2.1.0
DEBUG: Ember Data : 2.1.0
DEBUG: jQuery     : 1.11.3
DEBUG: -------------------------------
```

On en profite pour installer le plugin de développement pour [Chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
ou [Firefox](https://addons.mozilla.org/fr/firefox/addon/ember-inspector/)

On dispose donc désormais d'un template d'application opérationel. La structure complète du projet créé est décrite dans la 
[documentation](folder-layout).

{% endraw %}

[ember]: http://emberjs.com
[ember-cli]: http://www.ember-cli.com/
[folder-layout]: http://www.ember-cli.com/user-guide/#folder-layout
[html-bars]: https://github.com/tildeio/htmlbars
[ember-data]: https://github.com/emberjs/data
