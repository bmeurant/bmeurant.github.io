---
layout: ember-training
title: Formation Ember - Ember Data
permalink:  ember/training/ember-data/
prev: ember/training/components
---

<div id="toc"></div>

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

La définition d'un objet modèle [Ember Data][ember-data] se fait en étendant la classe [DS.Model](http://emberjs.com/api/data/classes/DS.Model.html).
La définition de cette nouvelle classe se fait dans un fichier js dans ``app/models``. Le nom du fichier déterminera le type du modèle que
l'on est en train de définir. Ainsi, la définition de ``app/models/user.js`` rendra disponible le type ``user``.

Cette classe permet de déclarer la structure du modèle : ses attributs ainsi que leur type et leurs éventuelles valeurs par défaut.

### Attributs

Les attributs sont déclérés comme des propriété de l'objet en utilisant [DS.attr()](http://emberjs.com/api/data/classes/DS.html#method_attr) :

```javascript
import DS from 'ember-data';

export default DS.Model.extend({
  scriptwriter: DS.attr(),
  illustrator: DS.attr()
});
```

### Attributs calculés

Tout comme n'importe quelle propriété [Ember][ember], un attribut [Ember Data][ember-data] peut être calculé à partir d'autres à l'aide d'une propriété calculée : 

```javascript
import DS from 'ember-data';

export default DS.Model.extend({
  scriptwriter: DS.attr(),
  illustrator: DS.attr(),
  
  authors: function() {
    return `${this.get('scriptwriter')} and ${this.get('illustrator')}`;
  }.property('scriptwriter', 'illustrator')
});
```

### "Types" (*Transforms*)

Lors de la déclaration d'un attribut, un "type" optinnel peut être précisé à l'aide des [Transformers](http://emberjs.com/api/data/classes/DS.Transform.html) dont l'identifiant 
est passé en paramètre de la fonction ``DS.attr()``. Les valeurs ``string``, ``boolean``, ``number`` et ``date`` sont gérées nativement.

```javascript
import DS from 'ember-data';

export default DS.Model.extend({
  scriptwriter: DS.attr('string'),
  illustrator: DS.attr('string'),
  publicationDate: DS.attr('date'),
  nbAlbums: DS.attr('number'),
  isComplete : DS.attr('boolean')
});
```

Il est également possible de définir des *transformers* personnalisés (ex : ``timestamp``) via la définition de nouveaux 
[Transformers](http://emberjs.com/api/data/classes/DS.Transform.html).

### Valeurs par défaut

La déclaration d'un atribut accepte également un paramètre permettant de définir une valeur par défaut pour l'attribut que l'on est en train de définir :

```javascript
import DS from 'ember-data';

export default DS.Model.extend({
  scriptwriter: DS.attr('string'),
  illustrator: DS.attr('string'),
  publicationDate: DS.attr('date', {defaultValue: '1970-01-01'}),
  nbAlbums: DS.attr('number', {defaultValue: 0}),
  isComplete : DS.attr('boolean', {defaultValue: false})
});
```

## Création

Une fois les modèles définis, il est possible d'en créer des instances. Celles-ci doivent être créées exclusivement dans le store à l'aide de 
la méthode [createRecord()](http://emberjs.com/api/data/classes/DS.Store.html#method_createRecord). Il n'est pas possible de créer une instance
d'un objet [Ember Data][ember-data] en dehors du store :

```javascript
this.store.createRecord('user', {
  firstName: 'Franck',
  lastName: 'Underwood'
});
```

Lors de la récupération de données depuis le serveur, la création et l'enregistrement dans le store est effectuée automatiquement par [Ember Data][ember-data].

A noter qu'il est également possible, dans certains cas particuliers (pré-chargement, endpoints complexes, atc.), d'alimenter les store à l'aide des méthodes
[push](http://emberjs.com/api/data/classes/DS.Store.html#method_push) ou [pushPayload](http://emberjs.com/api/data/classes/DS.Store.html#method_pushPayload). 
Ces méthodes permettent en effet de charger les store à parit de données JSON obtenues par ailleurs. cf. [documentation](https://guides.emberjs.com/v2.4.0/models/pushing-records-into-the-store/)

## Accès au store et injection

Comme évoqué plus haut, le store [Ember Data][ember-data] constitue donc le référentiel unique de persistance. Il doit donc être fréquemment accédé 
depuis les routes et contrôleurs [Ember][ember] notamment. [Ember Data][ember-data] effectue cette injection automatiqument pour nous. Il est donc
possible d'accéder au store (``this.store``) depuis chaque route / contrôleur au sein d'une application.

Ceci est rendu possible grâce aux **mécanismes d'injection de dépendance** d'[Ember][ember], et notamment aux *initializers* et aux *registrers*. 
Nous ne détaillerons pas d'avantage ces mécanismes ici mais il est important de remarquer leur existance et leur utilisation fréquente. En effet,
il est tout à fait courant que les *addons* [Ember][ember] s'appuie sur ces principes pour mettre à disposition des fonctions ou opérations à 
l'ensemble des objets d'une application ou à une sous partie. La mise à disposition de services métiers ou techniques transversaux est notamment
grandement facilité par ces outils.

cf. [documentation](https://guides.emberjs.com/v2.4.0/applications/dependency-injection/)

## Récupération & Recherche

Lorsque l'on utilise [Ember Data][ember-data], le store constitue donc le point d'accés unique permettant de rechercher et de retrouver
des objets (*records*) depuis le serveur. Le store embarque une gestion de cache avancée qui lui permet, selon les cas, d'interroger son 
cache local ou de transmettre la requête au serveur. Ainsi, lorsque l'application demande le chargement d'un objet ou d'un ensemble d'objets,
le store déterminera au cas par cas si il doit intérroger l'API distante ou se contenter de retourner les objets disponibles dans le store local.

Il existe trois grandes familles de requêtes :

### Méthodes ``find*``

Les méthodes ``find`` permettent de retrouver des objets localement si ils sont disponible ou en interrogeant l'API distante, dans le cas contraire.

Il est possible de rechercher tous les objets d'un type ([``findAll``](http://emberjs.com/api/data/classes/DS.Store.html#method_findAll)) :

```javascript
this.store.findAll('user');
```

Ou bien une instance en particulier à partir de son identifiant ([``findRecord``](http://emberjs.com/api/data/classes/DS.Store.html#method_findRecord)) : 

```javascript
this.store.findRecord('user', 1);
```

Ces fonctions retournent un [``PromiseArray``](http://emberjs.com/api/data/classes/DS.PromiseArray) dans le cas d'une collection ou une simple
*Promise* dans le cas d'un objet seul. Ces promesses seront résolues respectivement en un [``RecordArray``](http://emberjs.com/api/data/classes/DS.RecordArray.html)
et un *record* du type demandé au retour de la requête.

### Méthodes ``peek*``

Les méthodes ``peek`` sont très similaires aux ``find`` à ceci près qu'elles ne travaillent que localement et ne déclenchent jamais de requêtes
vers le serveur. Elles permettent donc d'interroger uniquement les objets déjà chargés dans le store.

Il est possible de rechercher tous les objets d'un type ([``peekAll``](http://emberjs.com/api/data/classes/DS.Store.html#method_peekAll)) :

```javascript
 this.store.peekAll('user');
```

Ou bien une instance en particulier à partir de son identifiant ([``peekRecord``](http://emberjs.com/api/data/classes/DS.Store.html#method_peekRecord)) : 

```javascript
this.store.peekRecord('user', 1);
```

Ces fonctions retournent directement un [``RecordArray``](http://emberjs.com/api/data/classes/DS.RecordArray.html) ou un *record* du type demandé.

### Méthodes ``query*``

Les méthodes ``query``, quant à elles, permettent de préciser des critères de recherche complexes via les options qui seront passées en paramètres
de requête.

On peut les utiliser pour rechercher un ensemble d'objets ([``query``](http://emberjs.com/api/data/classes/DS.Store.html#method_query)) :

```javascript
// /api/v1/user?filter[age]=20
this.store.query('user', {filter: {age: 20}});

// /api/v1/user?page=1
this.store.query('user', {page: 1});

// /api/v1/user?ids[]=1&ids[]=2
this.store.query('user', {ids: [1, 2]});
```

Ou un objet seul ([``queryRecord``](http://emberjs.com/api/data/classes/DS.Store.html#method_queryRecord)) :

```javascript
// /api/v1/user?filter[login]=funderwood
this.store.queryRecord('user', {filter: {login: "funderwood"}});
```

### Asynchronicité (promesses)

Ces méthodes effectuent des requêtes serveur et retournent donc des  promesses. En l'occurence, un [``PromiseArray``](http://emberjs.com/api/data/classes/DS.PromiseArray) dans le cas d'une 
collection ou une simple *Promise* dans le cas d'un objet seul. Ces promesses seront résolues respectivement en un [``RecordArray``](http://emberjs.com/api/data/classes/DS.RecordArray.html)
et un *record* du type demandé au retour de la requête ou rejetée en cas d'erreur.

Si l'on souhaite effectuer des opérations complémentaires sur un objet au retour du serveur, il est donc impératif d'attendre la résolution de la promesse en implémentatnt le traitement dans 
sa méthode ``then()``. 

```javascript
this.store.findRecord('user', 1).then((user) => {
  // anything using user
});
```

En revanche, lorsque l'on retourne directement le résultat de l'une de ces méthodes au sein de l'un des hook des routes (``model`` par exemple), la gestion des promesses est effectuée pour nous
et il n'est pas nécessaire d'attendre le retour effectif pour renvoyer le résultat. A noter qu'il est impératif de retourner cette promesse dans le *hook*, sans quoi le modèle demeurera null.

```javascript
  model() {
    return this.store.findRecord('user', 1);
  });
```

Il est cependant possible de retourner la promesse tout en enregistrant un callback. Cela peut notament s'avérer utile dans le traitement des erreurs : 

```javascript
return this.store.findRecord('user', 1).then(user => {
  // anything using user
}).catch(reason => {
  // error handling
});
```

{% endraw %}

<div class="work answer">
  {% capture m %}
  {% raw %}
  
1. Modifier le fichier ``app/models/comic.js``
   * Faire étendre la classe de ``DS.Model``
   * Modifier les attributs pour utiliser ``DS.attr()``. Définir les valeurs par défaut si besoin.
   
   > ```javascript
   > // app/models/comic.js
   >
   > import DS from 'ember-data';
   > 
   > export default DS.Model.extend({
   >   slug: function () {
   >     return this.get('title').dasherize();
   >   }.property('title'),
   >   
   >   title: DS.attr('string'),
   >   scriptwriter: DS.attr('string'),
   >   illustrator: DS.attr('string'),
   >   publisher: DS.attr('string'),
   >   isFavorite: DS.attr('boolean', {defaultValue: false}),
   > 
   >   ...
   > });
   > ```
   
   Lorsque l'on tente d'accèder à la route ``/comics``, l'application lève une erreur fatale : 
    
   ```console
   > Uncaught Error: You should not call `create` on a model. Instead, call `store.createRecord` with the attributes you would like to set.
   ```
   
   En effet, comme évoqué plus haut, le ``store`` doit impérativement être utilisé pour créer les objets [Ember Data](https://guides.emberjs.com/v2.4.0/models/) via la méthode
   ``createRecord``. Ainsi les appels à ``Comic.create(...)`` de la route ``app/routes/comics.js`` génèrent ces erreurs.
   
1. Modifier la route ``app/routes/comic.js`` pour supprimer les appels à ``Comic.create(...)`` et utiliser la méthode ``createRecord`` du store
   à la place
   * utiliser le hook ``init`` pour la création des objets
   * modifier le hook ``model`` pour renvoyer la liste des objets [Ember Data](https://guides.emberjs.com/v2.4.0/models/) en utilisant la méthode ``findAll`` du store. Que constate-t-on ?
   
   > ```javascript
   > // app/routes/comic.js
   >
   > import Ember from 'ember';
   > 
   > let blackSad = {
   >   title: 'Blacksad',
   >   scriptwriter: 'Juan Diaz Canales',
   >   illustrator: 'Juanjo Guarnido',
   >   publisher: 'Dargaud'
   > };
   > 
   > let calvinAndHobbes = {
   >   title: 'Calvin and Hobbes',
   >   scriptwriter: 'Bill Watterson',
   >   illustrator: 'Bill Watterson',
   >   publisher: 'Andrews McMeel Publishing'
   > };
   > 
   > let akira = {
   >   title: 'Akira',
   >   scriptwriter: 'Katsuhiro Otomo',
   >   illustrator: 'Katsuhiro Otomo',
   >   publisher: 'Epic Comics'
   > };
   > 
   > export default Ember.Route.extend({
   >   init() {
   >     this._super(...arguments);
   >     this.store.createRecord('comic', akira);
   >     this.store.createRecord('comic', blackSad);
   >     this.store.createRecord('comic', calvinAndHobbes);
   >   },
   >   model () {
   >     return this.store.findAll('comic');
   >   }
   > });
   > ```
   >
   > En utilisant la méthode ``findAll``, on constate que les résultats du store local sont bien renvoyés mais après une requête back en erreur (puisque celui-ci
   > n'existe pas). En effet, par défaut, comme expliqué plus haut, la manipulation du store entraîne des interrogations serveur.
   >
   > ```console
   > > Error: Ember Data Request GET /comics returned a 404
   > Payload (text/html; charset=utf-8)
   > Cannot GET /comics
   > ```
   
   * faire en sorte de supprimer toutes les erreurs
   
   > ```javascript
   > // app/routes/comic.js
   >
   > import Ember from 'ember';
   > 
   > ...
   > 
   > export default Ember.Route.extend({
   >   init() {
   >     ...
   >   },
   >   model () {
   >     return this.store.peekAll('comic');
   >   }
   > });
   > ```
   >
   > En utilisant la méthode ``peekAll``, on constate cette fois-ci qu'aucune requête n'est effectuée au serveur. Le store se contente alors de 
   > requêtes / réponses locales. 
   
  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>
   
{% raw %}

## Simulation d'un serveur

Pour aller plus loin dans l'utilisation d'[Ember Data][ember-data], il est nécessaire de se placer dans des conditions plus proches de la réalité et donc
de s'appuyer sur un serveur "distant". Dans le cas présent, pour des raisons pédagogiques, nous allons simuler ce serveur grâce à un *addon* [Ember][ember] :
[Ember CLI Mirage][ember-mirage].

Cet outil permet d'embarquer, côté client un serveur simulé permettant de *mocker* tout ou partie des requêtes effectuées par l'application au serveur distant. 
[Ember CLI Mirage][ember-mirage] dispose de fonctionnalités avancées telles que ses **routes prédéfinies**, ses **factories** et ses **fixtures**. Il est couramment
utilisé lors des tests d'acceptance, de manière à simuler un jeux de données statique ou dynamique ainsi que, dans certains cas lors des phases de développement
pour *mocker* certains appels vers des APIs externes. C'est à l'heure actuelle, l'outil de référence dans la communauté [Ember][ember] pour ce genre d'usages.
 
### Ember CLI Mirage addon

La modularité d'[Ember][ember] ainsi que son approche composants a permis et encouragé l'emmergence d'**addons**. Les **addons** [Ember][ember] sont un mécanisme 
d'extension formalisé en même temps que le développement d'[Ember CLI](http://ember-cli.com/). Ils sont un mécanisme d'extension puissant permettant d'ajouter à
une application [Ember][ember] de multiples fonctionnalités via la mise à disposition de composants, mixins, services, etc. Un **addon** peut embarquer un simple
composant comme un mécanisme d'authentification côté client complet. Le site [Ember addons](https://www.emberaddons.com) rencense l'ensemble des **addons** [Ember][ember]
et permet des recherches avancées.

[Ember CLI Mirage][ember-mirage] est l'un de ces addons et, comme tel, peut être installé de la manière suivante : 

```console
ember install ember-cli-mirage@beta
```

On installe la beta car celle-ci apporte des améiliorations indispensables, notament dans la gestion des relations.

### Routes & **raccourcis**

A l'initialisation, [Ember CLI Mirage][ember-mirage] n'est capable de répondre à aucune requête car il ne définit par défaut aucune route (à ne pas confondre avec
les routes [Ember][ember]). Il est donc nécessaire de définir les routes que l'on souhaite simuler dans le fichier ``app/mirage/config.js`` généré lors de l'installation.
le fichier généré comporte d'ailleur un grand nombre de commentaires destinés à expliquer le fonctionnement et la définition des routes. Il est à consulter pour d'avantage de détails.

Les routes peuvent ainsi être :

* déclarées simplement. Dans ce cas [Ember CLI Mirage][ember-mirage] exécutera l'implémentation par défaut en se basant sur le nom de la route (recherche dans les données locales, etc.) : 

  ```javascript
  // mirage/config.js
  this.get('/contacts');
  ```
  
* déclarées et implémentées. Dans ce cas [Ember CLI Mirage][ember-mirage] exécutera l'implémentation fournie :

  ```javascript
  // mirage/config.js
  this.get('/contacts', function(db, request) {
    return {
      data: db.contacts.map(attrs => (
        ... // anything
      ))
    };
  })
  ```

Par défaut, les routes non définies explicitement conduisent à des erreurs mais l'utilisation de ``this.passthrough()`` dans le fichier de configuration permet de damander à 
[Ember CLI Mirage][ember-mirage] d'effectuer plutôt un appel réel vers le serveur. Ce mécanisme permet la mise à disposition de mocks partiels, en développement notamment.

Pour plus de précision se reporter à la [documentation](http://www.ember-cli-mirage.com/docs/v0.2.0-beta.8/defining-routes/).

### Factories & Fixtures

L'un des composants clefs d'[Ember CLI Mirage][ember-mirage] est sa **base de données locale**. En effet, les requêtes simulées (et déclarées via les routes) peuvent renvoyer
directement des données mais également - et de manière plus intéressante - s'appuyer sur une base de données locale alimentée par des mécanismes tels que les **fixtures** et les
**factories**. Cela s'effectue en développement via un **scénario** définit dans ``mirage/scenarios/default.js`` et en tests via des configurations équivalentes dans chaque test.

* Les **factories** constituent un outil très puissant permettant de générer aléatoirement un ensemble de données de test en fonction de différents critères : suite numérique, random,
  liste prédéfinie, etc. Les **factories** sont définies dans ``mirage/factories``. Elles sont ensuite créées dans ``mirage/scenarios/default.js`` ou dans chaque test : 
  
  ```javascript
  // mirage/scenarios/default.js
  server.createList('contact', 10);
  ```
  
  cf. [documentation](http://www.ember-cli-mirage.com/docs/v0.2.0-beta.8/seeding-your-database/#defining-factories)

* Les **fixtures** permettent de fournir un ensemble de données statiques (et non générés dynamiquement comme les factories) sous la forme de données au format JSON. Les **fixtures** 
  sont définies dans ``mirage/fixtures``. Elles sont ensuite chargées dans ``mirage/scenarios/default.js`` ou dans chaque test : 
  
  ```javascript
  // mirage/scenarios/default.js
  server.loadFixtures();
  ```
  
  cf. [documentation](http://www.ember-cli-mirage.com/docs/v0.2.0-beta.8/seeding-your-database/#fixtures)

Ces deux mécanismes peuvent être combinés. Ils contribuent à peupler une base locale ``db`` qui est ensuite requêtée automatiquement par [Ember CLI Mirage][ember-mirage] pour retrouver les données
et peut également être manipulée à la main lors de la définition de nos propres implémentations.

### Models

Les modèles [Ember CLI Mirage][ember-mirage] sont à différencier absolument des modèles [Ember Data][ember-data]. Ils doivent être définis dans ``mirage\models`` pour pouvoir être manipulés par la 
database [Ember CLI Mirage][ember-mirage] mais il n'est pas néccessaire de redéfinir les attributs. 

```javascript
//mirage/models/user.js
import { Model } from 'ember-cli-mirage';

export default Model;
```

Comme on l'expérimentera plus tard, ils permettent en outre de gérer la définition des relations exposées par l'API [Ember CLI Mirage][ember-mirage].

```javascript
//mirage/models/user.js
import { Model } from 'ember-cli-mirage';

export default Model.extend({
  children: hasMany()
});
```

{% endraw %}

<div class="work answer">
  {% capture m %}
  {% raw %}
  
1. Nous allons maintenant configurer un serveur [Ember CLI Mirage](http://www.ember-cli-mirage.com/) permettant d'exposer notre liste de comics sous forme de *fixtures* (puisque nos données sont complètes
   et ne nécessitent pas d'être générées dynamiquement).
   * Installer [Ember CLI Mirage](http://www.ember-cli-mirage.com/)
   * Supprimer les factories inutiles
   * Créer la route [Ember CLI Mirage](http://www.ember-cli-mirage.com/) pour répondre à un GET ``/comics``
   * Ajouter les fixtures nécessaires et y déplacer la définition des comics
   * Modififer le scénario par défaut d'[Ember CLI Mirage](http://www.ember-cli-mirage.com/) pour charger les fixtures
   * Dans la route ``comics``, supprimer la création des comics et changer le précédent ``peekAll`` en ``findAll``
   
   > ```console
   > ember install ember-cli-mirage@beta
   > Installed packages for tooling via npm.
   > installing ember-cli-mirage
   >   create \\mirage\config.js\
   >   create \\mirage\scenarios\default.js
   >   create \\mirage\serializers\application.js
   >   install bower packages pretender, Faker
   >   not-cached https://github.com/trek/pretender.git#~0.12.0
   >   cached https://github.com/Marak/Faker.js.git#3.0.1
   >   resolved https://github.com/trek/pretender.git#0.12.0
   >   not-cached https://github.com/trek/FakeXMLHttpRequest.git#^1.3.0
   >   resolved https://github.com/trek/FakeXMLHttpRequest.git#1.4.0
   >   conflict Unable to find suitable version for pretender
   >     1) pretender ~0.10.1
   >     2) pretender ~0.12.0
   > ? Answer 2
   >   conflict Unable to find suitable version for FakeXMLHttpRequest
   >     1) FakeXMLHttpRequest ~1.2.1
   >     2) FakeXMLHttpRequest ^1.3.0
   > ? Answer 2
   > Installed browser packages via Bower.
   > Installed addon package.
   > ```
   >
   > ```javascript
   > // mirage/config.js
   >
   > export default function() {
   >   this.get('/comics');
   > }
   > ```
   >
   > ```javascript
   > // mirage/fixtures/comics.js
   > 
   > let blackSad = {
   >   id: 1,
   >   title: 'Blacksad',
   >   scriptwriter: 'Juan Diaz Canales',
   >   illustrator: 'Juanjo Guarnido',
   >   publisher: 'Dargaud'
   > };
   > 
   > let calvinAndHobbes = {
   >   id: 2,
   >   title: 'Calvin and Hobbes',
   >   scriptwriter: 'Bill Watterson',
   >   illustrator: 'Bill Watterson',
   >   publisher: 'Andrews McMeel Publishing'
   > };
   > 
   > let akira = {
   >   id: 3,
   >   title: 'Akira',
   >   scriptwriter: 'Katsuhiro Otomo',
   >   illustrator: 'Katsuhiro Otomo',
   >   publisher: 'Epic Comics'
   > };
   > 
   > export default [akira, blackSad, calvinAndHobbes];
   > ```
   >
   > ```javascript
   > // mirage/scenarios/default.js
   >
   > export default function (server) {
   >   server.loadFixtures();
   > }
   > ```
   > ```javascript
   > // app/routes/comics.js
   >
   > import Ember from 'ember';
   > 
   > export default Ember.Route.extend({
   >   model () {
   >     return this.store.findAll('comic');
   >   }
   > });
   > ```
   
1. Récupérer un ``comic`` par son *slug*
   * Modifier la route ``app/routes/comic.js`` pour effectuer une requête paramétrée sur le store plutôt qu'un ``this.modelFor(...).findBy(...)`` afin de récupérer un comic par son *slug*
   * Modifier la route [Ember CLI Mirage](http://www.ember-cli-mirage.com/) ``comics`` et y copier l'implémentation suivante pour accepter le parametre ``slug`` 
     
     ```javascript
     this.get('/comics', ({comic}, request) => {
       let slug = request.queryParams.slug;
     
       if (slug) {
         let foundComic = comic.where({title: slug.classify()})[0];
         if (foundComic) {
           return serializer.serialize(foundComic, request);
         } else {
           return new Mirage.Response(404, {}, "No comic found with slug: " + slug);
         }
       } else {
         return serializer.serialize(comic.all(), request);
       }
     });
     ```
     
   * Charger ensuite la route ``/comics/akira`` via un Ctrl-F5 pour constater dans la console que la requête ``GET /comics?slug=akira`` a bien été exécutée et qu'[Ember CLI Mirage](http://www.ember-cli-mirage.com/)
     y a répondu correctement
   * Pourquoi cette requête n'est-elle pas effectuée lorsque l'on vient de la route ``/comics`` ?
   
   > ```javascript
   > // app/routes/comic.js
   >
   > import Ember from 'ember';
   > 
   > export default Ember.Route.extend({
   >   model (params) {
   >     let askedModel = this.store.queryRecord('comic', {slug: params.comic_slug});
   > 
   >     ...
   >   },
   >   ...
   > });
   > ```
   >
   > ```javascript
   > // app/mirage/config.js
   >
   > export default function() {
   > 
   >   this.get('/comics', function(db, request) {
   >     let slug = request.queryParams.slug;
   > 
   >     if (slug) {
   >       return {comics: db.comics.where({title: slug.classify()})};
   >     } else {
   >       return {comics: db.comics};
   >     }
   >   });
   > }
   > ```
   >
   > Lorsque l'on vient de la route ``/comics``, le model complet est passé à la route ``/comics/{slug}`` via le ``linkTo``. Dans ce cas [Ember](http://emberjs.com/) n'exécute pas le hook ``model``
   > puisqu'il en dispose déjà. Dans le cas d'un chargement initial, au contraire, le modèle n'est pas disponible et [Ember](http://emberjs.com/) exécute le hook, entraînant une requête de la part
   > d'[Ember Data](https://guides.emberjs.com/v2.5.0/models/).
   
1. Rétablir la gestion des erreurs

   La gestion d'erreur actuelle de la route ``comics.index`` est désormais inopérante. En effet, elle se base sur un retour supposé immédiat de ``queryRecord`` contenant le model. Or, comme on 
   l'a expliqué plus haut, les fonctions de recherche du store manipulent exclusivement des promesses. Cela signifie que le retour de cette fonction sera toujours une promesse, résolue ou 
   rejetée de manière asynchrone. 
   
   Nous pourrions réecrire cette gestion d'erreur en s'appuyant sur les promesses via un ``catch`` de la manière suivante : 
   
   ```javascript
   model (params) {
     return this.store.queryRecord('comic', {slug: params.comic_slug}).catch( reason => {
       throw new Error("No comic found with slug: " + params.comic_slug);
     });
   },
   ```
   
   Cependant, cela réduirait la gestion des erreurs exclusivement à une gestion du statut 404. En outre, la route [Ember CLI Mirage](http://www.ember-cli-mirage.com/) renvoie une erreur complète que
   l'on peut exploiter. Pour cela, il suffit de s'appuyer simplement sur les mécanismes natifs de gestion d'erreurs d'[Ember](http://emberjs.com/). Toute erreur sera en effet propagée pour être ensuite
   affichée par le template approprié (en l'occurrence ``comics.error.hbs``). C'est également le cas des erreurs en provenance du serveur. Il suffit donc de modifier le template comme suit : 
   
   ```html
   {{!-- app/templates/comics/error.hbs --}}
   <p id="error">
     Comic error: {{model.errors.[0].detail}}
   </p>
   ```
   
   et de supprimer toute gestion d'erreur dans la route 
   
   ```javascript
   // app/routes/comics.js
   model (params) {
     return this.store.queryRecord('comic', {slug: params.comic_slug});
   },
   ```
   
   On constate que l'accès à un comic inexistant (par exemple ``comics/test``) affiche bien l'erreur.
   
  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>

{% raw %}

## Modification

La modification d'une instance de modèle [Ember Data][ember-data] n'implique, en elle même, aucune opération particulière puisqu'il suffit d'utiliser les *setters* de l'object de manière tout à fait classique.

```javascript
let user = this.store.findRecord('user', 1).then((user) => {
  user.set('lastName', 'New Last Name');
});
```

## Sauvegarde

Une fois l'instance de modèle [Ember Data][ember-data] créée et/ou modifiée, [Ember Data][ember-data] permet de persister ces changement sur le serveur. A la différence de la création ou des recherches,
la sauvegarde d'une instance de modèle s'effectue directement depuis l'instance, via l'invocation de la méthode [save()](http://emberjs.com/api/data/classes/DS.Model.html#method_save). 
Une requête est alors envoyée au serveur de manière à effectuer cette mise à jour :

```javascript
let user = this.store.createRecord('user', {
  firstName: 'Franck',
  lastName: 'Underwood'
});

user.save(); // -> POST /users/:id

let user = this.store.findRecord('user', 1).then((user) => {
  user.set('lastName', 'New Last Name');
  
  user.save(); // -> PUT /users/1
}); 
```

[Ember Data][ember-data] détérmine le type de requête (dans le cas présent, un POST pour une création, un PUT pour une modification) en fonction de l'état interne de l'objet (cf. plus loin).

### Asynchronicité (promesses)

Puisque la méthode ``save`` déclenche une requête vers le serveur, il s'agit d'un appel asynchrone. La méthode ``save`` renvoie en fait un objet ``Promise`` qui sera résolu une fois la requête effectuée
avec succès ou rejetée en cas d'erreur.

Si l'on souhaite effectuer une action à la suite d'une opération de sauvegarde, il est donc impératif d'attendre la résolution de la promesse en implémentatnt le traitement dans sa méthode ``then()``.
Dans le cas contraire, le traitement serait exécuté immédiatement après l'appel, sans attendre la réponse du serveur :

```javascript
user.save().then(() => {
  console.log("saved");
});

console.log("sent");
```

## Suppression

La suppression d'une instance peut s'effectuer de trois manières différentes : 

* Soit via la méthode du modèle [deleteRecord()](http://emberjs.com/api/data/classes/DS.Model.html#method_deleteRecord). Celle-ci se contente de placer l'objet dans un état (cf. ci-dessous) pariculier. L'objet
  est alors vu comme supprimé du store (et ne sera plus accessible) mais la requête de suppression ne sera envoyée au serveur que lors d'un ``save``.
  
  ```javascript
  user.deleteRecord();
  user.save(); // -> DELETE /users/:id
  ```
  
* Soit via la méthode du modèle [destroyRecord()](http://emberjs.com/api/data/classes/DS.Model.html#method_destroyRecord). Celle-ci effectue la requête de suppression au serveur immédiatement. Tout comme la méthode 
  ``save``, elle est asynchrone.
  
  ```javascript
  user.destroyRecord(); // -> DELETE /users/:id
  ```
  
* Soit via la méthode du store [deleteRecord()](http://emberjs.com/api/data/classes/DS.Store.html#method_deleteRecord) qui effectue également la requête immédiatement;

  ```javascript
  this.store.deleteRecord(user); // -> DELETE /users/:id
  ```

## Gestion d'états

[Ember Data][ember-data] effectue l'ensemble de ces opérations en s'appuyant sur une gestion fine des états de l'objet en fonction des différentes opérations effectuées. Il existe un grand nombre d'états
différents. Parmis les principaux

* [isNew](http://emberjs.com/api/data/classes/DS.Model.html#property_isNew) : positionné à la création de l'instance
* [hasDirtyAttributes](http://emberjs.com/api/data/classes/DS.Model.html#property_hasDirtyAttributes) : positionné lorsque l'objet a été modifié depuis son chargement. Remis à ``false`` suite à un ``save``.
* [isDeleted](http://emberjs.com/api/data/classes/DS.Model.html#property_isDeleted) : positionné lorsqu'un objet a été marqué pour suppression

[Ember Data][ember-data] s'appuie ensuite sur ces états pour déterminer les actions à effectuer sur les objets et notamment le type des requêtes à envoyer au serveur (``POST``, ``PUT``, ``DELETE``).

Ainsi le code suivant : 

```javascript
let comic = this.store.createRecord('comic');
console.log("1 - new ? - "+ comic.get('isNew'));
console.log("1 - dirty ? - "+ comic.get('hasDirtyAttributes'));
console.log("1 - deleted ? - "+ comic.get('isDeleted'));

comic.save().then(() => {
  console.log("3 - new ? - "+ comic.get('isNew'));
  console.log("3 - dirty ? - "+ comic.get('hasDirtyAttributes'));
  console.log("3 - deleted ? - "+ comic.get('isDeleted'));

  comic.set('title', 'new');
  console.log("4 - new ? - " + comic.get('isNew'));
  console.log("4 - dirty ? - " + comic.get('hasDirtyAttributes'));
  console.log("4 - deleted ? - " + comic.get('isDeleted'));

  comic.save().then(() => {
    console.log("5 - new ? - " + comic.get('isNew'));
    console.log("5 - dirty ? - " + comic.get('hasDirtyAttributes'));
    console.log("5 - deleted ? - " + comic.get('isDeleted'));

    comic.deleteRecord();
    console.log("6 - new ? - " + comic.get('isNew'));
    console.log("6 - dirty ? - " + comic.get('hasDirtyAttributes'));
    console.log("6 - deleted ? - " + comic.get('isDeleted'));

    comic.save().then(() => {
      console.log("7 - new ? - " + comic.get('isNew'));
      console.log("7 - dirty ? - " + comic.get('hasDirtyAttributes'));
      console.log("7 - deleted ? - " + comic.get('isDeleted'));
    });
  });
});

console.log("2 - new ? - "+ comic.get('isNew'));
console.log("2 - dirty ? - "+ comic.get('hasDirtyAttributes'));
console.log("2 - deleted ? - "+ comic.get('isDeleted'));
```

produira la sortie suivante : 

```console
1 - new ? - true
1 - dirty ? - true
1 - deleted ? - false

2 - new ? - true
2 - dirty ? - true
2 - deleted ? - false

Successful request: POST /comics

3 - new ? - false
3 - dirty ? - false
3 - deleted ? - false

4 - new ? - false
4 - dirty ? - false
4 - deleted ? - false

Successful request: PUT /comics/4

5 - new ? - false
5 - dirty ? - false
5 - deleted ? - false

6 - new ? - false
6 - dirty ? - true
6 - deleted ? - true

Successful request: DELETE /comics/4

7 - new ? - false
7 - dirty ? - false
7 - deleted ? - true
```

### Annulation des modifications

L'état ``hasDirtyAttributes`` permet également d'effectuer d'annuler un ensemble de modifications effectuées sur un objet et de le remettre dans son état initial. Cette annulation s'effectue via la méthode 
[http://emberjs.com/api/data/classes/DS.Model.html#method_rollbackAttributes](http://emberjs.com/api/data/classes/DS.Model.html#method_rollbackAttributes).

La méthode [changedAttributes()](http://emberjs.com/api/data/classes/DS.Model.html#method_changedAttributes) permet, en complément, d'obtenir la liste des modifications effectuées.

Ainsi le code suivant : 

```javascript
comic.set('title', 'new');
console.log("1 - dirty ? - " + comic.get('hasDirtyAttributes'));
console.log(comic.changedAttributes());

comic.rollbackAttributes();
console.log("2 - dirty ? - " + comic.get('hasDirtyAttributes'));
console.log(comic.changedAttributes());
```

produira la sortie suivante : 

```console
1 - dirty ? - true
EmptyObject {title: Array[2]}

2 - dirty ? - false
EmptyObject {}
```

### Validations

On remarque également que les modèles [Ember Data][ember-data] gèrent un état [isValid](http://emberjs.com/api/data/classes/DS.Model.html#property_isValid).
Celui ci est positionné lors de la réception d'erreurs de validation depuis le serveur. [Ember Data][ember-data] ne fournir en effet pas de gestion native de 
validation. En fonction des normes respectées, les adapters sont en revanche capables de récupérer les erreurs en provenance du serveur. La présence d'erreurs
de validation dans la réponse du serveur aura alors pour effet de positionner l'état de l'objet à ``isValid=false``. La liste des erreurs pourra ensuite être
accédée via la propriété [errors](http://emberjs.com/api/data/classes/DS.Model.html#property_errors) : ``user.get('errors')``.

Il ne faut cependant pas confondre cette récupérations d'erreurs de validations côté serveur avec une gestion de la validation des modèles côté client (dans un
formulaire, par exemple). [Ember Data][ember-data] ne fournit pas d'outillage à ce niveau là mais l'on peut se tourner vers l'addon 
[Ember CP Validations](http://offirgolan.github.io/ember-cp-validations/docs/modules/Home.html) qui en fournit une implémentation complète et de qualité, 
comprenant l'internationalisation.
 
{% endraw %}

<div class="work answer">
  {% capture m %}
  {% raw %}
  
1. On peut désormais simplifier grandement les opérations concernant la création et l'édition d'un comic. Modifier les routes ``comic.edit`` et ``comic.create``
   dans ce sens.
   * La gestion de l'état de sauvegarde (``hasUserSavedOrCancel``) peut disparaître au profit d'appels à ``save`` et de gestions d'états 
     [Ember Data](https://guides.emberjs.com/v2.4.0/models/)
   * De la même manière, la réinitialisation (``reset``) peut être avantageusement remplacée par un ``rollbackAttributes``.
   * Le modèle peut être accédé via ``this.get('controller.model')``
   * Le contrôleur ``app/controllers/comic/edit.js`` peut ensuite être supprimé sans impact.
   
   > ```javascript
   > // app/models/comic.js
   >
   > import DS from 'ember-data';
   > 
   > export default DS.Model.extend({
   >   slug: function () {
   >     return this.get('title').dasherize();
   >   }.property('title'),
   > 
   >   title: DS.attr('string', {defaultValue: 'new'}),
   >   scriptwriter: DS.attr('string'),
   >   illustrator: DS.attr('string'),
   >   publisher: DS.attr('string'),
   >   isFavorite: DS.attr('boolean', {defaultValue: false})
   > });
   > ```
   >
   > ```javascript
   > // app/mirage/config.js
   >
   > export default function() {
   > 
   >   this.get('/comics', function(db, request) {
   >     ...
   >   });
   > 
   >   this.put('/comics/:id');
   >   this.post('/comics');
   > });
   > ```
   >
   > ```javascript
   > // app/routes/comic/edit.js
   >
   > import Ember from 'ember';
   > 
   > export default Ember.Route.extend({
   > 
   >   actions: {
   >     save () {
   >       this.get('controller.model').save().then(() => {
   >         this.transitionTo('comic');
   >       });
   >     },
   >     cancel () {
   >       this.get('controller.model').rollbackAttributes();
   >       this.transitionTo('comic');
   >     },
   >     willTransition (transition) {
   >       if (this.get('controller.model.hasDirtyAttributes')) {
   >         if (confirm('Are you sure you want to abandon progress?')) {
   >           this.get('controller.model').rollbackAttributes();
   >         } else {
   >           transition.abort();
   >         }
   >       }
   >     }
   >   }
   > });
   > ```
   >
   > ```javascript
   > // app/routes/comics/create.js
   >
   > import Ember from 'ember';
   > 
   > export default Ember.Route.extend({
   >   templateName: 'comic/edit',
   >   controllerName: 'comic/edit',
   > 
   >   model () {
   >     return this.store.createRecord('comic');
   >   },
   > 
   >   actions: {
   >     save () {
   >       this.get('controller.model').save().then(() => {
   >         this.transitionTo('comic', this.get('controller.model'));
   >       });
   >     },
   >     cancel () {
   >       this.get('controller.model').rollbackAttributes();
   >       this.transitionTo('comics');
   >     },
   >     willTransition (transition) {
   >       if (this.get('controller.model.hasDirtyAttributes')) {
   >         if (confirm('Are you sure you want to abandon progress?')) {
   >           this.get('controller.model').rollbackAttributes();
   >         } else {
   >           transition.abort();
   >         }
   >       }
   >     }
   >   }
   > });
   > ```
   
  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>
   
{% raw %}

## Relations

belongsTo, hasMany

-> Exo albums




{% endraw %}

[ember]: http://emberjs.com/
[ember-data]: https://guides.emberjs.com/v2.4.0/models/
[ember-mirage]: http://www.ember-cli-mirage.com/