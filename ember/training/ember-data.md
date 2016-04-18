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

### ``find*``

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

### ``peek*``

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

### ``query*``

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

Ces fonctions retournent un [``PromiseArray``](http://emberjs.com/api/data/classes/DS.PromiseArray) dans le cas d'une collection ou une simple
*Promise* dans le cas d'un objet seul. Ces promesses seront résolues respectivement en un [``RecordArray``](http://emberjs.com/api/data/classes/DS.RecordArray.html)
et un *record* du type demandé au retour de la requête.

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
   
   En effet, comme évoqué plus haut, le ``store`` doit impérativement être utilisé pour créer les objets [Ember Data][ember-data] via la méthode
   ``createRecord``. Ainsi les appels à ``Comic.create(...)`` de la route ``app/routes/comics.js`` génèrent ces erreurs.
   
1. Modifier la route ``app/routes/comic.js`` pour supprimer les appels à ``Comic.create(...)`` et utiliser la méthode ``createRecord`` du store
   à la place
   * utiliser le hook ``init`` pour la création des objets
   * modifier le hook ``model`` pour renvoyer la liste des objets [Ember Data][ember-data] en utilisant la méthode ``findAll`` du store. Que constate-t-on ?
   
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
ember install ember-cli-mirage
```

### Routes & **raccourcis**

A l'initialisation, [Ember CLI Mirage][ember-mirage] n'est capable de répondre à aucune requête car il ne définit par défaut aucune route (à ne pas confondre avec
les routes [Ember][ember]). Il est donc nécessaire de définir les routes que l'on souhaite simuler dans le fichier ``app/mirage/config.js`` généré lors de l'installation.
le fichier généré comporte d'ailleur un grand nombre de commentaires destinés à expliquer le fonctionnement et la définition des routes. Il est à consulter pour d'avantage de détails.

Les routes peuvent ainsi être :

* déclarées simplement. Dans ce cas [Ember CLI Mirage][ember-mirage] exécutera l'implémentation par défaut en se basant sur le nom de la route (recherche dans les données locales, etc.) : 

  ```javascript
  this.get('/contacts');
  
* déclarées et implémentées. Dans ce cas [Ember CLI Mirage][ember-mirage] exécutera l'implémentation fournie :

  ```javascript
  // JSON API support
  this.get('/contacts', function(db, request) {
    return {
      data: db.contacts.map(attrs => (
        { type: 'contacts', id: attrs.id, attributes: attrs }
      ))
    };
  })
  ```

Par défaut, les routes non définies explicitement conduisent à des erreurs mais l'utilisation de ``this.passthrough()`` dans le fichier de configuration permet de damander à 
[Ember CLI Mirage][ember-mirage] d'effectuer plutôt un appel réel vers le serveur. Ce mécanisme permet la mise à disposition de mocks partiels, en développement notamment.

Pour plus de précision se reporter à la [documentation](http://www.ember-cli-mirage.com/docs/v0.1.x/defining-routes/).

### Factories & Fixtures

L'un des composants clefs d'[Ember CLI Mirage][ember-mirage] est sa **base de données locale**. En effet, les requêtes simulées (et déclarées via les routes) peuvent renvoyer
directement des données mais également - et de manière plus intéressante - s'appuyer sur une base de données locale alimentée par des mécanismes tels que les **fixtures** et les
**factories**. Cela s'effectue en développement via un **scénario** définit dans ``app/scenarios/default.js`` et en tests via des configurations équivalentes dans chaque test.

* Les **factories** constituent un outil très puissant permettant de générer aléatoirement un ensemble de données de test en fonction de différents critères : suite numérique, random,
  liste prédéfinie, etc. Les **factories** sont définies dans ``app/factories``. Elles sont ensuite créées dans ``app/scenarios/default.js`` ou dans chaque test : 
  
  ```javascript
  server.createList('contact', 10);
  ```
  
  cf. [documentation](http://www.ember-cli-mirage.com/docs/v0.1.x/seeding-your-database/#defining-factories)

* Les **fixtures** permettent de fournir un ensemble de données statiques (et non générés dynamiquement comme les factories) sous la forme de données au format JSON. Les **fixtures** 
  sont définies dans ``app/fixtures``. Elles sont ensuite chargées dans ``app/scenarions/default.js`` ou dans chaque test : 
  
  ```javascript
   server.loadFixtures();
  ```
  
  cf. [documentation](http://www.ember-cli-mirage.com/docs/v0.1.x/seeding-your-database/#fixtures)

Ces deux mécanismes peuvent être combinés. Ils contribuent à peupler une base locale ``db`` qui est ensuite requêtée automatiquement par [Ember CLI Mirage][ember-mirage] pour retrouver les données
et peut également être manipulée à la main lors de la définition de nos propres implémentations.

## Ember Data Adapters & Ember CLI Mirage

Avant de poursuivre, il est nécessaire d'introduire très rapidement la notion d'**Adapter**. [Ember Data][ember-data] s'appuie en effet sur le mécanisme central des **adapters** définit plus haut
permettant de traduire une opération effectuée sur le store en une requête serveur, adaptée au format de celui-ci. les adapters sont à définir dans ``app/adapters``. Il existe des adapters généraux
qui s'appliquent à tous les objects [Ember Data][ember-data] tel que ``app/adapters/application.js`` ou des adapters spécifiques à chaque objet tels que ``app/adapters/contact.js``.

Le fonctionnement et la personnalisation des adapters par objet seront détaillés plus tard. Il est cependant nécessaire de s'arrêter un peu sur l'adapter ``application``. En effet, celui-ci défini
les règles génériques de l'API avec laquelle l'application souhaite interragir. [Ember Data][ember-data] supporte nativment les adapters [RESTAdapter](http://emberjs.com/api/data/classes/DS.RESTAdapter.html)
et [JSONAPIAdapter](http://emberjs.com/api/data/classes/DS.JSONAPIAdapter.html). C'est ce dernier, respectant la spécification [JSON API](http://jsonapi.org/) qui est activé par défaut.

La modification de l'adapter général est très facile : 

```javascript
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  // others configurations (optional)
});
```

C'est notamment nécessaire avec [Ember CLI Mirage][ember-mirage] puisque celui-ci ne supporte pas par défaut JSON API. Il est cependant possible de personnaliser les routes pour le supporté tel que décrit dans la
[documentation](http://www.ember-cli-mirage.com/docs/v0.1.x/working-with-json-api/).


{% endraw %}

<div class="work answer">
  {% capture m %}
  {% raw %}
  
1. Nous allons maintenant configurer un serveur [Ember CLI Mirage][ember-mirage] permettant d'exposer notre liste de comics sous forme de *fixtures* (puisque nos données sont complètes
   et ne nécessitent pas d'être générées dynamiquement).
   * Installer [Ember CLI Mirage][ember-mirage]
   * Supprimer les factories inutiles
   * Créer la route [Ember CLI Mirage][ember-mirage] pour répondre à un GET ``/comics``
   * Ajouter les fixtures nécessaires et y déplacer la définition des comics
   * Modififer le scénario par défaut d'[Ember CLI Mirage][ember-mirage] pour charger les fixtures
   * Dans la route ``comics``, supprimer la création des comics et changer le précédent ``peekAll`` en ``findAll``
   
   > ```console
   > ember install ember-cli-mirage
   > version: 2.4.2
   > Installed packages for tooling via npm.
   > installing ember-cli-mirage
   >   create app\mirage\config.js
   >   create app\mirage\factories\contact.js
   >   create app\mirage\scenarios\default.js
   >   install bower packages pretender, lodash, Faker
   > Installing browser packages via Bower...
   >   cached https://github.com/Marak/Faker.js.git#3.0.1
   >   cached https://github.com/lodash/lodash.git#3.7.0
   >   cached https://github.com/trek/pretender.git#0.10.1
   >   cached https://github.com/trek/FakeXMLHttpRequest.git#1.2.1
   >   cached https://github.com/tildeio/route-recognizer.git#0.1.9
   > Installed browser packages via Bower.
   > Installed addon package.
   > ```
   >
   > ```javascript
   > // app/mirage/config.js
   >
   > export default function() {
   >   this.get('/comics');
   > }
   > ```
   >
   > ```javascript
   > // app/mirage/fixtures/comics.js
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
   > export default [akira, blackSad, calvinAndHobbes];
   > ```
   >
   > ```javascript
   > // app/mirage/scenarios/default.js
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
   
   En accédant à la route ``/comics`` dans le navigateur, on constate l'erreur suivante : 
   
   ```console
   > Error: Assertion Failed: normalizeResponse must return a valid JSON API document:
   	* One or more of the following keys must be present: "data", "errors", "meta".
   ```
   
   En effet, comme on l'a évoqué plus haut, [Ember CLI Mirage][ember-mirage] fournit une implémentation par défaut correspondant à un [RESTAdapter](http://emberjs.com/api/data/classes/DS.RESTAdapter.html)
   alors qu'[Ember Data][ember-data] s'appuie par défaut sur un [JSONAPIAdapter](http://emberjs.com/api/data/classes/DS.JSONAPIAdapter.html)
   
1. Modifier l'adapter général de l'application pour utiliser un ``RESTAdapter`` basique
   * Naviguer ensuite sur la route ``/comics`` pour constater que l'application répond désormais correctement
   
   > ```javascript
   > // app/adapters/application.js
   >
   > import DS from 'ember-data';
   > 
   > export default DS.RESTAdapter.extend({
   > });
   > ```
   
1. Modifier la route ``app/routes/comic.js`` pour effectuer une requête paramétrée sur le store plutôt qu'un ``this.modelFor(...).findBy(...)`` afin de récupérer un comic par son *slug*
   * Modifier la route [Ember CLI Mirage][ember-mirage] ``users`` et l'implémenter pour accepter le parametre ``slug`` 
     (hints: cf [query params](http://www.ember-cli-mirage.com/docs/v0.1.x/defining-routes/#dynamic-paths-and-query-params) et 
     [API database](http://www.ember-cli-mirage.com/docs/v0.1.x/database/#where).
   * Cette route doit renvoyer la liste des comics si elle est appelée sans paramètre et le comic damandé sinon. Dans tous les cas, le résultat doit être encapsulé de cette manière : ``{comics: <result>}``.
   * Utiliser la fonction [classify](http://emberjs.com/api/classes/Ember.String.html#method_classify) pour rechercher un comic à partir du titre reconstruit (le slug n'est pas enregistré)
   * Charger ensuite la route ``/comics/akira`` via un Ctrl-F5 pour constater dans la console que la requête ``GET /comics?slug=akira`` a bien été exécutée et qu'[Ember CLI Mirage][ember-mirage]
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
   > Lorsque l'on vient de la route ``/comics``, le model complet est passé à la route ``/comics/{slug}`` via le ``linkTo``. Dans ce cas [Ember][ember] n'exécute pas le hook ``model``
   > puisqu'il en dispose déjà. Dans le cas d'un chargement initial, au contraire, le modèle n'est pas disponible et [Ember][ember] exécute le hook, entraînant une requête de la part
   > d'[Ember Data][ember-data].
   
  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>

{% raw %}

-> Exo install Mirage
-> Exo (ou providing) config pour Mirage
-> Exo modification route comic & query
-> Exo modif vers find puis findId puis findBySlug 

## Modification

## Suppression

## Enregistrement / Sauvegarde

### Etat des objets

### Promesses & validation

-> addon ?

## Relations




{% endraw %}

[ember]: http://emberjs.com/
[ember-data]: https://guides.emberjs.com/v2.4.0/models/
[ember-mirage]: http://www.ember-cli-mirage.com/