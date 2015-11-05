---
layout: ember-training
title: Formation Ember - Routing
permalink:  routing/
prev: ember/training/templates
next: ember/training/ember-data
---

## Routeur

Le routeur est un composant central d'[Ember][ember]. Loin de constituer une pièce rapportée venant compléter un framework existant il en est la pierre angulaire. 
La compréhension et la manipulation du **routeur** et des **routes** est donc capitale dans l'appréhension du développement avec [Ember][ember].

Le routeur [Ember][ember] est unique au sein d'une application, c'est lui qui déclare les différentes **routes** qui seront proposées au sein de celle-ci et qui définit, le cas
échéant, les chemins personnalisés, paramètres, routes imbriquées, etc.

Si l'on examine le routeur de notre application, tel que créé par [Ember CLI][ember-cli], il est vide puisque nous n'avons créé aucune route pour le moment. 

```javascript
// app/router.js

import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
});

export default Router;
```

Il n'y a pas grand chose à dire sur cet élément pour le moment. Tout juste peut-on noter la récupération, depuis le système de gestion et de configuration des environnements d'[Ember][ember],
d'un paramètre permettant de déterminer la manière dont seront construites ou résolues les URLs de notre application. Se reporter à la 
[documentation](http://emberjs.com/api/classes/Ember.Location.html) pour plus de détails.

Le fait que le routeur soit vide ne signifie pas pour autant qu'aucune route n'existe. Nous avons d'ailleurs pu constater que la route ``application`` (``/``) existait et était personnalisable.
[Ember][ember] génère en effet pour nous des [Routes implicites](#routes-implicites) que nous aborderons plus loin.

<div class="work no-answer">
  {% capture m %}
  {% raw %}
  
On souhaite désormais créer une nouvelle route pour l'affichage et la manipulation de notre liste de ``comics``
  
1. Utiliser le *scaffolding* d'[Ember CLI](http://www.ember-cli.com/) pour déclarer une nouvelle route dans le routeur de notre application.
 
    ```console
    $ ember generate route comics
    
    version: 1.13.8
    installing route
      identical app\routes\comics.js
      identical app\templates\comics.hbs
    updating router
      add route comics
    installing route-test
      identical tests\unit\routes\comics-test.js
    ```
    
    On remarque que plusieurs éléments ont été générés / modifiés :
    * le routeur (``app/router.js``), d'abord, qui déclare désormais notre nouvelle route :
       
        ```javascript
        Router.map(function() {
          this.route('comics');
        });
        ```
    * une nouvelle route ``app/routes/comics.js`` vide.
    
        ```javascript
        export default Ember.Route.extend({
        });
        ```
    * un nouveau template ``app/templates/comics.hbs`` qui ne contient qu'un ``{{outlet}}``. Nous y reviendrons plus tard. (cf. [Routes imbriquées](#routes-imbriquees))
    
        ```html
        {{outlet}}
        ```
    * un nouveau test unitaire ``tests/unit/routes/comics-test.js``. Celui-ci ne contient qu'une simple assertion permettant de vérifier l'existence de la route.
    
        ```javascript
        moduleFor('route:comics', 'Unit | Route | comics', {
          // Specify the other units that are required for this test.
          // needs: ['controller:foo']
        });
        
        test('it exists', function(assert) {
          var route = this.subject();
          assert.ok(route);
        });
        ```
    
        Mais nous reviendrons sur ce test et, plus généralement, sur les tests unitaires par la suite.
  
  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>

## Routes

Le routeur se contente donc de déclarer l'existence d'une route - et donc d'une URL. La logique de cette route et son comportement se trouvent implémentés au sein d'une instance de
``Ember.Route``. Par convention, celle-ci doit se trouver dans un fichier de même nom que celui définit dans le routeur (ici ``comics``) dans le répértoire ``app/routes``. A
noter que dans le cas de [Routes imbriquées](#routes-imbriquees), l'arborescence de ce répertoire suit l'imbrication déclarée dans le routeur.

La route est responsable : 

* de la **récupération et du chargement d'un modèle** (c'est à dire de la ou des données qui seront fournies à un template)
* de la gestion de l'ensemble des **actions** en lien avec le chargement, la mise à jour d'un modèle ou la **transition** vers une nouvelle route
* du **rendu d'un template** (qu'il soit implicite ou explicite)

C'est donc celle-ci qui sera notament chargée d'appeler le **backend** pour récupérer & envoyer des données et mettre ainsi les objets métier (modèle) à jour.

Mais c'est aussi la route qui met en place les différents templates qu'il est nécessaire d'affichier lorsque l'on accède à une URL et l'organisation des routes au sein du routeur et leur
imbrication préside donc à l'organisation des différents templates de notre application.

<div class="work">
  {% capture m %}
  {% raw %}
   
1. Copier le test d'acceptance [02-routing-test.js](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/02-routing-test.js) dans ``tests/acceptance``.

1. Renommer le test unitaire ``tests/unit/comics-test.js`` en ``tests/unit/02-routing-test.js``

1. Modifier le contenu du template ``app/templates/comics.hbs`` :
    * Déplacer l'affichage (template) et la gestion (route) de la liste de comics pour que cette liste soit gérée totalement au sein de la route ``/comics`` (en conservant
      le titre de premier niveau dans le template ``app/templates/application.hbs``)
    * Ajouter un sous-titre ``Comics list`` juste après l'ouverture de la ``<div class="comics">``
 
    **Test** : *Les modifications doivent permettre de rendre le test [02 - Routing - 01 - Should display second level title](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/02-routing-test.js#L87) passant.*

    > ```html
    > {{!-- app/templates/application.hbs --}}
    > <div class="container">
    > 
    >   <div class="page-header">
    >     <h1 id="title">Comic books library</h1>
    >   </div>
    > 
    >   {{outlet}}
    > 
    > </div>
    > ``` 
    > 
    > ```html
    > {{!-- app/templates/comics.hbs --}}
    > <div class="row">
    >   <div class="comics">
    >     <h2>Comics list</h2>
    >     <ul>
    >       {{#each model as |comic|}}
    >         <li class="{{if comic.scriptwriter 'comic-with-scriptwriter' 'comic-without-scriptwriter'}}">
    >           {{comic.title}} by {{if comic.scriptwriter comic.scriptwriter "unknown scriptwriter"}}
    >         </li>
    >       {{else}}
    >         Sorry, no comic found
    >       {{/each}}
    >     </ul>
    >   </div>
    > </div>
    > ```
    > 
    > ```javascript
    > // app/routes/application.js
    > export default Ember.Route.extend({
    > });
    > ```
    > 
    > ```javascript
    > // app/routes/comics.js
    > export default Ember.Route.extend({
    > 
    >   model: function () {
    >     // WARN : SOULD NOT BE DONE : We should not affect anything to windows but
    >     // for the exercice, we want to access to comics from console today
    >     window.comics = [{title: "BlackSad"}, {title: "Calvin and Hobbes", scriptwriter: "Bill Watterson"}];
    > 
    >     return window.comics;
    >   }
    > });
    > ```
 
  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>

La nouvelle route ``comics`` affiche désormais la liste de nos comics de la même manière qu'elle était affichée précédemment et est accessible
via l'URL ``/comics``. On note à ce propos que l'URL n'a pas eu à être définie puisque, par convention, [Ember][ember] rend accessible une route
à l'URL définie par son nom qualifié (nom de ses [ancètres](#routes-imbriquees) séparés par des `/` puis nom de la route). Si besoin, il est évidemment possible de
personnaliser l'URL via l'option ``path`` fournie lors de la définition de la route :

```javascript
Router.map(function() {
  this.route('comics', { path: '/livres' });
});
```

### Routes imbriquées

{% raw %}

On remarque également que le template définit dans le template de l'application (``application.hbs``) est toujours affiché (titre principal).
Ceci est du au fait que la route ``comics`` est, comme toutes les routes d'une application [Ember][ember], imbriquée dans la route ``application``.

En effet il s'agit de la route de base de toute l'application. A la manière d'un conteneur, cette route permet classiquement de mettre en place
les éléments communs d'une application : *header*, *menu*, *footer*, ..., ainsi qu'un emplacement pour le contenu même de l'application : c'est
la fonction du *helper* ``{{outlet}}``.

Cette notion est au cœur d'[Ember][ember]. Lorsqu'une route est imbriquée dans une autre,
[Ember][ember] va rechercher les templates de ces deux routes et remplacer la zone `{{outlet}}` de la route mère
avec le rendu de la route fille. Ainsi de suite jusqu'à résolution complète de la route. Lors des transitions entre routes, les
zones des `{{outlet}}` concernées par le changement, **et seulement elles**, sont mises à jour.

Toute route fille (URL : ``mere/fille``) est déclarée dans le routeur en imbriquant sa définition dans celle de sa route mère (URL : ``mere``) 
de la façon suivante : 

```javascript
// app/router.js
...
Router.map(function() {
  this.route('mere', function() {
    this.route('fille');
  });
});
```

La route fille viendra alors se rendre dans la zone définie par l'``{{outlet}}`` de sa route mère, à la manière de poupées russes.

Par convention, les éléments constitutifs des routes filles (template, route, etc.) doivent être définies dans l'arborescence suivante :
``.../<route_mere>/<route_fille>.[hbs|js]``

{% endraw %}

<div class="work">
  {% capture m %}
  {% raw %}
   
1. Créer une route ``index`` accessible à l'URL `/comics/` affichant uniquement le texte *"Please select on comic book for detailled information"*
dans un paragraphe d'id ``no-selected-comic``.
 
    **Test** : *Les modifications doivent permettre de rendre le test [02 - Routing - 02 - Should display text on comics/index](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/02-routing-test.js#L87) passant.*
 
    **NB :** Dans notre cas, il n'est pas nécessaire de créer de fichier route (``app/routes/comics/index.js``) pour le moment puisque nous
    n'avons aucune logique à y intégrer. Ceci met en évidence les capacités de **génération d'objets** d'[Ember](http://emberjs.com/) déjà 
    évoquées dans le chapitre [Overview - Génération d'objets](../overview/#génération-d'objets). En effet, grâce aux conventions de nommage
    d'[Ember](http://emberjs.com/), le framework génère pour nous dynamiquement les objets de base nécessaires à l'éxécution d'une route.
    Seul le template est nécessaire. Il nous suffit ensuite de définir ces objet pour en fournir notre propre implémentation. En l'occurence,
    l'objet route pour `comics.index` sera généré pour nous.
    
    > ```javascript
    > // app/router.js
    > ...
    > Router.map(function() {
    >   this.route('comics', function() {
    >     this.route('index', {path: '/'});
    >   });
    > });
    > ```
    > 
    > ```html
    > {{!-- app/templates/comics.hbs --}}
    > <div class="row">
    >   <div class="comics">
    >     ...
    >   </div>
    >   {{outlet}}
    > </div>
    > ```
    > 
    > ```html
    > {{!-- app/templates/comics/index.hbs --}}
    > Please select on comic book for detailled information.
    > ```
    > 
    > On note la nécessité de l'``{{outlet}}`` dans la route mère ainsi que les arborescence et les noms utilisés. Enfin, on note également
    > la personnalisation de l'URL via l'option `path`.
 
  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>

### Routes implicites

### Redirections et Transitions

 
[handlebars]: http://handlebarsjs.com/
[ember-cli]: http://www.ember-cli.com/
[ember]: http://emberjs.com/