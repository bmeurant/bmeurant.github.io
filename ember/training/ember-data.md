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
la méthode [createRecord()](http://emberjs.com/api/data/classes/DS.Store.html#method_createRecord) :

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

-> Exo modification route comics model
-> Exo modification route comics avec peekAll + route comic & peekAll.findBy

## Ember CLI Mirage

-> Exo (ou providing) config pour Mirage
-> Exo modif vers find puis findId puis findBySlug 

## Modification

### Modification

## Sauvegarde

### Promesses & validation

-> addon ?

## Suppression

#### Etat des objets

## Relations




{% endraw %}

[ember]: http://emberjs.com/
[ember-data]: https://guides.emberjs.com/v2.4.0/models/