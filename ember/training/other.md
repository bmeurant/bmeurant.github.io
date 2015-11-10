## Namespaces

{% raw %}

Comme on a pu le constater, au sein d'une application [Ember][ember], les routes sont référencées par leur nom qualifié.
Celui-ci se calcule en accolant les noms de l'ensemble des routes mères puis du nom de la route fille. Le tout séparés 
par des ``.``.

Ainsi la route définie de cette manière ...

```javascript
// app/router.js
...
Router.map(function() {
  this.route('mere', function() {
    this.route('fille');
  });
});
```

... sera référençable par le qualifieur ``mere.fille``. Par exemple :
 
* dans un ``link-to`` : ``{{link-to "Titre route fille" "mere.fille"}}`` 
* lors de l'appel d'un ``transitionTo`` : ``this.transitionTo('mere.fille');``

Chaque niveau de route imbriquée est donc ajouté devant le nom de la route elle-même. Cela permet d'éviter les 
collisions de nommage. Cependant, il peut s'avérer nécessaire ou préférable de conserver un nom court. Cela est
possible en précisant que l'on souhaite réinitialiser le ``namespace`` via l'option ``resetNamespace`` dans le 
routeur : 

```javascript
// app/router.js
...
Router.map(function() {
  this.route('mere', function() {
    this.route('fille', {resetNamespace: true});
  });
});
```

{% endraw %}

<div class="work">
  {% capture m %}
  {% raw %}
  
1. Modifier la route ``comics.comic`` pour la nommer ``comic``
   * Mettre à jour tous les endroits de l'application ou cette route est référencée
    
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


## Plan

### Actions / Routes

création -> Route & actions + perso url
    save, cancel, willtransition
Edition -> perso route pour renderTemplate create

### Actions / Controllers

Filtering et sorting list
tranformation btn creer par input titre + bouton -> descativation btn si vide et sinon on bascule sur creér avec titre
actions avancées créer liste
actions target form mandatory

### Components

Validation formulaire ?
like component

### Persistence / Ember Data

Extraction model, création "store" et injection dans routes (au passage brief injections)
Ember-data, store, relations, etc.

### Tests

acceptance et unitaire

### Adv. Tpl

partials sur albums, render, etc.

### Backend

Serveur API -> REST Adapter

### Adv. Routing

Query params sur filtering et sorting comics

### Déploiement

gest environnements, asset pipeline, etc.
