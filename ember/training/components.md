---
layout: ember-training
title: Formation Ember - Composants
permalink:  ember/training/components/
prev: ember/training/actions-controllers
next: ember/training/ember-data
---

<div id="toc"></div>

Les composants [Ember][ember] sont une part importante de la structure du framework. [Ember][ember] revendique en effet depuis toujours une approche composants ainsi que la volonté
de converger vers les [Web components](http://w3c.github.io/webcomponents/) et les [Custom elements](http://w3c.github.io/webcomponents/spec/custom/) en particulier.

[Ember][ember] permet ainsi de définir - sous la forme de composants - des éléments évolués offrant une réutilisation maximales à la fois de structures d'affichage et de structures 
logique au sein d'une application voire, via le packaging de ces composants au sein d'[addons](https://guides.emberjs.com/v2.4.0/addons-and-dependencies/managing-dependencies/#toc_addons), 
au sein de plusieurs applications [Ember][ember].

Le futures versions d'[Ember][ember] doivent même voir la notion de contrôleur totalement remplacée par l'utilisation de [composants routables](https://github.com/ef4/rfcs/blob/routeable-components/active/0000-routeable-components.md).

## Définition

Un composant [Ember][ember] se définit par les éléments suivants :

* un template dans ``app/templates/components/my-component.hbs`` définissant le template spécifique du composant si il existe
* une sous classe de [Ember.Components](http://emberjs.com/api/classes/Ember.Component.html) dans ``app/components/my-component.js`` qui permet d'implémenter l'intégralité de la logique propre du composant

Comme à son habitude, [Ember][ember] ne nécessite pas que ces deux éléments soient explicitement déclarés si ce n'est pas nécessaire. Ainsi il est possible qu'un composant soit
pleinement définit par son template (aucune logique spécifique) ou par son fichier js (aucun rendu spécifique). Dans ce cas, l'élément manquant est généré de manière transparente par [Ember][ember]
sous la forme, respectivement, d'un object vide héritant d'[Ember.Components](http://emberjs.com/api/classes/Ember.Component.html) ou d'un template vide.  

A noter qu'[Ember][ember] fournit des outils permettant d'effectuer des tests d'intégration sur nos composants (en plus d'éventuels tests unitaires standards dans le cas de composants
implémentant une logique propre complexe).

### Nommage

Conformément à la [spécification W3C](http://w3c.github.io/webcomponents/spec/custom/), le nom d'un composant (et donc le nom des fichiers ``.js`` et ``.hbs`` associés doit impérativement comporter un tiret ``-``.
Dans le cas contraire, le composant ne sera pas détécté par [Ember][ember].

Ainsi ``my-component`` est valide, ``myComponent`` ou ``mycomponent`` ne le sont pas.

### Utilisation

{% raw %}

Une fois créé, un composant s'utilise de la même manière qu'un [helper](./templates/#helpers) via la notation ``{{ ... }}``.

Il peut s'agir : 

* de composants de type *inline* : Ces composants n'embarquent pas de contenu externe et se suffisent à eux-même. Il peut s'agir de
  composants très simples ou très complexes. Les informations et propriétés de l'expérieur leur sont exclusivement passées via
  des paramètres. Ainsi un composant invoqué de cette manière :
 
  ```html 
  {{user-name class="admin" user=model}}
  ```
  
  avec le template suivant :
  
  ```html
  <dl>
    <dt>First name: </dt><dd>user.firstName</dd>
    <dt>Last name: </dt><dd>user.lastName</dd>
  </dl>
  ```
  
  et le modèle suivant :
  
  ```javascript
  {
    firstName: "Franck",
    lastName: "Underwood"
  }
  ```
  
  donnera l'HTML suivant :
  
  ```html
  <div class="admin">
    <dl>
      <dt>First name: </dt><dd>Franck</dd>
      <dt>Last name: </dt><dd>Underwood</dd>
    </dl>
  </div>
  ```
   
* de composants de type *block* encapsulant du contenu. Ces composants fonctionnent exactement comme les premiers à la
  différence près qu'ils permettent d'y insérer du contenu externe. Ce contenu s'insèrera dans le template du composant
  en lieu et place de l'expression ``{{yield}}``. Ainsi un composant invoqué de cette manière :

  ```html
  {{#full-article class="article" title="model.title"}}
    {{#each model.paragraphs as |paragraph|}}
      <p>paragraph</p>
    {{/each}}
  {{/my-component}}
  ```
  
  avec le template suivant :
  
  ```html
  <article>
    <h2>title</h2>
    <div class="content">{{yield}}</div>
  </article>
  ```
  
  et le modèle suivant :
  
  ```javascript
  {
    title: "Lorem ipsum ...",
    paragraphs: [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit"
    ]
  }
  ```
  
  donnera l'HTML suivant :
  
  ```html
  <div class="article">
    <article>
      <h2>title</h2>
      <div class="content">
        <p>Lorem ipsum dolor sit amet</p>
        <p>consectetur adipiscing elit</p>
      </div>
    </article>
  </div>
  ```

### Passage de propriétés

Il est bien entendu possible de passer des propriétés - dynamiques ou non - aux composants afin qu'ils puissent les afficher et/ou les manipuler. Ce passage de propriétés se fait tout naturellement
selon la syntaxe habituelle ``nom=valeur``. Aini la déclaration suivante : 

```html
{{custom-user title='My title' user=model}}
```

permet la manipulation suivante dans le template du composant : 

```html
<h4>{{title}}</h4>
<dl>
    <dt>First name :</dt><dd>{{user.firstname}}</dd> 
    <dt>Last name :</dt><dd>{{user.lastname}}</dd> 
</dl>
```

Les deux propriétés ``title`` (litéral) et ``user`` ont donc été passées au composant qui peut alors les manipuler. Dans le cas précis il effectue un simple affichage

{% endraw %}

<div class="work answer">
  {% capture m %}
  {% raw %}

1. On souhaite afficher l'image de couverture pour chaque comic juste après le titre. Comme on anticipe que l'on aura besoin de réutiliser cet élément (dans une future notion d'album ?),
on va en faire un composant. 
   * Créer un composant `image-cover` très simple (template uniquement) affichant la couverture du comic dans une image de classe `cover`.
   * Copier les images de couverture en copiant [ce repertoire](https://github.com/bmeurant/ember-training/tree/master/public/assets/images) vers ``public/assets/images``
   * Pour le moment, se contenter d'afficher, pour tous les comics, la couverture par défaut (``public/assets/images/comics/covers/default.jpg``) 
   * Mettre à jour les templates ``app/templates/comic/index.hbs`` et ``app/templates/comic/edit.hbs`` pour ajouter l'appel du composant juste après le titre 
   
   > ```html
   > {{!-- app/templates/components/image-cover.hbs --}}
   > <img class="cover" src="/assets/images/comics/covers/default.jpg"/>
   > ```
   >
   > ```html
   > {{!-- app/templates/comic/index.hbs --}}
   > ... 
   > <h3>{{model.title}}</h3>
   > {{image-cover}}
   > <dl>
   > ...
   > ```
   >
   > ```html
   > {{!-- app/templates/comic/edit.hbs --}}
   > ... 
   > <div class="title">
   >   {{input id="title" type="text" value=model.title}}
   > </div>
   > {{image-cover name=model.slug}}
   > <div class="description">
   > ...
   > ```

1. On souhaite maintenant dynamiser ce composant pour afficher l'image de couverture correspondant au comic sélectionné. 
   * Modifier le template ``app/templates/comic/index.hbs`` pour ajouter les passage d'un paramètre au composant lui permettant d'accéder à l'identifiant (`slug`) du comic.
   * Modifier le template du composant pour remplacer *"default"* par la valeur de ce slug
   
   **Test** : Ces modifications doivent permettre de rendre passant le test [image-cover-test - renders image-cover](TODO link)
   
   > ```html
   > {{!-- app/templates/comic/index.hbs --}}
   > ... 
   > <h3>{{model.title}}</h3>
   > {{image-cover name=model.slug}}
   > <dl>
   > ...
   > ```
   > 
   > ```html
   > {{!-- app/templates/components/image-cover.hbs --}}
   > <img class="cover" src="/assets/images/comics/covers/{{name}}.jpg"/>
   > ```
   
   * Inspecter ensuite le DOM au niveau de l'image. Quel est le code qui a été généré ? Que constate-t-on ?
   
   > Le code généré est le suivant :
   >
   > ```html
   > <div id="ember483" class="ember-view"><img class="cover" src="/assets/images/comics/covers/blacksad.jpg"></div>
   > ```
   > 
   > On retrouve bien le code de notre template et on constate qu'il a été encapsulé dans un élément ``div`` englobant attaché par Ember
   > à notre composant.
   

  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>

{% raw %}

## Personalisation du rendu d'un composant

Le rendu des composants [Ember][ember] peut être très largement personalisé en créant une sous classe de [Ember.Components](http://emberjs.com/api/classes/Ember.Component.html) dans ``app/components``. 
Il est alors possible de configurer différentes choses : 
 
### Elément HTML

On a vu plus haut qu'[Ember][ember] encapsule par défaut les composants dans des div englobantes. Il est facilement possible de modifier ce comportement grâce à la propriété ``tagName`` du composant.
Cette propriété attend une chaîne de caractère contenant le type de l'élément : 

```javascript
export default Ember.Component.extend({
  tagName: 'li'
});
```

Résultat : 

```html
<li id="ember123" class="ember-view"></li>
```

### Classes

De la même manière il est possible de spécifier le ou les noms de classe(s) associés au composant via la propriété ``classNames``. Cette propriété attend soit une chaîne de caractère avec le nom de la classe unique
à ajouter au composant soit un tableau de chaînes de caractères dans le cas de classes multiples : 

```javascript
export default Ember.Component.extend({
  classNames: ['btn', 'success']
});
```

Résultat : 

```html
<div id="ember123" class="ember-view btn success"></div>
```

Il est également possible de positionner des classes sur l'élément racine d'un composant en fonction de critères applicatifs - de la valeur d'une propriété booléenne en l'occurrence. Cela s'effectue grâce
à la propriété ``classNameBindings``. La présence d'une classe sur le composant dépend ainsi de la valeur de la propriété booléenne associée sur le format ``<prop>:<classIfTrue>:<classIfFalse>``.

```javascript
export default Ember.Component.extend({
  classNameBindings: 'isSuccess:success:error',
  isSuccess: true
});
```

Résultat : 

```html
<div id="ember123" class="ember-view success"></div>
```

Tout comme la propriété ``classNames``, cette propriété accèpte aussi  bien une châine unique (une seule classe) qu'un tableau de chaînes.

### Attributs

Il est également posssible de positionner et de modifier différents attributs sur l'élément racine du composant via la propriété ``attributeBindings``. Celle-ci fonctionne comme la précédente et autorise
également la présence d'un seul identifiant d'attribut (chaîne) ou d'une liste d'identifiants. Elle permet de positionner l'attribut spécifié à la valeur de la propriété de même nom.

```javascript
export default Ember.Component.extend({
  attributeBindings: 'name',
  name: "username"
});
```

Il est également possible de spécifier explicitement le nom de la propriété : 

```javascript
export default Ember.Component.extend({
  attributeBindings: 'userName:name',
  userName: "username"
});
```

Résultat : 

```html
<div id="ember123" class="ember-view" name="username"></div>
```

Cela permet notamment de définir des valeurs d'attributs à partir de valeurs de propriétés passés au composant.

## Interactions 

Les principales formes d'interactions des composants avec leur environnement sont les suivantes :
 
 * Depuis les éléments parents vers les enfants. Les éléments parents sont ceux qui déclarent un composant - généralement en incluant sa définition au sein de leur template. Cette
   communication *descendante* se fait via l'utilisation de **propriétés dynamiques.**
 * Depuis le DOM suite à des actions de l'utilisation via l' **interception d'évènements**.
 * Depuis les éléments enfants vers les parents. Les composants peuvent ainsi informer leurs parents de la survenue d'évènements extérieurs. Cela s'effectue via des **actions.**

### Interactions parents -> enfants (propriétés)

Les composants suivent les principes de communication standard d'[Ember][ember] et cette forme de communication *descendante* s'appuie sur la manipulation de propriétés
dynamiques *bindées*. En effet, de manière générale, [Ember][ember] n'utilise pas de mécanismes de type *bus d'évènement* ou de *broadcasting* à proprement parler pour communiquer. 
A la place, un *état* est partagé entre les différents composants sous la forme de **propriétés dynamiques**. Ces propriétés sont ainsi passées par les parents aux enfants sous la
forme de paramètres classiques (``name=valeur``) comme vu plus haut. Tout évènement de changement de valeur de cette propriété sera ainsi disponible pour les composants enfants qui
souhaitent l'écouter, leur permettant ainsi de réagir à ce changement en adaptant leur comportement et/ou leur rendu.

Les binding de classes ou d'attributs peuvent faire directement référence à ces propriétés passées au composant. Ainsi, si un composant est invoqué de la manière suivante : 
 
```html
{{my-component selected=true}}
```

Il peut parfaitement déclarer le binding suivant :

```javascript
export default Ember.Component.extend({
  classNameBindings: 'selected'
});
```

Par convention, la propriété booléenne``selected`` est automatiquement écoutée pour décider du positionnement de la classe de même nom.

Il est cependant nécessaire de rappeler explicitement que les propriétées passées dynamiquement aux composants ne sont, par définition, pas disponibles au moment de la 
déclaration des propriétés du composant. Ainsi, la syntaxe suivante (où `user` est passé au composant par le parent) n'affichera jamais l'attribut ``name`` qui restera
toujours ``null`` :

```javascript
export default Ember.Component.extend({
  attributeBindings: 'userName:name',
  userName: user.get('fullName')
});
```

En effet, au moment de la déclaration de ``userName``, ``user`` n'est pas défini et sa valeur ne serait, à fortiori pas mise à jour lors du changement de la valeur ``user.fullName``. 
Il est donc nécessaire d'utiliser une **computed property**. Dans ce cas, dès que la propriété dynamique ``userName`` passée par le parent changera de valeur, l'attribut ``name`` sera
automatiquement mis à jour : 

```javascript
export default Ember.Component.extend({
  attributeBindings: 'userName:name',
  userName: function () {
      return this.get('user.fullName');
  }.property('user.fullName')
});
```

Ces mécanismes permettent donc de propager naturellement aux composants, via leurs parents, des changements d'états intervenus à d'autres endroits de l'application.

{% endraw %}

<div class="work answer">
  {% capture m %}
  {% raw %}

1. Modifier le composant ``image-cover`` pour passer sur une version full javascript 
   * Supprimer le fichier de tempates et créer le composant javascript
   * Faire en sorte de supprimer la div englobante tout en conservant le fonctionnement du composant
   
   **Tests** : Ces modifications doivent conserver passant le test [image-cover-test - renders image-cover](TODO link) et
   rendre passant le test [renders image-cover - root is image](TODO link)
   
   > ```javascript
   > // app/components/image-cover.js
   > 
   > import Ember from 'ember';
   > 
   > export default Ember.Component.extend({
   >   tagName: 'img',
   >   classNames: 'cover',
   >   attributeBindings: 'src',
   >   src: function () {
   >     return `/assets/images/comics/covers/${this.get('name')}.jpg`;
   >   }.property('name')
   > });
   > ```
   >
   > On note au passage l'utilisation des *littéraux de gabarits (template literals)* ES6. cf. [MDN](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Litt%C3%A9raux_gabarits)
   
  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>

{% raw %}

### Evènements utilisateurs (DOM)

Une autre forme évidente d'interaction consiste à demander à un composant de réagir à différents évènements DOM le concernant (c'est à dire intervenant sur la portion d'arbre DOM qu'il gère).

Cela se fait simplement en déclarant dans le composant une fonction du même nom que l'évènement auquel on souhaite que le composant réagisse. La liste des évènements gérés nativement
est disponible dans la [documentation officielle](https://guides.emberjs.com/v2.4.0/components/handling-events/#toc_event-names). 

Un paramètre est passé automatiquement à la function. Il contient l'évènement d'origine afin de permettre la récupération d'informations complémentaires (data, origine, etc.). L'évènement
n'est pas consommmé et continue à être propagé au sein de l'arbre d'appel. Il est possible de stopper cette propagation en renvoyant `false`.

```javascript
export default Ember.Component.extend({
  click(event) {
      // do whatever you want
      ...
      
      // stop event propagation if you want
      return false; 
  }
});
```

Il est possible de permettre explicitement à une application [Ember][ember] de de gérer des évènements personnalisés via la propriété ``customEvents``. 
De manière plus générale, cette propriété permet de définir de nouveaux gestionnaires pour des évènements non pris en charge nativement mais également de neutraliser la gestion de certains évènements.
Les évènements non pris en charge peuvent être des évènements DOM standard non pris en charge ou même des évènements plus métiers.

**NB** : 

* La déclaration de la prise en charge de ces nouveaux évènements se fait au niveau de l'application et non du composant.
* Les évènements DOM doivent être des [Bubble events](https://en.wikipedia.org/wiki/DOM_events). Les autres évènements ne peuvent être interceptés.

Ainsi le code suivant ajoute un gestionnaire pour l'évènement ``paste`` et supprime celui du ``doubleClick`` utilisateur. Le label associé à l'évènement correspond au nom du gestionnaire
qui sera invoqué lors de la survenue de l'évènement : 

```javascript
export default Ember.Application.extend({
  customEvents: {
      // add support for the paste event
      paste : 'paste',
      
      // remove support for click event
      doubleClick: null
  }
});
```

Ainsi, chaque composant pourra déclarer un gestionnaire  ``paste`` de cette manière : 

```javascript
export default Ember.Component.extend({
  paste() {
      // ...
  }
});
```


{% endraw %}

<div class="work answer">
  {% capture m %}
  {% raw %}

1. Créer un composant ``fav-btn`` qui va mettre en place un bouton permettant de sélectionner / désélectionner un comic en favori
   * il doit porter la classe ``btn-fav``
   * le comic est considéré favori si sa propriété ``isFavorite`` est à ``true``
   * le clic sur le bouton doit changer l'affichage en positionnant / enlevant la classe ``selected`` sur ce composant
   * le clic doit inverser la valeur de la propriété ``isFavorite`` du comic
   * modifier les templates ``comic/index.hbs`` et ``comic/edit.hbs`` pour intégrer ce composant juste en dessous de l'élément racine. L'appel doit être de cette forme : 
    
     ```html
     {{fav-btn selected=...}}
     ```
   
   **Test** : Ces modifications doivent rendre passant les tests [renders fav-btn](TODO link), 
   [update fav-btn after external change](TODO link) 
   et [update fav-btn after click](TODO link)
   
   > ```javascript
   > // app/components/fav-btn.js
   > 
   > import Ember from 'ember';
   > 
   > export default Ember.Component.extend({
   >   tagName: 'span',
   >   classNames: 'btn-fav',
   >   classNameBindings: 'selected',
   > 
   >   click: function () {
   >     this.toggleProperty('selected');
   >   }
   > });
   > ```
   
  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>

{% raw %}

### Interactions enfants -> parents (actions)

Enfin, la dernière forme d'interaction concerne la communication *ascendante*, c'est à dire depuis un composant enfant vers son ou ses parents. Cette mécanique s'appuie sur des 
**actions**. Ainsi chaque composant peut, tout comme les contrôleurs, définir des gestionnaires d'actions via le hash ``actions: {}``. Mais ils peuvent également déclencher ou
exécuter des actions pour communiquer avec leurs parents.

Pour des raisons historiques, il existe deux modes de déclaration et de gestion des actions. Les actions peuvent ainsi être définies :

* Sous forme de libellés par le composant (*element space actions*). Ce libellé, ainsi que d'éventuels paramètres peuvent être levés par le composant et propagés. L'action est 
  exécutée par le parent avec les paramètres passés par le composant.
* Sous forme de fonctions (*closure actions*) définies et implémentées par le ou les parents. La fonction est alors passée en propriété du composant. L'action est exécutée par 
  l'enfant à qui l'on a passé l'action.

#### Element space actions

Dans cette première forme, à l'issue d'un traitement (après la gestion du'un évènement DOM par exemple), un composant peut appeler la méthode ``sendAction`` pour propager une action
et avertir ainsi ses parents.

Cette méthode prend en premier paramètre le nom de l'action. Sans paramètre, c'est le nom par défaut "action" qui est pris. Tous les paramètres suivants seront vu comme des paramètres, 
le contexte d'exécution de l'action et remontés en même temps que le nom de l'action.

```javascript
export default Ember.Component.extend({
  ...

  click() {
    ...
    this.sendAction(); // === this.sendAction('action');
    this.sendAction('other', argument);
  }
});
```

Il est important de comprendre que cette méthode ne propage pas l'action ``'action'`` au travers de l'arbre des composants mais l'action définie lors de la définition du composant. Ainsi, 
le composant définit de la manière suivante :

```html
{{my-component action='customAction' onSubmit='save'}}
```

... entraînera l'éxécution de l'action ``'customAction'`` lors d'un ``this.sendAction()`` et de l'action ``'save'`` lors d'un ``this.sendAction('onSubmit', args)``. Ces deux actions sont à définir
dans l'un des parents du composant (autre composant, controlleur, routes). L'action est propagée au travers de l'arbre hiérarchie, jusqu'à trouver un gestionnaire.

```javascript
// route
actions: {
    save() {
      ...
    },
    customAction(args) {
      ...
    }
  }
```

#### Closure actions

Dans cette seconde forme, l'élément parent a passé au composant l'action elle-même, c'est à dire une fonction javascript. Le composant est donc en mesure d'exécuter directement cette méthode
en lui ajoutant les paramètres dont il dispose localement.

Ainsi la définition s'effectue de la manière suivante : 

```html
{{my-component action=(action 'customAction') onSubmit=(action 'save')}}
```

... et l'exécution : 

```javascript
export default Ember.Component.extend({
  ...

  click() {
    ...
    this.get('action')();
    this.get('onSubmit')(argument);
  }
});
```

Tout comme dans le cas des [closure actions vues au chapitre précédent](../actions-controllers#types-dactions), ces actions ne *bubblent* pas et doivent être explicitement définies dans le composant
ou le contrôleur le plus proche du composant. Si nécessaire, elles peuvent être propagées via l'utilisation d'autres actions au travers de l'appel à la méthode ``send`` :
 
```javascript
cancel() {
  this.send('onCancel');
}
```

Les deux formes coexistent et sont partiellement compatibles mais il semble que la seconde soit celle qui doive perdurer. Cependant le statut n'est pas clair aujourd'hui et la seconde forme, si elle
parait plus riche, puisque l'action est disponible à tout instant, introduit des contraintes supplémentaires telles que la nécessité absolue de les définir au plus bas niveau et de gérer manuellement 
une éventuelle propagation. Toutes les questions n'ont donc pas encore été adressées à ce sujet. Il est donc possible d'utiliser la forme qui nous convient le mieux.

A noter qu'il est possible de mixer certaines notations même si ce n'est pas l'option la plus lisible et donc pas celle à privilégier. Par exemple :

```html
{{my-component action='customAction' onSubmit=(action 'save')}}
```

```javascript
export default Ember.Component.extend({
  mouseOver() {
    this.get('action')();
  },
  click() {
    this.sendAction('save');
  }
});
```

{% endraw %}

<div class="work answer">
  {% capture m %}
  {% raw %}

1. Modifier le composant ``fav-btn`` de manière à propager une action en fin de méthode ``click()``
   * le gestionnaire d'action doit simplement permettre de logger, dans la route, le message suivant : ``<comic.slug> - favorite: <comic.isFavorite>``
   * cette action doit être exécutée aussi bien en consultation qu'en édition 
   * les deux typologies d'actions définies plus haut peuvent être indifférement utilisées
   * utiliser impérativement [Ember.Logger.debug](http://emberjs.com/api/classes/Ember.Logger.html#method_debug) pour cette opération
    
     La classe ``Ember.Logger`` offre une simple surcoûche à l'objet natif ``console`` permettant de s'abstraire d'éventuelles problématiques et API non
     standard, propre à chaque navigateur. En l'occurence, l'utilisation de cette classe nous permet également d'intercepter la fonction de log pour des besoins de tests.
   
   **Test** : Ces modifications doivent rendre passant les tests [04 - Components - 01 - Should log on index](TODO link)
   et [04 - Components - 02 - Should log on edit](TODO link)
   
   > **Element space actions**
   >
   > ```javascript
   > // app/components/btn-fav.js
   > export default Ember.Component.extend({
   >   tagName: 'span',
   >   classNames: 'btn-fav',
   >   classNameBindings: 'selected',
   > 
   >   click() {
   >     this.toggleProperty('selected');
   >     this.sendAction();
   >   }
   > });
   > ```
   >
   > ```html
   > {{!-- app/templates/comic/index.hbs --}}
   > ...
   > {{fav-btn selected=model.isFavorite action="favorize"}}
   > ...
   > ```
   >
   > ```html
   > {{!-- app/templates/comic/edit.hbs --}}
   > ...
   > {{fav-btn selected=model.isFavorite action="favorize"}}
   > ...
   > ```
   >
   > ```javascript
   > // app/routes/comic.js
   > export default Ember.Route.extend({
   >   ...
   >   actions: {
   >     favorize () {
   >       let model = this.modelFor(this.routeName);
   >       Ember.Logger.debug(model.get('slug'), '- favorite:', model.get('isFavorite'));
   >     }
   >   }
   > });
   > ```
   
   > **Closure actions**
   >
   > ```javascript
   > // app/components/btn-fav.js
   > export default Ember.Component.extend({
   >   tagName: 'span',
   >   classNames: 'btn-fav',
   >   classNameBindings: 'selected',
   > 
   >   click() {
   >     this.toggleProperty('selected');
   >     this.get('action')();
   >   }
   > });
   > ```
   >
   > ```html
   > {{!-- app/templates/comic/index.hbs --}}
   > ...
   > {{fav-btn selected=model.isFavorite action=(action "favorize")}}
   > ...
   > ```
   >
   > ```html
   > {{!-- app/templates/comic/edit.hbs --}}
   > ...
   > {{fav-btn selected=model.isFavorite action=(action "favorize")}}
   > ...
   > ```
   >
   > ```javascript
   > // app/controllers/comic/index.js
   > export default Ember.Controller.extend({
   > 
   >   actions: {
   >     favorize() {
   >       this.send('onFavorize');
   >     }
   >   }
   > });
   > ```
   >
   > ```javascript
   > // app/controllers/comic/edit.js
   > export default Ember.Controller.extend({
   > 
   >   actions: {
   >     ...
   >     favorize() {
   >       this.send('onFavorize');
   >     }
   >   }
   > });
   > ```
   >
   > ```javascript
   > // app/routes/comic.js
   > export default Ember.Route.extend({
   >   ...
   >   actions: {
   >     onFavorize () {
   >       let model = this.modelFor(this.routeName);
   >       Ember.Logger.debug(model.get('slug'), '- favorite:', model.get('isFavorite'));
   >     }
   >   }
   > });
   > ```
   
  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>

{% raw %}

## Cycle de vie des composants

{% endraw %}


[ember]: http://emberjs.com/

