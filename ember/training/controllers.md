---
layout: ember-training
title: Formation Ember - Actions & Contrôleurs
permalink:  actions-controllers/
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
et une fois l'évènement correspondant déclenché, celui-ci est propagé au sein de l'application. L'action est donc traitée au niveau le bas
où elle est intercéptée : dans le composant, puis dans  le contrôleur et, enfin, au sein de la hiérarchie de routes, 
de bas en haut. Une erreur est logguée dans le cas ou aucun gestionnaire n'est trouvé.

### {{action}} *helper*

La déclaration d'une action s'effectue donc, au sein du template, par l'utilisation du *helper* ``{{action}}`` au sein d'un élément HTML,
d'un composant standard ou d'un composant personnalisé.

```html
<div {{action "save"}}>confirm</div>
<button {{action "save"}}>confirm</button>
{{input value="confirm" enter="save"}}
<input type="text" value="confirm" {{action "save"}} />
```

En fonction du type de composants, le déclenchement de l'action s'effectue lors de certains évènements uniquement. Par exemple, 
si l'on utilise le helper ``{{input}}``, celui-ci ne s'effectue qu'à la "validation" du champs. C'est à dire lorsque l'on appuie sur
``Entrée``. Pour les éléments HTML standard, il s'effectue au clic, ce qui explique que les comportements de ``{{input}}`` et de ``<input/>`` diffèrent.

### Traitement d'une action

Une action déclenchée dans le template doit donc être traitée, dans le composant, le contrôleur correspondant, ou encore 
dans une des routes actives. Quelque soit l'endroit de la déclaration du gestionnaire, celle-ci s'effectue de la manière suivante, 
nécessairement au sein du *hook* ``actions`` : 

```javascript
// route, controller, component
actions: {
  save() {
    // perform some operations
  }
}
```

La propagation des actions au sein de la hiérarchie de composants, contrôleurs et routes peut être différente en fonction du
type d'actions. Pour plus de précisions se reporter au paragraphe [Propagation & bubbling](##propagation-%26-bubbling).

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
    méthode ?
    * Que constate-t-on suite à la transition ?
    * Pour le moment, ne pas se préoccuper d'annuler les modifications dans la liste de comics
    
    **Test** : *Les modifications doivent permettre de rendre le test [03 - Controller - 02 - Should cancel on edit reset](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/03-controller-test.js#L87) passant.*
    
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
    
    > ```javascript
    > // app/routes/comic/edit.js
    > 
    > import Ember from 'ember';
    > import Comic from '../../models/comic';
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
    >       this.set('controller.model', this.get('initialModel'));
    > 
    >       this.transitionTo('comic', this.get('controller.model'));
    >     }
    >   }
    > });
    > ```
    > 
    > La copie initiale du modèle se fait évidement dans le *hook* ``afterModel`` puisque c'est dans celui-là seulement
    > que l'on dispose du modèle initialisé. Cet objet est conservé dans une propriété ``initialModel``.
    >
    > La réinitialisation du modèle lui-même s'effectue en remplaçant le model du controller par le modèle conservé.
    > On note l'utilisation de la notation chaînée `.`
    >
    > La transition doit impérativement renvoyer le modèle réinitialisé. Dans le cas contraire, les bindings ne sont pas
    > mis à jour car la route mère `comic` n'est pas prévenue des changements.
    
1. Avant la transition, mettre à jour le tableau ``comics`` de la route ``comics`` afin de remplacer explicitement le modèle
   toujours référencé par celui réinitialisé.
    * Cette fois encore, un outil complet tel qu'[Ember Data](../ember-data) nous offrira, comme on le verra plus tard,
    de gérer l'ensemble de ces problématiques pour nous bien plus facilement.
    * Pour faciliter un peu l'opération, effectuer préalablement les opérations suivantes :
       * copier le code suivant dans un nouveau model ``app/models/comics.js`` :
       
          ```javascript
          import Ember from 'ember';
          
          export default Ember.ArrayProxy.extend({
          
            /**
             Replace an array item (object) with a new one.
             The item to replace is found from a specific value of a given property
             @method replaceBy
             @param {String} property to test
             @param [value] property value to test against
             @param {Object} new item
             */
            replaceBy (key, value, newObj) {
              let indexToReplace = this.indexOf(this.findBy(key, value));
          
              if (indexToReplace > -1) {
                this.replace(indexToReplace, 1, newObj);
              }
            }
          });
          ```
       * modifier la route ``app/routes/comics.js`` :
       
          ```javascript
          import Comics from '../models/comics';
          
          ...
          
          let comics = Comics.create({content: [blackSad, calvinAndHobbes, akira)});
          ```
          Ces modifications ont pour objectif de transformer le simple tableau ``comics`` initial pour utiliser une classe
          étendant ``Ember.ArrayProxy`` qui proxyfie, comme son nom l'indique, un tableau. Cette classe définit
          une nouvelle méthode ``replaceBy`` permettant de remplacer simplement un élément du tableau par un autre élément
          en recherchant cet élément par la valeur d'une de ses propriétés. On initialise ensuite ``comics`` avec un tableau.
    * utiliser la méthode ``replaceBy`` pour réinitialiser l'objet dans la liste de comics
    
    **Test** : *Les modifications doivent permettre de rendre le test [03 - Controller - 03 - Should reinit list on edit reset](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/03-controller-test.js#L87) passant.*

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
    > actions: {
    >   save () {
    >     this.transitionTo('comic');
    >   },
    >   cancel () {
    >     this.set('controller.model', this.get('initialModel'));
    >     this.modelFor('comics').replaceBy('slug', this.get('initialModel.slug'), this.get('initialModel'));
    > 
    >     this.transitionTo('comic', this.get('controller.model'));
    >   }
    > }
    > ```
    
    > ```javascript
    > // app/routes/comics.js
    >
    > import Comics from '../models/comics';
    > 
    > ...
    > 
    > let comics = Comics.create({content: Ember.Array([blackSad, calvinAndHobbes, akira])});
    > ```
      
1. Intercepter et traiter les actions 'save' et 'cancel' pour la route `comics.create`
    * Rediriger vers la route ``comic.edit`` du nouveau comic suite à validation.
    * Nettoyer la liste de comics et rediriger vers la route ``comics`` suite à annulation. Utiliser pour cela la fonction
      [removeObject()](http://emberjs.com/api/classes/Ember.MutableArray.html#method_removeObject) de ``Ember.MutableArray``.
    * Transformer la propriété ``slug`` d'un ``Comic`` en **computed propety** de manière à ce que le *slug* corresponde à
      la valeur du titre transformée grâce à la fonction [dasherize()](http://emberjs.com/api/classes/Ember.String.html#method_dasherize) 
      et qu'il soit mis à jour à chaque modification du titre.
      
    **Test** : Les modifications doivent permettre de rendre passants les tests 
    [03 - Controller - 04 - Should save on create submit](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/03-controller-test.js#L87)
    et [03 - Controller - 05 - Should reinit list on edit reset](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/03-controller-test.js#L87)
      
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
      >   publisher: ''
      > });
      > ```
      > 
      > ```javascript
      > // app/routes/comics/create.js
      > 
      > import Ember from 'ember';
      > import Comic from '../../models/comic';
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
      > 
      >       this.transitionTo('comics');
      >     }
      >   }
      > });
      > ```
      > 
      > On note le passage du model à la route ``comic`` lors de la transition suite au ``save``.
      
  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>

{% raw %}

### Evènements Ember

### Paramètre d'actions

Il est possible de déclarer et donc passer un paramètre à l'action qui sera déclenchée, de manière à pouvoir lire et utiliser ce paramètre
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

A noter que, concernant l'utilisation de ``{{input}}``, il n'est pas possible de passer un paramètre sans préciser l'évènement
comme exposé ci-dessous.

### Type d'évènements DOM

Il est enfin également possible de préciser explicitement le type d'évènement DOM que l'on souhaite lier à l'action de la 
manière suivante : 

```html
<div onclick={{action "save" "value"}}>confirm</div>
<button onclick={{action "save" model.id}}>confirm</button>
{{input enter=(action "save" model.id) value="confirm"}}
<input type="text" value="confirm" onclick={{action "save" model}} />
```

Les éléments html standards peuvent manipuler tout type d'évènement natif. Les évènements gérés par le *helper*``{{input}}``
sont listés dans la [documentation](http://emberjs.com/api/classes/Ember.Templates.helpers.html#toc_actions).

On remarque au passage, concernant l'utilisation du *helper* ``{{input}}``, l'utilisation d'une **sous-expression** 
[Handlebars][handlebars] via la notation ``{{input ... (action ...)}}``. Cette notation permet l'imbrication
d'expressions au sein des *helpers*. 

### Propagation & bubbling 

Il existe en réalité aujourd'hui, pour des raisons historiques, deux types d'actions différentes. Il s'agit des 
``element space actions`` d'un côté dont le fonctionnement s'appuie sur le *bubbling* et des ``closure actions`` qui 
doivent être intercéptées obligatoirement dans un contrôleur ou un composant et qui ne font pas intervenir de *bubbling*.

* les ``element space actions`` sont les actions historiques d'[Ember][ember]. 
     Elles interviennent lors de l'utilisation des syntaxes standard telles que :
     
     ```html
     <div {{action "save" model}}>confirm</div>
     {{input enter="save" value="confirm"}}
     ```
     
     Ces actions peuvent être indifféremment intercéptées dans un contrôleur, un composant ou une route. Leur fonctionnement
     et, en particulier, leur mode de propagation repose sur le *bubbling*. L'action est en effet automatiqument propagée de
     bas en haut, du composant à la route ``application`` jusqu'à trouver un gestionnaire. L'action n'est alors plus propagée.
     
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

* les ``closure actions`` constituent un nouveau types d'actions. 
     Elles interviennent lors de l'utilisation des syntaxes standard telles que :
     
     ```html
     <div onclick={{action "save" model}}>confirm</div>
     {{input enter=(action "save" model.id) value="confirm"}}
     ```
  
     Ce sont de simples fonctions dont la valeur de retour est récupérée par l'élément qui les invoque. Ce fonctionnement 
     les rend incompatible avec les mécanismes de *bubbling* décrits ci-dessus basés sur une valeur de retour. Ces actions 
     ne se propagent pas via *bubling* et doivent impérativement être interceptées dans un contrôleur ou un composant.

**NB:** Cette situation est problématique mais temporaire et les ``closure actions`` sont amenées à devenir le seul système de gestion des actions dans
un avenir proche. Pour d'avantage de détails, se reporter à cette [issue](https://github.com/emberjs/ember.js/issues/12581). Il est donc conseillé 
de privilégier la gestion des actions au sein d'un contrôleur ou d'un composant et, si nécessaire, de propager explicitement l'action vers
les routes impliquées.

{% endraw %}

 
[handlebars]: http://handlebarsjs.com/
[ember-cli]: http://www.ember-cli.com/
[ember]: http://emberjs.com/