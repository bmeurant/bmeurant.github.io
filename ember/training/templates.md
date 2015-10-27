---
layout: ember-training
title: Formation Ember
permalink:  templates/
prev: ember/training/ember-cli
next: ember/training/routing
---

{% raw %}

## Templating

Les ``templates`` ou ``gabarits`` sont des fragments de code HTML qui peuvent être enrichis par des expressions (encadrées par la notation ``{{}}``) via le moteur de template [Handlebars](handlebars). Ces expressions
permettent d'intégrer dynamiquement dans les fragments HTML la ou les valeurs d'objets javascript ainsi que le résultats d'exécution d'opérateurs logiques (``helpers``) proposés par
[Handlebars](handlebars) ou développés au projet sous forme de contributions.

Au sein de la structure de projet [Ember CLI](ember-cli) les templates se trouvent, dans le dossier ``app/templates`` puis, par convention, sont nommés et organisés en fonction de la route active (cf. chapitre [routing](../routing)).
Il s'agit de fichiers à l'extension ``.hbs`` et dont la syntaxe correspond à des marqueurs HTML enrichis d'expressions [Handlebars](handlebars) via la notation ``{{}}``. [Ember CLI](ember-cli) ou tout autre forme d'outillage
(plugins gulp, grunt, etc.) s'occupe, lors du déploiement de l'application ``Ember`` (via la commande ``server``) ou de son packaging (via la commande ``build``), du traitement de l'ensemble de ces templates. Ceux-ci
sont rassemblés, identifiés et compilés sous la forme de fonctions javascript qui pourront être exécutées dynamiquement en fonction de paramètres représentant les expressions dynamiques du template et donc refléter
les changements survenus sur les objets javascript attachés à ce template. Nous reviendrons plus loin (cf. ``bindings``) sur ce sujet.


### HTML

La fonction la plus basique d'un template [Handlebars](handlebars) consiste donc à afficher tel quel un fragment HTML. Sans autre forme d'opération. C'est précisément ce que fait le template par défaut de l'application
tel qu'il a été généré par [Ember CLI](ember-cli) :

```html
<!-- /app/templates/application.hbs -->

<h2 id="title">Welcome to Ember</h2>

{{outlet}}
```

On ignore pour le moment l'expression ``{{outlet}}`` liée aux opérations de ``routing`` sur lesquelles nous reviendrons juste après (cf. [routing](../routing)). On note tout de même la convention de nommage de ce fichier,
placé à la racine du répertoire ``templates`` et nommé ``application``. Il s'agit là de l'application des conventions de nommage d'``Ember`` et est, une fois encore, très étroitement lié au routeur d'``Ember`` abordé
au chapitre [routing](../routing). Retenons pour le moment qu'il s'agit du template principal de l'application dans lequel viendront s'imbriquer successivement l'ensemble des autres templates.

Commençons simplement par modifier le titre de l'application par "Comic books library". On constate que l'application est mise à jour et rechargée à la volée par [Ember CLI](ember-cli) et à l'exécution préalable de la
commande ``ember server``. Via cette commande, en effet, l'application est lancée et, lors de toute modification d'un fichier source, [Ember CLI](ember-cli) se charge d'exécuter l'*asset pipeline* et de recharger 
l'application.

### Bindings

Un language et d'un moteur de templating tel qu'[Handlebars](handlebars) serait inutile si il ne s'agissait que d'afficher ou d'assembler que du HTML statique. L'intérêt consiste à injecter dans ce template des valeurs
et expressions dynamiques en fonction des données et de la logique de l'application.

Il est au préalable nécessaire de créer un objet javascript contenant les données que l'on souhaite injecter. Cette opération s'effectue en manipulant les notions de ``model`` et de ``Route`` de la manière suivante.
On expliquera ces notions en détail dans le chapitre [routing](../routing), admettons pour le moment que nous avons un fichier ``app/routes/application.js`` :

(On note l'utilisation des modules Ecmascript 6 rendue possible par la transpilation par [Ember CLI](ember-cli). cf. [chapitre précédent](../ember-cli))
 
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
    > 2. En utilisant les outils proposés par le modèle objet d'Ember, on constate que le template est automatiquement mis à jour lorsque l'on modifie l'objet. C'est ce que l'on appelle le **Binding**.

{% endraw %}

[handlebars]: http://handlebarsjs.com/
[ember-cli]: http://www.ember-cli.com/