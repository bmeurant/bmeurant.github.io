---
layout: ember-training
title: Formation Ember - Actions & Contrôleurs
permalink:  ember/training/actions-controllers/
prev: ember/training/routing
next: ember/training/controllers
---

<div id="toc"></div>

Les contrôleurs [Ember][ember] se limitent à deux responsabilités :

* maintenir l'état de l'application en fonction de la route courante en s'appuyant sur leur propriétés propres. Cet état
  (contexte) composé de ces propriétés ainsi que du ou des modèles récupéré(s) depuis la route sont mis à disposition
  du template.
* déclarer et implémenter des méthodes de traitement des actions et des évènements issus de la manipulation du template
  (et donc du DOM) par l'utilisateur.

La fonction des contrôleurs est donc très limitée et se réduit de plus en plus. Les futurs versions d'[Ember][ember] verront
disparaître les contrôleurs au profit de composants dès lors que ceux-ci seront routables ce qui n'est pas encore le cas (cf.
[RFC](https://github.com/ef4/rfcs/blob/routeable-components/active/0000-routeable-components.md)).

## Routes, Contrôleurs & Modèles

La route définit donc, comme vu au chapitre précédent, une méthode ``model`` permettant de retrouver le modèle. Le contrôleur stocke, 
quant à lui, dans une propriété ``model`` le résultat de cette méthode pour l'exposer au template.

L'initialisation de la propriété ``model`` du contrôleur à partir du résultat de la méthode ``model`` de la route, après résolution 
des éventuelles promesses par [Ember][ember], s'effectue de manière totalement automatique via la méthode 
[setupController](http://emberjs.com/api/classes/Ember.Route.html#method_setupController) de la route. 
``setupController`` est appelée lorsque la route ou le modèle change, après le *hook* ``afterModel``. 
et peut donc être surchargée de manière à provisionner, dans le contrôleur associé à la route, des 
éléments de contexte supplémentaires dépendant de la route courante et de ses éventuels segments dynamiques : 

```javascript
setupController: function (controller, model) {
  this._super(controller, model);
  // custom behaviour
}
```

L'accès au(x) contrôleur(s) au sein d'une route peut s'effectuer de différentes manières :

* via l'accès direct à la propriété [controller](http://emberjs.com/api/classes/Ember.Route.html#property_controller) 
définie et provisionnée par [Ember][ember] au sein de la route :

   ```javascript
   this.get('controller');
   ```
  
* via l'utilisation de la méthode [controllerFor()](http://emberjs.com/api/classes/Ember.Route.html#method_controllerFor) qui,
comme la méthode [modelFor](http://emberjs.com/api/classes/Ember.Route.html#method_modelFor) pour le modèle, permet d'accéder
au contrôleur associé à une route donnée :

   ```javascript
   this.controllerFor('mere.fille');
   this.controllerFor(this.routeName);
   ```

L'objet modèle peut donc être récupéré, manipulé et modifié, depuis le contrôleur, via l'accés à la propriété ``model`` et depuis la route,
en passant par le contrôleur :

```javascript
// controller
this.get('model');
this.set('model', newModel);
```

```javascript
// route
this.get('controller').get('model');
this.get('controller.model');
this.get('controller').set('model', newModel);
this.set('controller.model', newModel);
```

On remarque dans les exemples précédents, qu'[Ember][ember] permet de faciliter l'accès à des objets et propriétés imbriqués
via l'utilisation de la notation ``.`` en lieu et place de getters / setters chaînés. Cette syntaxe plus concise est à privilégier. 
Elle est utilisable pour tous les objets [Ember][ember].

{% raw %}

## Actions

En [Ember][ember], le déclenchement d'évènements s'effectue grâce aux **actions**. Celles-ci sont déclarées au sein des templates
et propagée au sein de l'application. L'action est donc traitée au niveau le plus bas où elle est interceptée : dans le composant, 
puis dans  le contrôleur et, enfin, au sein de la hiérarchie de routes, de bas en haut. Une erreur est logguée dans le cas ou 
aucun gestionnaire n'est trouvé.

### {{action}} *helper*

La déclaration d'une action s'effectue, au sein du template, par l'utilisation du *helper* ``{{action}}`` au sein d'un élément HTML,
d'un composant standard ou d'un composant personnalisé.

```html
<div {{action "save"}}>confirm</div>
<button {{action "save"}}>confirm</button>
{{input value="confirm" enter="save"}}
<input type="text" value="confirm" {{action "save"}} />
```

En fonction du type de composant, le déclenchement de l'action s'effectue lors de certains évènements uniquement. Par exemple, 
si l'on utilise le helper ``{{input}}``, celui-ci ne s'effectue qu'à la "validation" du champs. C'est à dire lorsque l'on appuie sur
``Entrée``. Pour les éléments HTML standard, il s'effectue au clic, ce qui explique que les comportements de ``{{input}}`` et 
de ``<input/>`` diffèrent.

### Traitement d'une action

Une action déclenchée dans le template doit donc être traitée, dans le composant, le contrôleur correspondant, ou encore 
dans une des routes actives. Quelque soit l'endroit de la déclaration du gestionnaire, celle-ci s'effectue de la manière suivante, 
nécessairement au sein du *hash* ``actions`` : 

```javascript
// route, controller, component
actions: {
  save() {
    // perform some operations
  }
}
```

Les gestionnaires d'actions définis dans le *hash* ``actions`` sont hérités depuis les routes parentes et complétés / surchargés
au sein de la route courante.

### Bubbling

Une fois créée et lancée, une action est automatiquement propagée de bas en haut au sein de la hiérarchie de routes jusqu'à 
trouver un gestionnaire qui traitera l'action et stoppera sa propagation.
     
Il est néanmoins possible de forcer cette propagation, suite à un premier traitement en renvoyant `true` dans le 
gestionnaire :
     
```javascript
// route, controller, component
actions: {
  save() {
    // perform some operations
    return true;
  }
}
```

### Paramètre

Il est possible de passer un paramètre à l'action qui sera déclenchée, de manière à pouvoir lire et utiliser ce paramètre
dans le gestionnaire. Ce paramètre peut être un litéral ou un objet.

```html
<div {{action "save" "value"}}>confirm</div>
<button {{action "save" model.id}}>confirm</button>
<input type="text" value="confirm" {{action "save" model}} />
```

On peut alors récupérer la valeur du paramètre dans l'action du crontrôleur ou de la route : 

```javascript
actions: {
  save (param) {
    // perform some operations
  }
}
```

{% endraw %}

<div class="work answer">
  {% capture m %}
  {% raw %}

1. Déclencher et intercepter l'action ``save`` au clic sur le bouton ``.btn-submit`` de manière à effectuer une simple transition
vers la route ``comic``
    * Définir dans le template ``comic.edit`` l'action 'save' comme déclenchée au clic sur le bouton ``.btn-submit``
    * Définir dans la route ``comic.edit`` la méthode d'interception de l'action 'save'
    
    **Test** : *Les modifications doivent permettre de rendre le test [03 - Controller - 01 - Should save on edit submit](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/03-controller-test.js#L87) passant.*
    
    **NB** : Il n'est pas nécessaire d'effectuer d'autre opération car les modifications effectuées onté déjà été répercutées automatiquement
    grâce au binding bidirectionnel.
    
       > ```html
       > {{!-- app/templates/comic/edit.hbs --}}
       > <form>
       >     <div class="buttons">
       >       <button type="submit" {{action 'save'}} class="btn-submit"></button>
       >       <button type="reset" class="btn-cancel"></button>
       >     </div>
       >     ...
       > </form>
       > ```
       > 
       > ```javascript
       > // app/routes/comic/edit.js
       >
       > import Ember from 'ember';
       > 
       > export default Ember.Route.extend({
       >   actions: {
       >     save () {
       >       this.transitionTo('comic');
       >     }
       >   }
       > });
       > ```

1. Déclencher et intercepter l'action ``cancel`` au clic sur le bouton ``.btn-cancel`` de manière à annuler les modifications
   effectuées sur le model courant puis effectuer une transition vers la route ``comic``
    * Comme on ne dispose pas d'un ``store`` avancé comme cela sera le cas avec [Ember Data](../ember-data), il est nécessaire 
    d'effectuer en premier lieu une copie du modèle initial de manière à pouvoir le réinitialiser par la suite. Dans quelle
    méthode doit-on effectuer cette copie préalable ?
    * De manière à réinitialiser proprement le modèle sans outil tel qu'[Ember Data](../ember-data), implémenter la méthode
    ``reset`` suivante dans ``app/model/comic.js`` :
    
       ```javascript
       ...
       
       reset(comic) {
         this.set('title', comic.get('title'));
         this.set('scriptwriter', comic.get('scriptwriter'));
         this.set('illustrator', comic.get('illustrator'));
         this.set('publisher', comic.get('publisher'));
       }
       ```
    * Réinitialiser le modèle en cas de ``cancel``
    
    **Test** : Les modifications doivent permettre de rendre passant le test [03 - Controller - 02 - Should cancel on edit reset](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/03-controller-test.js#L87)
    
      > ```html
      > {{!-- app/templates/comic/edit.hbs --}}
      > <form>
      >     <div class="buttons">
      >       <button type="submit" {{action 'save'}} class="btn-submit"></button>
      >       <button type="reset" {{action 'cancel'}} class="btn-cancel"></button>
      >     </div>
      >     ...
      > </form>
      > ```
      
      > ```javascript
      > // app/routes/comic/edit.js
      > 
      > import Ember from 'ember';
      > import Comic from 'ember-training/models/comic';
      > 
      > export default Ember.Route.extend({
      >   afterModel (model) {
      >     this.set('initialModel', Comic.create(model));
      >   },
      >   actions: {
      >     save () {
      >       this.transitionTo('comic');
      >     },
      >     cancel () {
      >       this.get('controller.model').reset(this.get('initialModel'));
      >       this.transitionTo('comic');
      >     }
      >   }
      > });
      > ```
      > 
      > La copie initiale du modèle se fait évidement dans le *hook* ``afterModel`` puisque c'est dans celui-là seulement
      > que l'on dispose du modèle initialisé. Cet objet est conservé dans une propriété ``initialModel``.
      >
      > La réinitialisation du modèle lui-même s'effectue en appelant la méthode ``reset`` avec le modèle conservé.
      > On note l'utilisation de la notation chaînée `.`
    
1. Intercepter et traiter les actions 'save' et 'cancel' pour la route `comics.create`
    * Rediriger vers la route ``comic.edit`` du nouveau comic suite à validation.
    * Nettoyer la liste de comics et rediriger vers la route ``comics`` suite à annulation. Utiliser pour cela la fonction
      [removeObject()](http://emberjs.com/api/classes/Ember.MutableArray.html#method_removeObject) de ``Ember.MutableArray``.
    * Transformer la propriété ``slug`` d'un ``Comic`` en **computed propety** de manière à ce que le *slug* corresponde à
      la valeur du titre transformée grâce à la fonction [dasherize()](http://emberjs.com/api/classes/Ember.String.html#method_dasherize) 
      et qu'il soit mis à jour à chaque modification du titre.
      
    **Test** : Les modifications doivent permettre de rendre passants les tests 
    [03 - Controller - 03 - Should save on create submit](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/03-controller-test.js#L87)
    et [03 - Controller - 04 - Should reinit list on edit reset](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/03-controller-test.js#L87)
      
    > ```javascript
    > // app/models/comic.js
    > 
    > import Ember from 'ember';
    > 
    > export default Ember.Object.extend({
    >   slug: function() {
    >     return this.get('title').dasherize();
    >   }.property('title'),
    >   title: '',
    >   scriptwriter: '',
    >   illustrator: '',
    >   publisher: '',
    >
    >   reset (comic) { ... }
    > });
    > ```
    > 
    > ```javascript
    > // app/routes/comics/create.js
    > 
    > import Ember from 'ember';
    > import Comic from 'ember-training/models/comic';
    > 
    > export default Ember.Route.extend({
    >   templateName: 'comic/edit',
    >
    >   model () {...},
    > 
    >   actions: {
    >     save () {
    >       this.transitionTo('comic', this.get('controller.model'));
    >     },
    >     cancel () {
    >       this.modelFor('comics').removeObject(this.get('controller.model'));
    >       this.transitionTo('comics');
    >     }
    >   }
    > });
    > ```
    > 
    > On note le passage du model à la route ``comic`` lors de la transition suite au ``save`` puisque celui-ci vient 
    > d'être créé et était inconnu.
      
  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>

{% raw %}

### Evènements DOM

Lorsque l'on déclare une action, il est également possible de préciser explicitement le type d'évènement DOM que l'on souhaite lier à l'action de la 
manière suivante : 

```html
<div {{action 'save' "value" on 'doubleClick'}}>confirm</div>
<button {{action 'save' model.id on 'mouseUp'}}>confirm</button>
{{input enter=(action 'save' model.id) value="confirm"}}
<input type="text" value="confirm" onclick={{action 'save' model}} />
```

* Les éléments html standards peuvent manipuler tout type d'évènement natif.
* Les {{action ... on ... }} peuvent gérer les évènements [décrits ici](http://emberjs.com/api/classes/Ember.View.html#toc_event-names).
* Les évènements gérés par le *helper*``{{input}}`` sont listés dans la [documentation](http://emberjs.com/api/classes/Ember.Templates.helpers.html#toc_actions).

On remarque au passage, concernant l'utilisation du *helper* ``{{input}}``, l'utilisation d'une **sous-expression** 
[Handlebars][handlebars] via la notation ``{{input ... (action ...)}}``. Cette notation permet l'imbrication
d'expressions au sein des *helpers*. 

### Types d'actions

Il existe en réalité aujourd'hui, pour des raisons historiques, deux types d'actions différentes pouvant être définies depuis
un template. Il s'agit des ``element space actions`` d'un côté dont le fonctionnement s'appuie intégralement sur le *bubbling* 
et des ``closure actions`` de l'autre qui doivent être intercéptées obligatoirement dans un contrôleur ou un composant 
et qui ne font pas intervenir de *bubbling* à ce niveau.

* les **element space actions** sont les actions historiques d'[Ember][ember]. 
     Elles interviennent lors de l'utilisation des syntaxes standard telles que :
     
     ```html
     <div {{action 'save' model}}>confirm</div>
     <div {{action 'save' model on 'mouseUp'}}>confirm</div>
     {{input enter='save' value="confirm"}}
     ```
     
     Ces actions peuvent être indifféremment intercéptées dans un contrôleur, un composant ou une route. 

* les **closure actions** constituent un nouveau types d'actions. 
     Elles interviennent lors de l'utilisation des syntaxes imbriquées ou précisant les évènements DOM telles que :
     
     ```html
     {{input enter=(action 'save' model.id) value="confirm"}}
     <input type="text" value="confirm" onclick={{action 'save' model}} />
     ```
  
     Entre le template et le contrôleur / composant, ces actions ne se propagent pas pas via *bubling* et doivent 
     impérativement être interceptées **dans un contrôleur ou un composant** et, éventuellement, propagées explicitement.

**NB:** Cette situation est problématique mais temporaire et les **closure actions** sont amenées à devenir le seul système de gestion des actions 
entre le template et le contrôleur / composant dans un avenir proche. Pour d'avantage de détails, se reporter à cette 
[RFC](https://github.com/mixonic/rfcs/blob/kebab/text/0000-kebab-actions.md).

{% endraw %}

### Propagation explicite des actions

Les composants, contrôleurs et routes permettent donc de définir et de propager explicitement des actions via la méthode 
[send(actionName, context)](http://emberjs.com/api/classes/Ember.Controller.html#method_send) dont ils héritent tous via le
[mixin Ember.ActionHandler](http://emberjs.com/api/classes/Ember.ActionHandler.html).

Cette méthode permet de propager une action de nom ``actionName`` associée éventuellement à un ``context`` (objet, litéral, fonction, etc.)
selon les mécanismes standards de *bubbling* décrits [plus haut](#bubbling). La recherche commence au sein 
même de l'objet courant et se propage en l'absence de gestionnaire local.

```javascript
this.send('save', model);
```

Dans le cas des **closure actions**, c'est cette méthode qu'il est nécessaire d'utiliser pour permettre, si nécessaire, 
la propagation de l'action et de son contexte depuis le contrôleur ou le composant vers la route. L'action ainsi créée 
suit alors les règles de propagation et de bubbling standard définies plus haut.

### Actions standards Ember

[Ember][ember] fournit un certain nombre d'actions natives propagées automatiquement et interceptables au sein des routes.
Le traitement de ecs actions se fait de la même manière que les actions vues précédement définies dans les templates, au
sein du *hash* ``actions`` :

* [error](http://emberjs.com/api/classes/Ember.Route.html#event_error) : Une action ``error`` est levée lorsqu'une
promesse est rejetée au sein de l'un des *hooks* de la route (échec dans la récupération du modèle, etc.). La levée
ainsi que la propagation de cette action via le *bubbling* permet la gestion de l'erreur à n'importe quel niveau de
la hiérarchie de route.
   
   ```javascript
   actions: {
     /*
      * @error: thrown error
      * @transition: failed transition
      */
     error: function(error, transition) { ... }
   }
   ```

* [loading](http://emberjs.com/api/classes/Ember.Route.html#event_loading) : Une action ``loading`` est levée lorsque 
l'un des *hooks* de la route retourne une promesse non encore résolue.

   ```javascript
   actions: {
     /*
      * @transition: current transition
      * @route: route that triggered the event
      */
     loading: function(transition, route) { ... }
   }
   ```

* [didTransition](http://emberjs.com/api/classes/Ember.Route.html#event_didTransition) : Une action ``didTransition``
est levée lorsque la transition s'est effectuée complètement, c'est à dire après l'exécution des *hooks* d'entrée
(``beforeModel``, ``model``, ``afterModel``, ``setupController``). Cette
action est courament utilisée pour des opération de *tracking* (visites, etc.).
 
   ```javascript
   actions: {
     didTransition: function() { ... }
   }
   ``` 

* [willTransition](http://emberjs.com/api/classes/Ember.Route.html#event_willTransition) : Une action ``willTransition``
est levée lorsqu'une tentative de transition est effectuée depuis cette route.

   ```javascript
   actions: {
     /*
      * @transition: attempted transition
      */
     willTransition: function(transition) { ... }
   }
   ``` 
   
<div class="work answer">
  {% capture m %}
  {% raw %}
  
1. Modifier la route ``comic.edit`` pour gérer l'action ``willTransition`` de manière à ce que si l'utilisateur change
de route (en cliquant sur un autre comic par exemple) sans avoir sauvegardé, l'ensemble des modifications soient 
annulées.
    * L'annulation des modifications correspond aux mêmes opérations que celles effectuées lors d'un ``cancel``
    * Conserver la propagation de l'action ``willTransition`` aux routes parentes.
    
    **Test** : Les modifications doivent permettre de rendre passant le test [03 - Controller - 05 - Should cancel edit on transition](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/03-controller-test.js#L87)
    
    > ```javascript
    > // app/routes/comic/edit.js
    > 
    > afterModel (model) { ... },
    > 
    > resetComic () {
    >   this.get('controller.model').reset(this.get('initialModel'));
    > },
    > 
    > actions: {
    >   save () {
    >     this.transitionTo('comic');
    >   },
    >   cancel () {
    >     this.resetComic();
    >     this.transitionTo('comic');
    >   },
    >   willTransition () {
    >     this.resetComic();
    >     return true;
    >   }
    > }
    > ```
    
    On remarque que le save ne fonctionne plus (le test [03 - Controller - 01 - Should save on edit submit](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/03-controller-test.js#L87)
    ne passe plus) et que les changements semblent être annulées systématiquement.
    L'action ``willTransition`` est en effet exécutée après les autres actions et notament le ``save`` qui déclenche une transition
    via ``transitionTo``. De ce fait, quelques soient les opérations effectuées dans le ``save``, les annulations
    effectuées par ``willTransition`` sont appliquées.
    
1. Créer le contrôleur ``app/controllers/comic/edit.js`` et y intercepter les actions ``save`` et ``cancel``
    * Ces actions se contentent de positionner une propriété ``hasUserSavedOrCancel`` à ``true`` dans le contrôleur de manière
    à signaler que l'utilisateur a délibérément effectué une opération.
    * Faire que ces actions continuent de se propager à la route.
    * Modifier le gestionnaire de l'action ``willTransition`` de manière à n'effectuer les opérations d'annulation que si 
    l'utilisateur n'a effectué aucune des deux actions ``save`` ou ``cancel``
    * Comme on le verra plus tard, l'utilisation d'un outil tel qu'[Ember Data](../ember-data) permet, via les fonctions
    avancées de gestion de l'état des modèles et du ``store``, d'éviter d'avoir à effectuer nous mêmes ces contrôles.
    
    **Test** : Les modifications doivent permettre de rendre de nouveau passant le test [03 - Controller - 01 - Should save on edit submit](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/03-controller-test.js#L87)

     > ```javascript
     > // app/controllers/comic/edit.js
     > 
     > import Ember from 'ember';
     > 
     > export default Ember.Controller.extend({
     > 
     >   actions: {
     >     save() {
     >       this.set('hasUserSavedOrCancel', true);
     >       return true;
     >     },
     > 
     >     cancel() {
     >       this.set('hasUserSavedOrCancel', true);
     >       return true;
     >     }
     >   }
     > });
     > ```
     > 
     > ```javascript
     > // app/routes/comic/edit.js
     > 
     > actions: {
     >   save () { ... },
     >   cancel () { ... },
     >   willTransition () {
     >     if (!this.controller.get('hasUserSavedOrCancel')) {
     >       this.resetComic();
     >     }
     >     
     >     return true;
     >   }
     > }
     > ```
     
  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>
    
On remarque ici un autre effet de bord. En effet, si les modifications semblent bien avoir permis de rentre le ``save``
de nouveau opérationnel, ``willTransition`` ne semble plus exécutée après un ``save``. Pour le constater :
  
* Editer un premier comic et l'annuler via ``willTransition`` en cliquant sur un autre. Les modifications sont bien annulées.
* Editer à nouveau un comic et sauvegarder les modifications. Celles-ci sont bien sauvegardées.
* Editer encore un comic et l'annuler via ``willTransition``. Cette fois les modifications ne sont pas annulées.

Ceci est dû au fait que **les contrôleurs [Ember][ember] sont des singletons**. Ainsi, pour une même route, le même 
contôleur est toujours réutilisé. Il est donc nécessaire de s'assurer, à chaque accès à la route, que l'état géré
par ce contrôleur et éventuellement modifié lors du dernier accès est bien réinitialisé.

Dans notre cas, la propriété ``hasUserSavedOrCancel`` a été conservée à ``true`` laissant penser à ``willTransition``
qu'une action utilisateur avait été effectuée.

Comme on l'a évoqué dans le chapitre précédent, les routes [Ember][ember] disposent d'une méthode [resetController](http://emberjs.com/api/classes/Ember.Route.html#method_resetController)
appelée systématiquement lorsque la route ou le modèle change qui permet de laisser, en partant, le contrôleur dans un état stable,
prêt pour une utilisation ultérieure.
    

<div class="work answer">
  {% capture m %}
  {% raw %}
  
1. Implémenter, dans la route ``comic.edit``, le *hook* ``resetController`` de manière à réinitialiser la propriété
``hasUserSavedOrCancel`` à ``false``

    **Test** : Les modifications doivent permettre de rendre passant le test [03 - Controller - 06 - Should call willTransition on edit despite an old save](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/03-controller-test.js#L87)
    
    > ```javascript
    > // app/routes/comic/edit.js
    > 
    >   afterModel (model) { ... },
    > 
    >   resetController (controller) {
    >     controller.set('hasUserSavedOrCancel', false);
    >   },
    > 
    >   resetComic () { ... },
    >   
    > ```
  
1. On souhaite enfin proposer une confirmation à l'utilisateur lors du ``willTransition`` avant d'annuler les changements.
    * Afficher une alerte javascript de confirmation lors du ``willTransition`` demandant confirmation que l'utilisateur souhaite
    abandonner ses changements
    * En cas de réponse positive, poursuivre les opérations du ``willTransition``
    * En cas de réponse négative, annuler la transaction pour rester sur la route courante
    
    **Tests** : Les modifications doivent permettre de rendre passants les tests [03 - Controller - 07 - Should cancel edit after confirm true](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/03-controller-test.js#L87)
    et [03 - Controller - 08 - Should abort edit after confirm false](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/03-controller-test.js#L87)
    
    > ```javascript
    > // app/routes/comic/edit.js
    > 
    >   actions: {
    >     save () { ... },
    >     cancel () { ... },
    >     willTransition (transition) {
    >       if (this.controller.get('hasUserSavedOrCancel')) {
    >         return true;
    >       } else if (confirm('Are you sure you want to abandon progress?')) {
    >         this.resetComic();
    >         return true;
    >       } else {
    >         transition.abort();
    >       }
    >     }
    >   }
    > ```
  
  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>

## Contrôleurs

### Association explicite de contrôleur

On a utilisé jusqu'à présent les controllers implicites d'[Ember][ember] ou implémenté le contrôleur standard en respectant
les conventions de nommage.

Dans certains cas, cependant, il peut être utile de spécifier explicitement le contrôleur que l'on souhaite associer à la 
route de manière à réutiliser un contrôleur existant.

Cela s'effectue grâce à la propriété [controllerName](http://emberjs.com/api/classes/Ember.Route.html#property_controllerName)
de la route :

```javascript
export default Ember.Route.extend({
  controllerName: 'another/controller',
});
```

**NB** : On peut également utiliser la méthode [this.controllerFor('another/route')](http://emberjs.com/api/classes/Ember.Route.html#method_controllerFor)
de manière à récupérer le controller d'une autre route et l'affecter explicitement à la route courante dans le *hook* 
[setupController](http://emberjs.com/api/classes/Ember.Route.html#method_setupController). Cependant cette méthode est moins élégante
et peut générer des effets de bord. Elle n'est pas à privilégier. Noter également que le contrôleur en question doit impérativement
avoir été créé (notamment parce que la route correspondante est active).

 
<div class="work answer">
  {% capture m %}
  {% raw %}
  
1. Modifier la route ``comics.create`` pour implémenter le gestionnaire d'action ``willTransition`` selon les mêmes
principes que pour ``comic.edit``
    * Réutiliser le contrôleur de ``comic.edit``
    * Ne pas oublier de réinitialiser le contrôleur
  
    **Tests** : Les modifications doivent permettre de rendre passants les tests 
    [03 - Controller - 09 - Should cancel create on transition](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/03-controller-test.js#L87),
    [03 - Controller - 10 - Should call willTransition on create despite an old save](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/03-controller-test.js#L87),
    [03 - Controller - 11 - Should cancel create after confirm true](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/03-controller-test.js#L87) et
    [03 - Controller - 12 - Should abort create after confirm false](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/03-controller-test.js#L87)
    
    > ```javascript
    >   export default Ember.Route.extend({
    >     templateName: 'comic/edit',
    >     controllerName: 'comic/edit',
    >   
    >     model () { ... },
    >   
    >     resetController (controller) {
    >       controller.set('hasUserSavedOrCancel', false);
    >     },
    >   
    >     resetComic () {
    >       this.modelFor('comics').removeObject(this.get('controller.model'));
    >     },
    >   
    >     actions: {
    >       save () { ... },
    >       cancel () {
    >         this.resetComic();
    >         this.transitionTo('comics');
    >       },
    >       willTransition (transition) {
    >         if (this.controller.get('hasUserSavedOrCancel')) {
    >           return true;
    >         } else if (confirm('Are you sure you want to abandon progress?')) {
    >           this.resetComic();
    >           return true;
    >         } else {
    >           transition.abort();
    >         }
    >       }
    >     }
    >   });
    > ```
  
  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>

### Gestion de l'état et propriétés

Comme on l'a dit, la responsabilité principale des contrôleurs est de maintenir l'état de l'application à un instant donné.
cela s'effectue au travers de la définition et de la manipulation de propriétés au sein du contrôleur. La valeur de ces
propriétés est exposée au template qui peut ensuite provoquer des changements de valeur au travers des actions. L'utilisation
de [propriétés calculées](../underlyings/#propri%C3%A9t%C3%A9s-calcul%C3%A9es-%28computed-properties%29) au sein même du
contrôleur permet ensuite de propager automatiquement ce changement partout où cela est nécessaire. 

<div class="work answer">
  {% capture m %}
  {% raw %}
  
1. Nous allons maintenant ajouter un champ permettant de filtrer la liste les comics ainsi q'un bouton de tri permettant 
de trier les comics dans un ordre croissant ou décroissant.
    * Créer le contrôleur ``app/controllers/comics.js`` en se basant sur le modèle proposé plus bas.
    * Implémenter le corps de l'action ``sort`` de manière à inverser la valeur de la propriété ``sortAsc``. 
    Indice : utiliser pour cela une méthode de [Ember.Controller](http://emberjs.com/api/classes/Ember.Controller.html)
    qui permet d'inverser la valeur d'une propriété booléenne.
    * Compléter la propriété ``filteredComics`` afin que celle-ci se base sur la collection récupérée initialement.
    * Compléter la liste des propriétés observées par la propriété calculée ``filteredComics`` de manière à ce que celle-ci
    soit recalculée à chaque fois que la propriété ``filter`` change, chaque fois que l'on ajoute ou supprime un comic
    dans la liste et enfin lorsque l'on modifie le titre de n'importe quel comic.
    * Compléter la propriété observée par ``sortDefinition`` de manière à ce que celle-ci soit recalculée chaque fois que 
    la direction du tri est modifiée.
    * Compléter la propriété ``sortedComics`` afin que celle-ci se base sur la collection filtrée (``filteredComics``).
    * On remarque l'utilisation de la méthode [Ember.computed.filter](http://emberjs.com/api/classes/Ember.computed.html#method_filter)
    qui permet de filtrer facilement une collection et de la méthode [Ember.computed.sort](http://emberjs.com/api/classes/Ember.computed.html#method_sort)
    qui permet, elle, de faciliter le tri. Cette dernière s'appuie également sur une propriété calculée définissant les 
    caractéristiques du tri (propriété, ordre). Ici ``['title:asc']`` ou ``['title:desc']``.
    * Modifier le template ``app/templates/comics.hbs`` en se basant sur le modèle proposé plus bas.
    * Ajouter avant la liste de comics un ``input`` permettant de modifier la valeur de ``filter`` ainsi qu'un bouton 
    permettant de déclencher l'action ``sort``. Ce bouton doit     porter les classes css ``sort sort-asc`` ou 
    ``sort sort-desc`` en fonction de la valeur de ``sortAsc``.
    * Modifier la collection parcourue par le ``{{#each}}`` de façon à utiliser la liste triée.
    * Enfin, modifier le span de classe ``comics-number`` afin d'afficher, en temps réel, le nombre de comics triés 
    (ne pas modifier le contrôleur).
    
    ```javascript
    import Ember from 'ember';
    
    export default Ember.Controller.extend({
      filter: "",
      sortAsc: true,
    
      filteredComics: Ember.computed.filter(..., function (model) {
        let title = model.get('title');
        return !title || title.toLowerCase().match(new RegExp(this.get('filter').toLowerCase()));
      }).property(???, ???, ???),
    
      sortDefinition: function () {
        return ["title:" + (this.get('sortAsc') ? 'asc' : 'desc')];
      }.property(???),
    
      sortedComics: Ember.computed.sort(???, 'sortDefinition'),
    
      actions: {
        sort () {
          // @TODO ???
        }
      }
    });
    ```
    
    ```html
    <div class="row">
      <div class="comics">
        <h2>Comics list</h2>
    
        {{input type=text value=... class="filter"}}
        <button ??? class="???"></button>
    
        <ul>
          {{#each ??? as |comic|...}}
        </ul>
        {{link-to '' 'comics.create' class="add-comic"}}
    
        <span class="comics-number">Number of comics: ???</span>
      </div>
    
      {{outlet}}
    </div>
    ```
    
    **Tests** : Les modifications doivent permettre de rendre passants les tests 
    [03 - Controller - 13 - Should filter](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/03-controller-test.js#L87),
    [03 - Controller - 14 - Should sort](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/03-controller-test.js#L87) ainsi
    que l'ensemble des [tests unitaires du controller comics](https://github.com/bmeurant/ember-training/blob/master/tests/unit/controllers/comics-test.js)

    
      > ```javascript
      > // app/controllers/comics.js
      >
      > import Ember from 'ember';
      > 
      > export default Ember.Controller.extend({
      >   filter: "",
      >   sortAsc: true,
      > 
      >   filteredComics: Ember.computed.filter('model', function (model) {
      >     let title = model.get('title');
      >     return !title || title.toLowerCase().match(new RegExp(this.get('filter').toLowerCase()));
      >   }).property('filter', 'model.[]', 'model.@each.title'),
      > 
      >   sortDefinition: function () {
      >     return ["title:" + (this.get('sortAsc') ? 'asc' : 'desc')];
      >   }.property('sortAsc'),
      > 
      >   sortedComics: Ember.computed.sort('filteredComics', 'sortDefinition'),
      > 
      >   actions: {
      >     sort () {
      >       this.toggleProperty('sortAsc');
      >     }
      >   }
      > });
      > ```
    
      > ```html
      > {{!-- app/templates/comics.hbs --}}
      >
      > <div class="row">
      >   <div class="comics">
      >     <h2>Comics list</h2>
      > 
      >     {{input type=text value=filter class="filter"}}
      >     <button {{action "sort"}} class="sort {{if sortAsc 'sort-asc' 'sort-desc'}}"></button>
      > 
      >     <ul>
      >       {{#each sortedComics as |comic|}}
      >         <li class="{{if comic.scriptwriter 'comic-with-scriptwriter' 'comic-without-scriptwriter'}}">
      >           {{#link-to "comic" comic}}
      >             {{comic.title}} by {{if comic.scriptwriter comic.scriptwriter "unknown scriptwriter"}}
      >           {{/link-to}}
      >         </li>
      >       {{else}}
      >         Sorry, no comic found
      >       {{/each}}
      >     </ul>
      >     {{link-to '' 'comics.create' class="add-comic"}}
      > 
      >     <span class="comics-number">Number of comics: {{sortedComics.length}}</span>
      >   </div>
      > 
      >   {{outlet}}
      > </div>
      > ```
  
  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>
 
[handlebars]: http://handlebarsjs.com/
[ember-cli]: http://www.ember-cli.com/
[ember]: http://emberjs.com/