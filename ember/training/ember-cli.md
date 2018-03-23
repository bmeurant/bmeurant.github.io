---
layout: ember-training
title: Formation Ember - Ember CLI
permalink:  ember/training/ember-cli/
prev: ember/training/underlyings
next: ember/training/templates
---

<div id="toc"></div>

## Structure d'une application Ember

On a déjà évoqué le fait qu'[Ember][ember] était un framework avec des partis pris forts et un modèle de développement structurant.

Historiquement, cependant, [Ember][ember] **ne faisait aucun choix particulier du point de vue de l'organisation de nos applications**.

Il est donc tout à fait possible d'organiser son application [Ember][ember] comme on le souhaite : 

- dans un seul fichier JavaScript ou dans une balise `<script>`.
  On doit par contre impérativement respecter les conventions de nommage et enregistrer nos objets dans une variable globale
- on peut essayer d'organiser nous-même notre application, nos fichiers, gérer des modules, etc.
  Tout ça va passer par l'utilisation d'un outil de build javascript de type [Grunt](http://gruntjs.com/), [Gulp](http://gulpjs.com/), [Broccoli][broccoli].
  Ces outils vont nous permettre de concaténer nos différents fichiers JavaScript en un seul, de sortir les gabarits dans des fichiers `.hbs` et de les précompiler.
  On n'aura ensuite qu'à importer ces fichiers dans notre ``index.html``.

Cependant, la complexité et la richesse des applications [Ember][ember] augmentant, le besoin de disposer d'un outillage plus complet et plus adapté s'est rapidement fait sentir.
C'est suite à ce besoin que le projet [Ember CLI][ember-cli] est né, porté par une partie de la core team [Ember][ember].
Depuis, [Ember CLI][ember-cli] est devenu un standard *de facto* dans la communauté [Ember][ember] et a été ensuite officiellement supporté par l'équipe [Ember][ember].

## Ember CLI

[Ember CLI][ember-cli] est une **interface en ligne de commande** pour [Ember][ember].
Elle repose sur l'outil de build [Broccoli][broccoli] et permet :

* d'initialiser une application Ember avec, cette fois, une [structure de fichiers][folder-layout] et des [conventions de nommage](http://www.ember-cli.com/user-guide/#naming-conventions)
* de générer différents objets en mode scaffolding via des [commandes](http://www.ember-cli.com/user-guide/#using-ember-cli).
* d'utiliser des outils de build basés sur [Broccoli][broccoli] pour le prétraitement des pré-processeurs CSS par exemple
* d'utiliser les [modules ES6](https://tc39.github.io/ecma262/) plutôt qu'[AMD](http://en.wikipedia.org/wiki/Asynchronous_module_definition) ou [CommonJS](http://en.wikipedia.org/wiki/CommonJS) pour la modularisation.
  Cette question a été largement débattue.
  Ici un [article très intéressant](http://tomdale.net/2012/01/amd-is-not-the-answer/) à ce sujet.
* ...

Pour le reste, se reporter à la [doc officielle][ember-cli].

<div class="work no-answer">
    {% capture m %}

1. Installer Node (< 8) : [ici](https://nodejs.org/en/)
 
   ```console
   $ node -v
   v7.10.1
   $ npm -v
   4.2.0
   ```
    
1. Installer Yarn : [ici](https://yarnpkg.com/lang/en/docs/install/)

   ```console
   $ yarn -v
   1.5.1
   ```

1. Puis [Ember CLI](http://www.ember-cli.com/) :

   ```console
   $ yarn global add ember-cli
   $ ember -v
   ember-cli: 3.0.0
   node: 7.10.1
   ```
   
1. Vérifier la version de npm.
   Si celle-ci est inférieure à 3.7.x, la mettre à jour via ``yarn global add npm``  :

   ```console
   $ npm -v
   4.2.0
   ```

1. Créer une nouvelle application ``ember-training`` via [Ember CLI](http://www.ember-cli.com/) et la ligne de commande `ember` :

   ```console
   $ ember new ember-training --yarn
   installing app
     create .editorconfig
     ...
     create vendor\.gitkeep
   Yarn: Installed dependencies
   Successfully initialized git.
   ```

1. Lancer enfin cette nouvelle application via la ligne de commande : 

   ```console
   $ cd ember-training
   $ ember serve
   Build successful (13466ms)
   Serving on http://localhost:4200/

   Slowest Nodes (totalTime => 5% )              | Total (avg)         
   ----------------------------------------------+---------------------
   Babel (20)                                    | 10731ms (536 ms)    
   Concat (8)                                    | 1116ms (139 ms)     
   Rollup (1)                                    | 727ms
   ```

1. Ouvrir le navigateur à [cette adresse](http://localhost:4200) et constater que la page ci-dessous est affichée :
   ![Ember Welcome Page](/images/ember-welcome-page.png)
   Cette page est le résultat de l'addon `ember-welcome-page` qui délivre une page d'accueil statique stylisée...

   Dans le cadre d'un projet, cet addon est à désinstaller pour supprimer cette page d'aide : `yarn remove ember-welcome-page` )

   {% raw %}
1. Ouvrir le fichier `/app/templates/application.hbs`, supprimer le composant `{{welcome-page}}` et ajouter un titre:
   ```html
   <h2 id="title">Welcome to Ember</h2>
   
   {{outlet}}
   ```
   {% endraw %}

1. Relancer le serveur puis ouvrir le navigateur à [cette adresse](http://localhost:4200/) et constater que l'application est lancée en ouvrant la console :

   ```console
   DEBUG: -------------------------------
   DEBUG: Ember      : 3.0.0
   DEBUG: Ember Data : 3.0.2
   DEBUG: jQuery     : 3.3.1
   DEBUG: -------------------------------
   ``` 

1. On en profite enfin pour installer le plugin de développement pour [Chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
ou [Firefox](https://addons.mozilla.org/fr/firefox/addon/ember-inspector/)

On dispose donc désormais d'un template d'application opérationel.
La structure complète du projet créée est décrite dans la [documentation](folder-layout).

  {% endcapture %}{{ m | markdownify }}
</div>

Mais [Ember CLI][ember-cli] est bien loin de ne proposer qu'une structure de projet standard.
Il s'agit d'un outil de build complet comprenant :

* Un **asset pipeline** complet : à la manière d'une succession de tâches ``Grunt`` ou ``Gulp``, [Ember CLI][ember-cli] propose des outils pour compiler les templates, exécuter les pré-processeurs CSS, servir et minifier JS et CSS, etc.
  cf [Asset compilation](http://www.ember-cli.com/user-guide/#asset-compilation)
* L'exécution des tests.
  cf. [Tests](http://www.ember-cli.com/user-guide/#testing)
* La translation des conventions de nommage [Ember][ember] en structure de fichiers.
  cf. [Naming conventions](http://www.ember-cli.com/user-guide/#naming-conventions)
* La gestion des dépendances et librairies via ``Bower`` et ``Broccoli``.
  cf [Managing dependencies](http://www.ember-cli.com/user-guide/#managing-dependencies)
* La gestion des environnements.
  cf. [Environnements](http://www.ember-cli.com/user-guide/#Environments)
  Un certain nombre de configuration sont mises en place et adaptées en fonction des environnements (cache busting, etc.)
* La gestion du packaging et du déploiement.
  cf. [Déploiements](http://www.ember-cli.com/user-guide/#deployments)
* La transpilation de la syntaxe Ecmascript 6 et la gestion des modules dans une syntaxe Ecmascript 5 compatible avec tous les navigateurs.
  [Ember CLI][ember-cli] propose en effet d'utiliser en grande partie la syntaxe Ecmascript 6 et notament la gestion des modules propre à cette version du language.
  Cette gestion de module permet de gérer les dépendances internes au projet (classes, modules, etc.) sans faire appel à des librairies externes telles que ``requireJS``.
  cf. [Using Modules & the Resolver](http://www.ember-cli.com/user-guide/#using-modules)


## Bootstrap & Sass

De manière à avoir un look correct pour notre application à moindre frais, nous allons utiliser l'écosystème [Ember CLI][ember-cli] pour installer et intégrer 
le framework CSS [Bootstrap](http://getbootstrap.com/) et le préprocesseur [Sass](http://sass-lang.com/):

<div class="work no-answer">
    {% capture m %}

1. Installer ember-cli-sass via npm.
   Ce plugin permet d'intégrer la précompilation sass dans [Ember CLI](http://www.ember-cli.com/) :

   ```console
   $ ember install ember-cli-sass

   Yarn: Installed ember-cli-sass
   Installed addon package.
   ```
   
   En ouvrant le fichier ``package.json``, on constate que la dépendance ember-cli-sass a été ajoutée : 
       
   ```javascript
   // package.json
   
   ...
   
     "devDependencies": {
       ...
       "ember-cli-sass": "^7.1.7",
       ...
     }
   ...
   ```
1. Installer l'addon [ember-bootstrap](http://www.ember-bootstrap.com).
   Cet addon permet d'intégrer le framework CSS [Twitter Bootstrap](https://getbootstrap.com) et fournit des composants Ember compatibles prêts à l'emploi.
   Comme nous souhaitons utiliser Bootstrap 4, il faut ensuite le déclarer explicitement :

   ```console
   $ ember install ember-bootstrap
   
   Yarn: Installed ember-bootstrap
   installing ember-bootstrap
   Installing for Bootstrap 3 using preprocessor sass
     install package bootstrap
   Yarn: Installed bootstrap@^3.3.7
   Added ember-bootstrap configuration to ember-cli-build.js
   Installed addon package.

   $ ember generate ember-bootstrap --bootstrap-version=4
     uninstall package bootstrap-sass
     install package bootstrap
   Yarn: Installed bootstrap@^4.0.0
   Yarn: Uninstalled bootstrap-sass
   Added import statement to app/styles/app.scss
   Added ember-bootstrap configuration to ember-cli-build.js
   ```

   On constate que le fichier `package.json` a été mis à jour :

   ```javascript
   // package.json
   
   ...
   
     "devDependencies": {
       "bootstrap": "^4.0.0",
       "broccoli-asset-rev": "^2.4.5",
       "ember-ajax": "^3.0.0",
       "ember-bootstrap": "^1.2.1",
       ...
     }
   ...
   ```

   Le fichier de configuration `ember-cli-build.js` a également été mis à jour pour ajouter la configuration par défaut d'import des assets [Bootstrap](http://getbootstrap.com).
   Dans notre cas, nous utilisons Sass et ne voulons donc pas importer les CSS et Bootstrap 4 ne fournit plus d'icônes :

   ```javascript
   // ember-cli-build.js

   module.exports = function(defaults) {
     let app = new EmberApp(defaults, {
      'ember-bootstrap': {
        'bootstrapVersion': 4,
        'importBootstrapFont': false,
        'importBootstrapCSS': false
      }
    });
   ...
   };
   ```

1. Afin de bénéficier d'un jeu d'icônes complet, nous allons également installer l'addon [ember-font-awesome](https://github.com/martndemus/ember-font-awesome) :

   ```console
   ember install ember-font-awesome
   Yarn: Installed ember-font-awesome
   Installed addon package.
   ```

   Enfin, de manière à pouvoir utiliser [Fontawesome](http://fontawesome.io) dans nos fichiers Sass, nous devons effectuer la modification suivante :

   ```javascript
   // ember-cli-build.js

   var app = new EmberApp(defaults, {
     'ember-bootstrap': {...},
     'ember-font-awesome': {
       useScss: true
     }
   });
   ```
    
1. De manière à bénéficier de styles adaptés aux futurs exercices, copier le contenu de [ce fichier](https://raw.githubusercontent.com/bmeurant/ember-training/master/app/styles/app.scss) 
   dans le fichier ``app/styles/app.scss``.
    
  {% endcapture %}{{ m | markdownify }}
</div>

[ember]: http://emberjs.com
[ember-cli]: http://www.ember-cli.com/
[folder-layout]: http://www.ember-cli.com/user-guide/#folder-layout
[html-bars]: https://github.com/tildeio/htmlbars
[ember-data]: https://github.com/emberjs/data
[broccoli]: https://github.com/broccolijs/broccoli
