---
layout: ember-training
title: Formation Ember - Actions & Contrôleurs
permalink:  actions-controllers/
prev: ember/training/routing
next: ember/training/controllers
---

{% raw %}

## Actions & Evènements

Maintenant que nos routes sont installées et effectuent le rendu des templates associés, il va être nécessaire que notre application
puisse réagir aux comportements des utilisateurs. Pour celà, nous allons devoir générer et propsager des **évènements** au sein de 
l'application suite à une action utilisateur.

En [Ember][ember], le déclenchement d'évènements s'effectue grâce aux **actions**. Celles-ci sont déclarées au sein des templates
et une fois l'évènement correspondant déclenché, celui-ci est propagé au sein de l'application. L'action est donc traité au niveau le bas
où elle est intercéptée : dans le composant, puis dans  le contrôleur et, si elle n'y est pas traitée, au sein de la hiérarchie de route, 
de bas en haut. Une erreur est logguée dans le cas ou aucun gestionnaire n'est trouvé.

### {{action}}

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

#### traitement d'une action

Une action déclenchée dans le template doit donc être traitée, dans le composant, le contrôleur correspondant, ou dans une des routes actives,
en partant de la plus précise. Quelque soit l'endroit de la déclaration du gestionnaire, celle-ci s'effectue de la manière suivante, 
nécessairement au sein du *hook* ``actions`` : 

```javascript
// route, controller, component
actions: {
  save() {
    // perform some operations
  }
}
```

Par défaut la propagation de l'action s'arrète si un gestionnaire a été trouvé et l'action n'est donc plus propagée aux niveaux supérieurs.
Il est possible de forcer cette propagation en retournant explicitement la valeur `true` dans le egstionnaire :

```javascript
// route, controller, component
actions: {
  save() {
    // perform some operations
    return true;
  }
}
```

#### paramètre

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

#### type d'évènement

Il est enfin également possible de préciser explicitement le type d'évènement que l'on souhaite lier à l'action de la 
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

**NB:** Préciser le type d'évènement ou utiliser des sous-expressions a, de manière étrange, un impact majeur sur le comportement
de l'application puisque, dans ce cas, l'action au niveau du contrôleur est indispensable et l'action n'est pas propagée.

{% endraw %}

<div class="work no-answer">
  {% capture m %}
  {% raw %}

  
  
  
* linkto li -> action
* route comic.edit
* simple : bouton edit
* boutons valider
  
  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>
 
[handlebars]: http://handlebarsjs.com/
[ember-cli]: http://www.ember-cli.com/
[ember]: http://emberjs.com/