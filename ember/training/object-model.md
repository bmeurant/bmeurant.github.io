---
layout: page
title: Formation Ember
permalink:  object-model/
prev: ember/training/overview
next: ember/training/ember-cli
---

{% raw %}

## Modèle objet

Avec `Ember`, la quasi totalité des objets utilisés est dérivée d'une classe de base, la classe ``Ember.Object`` : les contrôleurs, les vues, les modèles, l'application elle-même.

C'est cette classe qui permet aux objets `Ember` de partager des comportements communs. Chaque objet `Ember` est ainsi capable d'observer les valeur de propriétés portées par d'autres objets, d'éventuellement lier leurs propres propriétés à celles des objets observer, de construire et d'exposer des propriétés calculées, etc.

Nous allons explorer pas à pas certains de ces comprtements. Pour cela, il faut en premier lieu disposer de l'objet `Ember` lui-même.

1. Créer un fichier html mettant en place un contexte Ember simple :

    ```html
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Ember Object model</title>
          <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
          <script src="http://builds.emberjs.com/tags/v1.13.3/ember.debug.js"></script>
        </head>
        <body>

        </body>
      </html>
    ```

2. Ouvrir ce fichier dans un navigateur, console Javascript ouverte.

    La console doit être exempte d'erreur et afficher l'information suivante :

    ```javascript
      DEBUG: For more advanced debugging, install the Ember Inspector from   https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi
    ```

3. Entrer ``Ember`` dans la console

    La réponse doit être un objet de type : ``Object {__loader: Object, imports: Window, lookup: Window, exports: Window, isNamespace: true…}``

    On constate, en développant cet objet, qu'il contient l'ensemble des objets et fonctions du framework. En particulier la classe ``Ember.Object`` que nous allons manipuler.

### Classes et instances

#### Definition

Pour définir et utiliser un nouvel objet `Ember`, il est nécessaire d'étendre - au minimum - la classe `Ember.Object` via la méthode ``extend()``.

1. Dans la console, créer une classe `Series` qui étend `Ember.Object` et définit une méthode `displayTitle` affichant en console une châine de caractères (le titre) passée en paramètre.

    > ```javascript
    > Series = Ember.Object.extend({
    >   displayTitle: function(title) {
    >     console.log(title);
    >   }
    > });
    > ```

2. Instancier cette classe et afficher un titre dans la console

    > ```javascript
    > one = new Series();
    > one.displayTitle("titre");
    > ```

#### Initialisation

1. On souhaite désormais initialiser l'objet à sa création avec un titre et afficher ce titre plutôt qu'un paramètre de méthode. Modifier la classe `Series` en conséquence et créer l'objet via la méthode [create()](http://emberjs.com/api/classes/Ember.Object.html#method_create) d'`Ember` en initialisant un champs `title`.

    > ```javascript
    > Series = Ember.Object.extend({
    >   displayTitle: function() {
    >     console.log(this.title);
    >   }
    > });
    >
    > one = Series.create({title: "My Title"});
    > one.displayTitle();
    > ```

    L'utilisation de la méthode [create()](http://emberjs.com/api/classes/Ember.Object.html#method_create) en lieu et place d'un simple `new` permet l'initialisation de propriétés via un objet passé en paramètre. La méthode `create` permet également d'effectuer des opérations d'initialisations complémentaires via l'appel de la méthode [init()](http://emberjs.com/api/classes/Ember.Object.html#method_init).

2. Ajouter une méthode d'initialisation qui réalise un simple log console du titre passé au create. Le résultat doit être le suivant :

    ```javascript
    one = Series.create({title: "My Title"});
    > My Title
    ```

    > ```javascript
    > Series = Ember.Object.extend({
    >   init: function() {
    >     console.log(this.title);
    >   },
    >   displayTitle: function() {
    >     console.log(this.title);
    >   }
    > });
    > ```

{% endraw %}