---
layout: ember-training
title: Formation Ember - Ember CLI
permalink:  ember-cli/
prev: ember/training/underlyings
next: ember/training/templates
---

## Structure d'une application Ember

On a déjà évoqué le fait qu'[Ember][ember] était un framework avec des partis pris forts et un modèle de développement structurant. 

Historiquement, cependant, [Ember][ember] **ne faisait aucun choix particulier du point de vue de l'organisation de nos applications**.

Il est donc tout à fait possible d'organiser son application [Ember][ember] comme on le souhaite : 

- dans un seul fichier JavaScript ou dans une balise `<script>`. On doit par contre impérativement respecter les conventions de 
  nommage et enregistrer nos objets dans une variable globale
- on peut essayer d'organiser nous-même notre application, nos fichiers, gérer des modules, etc. Tout ça va passer par l'utilisation 
  d'un outil de build javascript de type [Grunt](http://gruntjs.com/), [Gulp](http://gulpjs.com/), [Broccoli][broccoli]. 
  Ces outils vont nous permettre de concaténer nos différents fichiers JavaScript en un seul, de sortir les gabarits dans des fichiers
  `.hbs` et de les précompiler. On n'aura ensuite qu'à importer ces fichiers dans notre ``index.html``.

Cependant, la complexité et la richesse des applications [Ember][ember] augmentant, le besoin de disposer d'un outillage plus complet
et plus adapté s'est rapidement fait sentir. C'est suite à ce besoin que le projet [Ember CLI][ember-cli] est né, porté par une partie de la core team [Ember][ember]. Depuis, [Ember CLI][ember-cli] est
devenu un standard *de facto* dans la communauté [Ember][ember] et a été ensuite officiellement supporté par l'équipe [Ember][ember].

## Ember CLI

[Ember CLI][ember-cli] est une **interface en ligne de commande** pour [Ember][ember]. Elle repose
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

<div class="work no-answer">
    {% capture m %}

1. Installer Node : [ici](https://nodejs.org/en/)
 
    ```console
    $ node -v
    v4.2.1
    ```

1. Puis [Ember CLI][ember-cli] : 

    ```console
    $ npm install -g ember-cli
    $ ember -v
    version: 1.13.8
    node: 4.2.1
    npm: 2.13.4
    ```

1. Créer une nouvelle application ``ember-training`` via [Ember CLI](http://www.ember-cli.com/) et la ligne de commande `ember` :

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

1. Ouvrir le dossier de l'application et le fichier ``bower.json``. Dans les dépendances, changer les versions 
d' [Ember][ember] et d' ``ember-data`` pour ``^2.0.0`` si ce n'est pas déjà le cas : 

    ```javascript
    // bower.json
    
    {
      "name": "ember-training",
      "dependencies": {
        "ember": "^2.1.0",
        ...
        "ember-data": "^2.1.0",
        ...
    }
    ```

1. Mettre à jour les dépendances via ``bower install``

    Changer également la version d' ``ember-data`` dans le fichier ``package.json`` : 

    ```javascript
    // package.json
    
    {
      "name": "ember-training",
      
      ...
      
      "devDependencies": {
        ...
        "ember-data": "2.1.0",
        ...
      }
    }
    ``` 

1. Mettre à jour les dépendances via ``npm install``

1. Lancer enfin cette nouvelle application via la ligne de commande : 

    ```console
    $ cd ember-training
    $ ember serve
    version: 1.13.8
    Livereload server on http://localhost:49156
    Serving on http://localhost:4200/
    ```

1. Ouvrir le navigateur à [cette adresse](http://localhost:4200/) et constater que l'application est lancée en ouvrant la console :

    ```console
    DEBUG: -------------------------------
    DEBUG: Ember      : 2.1.0
    DEBUG: Ember Data : 2.1.0
    DEBUG: jQuery     : 1.11.3
    DEBUG: -------------------------------
    ```

1. On en profite enfin pour installer le plugin de développement pour [Chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
ou [Firefox](https://addons.mozilla.org/fr/firefox/addon/ember-inspector/)

On dispose donc désormais d'un template d'application opérationel. La structure complète du projet créé est décrite dans la 
[documentation](folder-layout).

  {% endcapture %}{{ m | markdownify }}
</div>

Mais [Ember CLI][ember-cli] est bien loin de ne proposer qu'une structure de projet standard. Il s'agit d'un outil de build complet comprenant : 

* Un **asset pipeline** complet : A la manière d'une succession de tâches ``Grunt`` ou ``Gulp``, [Ember CLI][ember-cli] propose des outils pour compiler les templates, exécuter les pré-processeurs CSS,
  servir et minifier JS et CSS, etc. cf [Asset compilation](http://www.ember-cli.com/user-guide/#asset-compilation)
* L'exécution des tests. cf. [Tests](http://www.ember-cli.com/user-guide/#testing)
* La translation des conventions de nommage [Ember][ember] en structure de fichiers. cf. [Naming conventions](http://www.ember-cli.com/user-guide/#naming-conventions)
* La gestion des dépendances et librairies via ``Bower`` et ``Broccoli``. cf [Managing dependencies](http://www.ember-cli.com/user-guide/#naming-conventions)
* La gestion des environnements. cf. [Environnements](http://www.ember-cli.com/user-guide/#Environments). Un certain nombre de configuration sont mises en place et adaptées en fonction des environnements 
  (cache busting, etc.)
* La gestion du packaging et du déploiement. cf. [Déploiements](http://www.ember-cli.com/user-guide/#deployments)
* La transpilation de la syntaxe Ecmascript 6 et la gestion des modules dans une syntaxte Ecmascript 5 compatible avec tous les navigateurs. [Ember CLI][ember-cli] propose en effet d'utiliser en grande partie la
  syntaxe Ecmascript 6 et notament la gestion des modules propre à cette version du language. Cette gestion de module permet de gérer les dépendances internes au projet (classes, modules, etc.) sans faire appel
  à des librairies externes telles que ``requireJS``. cf. [Using Modules & the Resolver](http://www.ember-cli.com/user-guide/#using-modules)


## Bootstrap & Sass

De manière à avoir un look correct pour notre application à moindre frais, nous allons utiliser l'écosystème [Ember CLI][ember-cli] pour installer et intégrer 
le framework CSS [Bootstrap](http://getbootstrap.com/) et le préprocesseur [Sass](http://sass-lang.com/):

<div class="work no-answer">
    {% capture m %}
    
1. Installer broccoli-sass via npm. Ce plugin permet d'intégrer la précompilation sass dans [Ember CLI](http://www.ember-cli.com/) : 

    ```console
    npm install --save-dev broccoli-sass
    ```
    
    En ouvrant le fichier ``package.json``, on constate que la dépendance broccoli-sass a été ajoutée : 
        
    ```javascript
    // package.json
    
    ...
    
      "devDependencies": {
        ...
        "broccoli-sass": "^0.6.8",
        ...
      }
    ...
    ```

1. Installer bootstrap-sass via bower. Celui-ci permet de disposer d'une distribution sass du framework bootstrap : 

    ```console
    $ bower install --save bootstrap-sass
    bower cached        https://github.com/twbs/bootstrap-sass.git#3.3.5
    bower validate      3.3.5 against https://github.com/twbs/bootstrap-sass.git#*
    ```
    
    En ouvrant le fichier ``bower.json``, on constate que la dépendance bootstrap-sass a été ajoutée : 
    
    ```javascript
    // bower.json
    
    ...
    
      "dependencies": {
        "ember": "^2.1.0",
        ...
        "bootstrap-sass": "~3.3.5"
      }
    ...
    ```

1. Renommer ensuite le fichier ``app/styles/app.css`` en ``app/styles/app.scss`` et importer le framework depuis les dépendances `bower` :

    ```console
    // app/styles/app.scss
    
    @import "bower_components/bootstrap-sass/assets/stylesheets/bootstrap";
    ```
    
1. Relancer l'application et constater qu'aucune erreur ne se produit. En particulier, le fichier ``ember-training.css`` doit avoir été chargé sans erreur et ne pas être vide :

    ```console
    ember server
    ```
    
1. De manière à bénéficier de styles adaptés aux futurs exercices, copier le contenu de [ce fichier](https://raw.githubusercontent.com/bmeurant/ember-training/master/app/styles/app.scss) 
   dans le fichier ``app/styles.app.scss``.
    
  {% endcapture %}{{ m | markdownify }}
</div>

[ember]: http://emberjs.com
[ember-cli]: http://www.ember-cli.com/
[folder-layout]: http://www.ember-cli.com/user-guide/#folder-layout
[html-bars]: https://github.com/tildeio/htmlbars
[ember-data]: https://github.com/emberjs/data
[broccoli]: https://github.com/broccolijs/broccoli
