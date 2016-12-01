---
layout: ember-training
title: Formation Ember - Backend
permalink:  ember/training/backend/
prev: ember/training/ember-data
next: ember/training/testing
---

<div id="toc"></div>

Au chapitre précédent nous avons utilisé [Ember Mirage][ember-mirage] pour émuler un serveur côté client. Nous allons désormais
nous connecter à un serveur réel.

Pour cela nous allons utiliser le serveur [json server][json-server]. Cet outil permet de mettre en place très rapidement un serveur REST
(CRUD) à des fins de prototypage ou de tests. 

En revanche, il est peu configurable et cet exercice nous obligera à personnaliser le comportement d'[Ember Data][ember-data].

<div class="work no-answer">
  {% capture m %}

1. Mettre en place un serveur [json server](https://github.com/typicode/json-server)
   * Installer [json server](https://github.com/typicode/json-server)

     ```console
     $ npm install -g json-server
     ```
   
   * Copier le contenu suivant dans un fichier ``db.json`` à la racine du projet

     ```javascript
     {
       "comics": [
         {
           "id": 1,
           "slug": "blacksad",
           "title": "Blacksad",
           "scriptwriter": "Juan Diaz Canales",
           "illustrator": "Juanjo Guarnido",
           "publisher": "Dargaud",
           "albums": [1, 2, 3, 4, 5]
         },
         {
           "id": 2,
           "slug": "calvin-and-hobbes",
           "title": "Calvin and Hobbes",
           "scriptwriter": "Bill Watterson",
           "illustrator": "Bill Watterson",
           "publisher": "Andrews McMeel Publishing"
         },
         {
           "id": 3,
           "slug": "akira",
           "title": "Akira",
           "scriptwriter": "Katsuhiro Otomo",
           "illustrator": "Katsuhiro Otomo",
           "publisher": "Epic Comics"
         }
       ],
       "albums": [
         {
           "id": 1,
           "title": "Somewhere Within the Shadows",
           "publicationDate": "2000-11-01",
           "number": 1,
           "coverName": "blacksad-1.jpg",
           "comicId": 1
         },
         {
           "id": 2,
           "title": "Arctic-Nation",
           "publicationDate": "2003-04-01",
           "number": 2,
           "coverName": "blacksad-2.jpg",
           "comicId": 1
         },
         {
           "id": 3,
           "title": "Red Soul",
           "publicationDate": "2005-11-01",
           "number": 3,
           "coverName": "blacksad-3.jpg",
           "comicId": 1
         },
         {
           "id": 4,
           "title": "A Silent Hell",
           "publicationDate": "2010-09-01",
           "number": 4,
           "coverName": "blacksad-4.jpg",
           "comicId": 1
         },
         {
           "id": 5,
           "title": "Amarillo",
           "publicationDate": "2013-11-01",
           "number": 5,
           "coverName": "blacksad-5.jpg",
           "comicId": 1
         }
       ]
     }
     ```
   
  * Lancer le serveur
  
    ```console
    $ json-server --watch db.json
     
      \{^_^}/ hi!
     
      Loading db.json
      Done
     
      Resources
      http://localhost:3000/comics
      http://localhost:3000/albums
     
      Home
      http://localhost:3000
     
      Type s + enter at any time to create a snapshot of the database
      Watching...
    ```
     
1. Comme nous n'avons désormais plus besoin de [Ember Mirage](http://www.ember-cli-mirage.com/) pour le développement mais souhaitons le conserver pour les tests, on le désactive
   dans le fichier ``config/environment.js`` :
   
   ```javascript
   module.exports = function(environment) {
     ...
   
     if (environment === 'development') {
       ...
   
       ENV['ember-cli-mirage'] = {
         enabled: false
       };
     }
     
     ...
   
     return ENV;
   };
   ```
   
   NB : On aurait pu aussi utiliser la fonction [passthrough](http://www.ember-cli-mirage.com/docs/v0.2.x/configuration/#passthrough) d'[Ember Mirage](http://www.ember-cli-mirage.com/)
   qui permet de laisser passer tout ou partie des requêtes mais on aurait dans ce cas continué à utiliser [Ember Mirage](http://www.ember-cli-mirage.com/) comme "passe plat", ce que l'on ne 
   souhaite pas.
   
  {% endcapture %}{{ m | markdownify }}
</div>

On dispose désormais à l'adresse ``http://localhost:3000`` d'un serveur REST simple mais opérationnel autorisant ``GET``, ``PUT``, ``POST``, ``DELETE`` ainsi que 
différentes options pour les différents modèles définis dans le fichier ``db.json``.

Cependant, l'application affiche une erreur puisque les requêtes ne sont pas résolues. En effet, en l'absence d'instructions complémentaires,
[Ember Data][ember-data] effectue ses requêtes sur lui-même (``http://localhost:4200``) ce qui, évidemment, renvoie une erreur :

```console
> GET http://localhost:4200/comics 404 (Not Found)
```

Nous allons donc devoir configurer notre application pour s'adapter à ce nouveau serveur au moyen de différents outils.

## Adapters

Les adapters définissent la façon dont [Ember Data][ember-data] communique avec le serveur : nom de l'hôte, structure des URLs, headers, codes de retour, etc.

[Ember Data][ember-data] fournit en standard deux *adapters* complets : [RESTAdapter](http://emberjs.com/api/data/classes/DS.RESTAdapter.html) et 
[JSONAPIAdapter](http://emberjs.com/api/data/classes/DS.JSONAPIAdapter.html). C'est ce dernier, implémentant la norme [JSON API](http://jsonapi.org/) qui est utilisé par défaut.
Le premier propose la communication avec une API REST non JSON API. Ces deux adapters étendent un même objet de base, [Adapter](http://emberjs.com/api/data/classes/DS.Adapter.html).

La configuration / personalisation de la communication nécessite donc de proposer un *adapter* personnalisé, étendant au minimum [Adapter](http://emberjs.com/api/data/classes/DS.Adapter.html) ou,
plus probablement, [RESTAdapter](http://emberjs.com/api/data/classes/DS.RESTAdapter.html) ou [JSONAPIAdapter](http://emberjs.com/api/data/classes/DS.JSONAPIAdapter.html).

Cela se fait en fournissant un adapter personnalisé ``app/adapters/application.js`` :

```javascript
// app/adapters/application.js
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  // custom props or methods
});
```

Il est alors possible de fournir des valeurs particulières à des propriétés de l'*adapter*. Les propriétés sont définies dans les classes de base. Il peut s'agir de la configuration de l'hôte (``host``),
du namespace de l'API (``namespace``), des headers (``headers``), etc. Il est également possible (et fréquent) de proposer des implémentations spécifiques pour certaines méthodes. En effet, un 
*adapter* propose de nombreuses méthodes permettant de retrouver un objet(``findRecord``), une collection(``findMany``), une relation(``findBelongsTo`` ou ``findHasMany``), etc. Les surcharger
permet de traiter les problématiques spécifiques d'une API.

Fournir un *adapter* au niveau application dans ``app/adapters/application.js`` permet donc de redéfinir le comportement pour toute l'application. Mais il est également possible de ne redéfinir un adapter
que pour un model en particulier, exactement de la même façon : 

```javascript
// app/adapters/user.js
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  // custom props or methods
});
```

Attention, dans ce cas, il est probable que vous souhaitiez que cet *adapter* particulier hérite de la configuration et des comportements de l'*adapter*
général (``app/adapters/application.js``). Auquel cas, la syntaxe est la suivante : 

```javascript
// app/adapters/user.js
import BaseAdapter from './application';

export default BaseAdapter.extend({
  // custom props or methods
});
```

Pour la liste complète des propriétés / méthodes des *adapters*, se référer à [Adapter](http://emberjs.com/api/data/classes/DS.Adapter.html), 
[RESTAdapter](http://emberjs.com/api/data/classes/DS.RESTAdapter.html) ou
[JSONAPIAdapter](http://emberjs.com/api/data/classes/DS.JSONAPIAdapter.html) en fonction de l'*adapter* que l'on souhaite étendre.

## Serializers

En complément des *adapters*, les *serializers*, sont chargés des opérations de sérialisation / désérialisation entre objets json
- en provenance ou à destination du serveur - et les objets locaux [Ember Data][ember-data]. 

Tout comme pour les *adapters*, [Ember Data][ember-data] propose en standard deux *serializers* complets : 
[RESTSerializer](http://emberjs.com/api/data/classes/DS.RESTSerializer.html) et 
[JSONAPISerializer](http://emberjs.com/api/data/classes/DS.JSONAPISerializer.html) qui étendent un même *serializer* de base 
[JSONSerializer](http://emberjs.com/api/data/classes/DS.JSONSerializer.html).

Les *serializers* permettent ainsi de nombreux points d'extension par surcharge ou extension de propriétés / méthodes. Il est ainsi
possible de redéfinir la clef primaire (``primaryKey``), le mapping de n'importe quel attribut (``keyForAttribute``), la récupération
des métadonnées (``extractMeta``) ainsi que de personnaliser toutes les méthodes de normalisation, c'est à dire de transformation 
d'une réponse JSON en objet [Ember Data][ember-data] via les méthodes ``normalize*``.

Il est possible de fournir un *serializer* général au niveau application : 

```javascript
// app/serializers/application.js
import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  // custom props or methods
});
```

... ou des *serializers* spécifiques pour chacun des modèles. C'est notamment à cet endroit que l'on pourra forcer la récupération de
*relations embarquées*. En effet, on a pu constater précédement que, par défaut, [Ember Data][ember-data] s'attend à ce que les relations
d'une ressource soit exposées par le serveur sous la forme d'identifiants simples. Charge à lui ensuite d'effectuer les requêtes
complémentaires nécessaires. Si l'API serveur expose à la place les relations emarquées, il est nécessaire de fournir un
*serializer* spécifique pour ce model :

```javascript
// app/serializers/post.js
import BaseSerializer from './application';
import EmbeddedRecordsMixin from 'ember-data/serializers/embedded-records-mixin';

export default BaseSerializer.extend(EmbeddedRecordsMixin, {
  attrs: {
    comments: { embedded: 'always' }
  }
}););
```

En réalité, ``comments: { embedded: 'always' }`` est un raccourci pour 

```javascript
comments: {
  serialize: 'records',
  deserialize: 'records'
}
```

Cela signifie qu'[Ember Data][ember-data] doit s'attendre à des ``comments`` embarqués dans le ``parent`` mais qu'il doit également les envoyer
embarqués au serveur lors d'une modification.

Si l'on avait utilisé, en revanche : 

```javascript
comments: {
  serialize: 'ids',
  deserialize: 'ids'
}
```

[Ember Data][ember-data] s'attendrait à récupérer et à envoyer des identifiants.

En mixant ces valeurs, on peut ajuster finement la manière dont les relations sont reçues et envoyées.

Pour la liste complète des propriétés / méthodes des adapters, se référer à [JSONSerializer](http://emberjs.com/api/data/classes/DS.JSONSerializer.html), 
[RESTSerializer](http://emberjs.com/api/data/classes/DS.RESTSerializer.html) ou
[JSONAPISerializer](http://emberjs.com/api/data/classes/DS.JSONAPISerializer.html) en fonction de l'*adapter* que l'on souhaite étendre.

<div class="work answer">
  {% capture m %}

1. Connecter le serveur
   * [json server](https://github.com/typicode/json-server) n'implémente pas la norme JSON API mais respecte en grande partie les conventions du [RESTAdapter](http://emberjs.com/api/data/classes/DS.RESTAdapter.html)
   * Changer l'hôte pour ``http://localhost:3000``

     > ```javascript
     > // app/adapters/application.js
     >
     > import DS from 'ember-data';
     > 
     > export default DS.RESTAdapter.extend({
     >   host: 'http://localhost:3000'
     > });
     > ```
   
   * Lorsqu'on accède à l'application, on constate que celle-ci n'affiche pas les comics et que la console affiche les warnings suivants :
   
     ```console
     WARNING: Encountered "0" in payload, but no model was found for model name "0" (resolved model name using ember-training@serializer:-rest:.modelNameFromPayloadKey("0"))
     WARNING: Encountered "1" in payload, but no model was found for model name "1" (resolved model name using ember-training@serializer:-rest:.modelNameFromPayloadKey("1"))
     WARNING: Encountered "2" in payload, but no model was found for model name "2" (resolved model name using ember-training@serializer:-rest:.modelNameFromPayloadKey("2"))
     ``` 
     
     En effet, le serveur renvoie les comics directement dans un tableau JSON :
     
     ```javascript
     [
       {
         "id": 1,
         "title": "Blacksad",
         ...
       },
       {
         "id": 2,
         "title": "Calvin and Hobbes",
         ...
       },
       {
         "id": 3,
         "title": "Akira",
         ...
       }
     ]
     ```
     
     alors que le [RESTAdapter](http://emberjs.com/api/data/classes/DS.RESTAdapter.html) s'attend à ce que le résultat soit encapsulé
     dans un hash ``comics`` : 
     
     ```javascript
     {
       "comics": [
         {
           "id": 1,
           "title": "Blacksad",
           ...
         },
         {
           "id": 2,
           "title": "Calvin and Hobbes",
           ...
         },
         {
           "id": 3,
           "title": "Akira",
           ...
         }
       ]
     }
     ```
     
1. Fournir un *serializer* personnalisé pour permettre à [Ember Data](https://guides.emberjs.com/v2.10.0/models/) de comprendre la réponse du serveur lors de l'accès à ``http://localhost:4200/comics``
   * Trouver la méthode ``normalize*`` qui convient et l'étendre pour encapsuler le résultat dans un hash correspondant au type requêté.
   * Cette méthode doit fonctionner pour tous les modèles (pas seulement pour ``comics``)
   
     > ```javascript
     > // app/serializers/application.js
     > 
     > import DS from 'ember-data';
     > 
     > export default DS.RESTSerializer.extend({
     > 
     >   normalizeArrayResponse(store, primaryModelClass, hash, id, requestType) {
     >     let newHash = {};
     >     newHash[primaryModelClass.modelName] = hash;
     >     return this._super(store, primaryModelClass, newHash, id, requestType);
     >   }
     > });
     > ```
     
1. Effectuer le même genre d'opération pour que l'application comprenne la réponse lors de l'accès à ``http://localhost:4200/comics/blacksad``
   puisque, là aussi, l'application est en erreur
   
   > ```javascript
   > // app/serializers/application.js
   > 
   > import DS from 'ember-data';
   > 
   > export default DS.RESTSerializer.extend({
   > 
   >   normalizeArrayResponse(store, primaryModelClass, hash, id, requestType) {
   >     ...
   >   },
   >
   >   normalizeSingleResponse(store, primaryModelClass, hash, id, requestType) {
   >     let newHash = {};
   >     newHash[primaryModelClass.modelName] = hash;
   >     return this._super(store, primaryModelClass, newHash, id, requestType);
   >   }
   > });
   > ```
   
1. En inspectant les requêtes réseau, on observe qu'une fois le comic récupéré, l'application effectue autant de requêtes complémentaires
   qu'il est associé d'albums à ce comic.
   * Modifier la configuration pour que l'application récupère les albums en une seule requête en utilisant l'une des propriétés du
     [RESTAdapter](http://emberjs.com/api/data/classes/DS.RESTAdapter.html).
     
     > ```javascript
     > // app/adapters/application.js
     > 
     > import DS from 'ember-data';
     > 
     > export default DS.RESTAdapter.extend({
     >   host: 'http://localhost:3000',
     >   coalesceFindRequests: true
     > });
     > ```
     
     On constate que la récupération des albums se fait désormais via une seule requête ``http://localhost:3000/albums?ids[]=1&ids[]=2&ids[]=3&ids[]=4&ids[]=5``
   
1. On souhaite désormais récupérer les albums embarqués lorsque l'on récupère un comic
   * Pour cela, il est nécessaire de passer le paramètre de requête ``_embed=albums`` au serveur. Soit ``http://localhost:3000/comics?slug=blacksad&_embed=albums``
   * Configurer l'application pour faire en sorte qu'[Ember Data](https://guides.emberjs.com/v2.10.0/models/) ajoute ce paramètre à la requête, dans le cas
     spécifique du model `comic`. 
   * Attention à étendre les bons objets de manière à continuer à bénéficier des personnalisations précédentes
   * Configurer l'application pour qu'[Ember Data](https://guides.emberjs.com/v2.10.0/models/) récupère les albums comme des relations embarquées du modèle ``comic``
   * Attention ! On souhaite récupérer les albums embarqués mais n'envoyer au serveur des identifiants lors d'une modification. En effet, dans le cas contraire,
     les albums seraient définitivement enregistrés dans le json du comic lui-même, ce que l'on ne souhaite pas.
   
     > ```javascript
     > // app/adapters/comic.js
     >
     > import BaseAdapter from './application'
     > 
     > export default BaseAdapter.extend({
     > 
     >   urlForQueryRecord(query, modelName) {
     >     return this._buildURL(modelName) + "?_embed=albums";
     >   }
     > });
     > ```
     >
     > ```javascript
     > // app/serializers/comic.js
     >
     > import DS from 'ember-data';
     > import BaseSerializer from './application';
     > 
     > export default BaseSerializer.extend(DS.EmbeddedRecordsMixin, {
     >   attrs: {
     >     albums: {
     >       serialize: 'ids',
     >       deserialize: 'records'
     >     }
     >   }
     > });
     >
     > ```
     >
     > Si l'on avait utilisé la notation ``embedded: always``, les albums auraient aussi été inclus entièrement dans la requête de modification.
     
1. Retourner à la racine de l'application ``http://localhost:4200/comics`` puis sélectionner ``blacksad``
   
   On constate que les albums ne sont plus chargés. En effet, on a indiqué grâce à la méthode ``urlForQueryRecord`` que l'on souhaitait les embarquer
   lors d'une requête unitaire. Or, lorsqu'on passe par la route ``comics``, on utilise la méthode ``findAll``. Lorsque l'on sélectionne ensuite un
   comic, [Ember Data](https://guides.emberjs.com/v2.10.0/models/) détecte que l'on a déjà chargé le modèle, n'éxécute pas le *hook* ``model`` ni
   la méthode ``queryRecord``. Or la méthode ``findAll`` n'appelle pas la méthode serveur qui embarque les albums.
    
   * Modifier l'adapter pour embarquer aussi les albums lors d'un ``findAll``
   
     > ```javascript
     > import BaseAdapter from './application';
     > 
     > export default BaseAdapter.extend({
     > 
     >   urlForQueryRecord(query, modelName) {
     >     return this._buildURL(modelName) + "?_embed=albums";
     >   },
     > 
     >   urlForFindAll(modelName, snapshot) {
     >     return this._buildURL(modelName) + "?_embed=albums";
     >   }
     > });
     > ```

  1. Enfin, un dernier warning doit apparaître dû au fait que la méthode [Ember Data](https://guides.emberjs.com/v2.10.0/models/) `queryRecord` attend un 
     objet en réponse et non un tableau d'un seul élément, comme renvoyé par la nouvelle API.

     On pourrait aisément modifier le hook `model` de la route `comic` pour traiter "manuellement ce cas" :

     ```javascript
     // app/routes/comic.js

     ...

       model (params) {
         return this.store.query('comic', {slug: params.comic_slug}).then(comics => comics.get('firstObject'));
       },

     ...
     
     ```

     Cependant, cette approche introduirait dans le code même de l'application une dépendance au format spécifique et non standard de l'API backend et nous
     obligerait en outre à effectuer ce traitement chaque fois que l'on récupère un `comic` seul dans toute notre application. Il est donc plus judicieux
     d'effectuer cette opération une fois pour toute au niveau des serializers.

     * Modifier le serializer correspondant pour transformer la réponse reçue dans le cas d'un `comic` seul

       > ```javascript
       > // app/serializers/comic.js 
       >
       > import DS from 'ember-data';
       > import BaseSerializer from './application';
       > import {isEmberArray as isArray } from 'ember-array/utils';
       > 
       > export default BaseSerializer.extend(DS.EmbeddedRecordsMixin, {
       >   attrs: {
       >     ...
       >   },
       > 
       >   normalizeSingleResponse(store, primaryModelClass, hash, id, requestType) {
       >     let newHash = hash;
       >     if (hash && isArray(hash)) {
       >       newHash = hash[0];
       >     } 
       >     return this._super(store, primaryModelClass, newHash, id, requestType);
       >   }
       > });
       > ```

  {% endcapture %}{{ m | markdownify }}
</div>

[ember]: http://emberjs.com/
[ember-data]: https://guides.emberjs.com/v2.10.0/models/
[ember-mirage]: http://www.ember-cli-mirage.com/
[json-server]: https://github.com/typicode/json-server