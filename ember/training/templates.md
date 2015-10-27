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

Au sein de la structure de projet [Ember CLI](ember-cli) les templates se trouvent, dans le dossier ``app/templates`` puis, par convention, sont nommés et organisés en fonction de la route active (cf. chapitre [routing](routing)).
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

On ignore pour le moment l'expression ``{{outlet}}`` liée aux opérations de ``routing`` sur lesquelles nous reviendrons juste après (cf. [routing](routing)). On note tout de même la convention de nommage de ce fichier,
placé à la racine du répertoire ``templates`` et nommé ``application``. Il s'agit là de l'application des conventions de nommage d'``Ember`` et est, une fois encore, très étroitement lié au routeur d'``Ember`` abordé
au chapitre [routing](routing). Retenons pour le moment qu'il s'agit du template principal de l'application dans lequel viendront s'imbriquer successivement l'ensemble des autres templates.

Commençons simplement par modifier le titre de l'application par "Comic books library". On constate que l'application est mise à jour et rechargée à la volée par [Ember CLI](ember-cli) et à l'exécution préalable de la
commande ``ember server``. Via cette commande, en effet, l'application est lancée et, lors de toute modification d'un fichier source, [Ember CLI](ember-cli) se charge d'exécuter l'*asset pipeline* et de recharger 
l'application.

### Bindings

{% endraw %}

[handlebars]: http://handlebarsjs.com/
[ember-cli]: http://www.ember-cli.com/
[routing]: ../routing