---
layout: ember-training
title: Formation Ember - Contrôleurs
permalink:  controllers/
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
[issue](https://github.com/ef4/rfcs/blob/routeable-components/active/0000-routeable-components.md)).

## Routes, Contrôleurs & Modèles

La route définit donc, comme vu au chapitre précédent, une méthode ``model`` permettant de retrouver le modèle, le contrôleur stocke 
dans une propriété ``model`` le résultat de cette méthode pour l'exposer au template.

L'initialisation de la propriété ``model`` du contrôleur à partir du résultat de la méthode ``model`` de la route, après résolution 
des éventuelles promesses par [Ember][ember], s'effectue de manière totalement automatique via la méthode 
[setupController](http://emberjs.com/api/classes/Ember.Route.html#method_setupController) de la route. Contrairement à la méthode
[activate](http://emberjs.com/api/classes/Ember.Route.html#method_activate), appelée lors de l'instantiation de la route par le routeur,
``setupController`` est appelée à chaque changement de route (y compris de segments dynamiques). Elle peut donc être surchargée de 
manière à provisionner, dans le contrôleur associé à la route, des éléments de contexte supplémentaires dépendant de la route activée : 

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
   this.controller;
   this.get('controller');
   ```
  
* via l'utilisation de la méthode [controllerFor()](http://emberjs.com/api/classes/Ember.Route.html#method_controllerFor) qui,
comme la méthode [modelFor](http://emberjs.com/api/classes/Ember.Route.html#method_modelFor) pour le modèle, permet d'accéder
au contrôleur associé à une route donnée :

   ```javascript
   this.controllerFor('mere.fille');
   this.controllerFor(this.routeName);
   ```

{% raw %}

## Actions

Maintenant que nos routes sont installées et effectuent le rendu des templates associés, il va être nécessaire que notre application
puisse réagir aux comportements des utilisateurs. Pour celà, nous allons devoir générer et propsager des **évènements** au sein de 
l'application suite à une action utilisateur.

En [Ember][ember], le déclenchement d'évènements s'effectue grâce aux **actions**. Celles-ci sont déclarées au sein des templates
et une fois l'évènement correspondant déclenché, celui-ci est propagé au sein de l'application. L'action est donc traité au niveau le bas
où elle est intercéptée : dans le composant, puis dans  le contrôleur et, si elle n'y est pas traitée, au sein de la hiérarchie de route, 
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

### Paramètre

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

### Type d'évènement DOM

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

<div class="work no-answer">
  {% capture m %}
  {% raw %}

  
* bouton valider -> binding RAF transitionTo sans model (pas besoin)
* bouton cancel -> stockage model initial, restaure model dans controller puis log title avec notation`.`enchaînée, transitionTo avec model
* liste non MAJ parce que pas remplacé l'objet modifié par le clone dans le tableau. Comme on n'utilise pas de store (on verra avec Ember DATA), obligé de le faire à la main
   * comics model -> arrayProxy vite fait
   * replaceBy et liste OK -> ember data mieux
  
  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>
 
[handlebars]: http://handlebarsjs.com/
[ember-cli]: http://www.ember-cli.com/
[ember]: http://emberjs.com/