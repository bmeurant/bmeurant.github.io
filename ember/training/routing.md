---
layout: ember-training
title: Formation Ember - Routing
permalink:  routing/
prev: ember/training/templates
next: ember/training/ember-data
---

**NB :** *Les exercices de cette section seront validés par le passage des [cas de tests associés](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/02-routing-test.js).
Il est donc nécessaire, en premier lieu, de copier ce ou ces fichiers de test dans le projet.*

## Routeur

Le routeur est un composant central d'[Ember][ember]. Loin de constituer une pièce rapportée venant compléter un framework existant il en est la pierre angulaire. 
La compréhension et la manipulation du **routeur** et des **routes** est donc capitale dans l'appréhension du développement avec [Ember][ember].

Le routeur [Ember][ember] est unique au sein d'une application, c'est lui qui déclare les différentes **routes** qui seront proposées au sein de celle-ci et qui définit, le cas
échéant, les chemins personnalisés, paramètres, routes imbriquées, etc.

Si l'on examine le routeur de notre application, tel que créé par [Ember CLI][ember-cli], il est vide puisque nous n'avons créé aucune route pour le moment. 

```javascript
// app/router.js

import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
});

export default Router;
```

Il n'y a pas grand chose à dire sur cet élément pour le moment. Tout juste peut-on noter la récupération, depuis le système de gestion et de configuration des environnements d'[Ember][ember],
d'un paramètre permettant de déterminer la manière dont seront construites ou résolues les URLs de notre application. Se reporter à la 
[documentation](http://emberjs.com/api/classes/Ember.Location.html) pour plus de détails.

Le fait que le routeur soit vide ne signifie pas pour autant qu'aucune route n'existe. Nous avons d'ailleurs pu constater que la route ``application`` (``/``) existait et était personnalisable.
[Ember][ember] génère en effet pour nous des [Routes implicites](#routes-implicites) que nous aborderons plus loin.

## Routes



## Routes imbriquées

## Routes implicites
 
[handlebars]: http://handlebarsjs.com/
[ember-cli]: http://www.ember-cli.com/
[ember]: http://emberjs.com/