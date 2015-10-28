---
layout: ember-training
title: Formation Ember
permalink:  templates/
prev: ember/training/ember-cli
next: ember/training/routing
---

{% raw %}

## Templating

Les ``templates`` ou ``gabarits`` sont des fragments de code HTML qui peuvent être enrichis par des expressions (encadrées par la notation ``{{}}``) via le moteur de template [Handlebars][handlebars]. Ces expressions
permettent d'intégrer dynamiquement dans les fragments HTML la ou les valeurs d'objets javascript ainsi que le résultats d'exécution d'opérateurs logiques (``helpers``) proposés par
[Handlebars][handlebars], par [Ember][ember] ou développés au projet sous forme de contributions.

Au sein de la structure de projet [Ember CLI][ember-cli] les templates se trouvent, dans le dossier ``app/templates`` puis, par convention, sont nommés et organisés en fonction de la route active (cf. chapitre [routing](../routing)).
Il s'agit de fichiers à l'extension ``.hbs`` et dont la syntaxe correspond à des marqueurs HTML enrichis d'expressions [Handlebars][handlebars] via la notation ``{{}}``. [Ember CLI][ember-cli] ou tout autre forme d'outillage
(plugins gulp, grunt, etc.) s'occupe, lors du déploiement de l'application ``Ember`` (via la commande ``server``) ou de son packaging (via la commande ``build``), du traitement de l'ensemble de ces templates. Ceux-ci
sont rassemblés, identifiés et compilés sous la forme de fonctions javascript qui pourront être exécutées dynamiquement en fonction de paramètres représentant les expressions dynamiques du template et donc refléter
les changements survenus sur les objets javascript attachés à ce template. Nous reviendrons plus loin (cf. ``bindings``) sur ce sujet.


### HTML

La fonction la plus basique d'un template [Handlebars][handlebars] consiste donc à afficher tel quel un fragment HTML. Sans autre forme d'opération. C'est précisément ce que fait le template par défaut de l'application
tel qu'il a été généré par [Ember CLI][ember-cli] :

```html
<!-- /app/templates/application.hbs -->

<h2 id="title">Welcome to Ember</h2>

{{outlet}}
```

On ignore pour le moment l'expression ``{{outlet}}`` liée aux opérations de ``routing`` sur lesquelles nous reviendrons juste après (cf. [routing](../routing)). On note tout de même la convention de nommage de ce fichier,
placé à la racine du répertoire ``templates`` et nommé ``application``. Il s'agit là de l'application des conventions de nommage d'``Ember`` et est, une fois encore, très étroitement lié au routeur d'``Ember`` abordé
au chapitre [routing](../routing). Retenons pour le moment qu'il s'agit du template principal de l'application dans lequel viendront s'imbriquer successivement l'ensemble des autres templates.

<div class="work">Exercice</div>

* Commençons simplement par modifier le titre de l'application par `"Comic books library"`. On constate que l'application est mise à jour et rechargée à la volée par [Ember CLI][ember-cli] et à l'exécution préalable de la
  commande ``ember server``. Via cette commande, en effet, l'application est lancée et, lors de toute modification d'un fichier source, [Ember CLI][ember-cli] se charge d'exécuter l'*asset pipeline* et de recharger 
  l'application.

### Data binding

Un language et d'un moteur de templating tel qu'[Handlebars][handlebars] serait inutile si il ne s'agissait que d'afficher ou d'assembler que du HTML statique. L'intérêt consiste à injecter dans ce template des valeurs
et expressions dynamiques en fonction des données et de la logique de l'application.

<div class="work">Exercice</div>

Il est au préalable nécessaire de créer un objet javascript contenant les données que l'on souhaite injecter. Cette opération s'effectue en manipulant les notions de ``model`` et de ``Route`` de la manière suivante.
On expliquera ces notions en détail dans le chapitre [routing](../routing), admettons pour le moment que nous avons un fichier ``app/routes/application.js`` :

(On note l'utilisation des modules Ecmascript 6 rendue possible par la transpilation par [Ember CLI][ember-cli]. cf. [chapitre précédent](../ember-cli))
 
```javascript
// app/routes/application.js

import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    // WARN : SOULD NOT BE DONE : We should not affect anything to windows but 
    // for the exercice, we want to access to series from console today
    window.series = {title: "BlackSad"};

    return series;
  }
});
```

On peut ensuite utiliser cet objet dans notre template : 

```html
<h2 id="title">Comic books library</h2>

<ul>
  <li>{{model.title}}</li>
</ul>

{{outlet}}
```

On constate que notre application affiche désormais une liste avec le nom la série que nous avons créée et injectée dans le template

<div class="work">Exercice</div>

* Ouvrir la console javascript et modifier le titre de la série. Quels sont les deux constats majeurs que l'on peut effectuer ?

    > ```javascript
    > > series
    > Object {__ember_meta__: Meta}
    > 
    > > series.title = "new title"
    > Uncaught EmberError {description: undefined, fileName: undefined, lineNumber: undefined, message: "Assertion Failed: You must use Ember.set() to set … `title` property (of [object Object]) to `test`.", name: "Error"…}
    >
    > > Ember.set(series, 'title', 'new title');
    > "new title"
    > ```
    
    > On constate les choses suivantes : 
    >
    > 1. L'objet 'series' créé a été enrichi par Ember. De ce fait, on ne peut doit plus et on ne peut plus manipuler directement ses propriétés sans accesseurs. cf [Modèle objet](../object-model)
    > 2. En utilisant les outils proposés par le modèle objet d'Ember, on constate que le template est automatiquement mis à jour lorsque l'on modifie l'objet. C'est ce que l'on appelle le **Data binding**.


### Binding dans des attributs HTML

Le *binding*, via la notation ``{{}}`` peut s'effectuer au sein d'un élément HTML mais il peut également être nécessaire de dynamiser le contenu des attributs eux-même : noms de classes, url source d'une image ou
d'un lien, etc.

Depuis la [version 1.11](http://emberjs.com/deprecations/v1.x/#toc_bind-attr), la syntaxe pour le *binding* d'attributs est similaire à celle utilisée pour le *binding* d'éléméents :
 
```html
<div title={{series.title}} class="series {{if series.author 'with-author' 'no-author'}}"></div>
```

De la même manière que pour le *binding* d'éléments, le template est mis à jour automatiquement lors de la mise à jour du modèle. Cela peut s'avérer très utile pour conditionner les classes portées par
un élément et donc son affichage d'un éléments en fonction de l'état des données injectées.

### Helpers

[Handlebars][handlebars] et [Ember][ember] propose de nombreux *helpers* qui permettent d'introduire un minimum de logique au sein de nos templates. Ces *helpers* peuvent être de types différents :

* **blocks** : C'est le cas majoritaire. Ces *helpers* englobent des éléments HTML (et / ou d'autres *helpers*) au sein d'un bloc comprenant un début et une fin.

C'est le cas, par exemple du *helper* ``each`` : 

```html
<ul>
  {{#each model as |series|}}
    <li>{{series.title}}</li>
  {{/each}}
</ul>
```

Ou encore du *helper* ``if`` :

```html
{{#if series.author}}
  by {{series.author}}
{{else}}
  by unknown author
{{/if}}
```

* **inline** : Ce type de *helper* n'encapsule pas un block HTML mais exécute une seule instruction.
 
C'est le cas du *helper* ``log`` : 

```html
{{log "Model log: " model}}
```

Ou d'une autre sorte de *helper* ``if`` :

```html
<li>{{series.title}} by {{if series.author series.author "unknown author"}}</li>
```

Les *helpers inline* sont fréquement utilisés pour dynamiser les valeurs d'attributs HTML :

```html
<div class={{if isSelected 'current'}}>
  ...
</div>
  ```
  
A noter que les *helpers* (et notament les *helpers inline*) peuvent être imbriqués (*nested*) à l'aide de parenthèses ``()``


On retiendra les *hepers* [Handlebars][handlebars] principaux :

* conditionnels : ``if`` & ``unless``
* listes et collections : ``each`` avec l'aide de ``this``, ``@index``, ``@key``, ``@first``, ``@last``
* scope : ``with``
* log : ``log``

La liste complète des *helpers* [Handlebars][handlebars] natifs est accessible dans la [documentation](http://handlebarsjs.com/builtin_helpers.html).

[Ember][ember] ajoute à cela un certain nombre de *helpers* spécifiques à la construction d'applications [Ember][ember] en facilitant la manipulation d'objets [Ember][ember].
Il peut s'agir, selon les cas, de nouveaux *helpers* ou d'enrichissements portant sur des *helpers* [Handlebars][handlebars] existant.


On retiendra les *helpers* [Ember][ember] principaux :

* accès dynamique à une propriété : ``get``
* listes et collections : ``each-in`` pour parcourir les propriétés d'un objet ainsi q'une extension du ``each`` [Handlebars][handlebars] conservant le scope.
* navigation : ``link-to`` en inline ou en block et ``query-param``, ``outlet``
* évènements : ``action`` pour propager des évènements vers des composants depuis des interractions sur des éléments HTML
* formulaires : ``input``, ``textarea`` 
* instantiation & rendering : ``component``, ``render``, ``partial``
* développement : ``debugger``

La liste complète des *helpers* [Ember][ember] est accessible dans la [documentation](http://emberjs.com/api/classes/Ember.Templates.helpers.html).

[Ember][ember] et [Handlebars][handlebars] facilitent enfin la création et la contribution de nouveaux *helpers* via la fonction ``registerHelper`` d'[Handlebars](http://handlebarsjs.com/#helpers),
la commande ``ember generate helper helper-name`` ou la contribution directe dans le dossier ``app/helpers``. cf [Ember documentation](http://guides.emberjs.com/v2.1.0/templates/writing-helpers/) & 
[Ember CLI documentation](http://www.ember-cli.com/user-guide/#resolving-handlebars-helpers) sur le sujet (attention au `-` obligatoire dans le nom pour [Ember CLI][ember-cli].

{% endraw %}

[handlebars]: http://handlebarsjs.com/
[ember-cli]: http://www.ember-cli.com/
[ember]: http://emberjs.com/