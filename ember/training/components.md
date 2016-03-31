---
layout: ember-training
title: Formation Ember - Composants
permalink:  ember/training/components
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
   * Créer un composant très simple (template uniquement) affichant la couverture du comic dans une image de classe `cover`.
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
   > On retrouve bien le code de notre template mais on constate également qu'il a été encapsulé dans un élément ``div`` englobant attaché par Ember
   > à notre composant.
   

  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>

{% raw %}


[ember]: http://emberjs.com/

