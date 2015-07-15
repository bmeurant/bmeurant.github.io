---
layout: ember-training
title: Formation Ember
permalink:  object-model/
prev: ember/training/overview
next: ember/training/ember-cli
home: ember/training/
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
          <script src="http://builds.emberjs.com/tags/v1.13.3/ember-template-compiler.js"></script>
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

1. Dans la console, créer une classe `Book` qui étend `Ember.Object` et définit une méthode `logTitle` affichant en console une châine de caractères (le titre) passée en paramètre.

    > ```javascript
    > Book = Ember.Object.extend({
    >   logTitle: function(title) {
    >     console.log(title);
    >   }
    > });
    > ```

2. Instancier cette classe et afficher un titre dans la console

    > ```javascript
    > one = new Book();
    > one.logTitle("titre");
    > ```

#### Initialisation

1. On souhaite désormais initialiser l'objet à sa création avec un titre et afficher ce titre plutôt qu'un paramètre de méthode. Modifier la classe `Book` en conséquence et créer l'objet via la méthode [create()](http://emberjs.com/api/classes/Ember.Object.html#method_create) d'`Ember` en initialisant un champs `title`.

    > ```javascript
    > Book = Ember.Object.extend({
    >   logTitle: function() {
    >     console.log(this.title);
    >   }
    > });
    >
    > one = Book.create({title: "My Title"});
    > one.logTitle();
    > ```

    L'utilisation de la méthode [create()](http://emberjs.com/api/classes/Ember.Object.html#method_create) en lieu et place d'un simple `new` permet l'initialisation de propriétés via un objet passé en paramètre. La méthode `create` permet également d'effectuer des opérations d'initialisations complémentaires via l'appel de la méthode [init()](http://emberjs.com/api/classes/Ember.Object.html#method_init).

2. Ajouter une méthode d'initialisation qui réalise un simple log console du titre passé au create. Le résultat doit être le suivant :

    ```javascript
    one = Book.create({title: "My Title"});
    > My Title
    ```

    > ```javascript
    > Book = Ember.Object.extend({
    >   init: function() {
    >     this.logTitle();
    >   },
    >   logTitle: function() {
    >     console.log(this.title);
    >   }
    > });
    > ```


#### Héritage

On peut évidemment étendre une sous classe d'``Ember.Object`` plutôt que ``Ember.Object`` directement. A noter que c'est ce qui est fait chaque fois que l'on étend un objet natif d'``Ember`` puisque
tous étendent ``Ember.Object`` : ``Ember.View``, ``Ember.Controller``, ``Ember.Route``, etc.

Dans le cas d'une route, par exemple :

```javascript
BookRoute = Ember.Route.extend({
  ...
});
```

Dans le cadre de l'héritage d'``Ember.Object``, l'ensemble des méthodes peuvent être surchargées. Les méthodes de la classe mère peuvent être accédées via l'appel de la méthode spéciale ``_super(...)``.

1. Modifier la classe ``Book`` pour lui ajouter une méthode ``logType`` qui affiche "Book". Le résultat doit être le suivant :

    ```javascript
    one = Book.create({title: "My Title"});
    > My Title
    one.logType();
    > Book
    ```

    > ```javascript
    > Book = Ember.Object.extend({
    >   ...
    >   logType: function() {
    >     console.log("Book");
    >   }
    > });
    > ```

2. Définissez une classe ``Series`` qui étend ``Book`` et surcharge la méthode ``logType`` en affichant ``Series`` :

    ```javascript
    one = Series.create({title: "My Title"});
    > My Title
    one.logType();
    > Series
    ```

    > ```javascript
    > Book = Ember.Object.extend({
    >   ...
    >   logType: function() {
    >     console.log("Series");
    >   }
    > });
    > ```

3. Modifier ``Series`` de sorte que ``logType`` affiche également le type de la classe mère :

    ```javascript
    one = Series.create({title: "My Title"});
    > My Title
    one.logType();
    > Book
    > Series
    ```

    > ```javascript
    > Book = Ember.Object.extend({
    >   ...
    >   logType: function() {
    >     this._super();
    >     console.log("Series");
    >   }
    > });
    > ```

    L'appel à la méthode mère doit donc être explicite. Lorsque vous héritez d'un objet Ember (``Controller``, ``View``, ``Route``, etc.) et que vous surchargez la méthode ``init`` dans votre implémentation, soyez sûr de bien appeler la méthode ``_super`` au
    tout début de l'init. Dans le cas contraire, les traitements d'initialisation standard prévus par ``Ember`` ne pourraient pas s'exécuter correctement entyraînant des comportements erratiques.


#### Accesseurs

Jusqu'à présent, nous ne nous sommes pas posé beaucoup de question sur la manière d'accéder aux propriétés des objects ``Ember``. Pourtant, tout ``Ember.Object`` expose des accesseurs qu'il est nécessaire d'utiliser.

1. En se basant sur le code de la classe ``Book`` créée précédement et sur l'instance one, effectuer les opérations suivantes :

    ```javascript
    one.title;
    one.get("title");
    one.title = "new title";
    one.set("title", "new title");
    one.get("title");
    ```

    > Les résultats sont les suivants :
    >
    > ```javascript
    > one.title;
    > > "My Title"
    > one.get("title");
    > > "My Title"
    > one.title = "new title";
    > > Uncaught EmberError { ..., message: "Assertion Failed: You must use Ember.set()" ... }
    > one.set("title", "new title");
    > > Class { ... }
    > one.get("title");
    > > "new title"
    > ```

Lorsqu'on essaie de faire une affectation directe sur une propriété dun ``Ember.Object``, une exception explicite est levée nous obligeant à appeler le setter ``Ember.set()``.

La raison est qu'``Ember`` met en place un certain nombre de mécanismes que nous explorerons par la suite. Parmi ces mécanismes, les ``computed properties``, les ``observers`` ainsi que
l'ensemble des mécanismes de binding du template qui permettent au framework de réagir de manière native et transparent aux changements survenant sur différents objets.

Les mécanismes de binding sont, en particulier, au coeur du moteur de rendu d'``Ember``. Ces mécanismes permettent aux templates html de se mettre automatiquement à jour lors d'un changement
sur un objet et cela de manière performante et ciblé, sans avoir à parcopurir l'ensemble des objets connus.

L'exemple suivant permet de se faire une idée de ce mécanisme. Copier le contenu suivant dans le fichier html créé, juste avant la balise ``</head>``:

```html
<script>

Book = Ember.Object.extend({
  init: function() {
    this.displayTitle();
  },
  displayTitle: function() {
    console.log(this.title);
  },
  logType: function() {
    console.log("Book");
  }
});

Series = Book.extend({
  logType: function() {
    this._super();
    console.log("Series");
  }
});

one = Series.create({title: "My Title"});

App = Ember.Application.create();

App.ApplicationController = Ember.Controller.extend({
  series: one
});
</script>

<script type="text/x-handlebars">
  <p>
    {{series.title}}
  </p>
</script>
```

On remarque alors qu'il suffit de modifier, dans la console, le titre via ``one.set("title", "new title");`` pour que le template soit mis à jour, sans action supplémentaire de notre part !

Ce fonctionnement ainsi que tous les mécanismes d'observation à la base du framework s'appuie sur l'utilisation des getters / setters des ``Ember.Object``. Il est donc absolument nécessaire
de les utiliser systématiquement. Lorsque c'est possible, ``Ember`` nous y oblige. Cependant (notamment dans le cas des getters), il n'est pas toujours possible de forcer l'usage de ces accesseurs
et il est donc important d'être vigilant sur ces points.


{% endraw %}