---
layout: ember-training
title: Formation Ember - Testing
permalink:  ember/training/testing/
prev: ember/training/backend
---

<div id="toc"></div>

La testabilité des applications a toujours été une préoccupation importante des équipes [Ember][ember] tant au niveau des choix de conception
qu'au niveau de l'outillage. En règle générale, les tests et la testabilité d'une application constitunte des enjeux majeurs et parfois complexes à 
maîtriser. Les aspects dynamiques des applications web, la nature asycnhrone des évènements, les opérations de rendu, la *Run Loop*, etc. peuvent
parfois poser certaines difficulté dans la construction de tests fiables.

Pour ces raisons, [Ember][ember] embarque un certain nombre d'outils permettant d'aider à la construction des tests en résolvant pour nous de 
nombreuses problématiques. L'outillage d'[Ember][ember] en matières de tests s'appuie sur le framework [Qunit](http://qunitjs.com/) qu'il
enrichit avec de nombreux *helpers*.

Au sein d'une application [Ember][ember], les tests prennent place dans le répertoire ``tests`` et peuvent être lancés via la commande

```console
ember test [--server]
```

La commande simple lance l'ensemble des tests une fois. L'option ``--server`` permet de le lancer automatiquement à chaque modification et ce, pour
différents navigateurs grâce au runner [Testem](https://github.com/airportyh/testem).

Trois grandes catégories de tests sont adressées au travers de ces outils :

## Tests d'acceptance

Les tests d'acceptances sont définis dans ``tests/acceptance``.

Ces tests permettent d'évaluer le comportement de l'application dans son ensemble. L'environnement d'exécution des tests d'acceptance correspond à
celui d'une application entière, initialisée, démarrée puis nettoyée et arrétée pour chaque module.
 
Ces tests d'acceptances permettent donc de naviguer entre les différents URLs de l'application, de tester l'enchaînement des routes, le comportement
des différents composants entre eux au sein de l'environnement globale de l'application, l'intégration des addons, etc. A ce niveau, les éléments testés
sont réputés fonctionner correctement d'un point de vue unitaire. On s'attache alors à tester leurs interractions avec les autres élements de
l'application : actions, évènements, transitions, etc.

L'exemple ci-dessous reprend l'un des tests d'acceptance de l'application exemple. On cherche ici à vérifier que le processus de sauvegarde fonctionne
correctement une fois que l'utilisateur a modifié un comic et cliqué sur ``submit`` :

```javascript
test("03 - Controller - 01 - Should save on edit submit", function (assert) {
  assert.expect(4);

  visit('/comics/akira/edit').then(function () {
    let $selectedComic = find(".selected-comic");
    assert.equal($selectedComic.length, 1, "Current selected comics zone is displayed");

    let $form = $selectedComic.find("form");
    assert.equal($form.length, 1, "Comic form exists");

    let newTitle = "new value";
    fillIn(".selected-comic form #title", newTitle);
    click(".selected-comic form .btn-submit");
    andThen(function() {
      assert.equal(currentRouteName(), 'comic.index', "Route name is correct");
      assert.ok(find(".selected-comic h3").text().indexOf(newTitle) >= 0, "Title modified");
    });
  });
});
```

On teste donc la modification du formulaire puis, surtout, le comportement de l'application suite à la soumission du formulaire : redirection
vers une nouvelle page et modification effective du titre.

Ces opérations sont grandement facilitées par les *helpers* proposés par [Ember][ember], c'est à dire l'ensemble des fonctions permettant de : 

* simuler le comportement d'un utilisateur : ``visit()``, ``click()``, ``fillIn``
* de gérer les aspects asynchrones : ``andThen()``
* d'accéder à l'état de l'application : ``find()``, ``currentRouteName()``

L'utilisation de ces fonction est rendu possible par l'utilisation du *helper* [Ember][ember] ``moduleForAcceptance`` en lieu et place d'un module 
standard [Qunit](http://qunitjs.com/) :

```javascript
import moduleForAcceptance from '../helpers/module-for-acceptance';

moduleForAcceptance('03 - Controller Acceptance Tests', {
  beforeEach() {
    ...
  }
});
```

Ce module se charge en effet d'initialiser complètement l'application [Ember][ember] et de la démarrer ainsi que de la nettoyer complètement
à la fin du test. Des *hooks* d'extension sont proposés afin de permettre l'ajout d'opérations d'initialisation / destruction personnalisées
(via ``beforeEach`` et ``afterEach``).

De plus amples détails sont données sur les tests d'acceptance et les *helpers* proposés dans la 
[documentation officielle](https://guides.emberjs.com/v2.5.0/testing/acceptance/).

## Tests unitaires

Les tests unitaires sont définis dans ``tests/unit``.

Comme partout ailleurs, les tests unitaires permettent de valider finement le fonctionnement d'un objet, quel qu'il soit : entrées / sorties,
méthodes, comportement, etc. Dans le cas spécifique d'objets [Ember][ember] ils permettent également de contrôler le calcul des propriétés calculées 
et le déclenchement des *observers*.

L'exemple ci-dessous reprend l'un des tests unitaire de l'application exemple. Le test en question cherche à vérifier le comportement des fonctions
de filtre do contrôleur ``comics`` lorsque la veleur de filtre est mise à jour. On teste ici uniquement le comportement interne du contrôleur : 
calcul des propriétés calculées notamment :

```javascript
test('should correctly compute filteredComics on filter update', function(assert) {
  const controller = this.subject();
  const model = [Ember.Object.create({title: "Akira"}), Ember.Object.create({title: "Blacksad"})];
  controller.set('model', model);
  controller.set('filter', "");

  assert.equal(controller.get('filteredComics').length, 2);

  controller.set('filter', "kira");
  assert.equal(controller.get('filteredComics').length, 1);
  assert.equal(controller.get('filteredComics').get(0).get('title'), "Akira");

  controller.set('filter', "bla");
  assert.equal(controller.get('filteredComics').length, 1);
  assert.equal(controller.get('filteredComics').get(0).get('title'), "Blacksad");
});
```

[Ember][ember] apporte également son aide ici, notamment via la function ``this.subject()`` qui permet de récupérer une instance
de l'élément que l'on souhaite tester parfaitement initialisée. Ici le contrôleur ``comics``. Ces tâches d'itnitialisation et de 
destruction sont prises en charge notamment par le *helpers* [Ember][ember] ``moduleFor`` utilisé à la place d'un module 
standard [Qunit](http://qunitjs.com/) :

```javascript
import Ember from "ember";
import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:comics', 'Unit | Controller | comics', {
  unit: true;
});
```

De plus amples détails sont données sur les tests unitaire dans la 
[documentation officielle](https://guides.emberjs.com/v2.5.0/testing/unit-testing-basics/).

## Tests d'intégration

Les tests d'intégration sont définis dans ``tests/integration``.

A mi chemin entre les tests d'acceptance et les tests unitaires, les tests d'intégrations permettent de valider le comportement d'un
élement au sein d'un environnement d'exécution simplifié. Ils sont principalement utilisés pour tester l'affichage et le comportement
des composants. Y compris en termes d'évènements, d'actions, etc. A ce titre il ne peux s'agir de tests unitaires mais ils n'ont pas non plus
besoin de l'exécution de l'appliaction dans sa totalité.

L'exemple ci-dessous reprend l'un des tests unitaire de l'application exemple. Ce test effectue lui-même le rendu du composant et vérifie qu'il est 
correct. Puis il modifie l'une des valeurs du modèle et vérifie que le composant se met correctement à jour :

```javascript
test('update fav-btn after external change', function(assert) {

  akira.set('isFavorite', false);
  this.set('model', akira);

  this.render(hbs`{{fav-btn selected=model.isFavorite}}`);

  assert.equal(this.$().find('.btn-fav.selected').length, 0);

  Ember.run(() => {
    akira.set('isFavorite', true);
  });

  assert.equal(this.$().find('.btn-fav.selected').length, 1);
});
```

On note l'utilisation nécessaire de ``Ember.run()``. En effet, puisqu'il s'agit d'un test d'intégration, les différentes opérations sont effectuées 
en dehors de la *runloop* [Ember][ember]. Il est donc nécessaire d'invoquer explicitement ``run`` de manière à rendre le changement de valeur du modèle
effectif.

L'utilisation la plus courante des etsts d'intégration concerne les composants et passe par l'utilisation du *helper* ``moduleForComponent`` : 

```javascript
moduleForComponent('fav-btn', 'Integration | Component | fav btn', {
  integration: true
});
```

## Configuration

Lors de l'exécution de l'ensemble de ces tests, la configuration active est celle des tests définie dans le fichier ``config/environment.js`` :

```javascript
if (environment === 'test') {
...
}
```

En cas de besoin, il est possible de détecter dans le code de l'application si celle-ci est exécutée dans un environnement de tests ou non. Cela se
fait grâce à la variable ``Ember.testing`` accessible partout. Si une valeur particulière de la configuration est nécessaire, il est également
possible d'importer l'ensemble des options de configuration : 

```javascript
import DS from 'ember-data';
import config from '../config/environment';

export default DS.RESTAdapter.extend({
  host: config.host,
  coalesceFindRequests: true
});
```

Ces usages sont principalment utilisés pour adapter les comportement des adapters / serializers qui sont rarement totalement identiques en fonction
des environnements d'exécution.

La documentation d'[Ember][ember] propose de nombreux éléments complémentaires utilises à la rédaction de tests spécifiques pour :

* les [routes](https://guides.emberjs.com/v2.5.0/testing/testing-routes/)
* les [contrôleurs](https://guides.emberjs.com/v2.5.0/testing/testing-controllers/)
* les [composants](https://guides.emberjs.com/v2.5.0/testing/testing-components/)
* les [modèles](https://guides.emberjs.com/v2.5.0/testing/testing-models/)

<div class="work answer">
  {% capture m %}
  
Depuis l'ajout d'[Ember Data](https://guides.emberjs.com/v2.5.0/models/), les tests ne passent plus, conséquence des nombreux changements
effectués. Nous allons les adapter pour le faire passer de nouveau (sauf les tests d'acceptance des templates qui peuvent être supprimés)
    
1. En premier lieu, nous devons configurer notre adapter pour qu'il s'adapte aussi bien à l'environement de développement qu'à celui de test
   * Modifier ``config/environment.js`` pour lui configurer l'adresse du serveur dans l'environement de développement :
     
     ```javascript
     if (environment === 'development') {
         ...
     
         ENV['ember-cli-mirage'] = {
           enabled: false
         };
         ENV.host =  'http://localhost:3000';
       }
     ```
     
   * Modifier ensuite l'adapter ``app/adapters/application.js`` pour positionner cette variable et non l'URL de développement en dur :
    
     ```javascript
     import DS from 'ember-data';
     import config from '../config/environment';
     
     export default DS.RESTAdapter.extend({
       host: config.host,
       coalesceFindRequests: true
     });
     ```
     
   De cette manière, l'adapter ira chercher l'hôte dans la liste des configuration pour l'environnement courant. Seule la valeur pour l'environement
   de développement étant définie, les tests se baseront sur la valeur par défaut ``http://localhost:4200``. il aurait été aussi également possible
   de configurer spécifiquement mirage pour intercepter les requêtes à ``http://localhost:3000``.
   
1. Nous devons ensuite configurer les ``Serializers``
   * En premier lieu, on change le *serializer* de mirage en ``RestSerializer`` pour rester plus proche du fonctionnement en développement.
   
     ```javascript
     // mirage/serializers/application.js
     
     import { RestSerializer } from 'ember-cli-mirage';
     
     export default RestSerializer.extend({
     });
     ```
     
   * On adapte ensuite celui de l'application afin que les modifications effectuées ne soient pas appliquées lors de tests : 
   
     ```javascript
     // app/serializers/application.js
     
     import Ember from 'ember';
     import DS from 'ember-data';
     
     export default Ember.testing ? DS.RESTSerializer : DS.RESTSerializer.extend({
         serializeIntoHash(hash, typeClass, snapshot, options) {
           Ember.assign(hash, this.serialize(snapshot, options));
         },
     
         normalizeSingleResponse(store, primaryModelClass, hash, id, requestType) {
           let newHash = {};
     
           if (!hash[primaryModelClass.modelName]) {
             newHash[primaryModelClass.modelName] = hash;
           } else {
             newHash = hash;
           }
     
           return this._super(store, primaryModelClass, newHash, id, requestType);
         },
     
         normalizeArrayResponse(store, primaryModelClass, hash, id, requestType) {
           let newHash = {};
           newHash[primaryModelClass.modelName] = hash;
           return this._super(store, primaryModelClass, newHash, id, requestType);
         }
     });
     ```
   
   * et on modifie la configuration mirage pour adapter les réponses au RestSerializer:
   
     ```javascript
     this.get('/comics', ({comic}, request) => {
       let slug = request.queryParams.slug;
     
       if (slug) {
         let foundComic = comic.where({title: slug.classify()})[0];
         if (foundComic) {
           return {comic: serializer.serialize(foundComic, request)};
         } else {
           return new Mirage.Response(404, {}, "No comic found with slug: " + slug);
         }
     
       } else {
         return serializer.serialize(comic.all(), request);
       }
     });
     ```
     
1. Modifier enfin les tests de manière à les corriger. Le test ``tests/unit/routes/comic-test`` peut être supprimé pusique nous délégons toute
   la logique à [Ember Data](https://guides.emberjs.com/v2.5.0/models/)
   
   > L'ensemble des tests corrigés peut être trouvé sur le [repo github](https://github.com/bmeurant/ember-training/blob/controllers-tests/tests).
  
  {% endcapture %}{{ m | markdownify }}
</div>

[ember]: http://emberjs.com/
[ember-data]: https://guides.emberjs.com/v2.5.0/models/
[ember-mirage]: http://www.ember-cli-mirage.com/
[json-server]: https://github.com/typicode/json-server