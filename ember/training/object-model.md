---
layout: ember-training
title: Formation Ember
permalink:  object-model/
prev: ember/training/overview
next: ember/training/structure
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
          <script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
          <script src="http://builds.emberjs.com/tags/v2.0.0/ember.debug.js"></script>
          <script src="http://builds.emberjs.com/tags/v2.0.0/ember-template-compiler.js"></script>
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
    > > Book = Ember.Object.extend({
    >     logTitle: function(title) {
    >       console.log(title);
    >     }
    >   });
    > ```

2. Instancier cette classe et afficher un titre dans la console

    > ```javascript
    > > one = new Book();
    > > one.logTitle("titre");
    > ```


#### Initialisation

1. On souhaite désormais initialiser l'objet à sa création avec un titre et afficher ce titre plutôt qu'un paramètre de méthode. Modifier la classe `Book` en conséquence et créer l'objet via la méthode [create()](http://emberjs.com/api/classes/Ember.Object.html#method_create) d'`Ember` en initialisant un champs `title`.

    > ```javascript
    > > Book = Ember.Object.extend({
    >     logTitle: function() {
    >       console.log(this.title);
    >     }
    >   });
    >
    > > one = Book.create({title: "My Title"});
    > > one.logTitle();
    > ```

    L'utilisation de la méthode [create()](http://emberjs.com/api/classes/Ember.Object.html#method_create) en lieu et place d'un simple `new` permet l'initialisation de propriétés via un objet passé en paramètre. La méthode `create` permet également d'effectuer des opérations d'initialisations complémentaires via l'appel de la méthode [init()](http://emberjs.com/api/classes/Ember.Object.html#method_init).

2. Ajouter une méthode d'initialisation qui réalise un simple log console du titre passé au create. Le résultat doit être le suivant :

    ```javascript
    > one = Book.create({title: "My Title"});
    My Title
    ```

    > ```javascript
    > > Book = Ember.Object.extend({
    >     init: function() {
    >       this.logTitle();
    >     },
    >     logTitle: function() {
    >       console.log(this.title);
    >     }
    >   });
    > ```


#### Héritage

On peut évidemment étendre une sous classe d'``Ember.Object`` plutôt que ``Ember.Object`` directement. A noter que c'est ce qui est fait chaque fois que l'on étend un objet natif d'``Ember`` puisque
tous étendent ``Ember.Object`` : ``Ember.View``, ``Ember.Controller``, ``Ember.Route``, etc.

Dans le cas d'une route, par exemple :

```javascript
> BookRoute = Ember.Route.extend({
    ...
  });
```

Dans le cadre de l'héritage d'``Ember.Object``, l'ensemble des méthodes peuvent être surchargées. Les méthodes de la classe mère peuvent être accédées via l'appel de la méthode spéciale ``_super(...)``.

1. Modifier la classe ``Book`` pour lui ajouter une méthode ``logType`` qui affiche "Book". Le résultat doit être le suivant :

    ```javascript
    > one = Book.create({title: "My Title"});
    My Title
    > one.logType();
    Book
    ```

    > ```javascript
    > > Book = Ember.Object.extend({
    >     ...
    >     logType: function() {
    >       console.log("Book");
    >     }
    >   });
    > ```

2. Définissez une classe ``Series`` qui étend ``Book`` et surcharge la méthode ``logType`` en affichant ``Series`` :

    ```javascript
    > one = Series.create({title: "My Title"});
    My Title
    > one.logType();
    Series
    ```

    > ```javascript
    > >  Book = Ember.Object.extend({
    >      ...
    >      logType: function() {
    >        console.log("Series");
    >      }
    >    });
    > ```

3. Modifier ``Series`` de sorte que ``logType`` affiche également le type de la classe mère :

    ```javascript
    > one = Series.create({title: "My Title"});
    My Title
    > one.logType();
    Book
    Series
    ```

    > ```javascript
    > > Book = Ember.Object.extend({
    >     ...
    >     logType: function() {
    >       this._super();
    >       console.log("Series");
    >     }
    >   });
    > ```

    L'appel à la méthode mère doit donc être explicite. Lorsque vous héritez d'un objet Ember (``Controller``, ``View``, ``Route``, etc.) et que vous surchargez la méthode ``init`` dans votre implémentation, soyez sûr de bien appeler la méthode ``_super`` au
    tout début de l'init. Dans le cas contraire, les traitements d'initialisation standard prévus par ``Ember`` ne pourraient pas s'exécuter correctement entyraînant des comportements erratiques.


#### Accesseurs

Jusqu'à présent, nous ne nous sommes pas posé beaucoup de question sur la manière d'accéder aux propriétés des objects ``Ember``. Pourtant, tout ``Ember.Object`` expose des accesseurs qu'il est nécessaire d'utiliser.

1. En se basant sur le code de la classe ``Book`` créée précédement et sur l'instance one, effectuer les opérations suivantes :

    ```javascript
    > one.title;
    > one.get("title");
    > one.title = "new title";
    > one.set("title", "new title");
    > one.get("title");
    ```

    > Les résultats sont les suivants :
    >
    > ```javascript
    > > one.title;
    > "My Title"
    > > one.get("title");
    > "My Title"
    > > one.title = "new title";
    > Uncaught EmberError { ..., message: "Assertion Failed: You must use Ember.set()" ... }
    > > one.set("title", "new title");
    > Class { ... }
    > > one.get("title");
    > "new title"
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


#### Réouvrir une classe

Les instances et les sous-classes d'``Ember.Object`` mettent également à disposition une méthode ``reopen``.
Cette méthode permet de définir les classes et instances de manière itérative et d'enrichir
les classes avec de nouvelles propriétés ou méthodes.

1. Réouvrir la classe ``Book`` et lui ajouter une propriété ``pages``.

       > ```javascript
       >   > Book.reopen({
       >        pages: 10
       >     });
       > ```

2. Afficher la valeur de ``pages`` sur l'instance existante ``one`` en utilisant l'accesseur. Que constate-t-on ?

       > ```javascript
       >   > one.get('pages');
       >   undefined
       > ```
       >
       > On constate que la propriété n'est pas définie.

3. Créer une nouvelle instance ``two`` de ``Book`` puis afficher la valeur de ``pages`` sur cette instance. Afficher de nouveau la valeur de ``pages`` sur l'instance ``one``.

       > ```javascript
       >   > two = Book.create({title: 'two'})
       >   two
       >   > two.get('pages');
       >   10
       >   > one.get('pages');
       >   10
       > ```
       >
       > On constate que la propriété a bien été définie et initialisée dans nos deux instance. Y compris l'instance ``one`` qui existait déjà.
       > Les propriétés et méthodes ajoutées par ``reopen`` ne sont donc ajoutées effectivement au prototype de la classe que lors de la prochaine
       > création d'une instance de cette classe, en mode *lazy*. cf. [cette discussion](https://github.com/emberjs/ember.js/issues/3783)

4. Lors de l'utilisation de ``reopen`` permet il est possible, tout comme dans le cas d'un héritage, de redéfinir une méthode existante mais également d'utiliser la méthode ``_super(...)``
   pour appeler la méhode définie avant. Utiliser ``reopen`` pour redéfinir ``displayTitle`` et afficher une ligne ``Title:`` avant d'afficher le titre.

       > ```javascript
       >   > Book.reopen({
       >       displayTitle: function() {
       >         console.log('Title:');
       >         this._super();
       >      });
       >
       >  > three = Book.create({title: 'three'});
       >  Title:
       >  three
       > ```

La méthode ``reopen`` permet donc d'ajouter des propriétés et méthodes de classe. Cette méthode permet, de manière très pratique, de définir une classe de manière itérative et donc bien plus dynamiqe.
Il faut tout de même être conscient que les nouvelles méthodes et propriétés ne sont disponibles dans les instances existantes qu'après la création d'une nouvelle instance. De manière
générale, il est conseillé d'éviter d'appeler ``reopen`` sur une classe après en avoir créé des instances.

``Ember.Object`` propose également une méthode ``reopenClass`` permettant d'ajouter des variables ou méthodes de classe statiques.

1. Utiliser ``reopenClass`` pour ajouter une propriété ``canBeRead`` à la classe ``Book``. Afficher la valeur de cette propriété statique dans la console.

       > ```javascript
       >   > Book.reopenClass({
       >       canBeRead: true
       >     })
       >
       >  > Book.canBeRead
       >  true
       >  > four = Book.create({title: 'four'})
       >  > four.canBeRead
       >  undefined
       > ```

#### Computed properties

Les ``computed properties`` (*propriétés calculées*) constituent un élément essentiel du modèle objet d'Ember. Une ``computed property`` permet de définir une propriété sous la forme d'une
fonction. Cette fonction est exécutée automatiquement lorsque l'on accède à la propriété (via un classique ``get('myProp')``). Une ``computed property`` est classiquement déclarée comme dépendant d'une 
ou plusieurs autres propriétés, permettant ainsi à Ember d'effectuer le calcul de la valeur de cette propriété au changement d'une ou plusieurs de ces propriétés.


1. Réouvrir la classe ``Series`` pour y ajouter deux propriétés ``writer`` et ``drawer`` ainsi qu'une propriété calculée ``authors`` dont la valeur correspond à la concaténation des deux propriétés 
précédentes séparées par ``' and '``. La propriété calculée ``authors`` doit afficher un log d'exécution quelconque et son exécution doit dépendre des deux propriétés ``writer`` et ``drawer``.
 
       Créer ensuite une instance de ``Series`` puis accéder plusieurs fois de suite à la propriété ``authors``. Changer ensuite l'une des deux propriétés ``writer`` et ``drawer`` (via un ``set``) 
       et accéder de nouveau à ``authors``. Que constate-t-on lors de ces différentes opérations ? En quoi une propriété calculée est différente d'une simple méthode ?

       > ```javascript
       >   > Series.reopen({
       >       writer: null, 
       >       drawer: null,
       >       authors: Ember.computed('writer', 'drawer', function() {
       >         console.log('computed property calculated');
       >         return this.get('writer') + ' and ' + this.get('drawer');
       >       })
       >     });
       >
       >  > five = Series.create({title:'five', writer: '5 writer', drawer: '5 drawer'});
       >  five
       >  Class {title: "five", writer: "5 writer", drawer: "5 drawer", __ember1439469290671: null, __nextSuper: undefined…}
       >
       >  > five.get('authors');
       >  computed property calculated
       >  "5 writer and 5 drawer"
       >
       >  > five.get('authors');
       >  "5 writer and 5 drawer"
       >
       >  > five.set('writer', 'new writer');
       >  "new writer"
       >
       >  > five.get('authors');
       >  computed property calculated
       >  "new writer and 5 drawer"
       >
       >  > five.get('authors');
       >  "new writer and 5 drawer"
       > ```
       >
       > On constate qu'une propriété calculée est bien différente d'une fonction en ce sens qu'Ember calcule sa valeur en fonction du contexte dont elle dépend. Cette valeur n'est ensuite
       > recalculée que si ce contexte est modifié. Dans le cas contraire, Ember se contente de renvoyer la précédentes valeurs mise en cache, d'où l'absence de log dans ce cas.
        
2. Utiliser une autre syntaxe pour la déclaration de cette propriété calculée et vérifier que les deux notations sont strictement équivalentes.

       > ```javascript
       >  >  Series.reopen({
       >       writer: null, 
       >       drawer: null,
       >       authors: function() {
       >         console.log('computed property calculated');
       >         return this.get('writer') + ' and ' + this.get('drawer');
       >       }.property('writer', 'drawer')
       >     });
       >
       >  > five = Series.create({title:'five', writer: '5 writer', drawer: '5 drawer'});
       >  five
       >  Class {title: "five", writer: "5 writer", drawer: "5 drawer", __ember1439469290671: null, __nextSuper: undefined…}
       >
       >  > five.get('authors');
       >  computed property calculated
       >  "5 writer and 5 drawer"
       >
       >  > five.get('authors');
       >  "5 writer and 5 drawer"
       >
       >  > five.set('writer', 'new writer');
       >  "new writer"
       >
       >  > five.get('authors');
       >  computed property calculated
       >  "new writer and 5 drawer"
       >
       >  > five.get('authors');
       >  "new writer and 5 drawer"
       > ```
       > 
       > Les deux syntaxes sont strictement équivalentes. C'est cenpendant la seconde qui est la plus fréquement utilisée et à privilégier. La première est utile et utilisée dans le cas où 
       > l'on souhaite utiliser Ember en désactivant les extensions de prototype qu'il ajoute (cf. [documentation](http://emberjs.com/guides/configuring-ember/disabling-prototype-extensions/)) 

3. Modifier la déclaration de la propriété calculée ``authors`` en supprimant la dépendance aux deux propriétés ``writer`` et ``drawer``. Réexécuter ensuite la série d'opérations précédente.
Que constate-t-on ?

       > ```javascript
       >  > Series.reopen({
       >       writer: null, 
       >       drawer: null,
       >       authors: function() {
       >         console.log('computed property calculated');
       >         return this.get('writer') + ' and ' + this.get('drawer');
       >       }.property('writer', 'drawer')
       >     });
       >
       >  > five = Series.create({title:'five', writer: '5 writer', drawer: '5 drawer'});
       >  five
       >  Class {title: "five", writer: "5 writer", drawer: "5 drawer", __ember1439469290671: null, __nextSuper: undefined…}
       >
       >  > five.get('authors');
       >  computed property calculated
       >  "5 writer and 5 drawer"
       >
       >  > five.get('authors');
       >  "5 writer and 5 drawer"
       >
       >  > five.set('writer', 'new writer');
       >  "new writer"
       >
       >  > five.get('authors');
       >  "5 writer and 5 drawer"
       > ```
       > 
       > On s'apperçoit ici que la propriété n'est pas recalculée lorsque l'on change l'une des propriétés puisqu'elle ne dépend plus de ces propriétés. Ember utilisera donc 
       > toujours la valeur calculée cachée de cette propriété puisque, pour lui, celle-ci ne peut pas changer.
      
##### Enchaînement des propriétés calculées

Les propriétés calculées peuvent être chaînées les unes avec les autres, permettant ainsi de mettre automatiquement à jour une série de propriétés en cascade lors de la modification de l'une 
d'entre elles.

Réouvrir la classe ``Series`` et ajouter une nouvelle propriété calculée ``summary`` qui retourne une concaténation du titre et des auteurs de la série lorsque l'une des propriétés ``title`` ou
``authors`` change. Modifier ensuite la valeur de la propriété ``writer`` et constater que ``authors`` et ``summary`` ont été correctement mises à jour. (Ne pas oublier de redéclarer ``writer`` et 
``drawer`` comme propriétés dont ``authors`` dépend).

> ```javascript
>  > Series.reopen({
>      summary: function() {
>    	return this.get('title') + ' by ' + this.get('authors');
>      }.property('title', 'authors')
>    });
>
>  > five = Series.create({title:'five', writer: '5 writer', drawer: '5 drawer'});
>  five
>  Class {title: "five", writer: "5 writer", drawer: "5 drawer", __ember1439469290671: null, __nextSuper: undefined…}
>
>  > five.get('summary');
>  computed property calculated
>  "five by 5 writer and 5 drawer"
>
>  > five.set('writer', 'new writer');
>  "new writer"
>
>  > five.get('authors');
>  "five by new writer and 5 drawer"
> ```

##### Modification de propriétés calculées

Il est également possible de modifier une propriété calculée afin de mettre à jour en cascade les propriétés dont elle est dépendante. Cela se fait en passant à ``Ember.computed`` un objet
javascript contenant à la fois une méthode get et une méthode set au lieu de la simple fonction utilisée précédement.
 
Réouvrir la classe ``Séries`` de manière à modifier la propriété ``authors`` pour lui fournir un setter afin de mettre à jour ``writer`` et ``drawer`` lorsque l'on modifie ``authors``. L'objectif
est de permettre la séquence suivante : 

```javascript
> five.set('authors', 'Véronique and Davina');
"Véronique and Davina"
> five.get('writer');
"Véronique"
> five.get('drawer');
"Davina"
```

> ```javascript
> Series.reopen({
>   authors: Ember.computed('writer', 'drawer', {
> 	get: function(key) {
> 	  return this.get('writer') + ' and ' + this.get('drawer');
>     },
>     set: function(key, value) {
> 	  var  authors = value.split(/ and /);
> 	  this.set('writer', authors[0]);
> 	  this.set('drawer', authors[1]);
>     }
>   })
> });
> ```

NB : Il est nécessaire d'utiliser ``Ember.computed`` à cause de certaines incompatibilités de syntaxe sur les navigeteurs actuels 

##### Propriétés calculées sur les collections

#### Observers

#### Bindings

{% endraw %}