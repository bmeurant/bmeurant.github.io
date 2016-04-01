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

* de composants de type *inline* :
 
```html
{{my-component}}
```
   
* de composants de type "block" encapsulant du contenu :  

```html
{{#my-component}}<p>anything</p>{{/my-component}}
```

## Passage de paramètres

Il est bien entendu possible de passer des paramètres aux composants afin qu'ils puissent les afficher voire les manipuler. Ce passage de paramètres se fait tout naturellement
selon une syntaxe d'attribut html de type ``nom=valeur``. La valeur pouvant évidemment être un objet complexe. Aini la déclaration suivante : 

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

Les deux paramètres ``title`` (litéral) et ``user`` (complexe) ont donc été passé au composant qui peut alors les manipuler. Dans le cas précis il effectue un simple affichage

{% endraw %}

<div class="work answer">
  {% capture m %}
  {% raw %}

1. On souhaite afficher l'image de couverture pour chaque comic juste après le titre. Comme on anticipe que l'on aura besoin de réutiliser cet élément (dans une future notion d'album ?),
on va en faire un composant. 
   * Créer un composant `image-cover` très simple (template uniquement) affichant la couverture du comic dans une image de classe `cover`.
   * Copier les images de couverture en copiant [ce repertoire](https://github.com/bmeurant/ember-training/tree/master/public/assets/images) vers ``public/assets/images``
   * Pour le moment, se contenter d'afficher, pour tous les comics, la couverture par défaut (``public/assets/images/comics/covers/default.jpg``) 
   * Mettre à jour le template ``app/templates/comic/index.hbs`` pour ajouter l'appel du composant juste après le titre 
   
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

### Classes

De la même manière il est possible de spécifier le ou les noms de classe(s) associés au composant via la propriété ``classNames``. Cette propriété attend soit une chaîne de caractère avec le nom de la classe unique
à ajouter au composant soit un tableau de chaînes de caractères dans le cas de classes multiples : 

```javascript
export default Ember.Component.extend({
  classNames: ['btn', 'success']
});
```

Il est également possible de positionner des classes sur l'élément racine d'un composant en fonction de critères applicatifs - de la valeur d'une propriété booléenne en l'occurrence. Cela s'effectue grâce
à la propriété ``classNameBindings``. La présence d'une classe sur le composant dépend ainsi de la valeur de la propriété booléenne associée sur le format ``<prop>:<classIfTrue>:<classIfFalse>``.

```javascript
export default Ember.Component.extend({
  classNameBindings: 'isSuccess:success:error',
  isSuccess: true
});
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
  attributeBindings: 'name:userName',
  userName: "username"
});
```

Cela permet notamment de définir des valeurs d'attributs à partir de valeurs de paramètres passés au composant.

### Paramètres dynamiques et computed properties

Il est nécessaire de rappeler explicitement que les paramètres passés dynamiquement aux composants ne sont, par définition, pas disponibles au moment de la déclaration des propriétés de notre composant. Ainsi,
la syntaxe suivante (où `user` est passé au composant par le template englobant) ne peut pas fonctionner :

```javascript
export default Ember.Component.extend({
  attributeBindings: 'name:userName',
  userName: user.get('fullName')
});
```

En effet, au moment de la déclaration de ``userName``, ``user`` n'est pas définit et la valeur ne serait, à fortiori pas mise à jour lors du changement de la valeur ``user.fullName``. Il est donc nécessaire
d'utiliser une **computed property** : 

```javascript
export default Ember.Component.extend({
  attributeBindings: 'name:userName',
  userName: function () {
      return this.get('user.fullName');
  }.property('user.fullName')
});
```

{% endraw %}

<div class="work answer">
  {% capture m %}
  {% raw %}

1. Modifier le composant ``image-cover`` pour passer sur une version full javascript 
   * Supprimer le fichier de tempates et créer le composant javascript
   * Faire en sorte de supprimer la div englobante tout en conservant le fonctionnement du composant
   
   **Test** : Ces modifications doivent conserver passant le test [image-cover-test - renders image-cover](TODO link) et
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

  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>

{% raw %}

{% endraw %}


[ember]: http://emberjs.com/

