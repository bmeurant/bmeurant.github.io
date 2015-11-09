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

* du **rendu d'un template** (qu'il soit implicite ou explicite)
* de la **récupération et du chargement d'un modèle** (c'est à dire de la ou des données qui seront fournies à un template)
* de la gestion de l'ensemble des **actions** en lien avec le chargement, la mise à jour d'un modèle ou la **transition** vers une nouvelle route

C'est donc celle-ci qui sera notament chargée d'appeler le **backend** pour récupérer & envoyer des données et mettre ainsi les objets métier (modèle) à jour.

Mais c'est aussi la route qui met en place les différents templates qu'il est nécessaire d'affichier lorsque l'on accède à une URL et l'organisation des routes au sein du routeur et leur
imbrication préside donc à l'organisation des différents templates de notre application.

<div class="work">
  {% capture m %}
  {% raw %}
   
1. Copier le test d'acceptance [02-routing-test.js](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/02-routing-test.js) dans ``tests/acceptance``.

1. Renommer le test unitaire ``tests/unit/comics-test.js`` en ``tests/unit/02-routing-test.js``

1. Modifier le contenu du template ``app/templates/comics.hbs`` :
    * Déplacer le contenu de la route ``application.js`` dans la route ``comics.js``
    * Déplacer le contenu de la ``<div class="row">`` du template ``application.hbs`` dans le tempate ``comics.hbs``
    * Ajouter un sous-titre ``Comics list`` juste après l'ouverture de la ``<div class="comics">``
    * Ajouter un paragraph de classe ``no-selected-comic`` juste après la fermeture de la ``<div class="comics">`` contenant le texte "Please select on comic book for detailled information."
 
    **Tests** : *Les modifications doivent permettre de rendre les tests suivants passants :
    * [02 - Routing - 01 - Should display second level title](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/02-routing-test.js#L87)*
    * [02 - Routing - 02 - Should display text on comics/](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/02-routing-test.js#L87)*


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
    >
    >   <p id="no-selected-comic">
    >     Please select on comic book for detailled information.
    >   </p>
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
personnaliser l'URL via l'option ``path`` fournie lors de la définition de la route. Par exemple :

```javascript
Router.map(function() {
  this.route('books', { path: '/livres' });
});
```

## Modèle

L'une des responsabilité principales d'une route consiste donc à assurer la récupération et la gestion d'un modèle (*model*). 
Au sens général un modèle est un objet métier contenant des propriétés. En [Ember][ember], il peut s'agir d'objets javascript natifs ou d'instances de
classes héritant de `Ember.Object`. Cependant, comme on a pu le constater [auparavant](../templates/#bindings), dans le cas où l'on fournit un objet javascript natif à 
[Ember][ember], celui-ci le transforme automatiquement en sous-classe d'`Ember.Object` de manière à être capable d'écouter les changements survenus sur
ce modèle. Principalement pour pouvoir être capable de mettre à jour les template via les *bindings*.

[Ember][ember] propose également une librairie, [Ember Data](https://github.com/emberjs/data), permettant de gérer les modèles, 
leurs propriétés ainsi que leurs relations de manière très poussée. Un peu à la manière d'un ORM. Nous y reviendrons dans un [chapitre ultérieur](../ember-data).

Les modèles peuvent être récupérés en mémoire mais son classiquement chargés depuis un *backend* via une **API REST**. Qu'ils soient ou non gérés au travers 
d'[Ember Data](https://github.com/emberjs/data).

Le modèle peut être un objet seul ou une collection d'objets et, une fois récupéré par la route, il est transmis au template associé ce qui permet toutes les opérations de *binding*.
 
Les routes [Ember][ember] étendent la classe `Ember.Route` et mettent à disposition un certain nombre de *hooks* relatifs à la gestion du modèle.
Ces *hooks* sont des méthodes de la classe mère, vides ou non, qui sont automatiquement appelées par [Ember][ember] lors de la résolution de la route :

* ``model()`` : Cette fonction doit retourner un objet ou une collection d'objet. Elle est automatiquement appelée lorsque la route est activée.
  
     Le modèle ainsi récupéré (en synchrone ou en asynchrone) est ainsi transmis au template associé ainsi qu'aux éventuelles routes filles. La gestion de l'asynchronisme
     est effectuée pour nous par le framework en utilisant des promesses (*promises*). Manipuler un objet ou une collection mémoire ou le retour d'une requête à une API est donc
     strictement équivalent de ce point de vue.

     ```javascript
     model: function () {
       return [{title: "BlackSad"}, {title: "Calvin and Hobbes", scriptwriter: "Bill Watterson"}];
     }
     ```
     
     A noter que cette méthode n'est pas appelée si un modèle est fourni à la route lors de son activation, par exemple via le *helper* ``link-to`` ou
     un appel à ``transitionTo``. Nous reviendrons sur ces deux cas par la suite.

* ``beforeModel()`` : Cette méthode est appelée au tout début de la résolution de la route et, comme son nom l'indique, avant la récupération du modèle vie la méthode
   ``model()``. 
   
     Elle est courament utilisée pour effectuer une vérification susceptible d'entrainer l'annulation de la transition en cours ou une redirection sans 
     que la résolution du modèle soit préalablement nécessaire. 
     
     Comme elle prend totalement en charge l'aspect asynchrone, cela lui permet d'être aussi très utile lorsqu'il 
     est nécessaire d'effectuer une opération asynchrone avant de pouvoir tenter de récupérer le modèle. En effet, le cycle d'exécution attendra automatiquement la résolution 
     de l'appel asynchrone avant d'exécuter la méthode ``model``.
   
     ```javascript
     beforeModel: function(transition) {
       ...
     }
     ```
   
* ``afterModel()`` : Cette méthode est appelée après la résolution du modèle et est utilisée régulièrement pour déclencher des transitions, des redirections ou toute sorte d'opération
  nécessitant la résolution préalable du modèle.
  
    ```javascript
    afterModel: function(model, transition) {
      ...
    }
    ```
 
Noter que dans ces deux dernières méthodes, un objet ``transition`` est fourni automatiquement. Cet objet permet d'agir sur la transaction en cours et notamment d'annuler
la transition courante (``transition.abort()``) ou de reprendre une transition précédemment annulée (``transition.retry()``).

<div class="work no-answer">
  {% capture m %}
  {% raw %}
  
1. Modifier la route ``comics`` pour passer sur un modèle plus complet : 
   * Créer une classe ``Comic`` étendant ``Ember.Object``
   * Définir les propriétés ``id``, ``title``, ``scriptwriter``, ``illustrator``, ``publisher``
   * Retourner une liste d'au moins deux instances de cette classe 
  
    ```javascript
    // app/routes/comics
    import Ember from 'ember';
    
    let Comic = Ember.Object.extend({
      slug: '',
      title: '',
      scriptwriter: '',
      illustrator: '',
      publisher: ''
    });
    
    let blackSad = Comic.create({
      slug: 'blacksad',
      title: 'BlackSad',
      scriptwriter: 'Juan Diaz Canales',
      illustrator: 'Juanjo Guarnido',
      publisher: 'Dargaud'
    });
    
    let calvinAndHobbes = Comic.create({
      slug: 'calvin-and-hobbes',
      title: 'Calvin and Hobbes',
      scriptwriter: 'Bill Watterson',
      illustrator: 'Bill Watterson',
      publisher: 'Andrews McMeel Publishing'
    });
    
    let akira = Comic.create({
      slug: 'akira',
      title: 'Akira',
      scriptwriter: 'Katsuhiro Ôtomo',
      illustrator: 'Katsuhiro Ôtomo',
      publisher: 'Epic Comics'
    });
    
    let comics = [blackSad, calvinAndHobbes, akira]
    
    export default Ember.Route.extend({
      model() {
        return comics;
      }
    });
    ```
 
  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>

## Routes imbriquées

{% raw %}

On a pu remarquer que le template définit au niveau de l'application (``application.hbs``) était toujours affiché (titre principal),
en même temps que le template de la route ``comics``. Ceci est du au fait que la route ``comics`` est, comme toutes les routes d'une application 
[Ember][ember], imbriquée dans la route ``application``.

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
   
1. Créer une route ``comic``, fille de la route ``comics``.
    * Utiliser la ligne de commande [Ember CLI](http://ember-cli.com) ``generate route comics/comic`` pour générer la route
    * La nouvelle route doit afficher un texte *"Comic selected !"* dans une div de classe ``selected-comic`` à droite de la liste de comics
    * Ne pas oublier l' ``{{outlet}}`` dans la route mère

    **Test** : *Les modifications doivent permettre de rendre le test [02 - Routing - 03 - Should display single comic zone](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/02-routing-test.js#L87) passant.*

    > ```console
    > $ ember generate route comics/comic
    >
    > version: 1.13.8
    > installing route
    >   create app\routes\comics\comic.js
    >   create app\templates\comics\comic.hbs
    > updating router
    >   add route comics/comic
    > installing route-test
    >   create tests\unit\routes\comics\comic-test.js
    > ```
    >
    > ```javascript
    > // app/router.js
    > 
    > Router.map(function () {
    >   this.route('comics', function() {
    >     this.route('comic');
    >   });
    > });
    > ```
    > 
    > ```html
    > {{!-- app/templates/comics.hbs--}}
    > 
    > <div class="row">
    >   <div class="comics" ...>
    > 
    >   <p id="no-selected-comic">
    >     Please select on comic book for detailled information.
    >   </p>
    > 
    >   {{outlet}}
    > </div>
    > ```
    > 
    > ```html
    >  {{!-- app/templates/comics/comic.hbs--}}
    >  
    >  <div class="selected-comic">
    >    Comic selected !
    >  </div>
    > ```
    
    On note la création du test unitaire ``tests/unit/routes/comics/comic-test.js`` et notamment l'arborescence dans laquelle il a été créé.
    
    On note également que l'objet route ``app/routes/comics/comic.js`` est totalement vide puisque nous n'avons aucune logique particulière à y 
    implémenter. En effet, grâce aux conventions de nommage d'[Ember](http://emberjs.com/) et aux capacités
    de **génération d'objets** d'[Ember](http://emberjs.com/) déjà évoquées dans le chapitre 
    [Overview - Génération d'objets](../overview/#génération-d'objets), le framework génère pour nous dynamiquement les objets de base 
    nécessaires à l'éxécution d'une route. Il nous suffit ensuite de surcharger / compléter ces objet pour en fournir notre propre implémentation. 
    En l'occurence, la logique de l'objet route pour `comics.comic` a été héritée.
   
  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>

## Segments dynamiques

Les routes que nous avons manipulés jusqu'à présent chargent un modèle statique (``comics``) ou pas de modèle du tout (``comics.comic``).
Les routes [Ember][ember] permettent la gestion de segments de routes dynamiques, c'est à dire capables de récupérer un paramètre dynamique
de l'URL pour aller rechercher et charger un modèle dont la valeur dépend de ce paramètre.

Cela se fait en personalisant le ``path`` de la route via l'utilisation du caractère ``:`` :

```javascript
// app/router.js

Router.map(function() {
  this.route('book', { path: '/book/:book_id' });
  this.route('user', { path: '/user/:user_name' });
});
```

On récupère ensuite la valeur de ce paramètre dans le *hook* ``model()`` évoué plus haut de manière à récupérer le modèle correspondant
au critère depuis un ``store``, une API ...

```javascript
// app/routes/book.js

export default Ember.Route.extend({
  model(params) {
    return findModelById('book', params.book_id);
  }
});
```

Nous verrons plus loin que lorsque l'on s'appuie sur une libairie de gestion de la persistence telle que [Ember Data](../ember-data), le *hook*
``model`` propose une implémentation par défaut qui effectuer seule ces opérations en s'appuyant sur les conventions d'[Ember][ember]. Nous y
reviendrons plus loin.

La notation ``<name>_<prop>`` constitue également une convention permettant à l'implémentation par défaut de ``model`` évoquée plus 
haut de récupérer la valeur de ce paramètre et d'effectuer une recherche dans le ``store`` (cf. [chapitre Ember Data](../ember-data)) en
effectuant la correspondance avec la propriété ``prop`` du modèle ``name``.

<div class="work">
  {% capture m %}
  {% raw %}
  
1. Pour le moment, transformons la route ``comics.comic`` avec un segment dynamique nous permettant d'afficher le détail d'un comic à la 
place du texte précédent. 
    * La nouvelle route doit répondre à l'URL ``/comics/<slug>`` ou ``slug`` correspond à la propriété ``slug`` du modèle ``comic``
    * Comme nous ne disposons pour l'instant pas de ``store`` nous permettant de disposer d'un référentiel partagé de nos modèles,
      utiliser la méthode ``modelFor`` pour récupérer le modèle de la route mère ``/comics``.
        [Ember](http://emberjs.com) fournit une méthode [modelFor](http://emberjs.com/api/classes/Ember.Route.html#method_modelFor) dans chaque route permettant de récupérer le modèle d'une route mère, 
        directe ou non.    
    * La route doit récupérer la valeur du paramètre ``slug`` et renvoyer le modèle correspondant. Utiliser la fonction Ember
      [filterBy](http://emberjs.com/api/classes/Ember.Array.html#method_filterBy)
    * Le template doit être modifié pour afficher le détail d'un comic :
    
        ```html
        {{!-- app/templates/comics/comic.hbs --}}
        
        <div class="selected-comic">
          <h3>{{model.title}}</h3>
          <dl>
            <dt>scriptwriter</dt>
            <dd>{{model.scriptwriter}} </dd>
            <dt>illustrator</dt>
            <dd>{{model.illustrator}}</dd>
            <dt>publisher</dt>
            <dd>{{model.publisher}}</dd>
          </dl>
        </div>
        ```
    
    **Test** : *Les modifications doivent permettre de rendre passants les tests* : 
       * *Unitaire : [model() should retrieve existing slug](https://github.com/bmeurant/ember-training/blob/master/tests/unit/routes/comics/comic-test.js#L87)*
       * *Acceptance : [02 - Routing - 04 - Should display the comic detail](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/02-routing-test.js#L87)*

     > ```javascript
     > // app/router.js
     > 
     > Router.map(function () {
     >   this.route('comics', function() {
     >     this.route('comic', {path: '/:comic_slug'});
     >   });
     > });
     > ```
     > 
     > ```html
     > {{!-- app/templates/comics/comic.hbs --}}
     > 
     > <div class="selected-comic">
     >   <h3>{{model.title}}</h3>
     >   <dl>
     >     <dt>scriptwriter</dt>
     >     <dd>{{model.scriptwriter}} </dd>
     >     <dt>illustrator</dt>
     >     <dd>{{model.illustrator}}</dd>
     >     <dt>publisher</dt>
     >     <dd>{{model.publisher}}</dd>
     >   </dl>
     > </div>
     > ```
     > 
     > ```javascript
     > // app/routes/comics/comic.js
     > 
     > import Ember from 'ember';
     > 
     > export default Ember.Route.extend({
     >   model (params) {
     >     return this.modelFor('comics').filterBy('slug', params.comic_slug).get(0);
     >   }
     > });
     > ```
    
  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>

## Lien vers une route

{% raw %}

[Ember][ember] propose un *hekper* [link-to](http://emberjs.com/api/classes/Ember.Templates.helpers.html#method_link-to) qui permet de générer
un lien vers une route de notre application. L'utilisation de ce *helper* permet la génération et la gestion de liens internes à l'application.

Un certain nombre de comportements sont apportés par l'utilisation de ce *helper* :

* La génération d'un lien ``href`` :

    ```html
    {{#link-to 'comics'}}
      Back to comics List
    {{/link-to}}
    ```
    
    ```html
    <a href="/comics">Back to comics List</a>
    ```
    
    Le lien s'effectue vers la route spécifiée par son nom qualifié, c'est à dire augmenté du nom de ses routes mères. 
    Par exemple ``comics.comic``
    
* La gestion de la route courante :

    En effet, lorsqu'on utilise ce *helper*  et que la route courante se trouve être la route pointée
    par celui-ci, [Ember][ember] positionne automatiquement pour nous la classe ``active`` sur cet élement. Cela permet, notamment dans 
    une liste, de visualiser l'élément courant.
    
    A noter qu'il est également possible de spécifier si l'on souhaite que l'élément soit actif pour d'autres routes grâce à l'option
    ``current-when`` :
    
    ```html
    {{#link-to 'comics' current-when='books'}}
      Back to comics List
    {{/link-to}}
    ```
    
    ```html
    <a href="/comics" class="active">Back to comics List</a>
    ```
    
* Le passage d'un paramètre dynamique : 

    Le *helper* permet de préciser un paramètre dynamique en second argument 

    ```html
    {{#link-to 'book' book.id}}
      Show book
    {{/link-to}}
    ```
    
    ```html
    <a href="/book/1">Show book</a>
    ```

* Le passage d'un modèle : 

    ```html
    {{#link-to 'book' book}}
      Show book
    {{/link-to}}
    ```
    
    ```html
    <a href="/book/1">Show book</a>
    ```

    La différence entre les deux derniers exemples n'est pas visible dans l'URL générée mais fait une grosse différence 
    dans le cycle de vie de la route. En effet, dans le second cas, [Ember][ember] considère que le modèle est déjà
    connu et n'exécute pas la méthode ``model`` de la route fille, ce qui serait inutile. Dans le premier cas, en revanche,
    [Ember][ember] n'a connaissance que de la valeur du paramètre et doit réexécuter ``model`` pour récupérer le modèle à
    partir du paramètre.

* Personnalisation de la sérialisation du model.

    Par défaut, lorsque l'on passe un modèle à un ``link-to``, [Ember][ember] cherche la propriété ``id`` de ce modèle pour
    l'ajouter à l'URL (``book/1``). Si l'on souhaite se baser sur une autre propriété que sur l'id, il est nécessaire de 
    fournir une fonction ``serialize`` personnalisée à la route cible :
    
    ```javascript
    // app/router.js
    
    Router.map(function() {
      this.route('book', { path: '/book/:book_title' });
    });
    ```
    
    ```javascript
    // app/routes/book.js
    
    serialize: function(model) {
      return {
        book_title: model.get('title')
      };
    }
    ```
    
    ```html
    {{#link-to 'book' book}}
      Show book
    {{/link-to}}
    ```
    
    ```html
      <a href="/book/germinal">Show book</a>
    ```

{% endraw %}

<div class="work">
  {% capture m %}
  {% raw %}
  
1. Modifier le template ``app/templates/comics.hbs`` à l'aide du *helper* ``link-to`` de manière à ce que titre du 
comic deviennent un lien cliquable vers la route du comic ``/comic/<comic_slug>`` correspondant.
    * Utiliser un ``link-to`` avec le paramètre dynamique ``comic.slug`` (ne pas passer le modèle entier)
    * Modifier la route ``app/routes/comics/comic.js`` pour ajouter un ``console.log`` avant le ``return`` de la
      méthode ``model``
    
    **Test** : *Les modifications doivent permettre de rendre le test [02 - Routing - 05 - Should display links](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/02-routing-test.js#L87) passant.*

    Ouvrir la console puis accéder au détail du comic en cliquant sur le lien puis accéeder eu détail d'un autre comic en entrant 
    directement l'URL dans le navigateur.
    
    Que constate-t-on ?
    
    > ```html
    > {{!-- app/templates/comics.hbs --}}
    > ...
    > <ul>
    >   {{#each model as |comic|}}
    >     <li class="{{if comic.scriptwriter 'comic-with-scriptwriter' 'comic-without-scriptwriter'}}">
    >       {{#link-to "comics.comic" comic.slug}}
    >         {{comic.title}} by {{if comic.scriptwriter comic.scriptwriter "unknown scriptwriter"}}
    >       {{/link-to}}
    >     </li>
    >   {{else}}
    >     Sorry, no comic found
    >   {{/each}}
    > </ul>
    > ...
    > ```
    > 
    > ```javascript
    > // app/routes/comics/comic.js
    > 
    > export default Ember.Route.extend({
    >   model (params) {
    >     console.log('passed in comic model');
    >     return this.modelFor('comics').filterBy('slug', params.comic_slug).get(0);
    >   }
    > });
    > ```
    >
    > En observant la console, on constate que dans les deux cas, le *hook* ``model`` de la route ``app/routes/comics/comic.js``
    > a été éxécuté, entrainant à chaque fois un chargement du modèle.
    
1. Modifier le template ``app/templates/comics.hbs`` et changer le *helper* ``link-to`` de manière à passer un modèle 
complet au lieu du seul slug.
    * Ajouter la méthode ``serialize`` nécessaire à la route.
    
    Ouvrir la console puis accéder au détail du comic en cliquant sur le lien puis accéeder eu détail d'un autre comic en entrant 
    directement l'URL dans le navigateur.
    
    Que constate-t-on ?
    
    > ```html
    > {{!-- app/templates/comics.hbs --}}
    > ...
    > <ul>
    >   {{#each model as |comic|}}
    >     <li class="{{if comic.scriptwriter 'comic-with-scriptwriter' 'comic-without-scriptwriter'}}">
    >       {{#link-to "comics.comic" comic}}
    >         {{comic.title}} by {{if comic.scriptwriter comic.scriptwriter "unknown scriptwriter"}}
    >       {{/link-to}}
    >     </li>
    >   {{else}}
    >     Sorry, no comic found
    >   {{/each}}
    > </ul>
    > ...
    > ```
    >
    > ```javascript
    > // app/routes/comics/comic.js
    > 
    > export default Ember.Route.extend({
    >   model (params) {
    >     console.log('passed in comic model');
    >     return this.modelFor('comics').filterBy('slug', params.comic_slug).get(0);
    >   },
    >   serialize: function(model) {
    >     return {
    >       comic_slug: model.get('slug')
    >     };
    >   }
    > });
    > ```
    >
    > En observant la console, on constate que le *hook* ``model`` de la route ``app/routes/comics/comic.js``
    > n'a été exécuté que dans le second cas. Dans le premier, en effet, le modèle était déjà connu et a été passé
    > à la route en l'état. Il n'est donc pas nécessaire de le charger à nouveau.
  
  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>

## Routes implicites

On a évoqué plus haut le fait qu'il n'était pas nécessaire de déclarer explicitement la route ``application``, ni dans le routeur ni dans les routes ; 
et que seul le template était nécessaire. La route ``application`` est en effet une route implicite ; créée, connue et gérée nativement par
[Ember][ember]. C'est une route encore plus particulière car il s'agit de la route mère, du conteneur principal de toute application [Ember][ember].

Mais la route ``application`` n'est pas la seule route implicite gérée par [Ember][ember]. D'autres routes implicites 
encore sont créées comme le montre la capture ci-dessous pour notre application : 

<p class="text-center">
    <img src="/images/implicit-routes.png" alt="Routes implicites"/>
</p>

En noir apparaissent les routes déclarées explicitement (à l'exception près de la route ``application`` qui apparait en noir alors qu'elle est implicitement créée par
[Ember][ember]). En gris apparaissent l'ensemble des routes créées implicitement par [Ember][ember] et donc disponibles au sein de notre application sans que nous ayons
besoin de nous en occuper.

On constate que plusieurs types de routes sont implicitement créées lors de la déclaration explicite d'une de nos routes applicatives :

* ``index`` :
    
    Une route ``index`` est automatiquement disponible pour chaque niveau d'imbrication. Le template proposé pour cette route se rendra dans l'outlet de la route
    mère. Si la route mère peut être considérée comme le conteneur de ses filles, la route ``index`` doit être vue comme la route par défaut. On a pu en effet constater ci-dessus
    que ``comics.index`` permettait l'accès à l'URL ``/comics``
    
* ``loading`` / ``error`` : 

    Lors des opérations ``beforeModel``, ``model`` et ``afterModel``, des évènements de type ``loading`` ou ``error`` peuvent être propagés pendant les 
    opérations de récupération de modèle ou d'interrogation d'API ou si celles-ci tombent en erreur. Dans ces cas, [Ember][ember] appelle automatiquement les routes 
    implicites ``loading`` / ``error`` créées pour chaque route

    A noter que le fonctionnement de ces routes et notamment la gestion de leur imbrication les unes par rapport aux autres fonctionnement rigoureusement de la même manière que toute
    route déclarée explicitement. En particulier au niveau du *bubbling* : les évènement *error* et *loading*, notamment, vont remonter la structure d'imbrication des routes les unes
    par rapport aux autres jusqu'à trouver une route en capacité de traiter cet évènement. Ce fonctionnement permet donc, au choix :

    * de proposer une gestion des erreurs et du chargement commun à toute l'application au travers des routes ``application-loading`` et ``application-error``
    * de spécialiser la gestion de ces évènement au niveau local, par exemple pour un sous ensemble fonctionnel devant gérer les mêmes types d'erreurs, etc.
    
    En réalité, la bonne solution se trouve souvent dans un mix des deux avec la fourniture dun traitement général au niveau application spécialisé au besoin au niveau
    des routes mères.

On note enfin que, grâce capacités de **génération d'objets** d'[Ember](http://emberjs.com/) déjà évoquées dans le chapitre [Overview - Génération d'objets](../overview/#génération-d'objets), 
les routes n'ont pas été les seuls objets à avoir été implicitement créés. En effet, on remarque que les contrôleurs et templates associés ont été également créés. Ils proposent une implémentation
par défaut vide, bien entendu.

<div class="work">
  {% capture m %}
  {% raw %}
 
1. Ajouter le template pour la route ``comics.index`` et modifier le template de la route ``comics`` de manière à ce que le paragraphe
``no-selected-comic`` ne s'affiche que lorsque aucun comic n'est selectionné. C'est à dire pour l'URL (``/comics``)

    On note que l'on n'a pas besoin de définir l'objet route ``app/routes/comics/index.js`` parce que celle-ci est implicitement
    créée vide par [Ember][ember].
    
    > ```html
    > {{!-- app/templates/comics.hbs --}}
    > 
    > <div class="row">
    >   <div class="comics"...>
    > 
    >   {{outlet}}
    > </div>
    > ```
    > 
    > ```html
    > {{!-- app/templates/comics/index.hbs --}}
    > 
    > <p id="no-selected-comic">
    >   Please select on comic book for detailled information.
    > </p>
    > ```
   
1. On souhaite désormais gérer le cas où le comic demandé n'est pas trouvé.
    * Modifier la route pour lever une erreur si le slug n'est pas trouvé (``throw Error("...")``)
    * Ajouter un template ``error`` au niveau de l'application (``app/templates/error.error.hbs``). Ce template se 
      contente d'afficher le model dans un paragraphe d'id ``error``
      
      
    **Test** : *Les modifications doivent permettre de rendre le test unitaire [model() should throw error if slug not found](https://github.com/bmeurant/ember-training/blob/master/tests/unit/routes/comics/comic-test.js#L87) passant.*
      
    > ```javascript
    >   // app/routes/comics/comic.js
    >   ...
    >   model (params) {
    >     let askedModel = this.modelFor('comics').filterBy('slug', params.comic_slug).get(0);
    > 
    >     if (askedModel === undefined) {
    >       throw new Error("No comic found with slug: " + params.comic_slug);
    >     }
    > 
    >     return askedModel;
    >   }
    > ```
    > 
    > ```html
    > {{!-- app/templates/error.hbs --}}
    > <p id="error">
    >   {{model}}
    > </p>
    > ```
   
1. Dans notre cas il serait plus pertinent de gérer cette erreur au niveau de l'affichage d'un comic et non de 
l'application.
    * Copier le contenu du template ``app/templates/error.hbs`` dans un nouveau template ``app/templates/comics/error.hbs``
    * Dans ``app/templates/error.hbs``, faire précéder le modèle du texte "Application error: "
    * Dans ``app/templates/comics/error.hbs``, faire précéder le modèle du texte "Comic error: "
    
    > ```html
    > {{!-- app/templates/error.hbs --}}
    > <p id="error">
    >   Application error: {{model}}
    > </p>
    > ```
    >
    > ```html
    > {{!-- app/templates/error.hbs --}}
    > <p id="error">
    >   Comic error: {{model}}
    > </p>
    > ```
    
On constate que l'erreur levée au niveau ``comics/comic`` a été propagée au sein de l'application jusqu'à trouver un
*handler*. Ce mécanisme permet de gérer les erreurs de la manière la plus contextuelle possible tout en proposant
un gestionnaire par défaut pour toute l'application.

  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>

## Transitions & Redirections

On a vu que l'on pouvait changer de route via l'utilisation de ``link-to``. Il est également possible d'effectuer la même
opération depuis une route grâce à la méthode ``transitionTo`` ou depuis un contrôleur via ``transitionToRoute``.

Dans une route, ces changements de route via ``transitionTo`` peuvent s'effectuer :
* avant que l'on connaisse le modèle dans ``beforeModel`` dans le cas où la transition est systématique
* après avoir récupéré le modèle dans ``afterModel`` si l'appel de la transition dépend de l'état ou de la valeur du modèle

Dans les deux cas, l'appel à ``transitionTo`` stoppe et invalide toute transition en cours et en déclenche une nouvelle.

L'appel à ``transitionTo`` au sein de routes imbriquées mérite donc une attention supplémentaire. En effet, les *hook* 
``beforeModel``, ``model`` et ``afterModel`` sont exécutés en cascade, à la manière de poupées russes, depuis la route
de plus haut niveau vers celle de plus bas niveau.

Lorsque l'on effectue une transition depuis une route mère vers une route fille, la transition de la route mère est donc 
invalidée et une nouvelle transition pour la route fille est démarrée. Or celle-ci implique l'invocation des *hooks* de
sa route mère. Ce fonctionnement est loin d'être optimal puisque ceux-ci viennent à peine d'être exécutés.

Dans ce cas il est préférable d'utiliser la méthode ``redirect`` qui agit exactement comme un ``transitionTo`` mais 
conserve la transaction courante valide.

<div class="work">
  {% capture m %}
  {% raw %}
  
1. Modifier l'application de manière à rediriger ``/`` vers ``/comics``
    
   > ```javascript
   > //app/routes/application.js
   >
   > import Ember from 'ember';
   > 
   > export default Ember.Route.extend({
   >   beforeModel() {
   >     this.transitionTo('comics');
   >   }
   > });
   > ```
  
  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>


## Conclusion

Le routeur et les routes d'[Ember][ember] proposent donc des mécanismes avancés et constituent des éléments centraux 
dans le fonctionnement du framework.

On a pu également constater à quel point les conventions tenaient une place importante dans la structure de notre
application et dans le fonctionnement des différents éléments. Il est important également de se rappeler que la très 
grande majorité de ces conventions peuvent être adaptées et personalisées à l'aide de configuration et de points
d'extension. 

 
[handlebars]: http://handlebarsjs.com/
[ember-cli]: http://www.ember-cli.com/
[ember]: http://emberjs.com/