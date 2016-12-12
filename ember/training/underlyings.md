---
layout: ember-training
title: Formation Ember - Mécanismes sous-jacents
permalink:  ember/training/underlyings/
prev: ember/training/overview
next: ember/training/ember-cli
---

<div id="toc"></div>

## Modèle object

Avec [Ember][ember], la quasi totalité des objets utilisés est dérivée d'une classe de base, la classe ``Ember.Object`` : les contrôleurs, les modèles, l'application elle-même.

C'est cette classe qui permet aux objets [Ember][ember] de partager des comportements communs. Chaque objet [Ember][ember] est ainsi capable d'observer les valeur de propriétés portées par d'autres objets, d'éventuellement lier leurs propres propriétés à celles des objets observés, de construire et d'exposer des propriétés calculées, etc.

Nous allons explorer pas à pas certains de ces comportements. Pour cela, il faut en premier lieu disposer de l'objet [Ember][ember] lui-même.

<div class="work no-answer">
    {% capture m %}

1. Créer un fichier html mettant en place un contexte Ember simple :

   ```html
   <!DOCTYPE html>
   <html>
     <head>
       <meta charset="utf-8">
       <title>Ember Object model</title>
       <script src="http://code.jquery.com/jquery-3.1.1.min.js"></script>
       <script src="http://builds.emberjs.com/tags/v2.10.0/ember.debug.js"></script>
       <script src="http://builds.emberjs.com/tags/v2.10.0/ember-template-compiler.js"></script>
     </head>
     <body>

     </body>
   </html>
   ```

2. Ouvrir ce fichier dans un navigateur, console Javascript ouverte.

   La console doit être exempte d'erreur et afficher l'information suivante :

   ```javascript
   DEBUG: For more advanced debugging, install the Ember Inspector from https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi
   ```

3. Entrer `Ember` dans la console

   La réponse doit être : 
   
   ```console
   Object {__loader: Object, imports: Window, lookup: Window, exports: Window, isNamespace: true…}
   ```

   On constate, en développant cet objet, qu'il contient l'ensemble des objets et fonctions du framework. 
   En particulier la classe ``Ember.Object`` que nous allons manipuler.

  {% endcapture %}{{ m | markdownify }}
</div>

### Classes et instances

#### Definition

Pour définir et utiliser un nouvel objet [Ember][ember], il est nécessaire d'étendre - au minimum - la classe `Ember.Object` via la méthode ``extend()``.

<div class="work">
    {% capture m %}

1. Dans la console, créer une classe `Book` qui étend `Ember.Object` et définit une méthode `logTitle` affichant en console une chaîne de caractères (le titre) passée en paramètre.

   > ```javascript
   > > Book = Ember.Object.extend({
   >     logTitle: function(title) {
   >       console.log(title);
   >     }
   >   });
   > ```

1. Instancier cette classe et afficher un titre dans la console

   > ```javascript
   > > one = new Book();
   > > one.logTitle("titre");
   > ```

  {% endcapture %}{{ m | markdownify }}
</div>

#### Initialisation

On souhaite désormais initialiser l'objet à sa création avec un titre et afficher ce titre plutôt qu'un paramètre de méthode. 

<div class="work">
    {% capture m %}

1. Modifier la classe `Book` en conséquence et créer l'objet via la méthode [create()](http://emberjs.com/api/classes/Ember.Object.html#method_create) 
   d'[Ember](http://emberjs.com) en initialisant un champs `title`.

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

1. Ajouter une méthode d'initialisation qui réalise un simple log console du titre passé au create. Le résultat doit être le suivant :

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

  {% endcapture %}{{ m | markdownify }}
</div>

#### Héritage

On peut évidemment étendre une sous classe d'``Ember.Object`` plutôt que ``Ember.Object`` directement. 
A noter que c'est ce qui est fait chaque fois que l'on étend un objet natif d'[Ember][ember] puisque
tous étendent ``Ember.Object`` : ``Ember.Controller``, ``Ember.Route``, etc.

Dans le cas d'une route, par exemple :

```javascript
> BookRoute = Ember.Route.extend({
    ...
  });
```

Dans le cadre de l'héritage d'``Ember.Object``, l'ensemble des méthodes peuvent être surchargées. 
Les méthodes de la classe mère peuvent être accédées via l'appel de la méthode spéciale ``_super(...)``.

<div class="work">
    {% capture m %}

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

1. Définir une classe ``Comic`` qui étend ``Book`` et surcharge la méthode ``logType`` en affichant ``Comic``.

   On doit pouvoir effectuer les opérations suivantes :

   ```javascript
   > one = Comic.create({title: "My Title"});
   My Title
   
   > one.logType();
   Comic
   ```

   > ```javascript
   > >  Comic = Book.extend({
   >      ...
   >      logType: function() {
   >        console.log("Comic");
   >      }
   >    });
   > ```

3. Modifier ``Comic`` de sorte que ``logType`` affiche également le type de la classe mère.

   On doit pouvoir effectuer les opérations suivantes :

   ```javascript
   > one = Comic.create({title: "My Title"});
   My Title
   
   > one.logType();
   Book
   Comic
   ```

   > ```javascript
   > > Commic = Book.extend({
   >     ...
   >     logType: function() {
   >       this._super();
   >       console.log("Comic");
   >     }
   >   });
   > ```

   L'appel à la méthode mère doit donc être explicite. Lorsque vous héritez d'un objet Ember (``Controller``, ``Route``, etc.) et que vous surchargez la méthode ``init`` dans votre implémentation, soyez sûr de bien appeler la méthode ``_super`` au
   tout début de l'init. Dans le cas contraire, les traitements d'initialisation standard prévus par [Ember](http://emberjs.com) ne pourraient pas s'exécuter correctement entraînant des comportements erratiques.

  {% endcapture %}{{ m | markdownify }}
</div>

#### Accesseurs

Jusqu'à présent, nous ne nous sommes pas posé beaucoup de questions sur la manière d'accéder aux propriétés des objets [Ember][ember]. 
Pourtant, tout ``Ember.Object`` expose des accesseurs qu'il est nécessaire d'utiliser.

<div class="work">
    {% capture m %}

1. En se basant sur le code de la classe ``Book`` créée précédemment et sur l'instance one, effectuer les opérations suivantes :

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
   >
   > > one.get("title");
   > "My Title"
   >
   > > one.title = "new title";
   > Uncaught EmberError { ..., message: "Assertion Failed: You must use Ember.set()" ... }
   >
   > > one.set("title", "new title");
   > Class { ... }
   >
   > > one.get("title");
   > "new title"
   > ```
    
  {% endcapture %}{{ m | markdownify }}
</div>

Lorsqu'on essaie de faire une affectation directe sur une propriété d'un ``Ember.Object``, une exception explicite est levée nous obligeant à appeler le setter ``Ember.set()``.

La raison est qu'[Ember][ember] met en place un certain nombre de mécanismes que nous explorerons par la suite. Parmi ces mécanismes, les ``computed properties``, les ``observers`` ainsi que
l'ensemble des mécanismes de binding du template qui permettent au framework de réagir de manière native et transparente aux changements survenant sur différents objets.

Les mécanismes de binding sont, en particulier, au coeur du moteur de rendu d'[Ember][ember]. Ces mécanismes permettent aux templates html de se mettre automatiquement à jour lors d'un changement
sur un objet et cela de manière performante et ciblée, sans avoir à parcourir l'ensemble des objets connus.

L'exemple suivant permet de se faire une idée de ce mécanisme. 

<div class="work no-answer">
    {% capture m %}
    {% raw %}

1. Copier le contenu suivant dans le fichier html créé, juste avant la balise ``</head>``:

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
   
     Comic = Book.extend({
       logType: function() {
         this._super();
         console.log("Comic");
       }
     });
   
     one = Comic.create({title: "My Title"});
   
     App = Ember.Application.create();
   
     App.ApplicationController = Ember.Controller.extend({
       comic: one
     });
   </script>
   
   <script type="text/x-handlebars">
     <p>
       {{comic.title}}
     </p>
   </script>
   ```
    
  {% endraw %}
  {% endcapture %}{{ m | markdownify }}
</div>

On remarque alors qu'il suffit de modifier, dans la console, le titre via ``one.set("title", "new title");`` pour que le template soit mis à jour, sans action supplémentaire de notre part !

Ce fonctionnement ainsi que tous les mécanismes d'observation à la base du framework s'appuie sur l'utilisation des getters / setters des ``Ember.Object``. Il est donc absolument nécessaire
de les utiliser systématiquement. Lorsque c'est possible, [Ember][ember] nous y oblige. Cependant (notamment dans le cas des getters), il n'est pas toujours possible de forcer l'usage de ces accesseurs
et il est donc important d'être vigilant sur ces points.


#### Réouvrir une classe

Les instances et les sous-classes d'``Ember.Object`` mettent également à disposition une méthode ``reopen``.
Cette méthode permet de définir les classes et instances de manière itérative et d'enrichir
les classes avec de nouvelles propriétés ou méthodes.

<div class="work">
    {% capture m %}

1. Dans la console, réouvrir la classe ``Book`` et lui ajouter une propriété ``pages``.

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
   >
   >   > two.get('pages');
   >   10
   >
   >   > one.get('pages');
   >   10
   > ```
   >
   > On constate que la propriété a bien été définie et initialisée dans nos deux instances. Y compris l'instance ``one`` qui existait déjà.
   > Les propriétés et méthodes ajoutées par ``reopen`` ne sont donc ajoutées effectivement au prototype de la classe que lors de la prochaine
   > création d'une instance de cette classe, en mode *lazy*. cf. [cette discussion](https://github.com/emberjs/ember.js/issues/3783)

4. Lors de l'utilisation de ``reopen``, il est possible, tout comme dans le cas d'un héritage, de redéfinir une méthode existante mais également d'utiliser la méthode ``_super(...)``
   pour appeler la méhode définie avant. Utiliser ``reopen`` pour redéfinir ``displayTitle`` et afficher une ligne ``Title:`` avant d'afficher le titre.

   > ```javascript
   >   > Book.reopen({
   >       displayTitle: function() {
   >         console.log('Title:');
   >         this._super();
   >      }});
   >
   >  > three = Book.create({title: 'three'});
   >  Title:
   >  three
   > ```
    
  {% endcapture %}{{ m | markdownify }}
</div>

La méthode ``reopen`` permet donc d'ajouter des propriétés et méthodes de classe. Cette méthode permet, de manière très pratique, de définir une classe de manière itérative et donc bien plus dynamique.
Il faut tout de même être conscient que les nouvelles méthodes et propriétés ne sont disponibles dans les instances existantes qu'après la création d'une nouvelle instance. De manière
générale, il est conseillé d'éviter d'appeler ``reopen`` sur une classe après en avoir créé des instances.

``Ember.Object`` propose également une méthode ``reopenClass`` permettant d'ajouter des variables ou méthodes de classe statiques.

<div class="work">
    {% capture m %}

1. Utiliser ``reopenClass`` pour ajouter une propriété ``canBeRead`` à la classe ``Book``. Afficher la valeur de cette propriété statique dans la console.

   > ```javascript
   >   > Book.reopenClass({
   >       canBeRead: true
   >     })
   >
   >  > Book.canBeRead
   >  true
   >
   >  > four = Book.create({title: 'four'})
   >  > four.canBeRead
   >  undefined
   > ```
       
  {% endcapture %}{{ m | markdownify }}
</div>

### Propriétés calculées (``Computed properties``)

Les propriétés calculées (``computed properties``) constituent un élément essentiel du modèle objet d'Ember. Une propriété calculée permet de définir une propriété sous la forme d'une
fonction. Cette fonction est exécutée automatiquement lorsque l'on accède à la propriété (via un classique ``get('myProp')``). Une propriété calculée est classiquement déclarée comme dépendant d'une 
ou plusieurs autres propriétés, permettant ainsi à Ember d'effectuer le calcul de la valeur de cette propriété au changement d'une ou plusieurs de ces propriétés.

<div class="work">
    {% capture m %}

1. Réouvrir la classe ``Comic`` pour y ajouter deux propriétés ``writer`` et ``drawer`` ainsi qu'une propriété calculée ``authors`` dont la valeur correspond à la concaténation des deux propriétés 
précédentes séparées par ``' and '``. La propriété calculée ``authors`` doit afficher un log d'exécution quelconque et son exécution doit dépendre des deux propriétés ``writer`` et ``drawer``.
 
   Créer ensuite une instance de ``Comic`` puis accéder plusieurs fois de suite à la propriété ``authors``. Changer ensuite l'une des deux propriétés ``writer`` et ``drawer`` (via un ``set``) 
   et accéder de nouveau à ``authors``. Que constate-t-on lors de ces différentes opérations ? En quoi une propriété calculée est différente d'une simple méthode ?

   > ```javascript
   >   > Comic.reopen({
   >       writer: null, 
   >       drawer: null,
   >       authors: Ember.computed('writer', 'drawer', function() {
   >         console.log('computed property calculated');
   >         return this.get('writer') + ' and ' + this.get('drawer');
   >       })
   >     });
   >
   >  > five = Comic.create({title:'five', writer: '5 writer', drawer: '5 drawer'});
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
   > recalculée que si ce contexte est modifié. Dans le cas contraire, Ember se contente de renvoyer la précédente valeur mise en cache, d'où l'absence de log dans ce cas.
        
1. Utiliser une autre syntaxe pour la déclaration de cette propriété calculée et vérifier que les deux notations sont strictement équivalentes.

   > ```javascript
   >  >  Comic.reopen({
   >       writer: null, 
   >       drawer: null,
   >       authors: function() {
   >         console.log('computed property calculated');
   >         return this.get('writer') + ' and ' + this.get('drawer');
   >       }.property('writer', 'drawer')
   >     });
   >
   >  > five = Comic.create({title:'five', writer: '5 writer', drawer: '5 drawer'});
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
   > Les deux syntaxes sont strictement équivalentes. Il est cependant conseillé d'utiliser la première version qui n'utilise pas la réécriture du prototype de ``function`` (cf. [documentation](http://emberjs.com/guides/configuring-ember/disabling-prototype-extensions/)) 

1. Modifier la déclaration de la propriété calculée ``authors`` en supprimant la dépendance aux deux propriétés ``writer`` et ``drawer``. Réexécuter ensuite la série d'opérations précédente.
Que constate-t-on ?

   > ```javascript
   >  > Comic.reopen({
   >       writer: null, 
   >       drawer: null,
   >       authors: function() {
   >         console.log('computed property calculated');
   >         return this.get('writer') + ' and ' + this.get('drawer');
   >       }.property()
   >     });
   >
   >  > five = Comic.create({title:'five', writer: '5 writer', drawer: '5 drawer'});
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
   > On s'aperçoit ici que la propriété n'est pas recalculée lorsque l'on change l'une des propriétés puisqu'elle ne dépend plus de ces propriétés. Ember utilisera donc 
   > toujours la valeur calculée cachée de cette propriété puisque, pour lui, celle-ci ne peut pas changer.
      
  {% endcapture %}{{ m | markdownify }}
</div>
      
#### Enchaînement des propriétés calculées

Les propriétés calculées peuvent être chaînées les unes avec les autres, permettant ainsi de mettre automatiquement à jour une série de propriétés en cascade lors de la modification de l'une 
d'entre elles.

<div class="work">
    {% capture m %}

1. Réouvrir la classe ``Comic`` et ajouter une nouvelle propriété calculée ``summary`` qui retourne une concaténation du titre et des auteurs de la série lorsque l'une des propriétés ``title`` ou
   ``authors`` change. Modifier ensuite la valeur de la propriété ``writer`` et constater que ``authors`` et ``summary`` ont été correctement mises à jour. (Ne pas oublier de redéclarer ``writer`` et 
   ``drawer`` comme propriétés dont ``authors`` dépend).

   > ```javascript
   >  > Comic.reopen({
   >	  authors: function() {
   >     	console.log('computed property calculated');
   >     	return this.get('writer') + ' and ' + this.get('drawer');
   >   	  }.property('writer', 'drawer'),
   >      summary: function() {
   >    	return this.get('title') + ' by ' + this.get('authors');
   >      }.property('title', 'authors')
   >    });
   >
   >  > five = Comic.create({title:'five', writer: '5 writer', drawer: '5 drawer'});
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
    
  {% endcapture %}{{ m | markdownify }}
</div>

#### Modification de propriétés calculées

Il est également possible de modifier une propriété calculée afin de mettre à jour en cascade les propriétés dont elle est dépendante. Cela se fait en passant à ``Ember.computed`` un objet
javascript contenant à la fois une méthode get et une méthode set au lieu de la simple fonction utilisée précédement.
 
<div class="work">
    {% capture m %}
 
1. Réouvrir la classe ``Comic`` de manière à modifier la propriété ``authors`` pour lui fournir un setter afin de mettre à jour ``writer`` et ``drawer`` lorsque l'on modifie ``authors``. L'objectif
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
   > Comic.reopen({
   >   authors: Ember.computed('writer', 'drawer', {
   > 	  get: function(key) {
   >       console.log('computed property calculated');
   >       return this.get('writer') + ' and ' + this.get('drawer');
   >     },
   >     set: function(key, value) {
   >       console.log('computed property modified');
   >       var  authors = value.split(/ and /);
   >       this.set('writer', authors[0]);
   >       this.set('drawer', authors[1]);
   >       return value;
   >     }
   >   })
   > });
   > ```

   NB : Il est nécessaire d'utiliser ``Ember.computed`` à cause de certaines incompatibilités de syntaxe sur les navigateurs actuels 

  {% endcapture %}{{ m | markdownify }}
</div>

#### Propriétés calculées sur les collections

Ember prévoit également que ses propriétés calculées puissent s'appuyer sur des évènements portant sur les éléments d'une collection (ajout, suppression, modification). Cela est possible au
travers de la notation ``myCollection.@each.myProperty`` ou encore ``myCollection.[]``.

<div class="work">
    {% capture m %}

1. Réouvrir ``Book`` pour y ajouter une propriété ``isPublished`` par défaut à false. Créer ensuite une nouvelle classe ``Collection`` contenant un ensemble de ``comic``. Enfin, 
créer deux nouvelles séries :

   ```javascript
   > Book.reopen({
       isPublished: false
     });
   
   > Collection = Ember.Object.extend({ 
       books: [] 
     });
   
   > two = Comic.create({title:'two', isPublished: true});
   > three = Comic.create({title:'three'});
   ```

1. Réouvrir ``Collection`` pour y  ajouter une propriété calculée permettant de compter le nombre de livres publiés au sein de la collection. Cette propriété doit être déclenchée
lors de la modification de l'un des statuts ``isPublished`` des éléments de la collection ``books``, lors d'un ajout ou d'une suppression (``books.@each.isPublished``). Cette propriété
retourne le nombre de livres publiés dans la collection. Placer un log dans la fonction de manière à tracer son exécution.

   Créer ensuite une collection contenant les trois séries créées.
   
   Constater que cette propriété est bien mise à jour (calculée) lorsque l'on change la valeur de la propriété ``isPublished``
   de l'une des trois série ou lorsque l'on en supprime une. En revanche, elle n'est pas exécutée lorsque n'importe quelle autre propriété
   d'une série est modifiée.

   > ```javascript
   > > Collection.reopen({
   >     numberOfPublished: function() {
   >       console.log("compute numberOfPublished");
   >   	return this.get('books').filterBy('isPublished', true).length;
   >     }.property('books.@each.isPublished')
   >   });
   >
   > > newCollection = Collection.create({books: [one, two, three]});
   > 
   > > newCollection.get('numberOfPublished');
   > compute numberOfPublished
   > 1
   > > one.set('isPublished', true);
   > true
   > > newCollection.get('numberOfPublished');
   > compute numberOfPublished
   > 2
   > > newCollection.get('books').removeAt(0);
   > [Class, Class]
   > > newCollection.get('numberOfPublished');
   > compute numberOfPublished
   > 1
   > > two.set('writer', 'new writer');
   > "new writer"
   > > newCollection.get('numberOfPublished');
   > 1
   > ```

1. Réouvrir ``Collection`` pour changer les conditions de dépendance de la propriété calculée en supprimant le filtre supplémentaire sur la
propriété ``isPublished`` (``books.[]``).

   Créer ensuite une collection contenant les trois séries créées.
   
   Constater que cette propriété n'est mise à jour (calculée) que lors d'un ajout ou d'une suppression dans la liste des séries. La modification
   d'une propriété d'un élément de la liste (quelque soit cette propriété) ne déclenche pas l'éxécution de la fonction.
   
   > ```javascript
   >     > Collection.reopen({
   >       numberOfPublished: function() {
   >         console.log("compute numberOfPublished");
   >     	return this.get('books').filterBy('isPublished', true).length;
   >       }.property('books.[]')
   >     });
   >     
   >     > newCollection = Collection.create({books: [one, two, three]});
   >     
   >     > newCollection.get('numberOfPublished');
   >     compute numberOfPublished
   >     2
   >     > three.set('isPublished', true);
   >     true
   >     > newCollection.get('numberOfPublished');
   >     2
   >     > newCollection.get('books').removeAt(0);
   >     [Class, Class]
   >     > newCollection.get('numberOfPublished');
   >     compute numberOfPublished
   >     2
   >     > newCollection.get('books').removeAt(0);
   >     [Class]
   >     > newCollection.get('numberOfPublished');
   >     compute numberOfPublished
   >     1
   > ```
    
1. Modifier enfin une dernière fois ``Collection`` et la propriété ``numberOfPublished`` pour faire en sorte que la propriété
soit recalculée à la fois lors de la modification d'un livre existant et lors de l'ajout ou la suppression d'un livre.
    
   > ```javascript
   >     > Collection.reopen({
   >       numberOfPublished: function() {
   >         console.log("compute numberOfPublished");
   >     	return this.get('books').filterBy('isPublished', true).length;
   >       }.property('books.[]', 'books.@each.isPublished')
   >     });
   > ```
    
  {% endcapture %}{{ m | markdownify }}
</div>

### Observeurs (``Observers``)

Des observeurs [Ember][ember] peuvent également être déclarés sur toute propriété (y compris les propriétés calculées) et déclenchés au changement de la valeur de cette propriété.

<div class="work">
    {% capture m %}

1. Déclarer un observeur du changement de la propriété calculée ``authors``. Créer une nouvelle instance de ``Comic`` et noter le moment où l'observeur est appelé.

   > ```javascript
   > > Comic.reopen({
   >     authorsChanged: Ember.observer('authors', function() {
   >       console.log('authors observer called');
   >     })
   >   });
   >  
   > > six = Comic.create({title:'six', writer: '6 writer', drawer: '6 drawer'});
   > Class {title: "six", writer: "6 writer", drawer: "6 drawer", __ember1444061327029: null, __nextSuper: undefined…}
   >  
   > > six.get('authors');
   > computed property calculated
   > "6 writer and 6 drawer"
   >  
   > > six.set('writer', 'new writer');
   > authors observer called
   > "new writer"
   > ```
    
  {% endcapture %}{{ m | markdownify }}
</div>
    
La documentation est très complète sur le sujet et il n'est nul besoin de la paraphraser ici, je vous invite donc à vous y reporter [ici](http://guides.emberjs.com/v2.10.0/object-model/observers/).
Cependant, pour résumer, il est bon de noter les points suivants : 

* Les observeurs sont exécutés de manière **synchrône** comme on a pu le constater. Le déclenchement a eu lieu immédiatement après la modification de la propriété, avant même le calcul de la
  propriété calculée qui en dépend.
* Cela signifie que plusieurs modifications déclencheront plusieurs fois les observeurs de manière non optimisée. Si l'on souhaite maîtriser d'avantage ces déclenchements, il est nécessaire de
  faire appel à la méthode ``Ember.run.once`` comme expliqué dans la [documentation](http://guides.emberjs.com/v2.10.0/object-model/observers/)
  
Les observeurs permettent donc de déclencher des traitements (et non de recalculer des propriétés) lors du changement d'une propriété. Ils sont en particulier très utiles lorsque l'on souhaite 
déclencher un traitement après que le *binding* ait été effectué.

### API Collections (``Enumerables``)

Ember gère ses collections et énumérations (et nous propose de gérer les nôtres) au travers d'objets [Ember.Enumerable](http://emberjs.com/api/classes/Ember.Enumerable.html). Cette API
s'appuie sur les opérations de l'API javascript standard (``array``). Cette API permet de gérer toutes les collections d'objets via une interface normalisée et commune et nous permet donc
d'utiliser et de proposer des structures de données complètement nouvelles sans impact sur le reste de notre application.

Cette API est décrite de manière succinte [ici](http://guides.emberjs.com/v2.10.0/object-model/enumerables/) et exhaustive [ici](http://emberjs.com/api/classes/Ember.Enumerable.html).


## *RunLoop*

Un autre mécanisme extrêmement important est impliqué tant dans l'optimisation du moteur de rendu que dans le calcul et la synchronisation des propriétés entre elles : la *RunLoop*. Ce mécanisme est
absolument central dans le fonctionnement d'[Ember][ember] et s'appuie sur la micro librairie [Backburner](https://github.com/ebryn/backburner.js/). Dans la plupart des cas, on n'a pas à
s'en préoccuper et on peut parfaitement mettre en place une application [Ember][ember] complète sans interagir directement avec la *RunLoop*. Il est cependant parfois nécessaire, lorsqu'on
ajoute nos propres `helpers` [Handlebars](http://handlebarsjs.com/) ou nos propres composants avancés. C'est de toutes façons essentiel d'en comprendre le fonctionnement.

Comme son nom ne l'indique pas, la *RunLoop* n'est pas une loop mais un ensemble de queues permettant à [Ember][ember] de différer et d'organiser un certain nombre d'opérations
qui seront ensuite exécutées en dépilant ces queues dans un ordre de priorité donné. 

Les queues sont : 

* `sync` : synchronisation des *bindings*
* `actions` : exécution des tâches planifiées et résolution des *promises*
* `routerTransitions` : transitions entre routes
* `render` : mise à jour du DOM
* `afterRender` : opérations devant s'exéuter après la mise à jour du DOM
* `destroy` : destruction des objets

C'est ce mécanisme qui permet, en quelque sorte, d'empiler les calculs de propriétés calculées lorsque les propriétés
*observées* sont modifiées et surtout c'est grâce à ce mécanisme que le rendu n'est effectué qu'une seule fois lors de la modification d'un modèle.

Pour reprendre l'exemple de la [doc officielle](http://guides.emberjs.com/v2.10.0/applications/run-loop/), si l'on a l'objet suivant :

{% raw %}

```js
var User = Ember.Object.extend({
  firstName: null,
  lastName: null,
  fullName: function() {
    return this.get('firstName') + ' ' + this.get('lastName');
  }.property('firstName', 'lastName')
});
```

Et le template :

```html
{{firstName}}
{{fullName}}
```

{% endraw %}

Sans la *RunLoop*, on exécuterait le rendu deux fois si l'on modifie successivement `firstname` puis `lastname`. La *RunLoop* met tout ça (et plein d'autres
choses) en queue et n'effectue le rendu qu'une seule et unique fois, lorsque nécessaire.

our aller plus loin, se référer à la [documentation officielle](http://guides.emberjs.com/v2.10.0/applications/run-loop) et à cette 
[présentation d'Eric Bryn](http://talks.erikbryn.com/backburner.js-and-the-ember-run-loop).

[ember]: http://emberjs.com