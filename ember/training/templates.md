---
layout: ember-training
title: Formation Ember - Templates, les bases
permalink:  templates/
prev: ember/training/ember-cli
next: ember/training/routing
---

{% raw %}

**NB :** *Les exercices de cette section seront validés par le passage des cas de tests associés. Il est donc nécessaire, en premier lieu, de copier ce ou ces fichiers de test dans le projet* :

* [01-templates-test.js](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/01-templates-test.js) dans ``tests/acceptance``.

## Templating

Les ``templates`` ou ``gabarits`` sont des fragments de code HTML qui peuvent être enrichis par des expressions (encadrées par la notation ``{{}}``) via le moteur de template [Handlebars][handlebars]. Ces expressions
permettent d'intégrer dynamiquement dans les fragments HTML la ou les valeurs d'objets javascript ainsi que le résultat d'exécution d'opérateurs logiques (``helpers``) proposés par
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
{{!-- /app/templates/application.hbs --}}

<h2 id="title">Welcome to Ember</h2>

{{outlet}}
```

On ignore pour le moment l'expression ``{{outlet}}`` liée aux opérations de ``routing`` sur lesquelles nous reviendrons juste après (cf. [routing](../routing)). On note tout de même la convention de nommage de ce fichier,
placé à la racine du répertoire ``templates`` et nommé ``application``. Il s'agit là de l'application des conventions de nommage d'``Ember`` et est, une fois encore, très étroitement liée au routeur d'``Ember`` abordé
au chapitre [routing](../routing). Retenons pour le moment qu'il s'agit du template principal de l'application dans lequel viendront s'imbriquer successivement l'ensemble des autres templates.

{% endraw %}

<div class="work no-answer">
    {% capture m %}
    {% raw %}

1. Commençons simplement par modifier le titre de l'application par `"Comic books library"` et par faire quelques autres modifications destinées à intégrer le style [Bootstrap](http://getbootstrap.com/) :

    **Test** : *Les modifications doivent permettre de rendre le test [01 - Templates - 01 - Should include Bootstrap header](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/01-templates-test.js#L38) passant.*

    ```html
    {{!-- /app/templates/application.hbs --}}
    <div class="container">
    
      <div class="page-header">
        <h1 id="title">Comic books library</h1>
      </div>
     
      {{outlet}}
    
    </div>
    ```  
    
    On constate que l'application est mise à jour et rechargée à la volée par [Ember CLI](http://www.ember-cli.com/) et à l'exécution préalable de la
    commande ``ember server``. Via cette commande, en effet, l'application est lancée et, lors de toute modification d'un fichier source, 
    [Ember CLI](http://www.ember-cli.com/) se charge d'exécuter l'*asset pipeline* et de recharger l'application.
  
  {% endraw %}
   
  {% endcapture %}{{ m | markdownify }}
</div>

## Binding

Un language et d'un moteur de templating tel qu'[Handlebars][handlebars] serait inutile s'il ne s'agissait que d'afficher ou d'assembler que du HTML statique. L'intérêt consiste à injecter dans ce template des valeurs
et expressions dynamiques en fonction des données et de la logique de l'application.

<div class="work">
    {% capture m %}
    {% raw %}

1. Créer un objet javascript contenant les données que l'on souhaite injecter. 

    Cette opération s'effectue en renvoyant un ``model`` au sein d'une ``Route`` de la manière suivante.
    On expliquera ces notions en détail dans le chapitre [routing](../routing), admettons pour le moment que nous avons un fichier ``app/routes/application.js`` :

    (On note l'utilisation des modules Ecmascript 6 rendue possible par la transpilation par [Ember CLI](http://www.ember-cli.com/). cf. [chapitre précédent](../ember-cli))
     
    ```javascript
    // app/routes/application.js
    
    import Ember from 'ember';
    
    export default Ember.Route.extend({
    
      model: function() {
        // WARN : SOULD NOT BE DONE : We should not affect anything to windows but 
        // for the exercice, we want to access to comic from console today
        window.comic = {title: "BlackSad"};
    
        return comic;
      }
    });
    ```
    
    On peut ensuite utiliser cet objet dans notre template : 
    
    ```html
    {{!-- /app/templates/application.hbs --}}
    
    <div class="container">
    
      <div class="page-header">
        <h1 id="title">Comic books library</h1>
      </div>
    
      <div class="row">
        <span class="comics">{{model.title}}</span>
      </div>
    
      {{outlet}}
    
    </div>
    ```
    
    On constate que notre application affiche désormais le nom du comic que nous avons créé et injecté dans le template

1. Ouvrir la console javascript et modifier le titre du comic. Quels sont les deux constats majeurs que l'on peut effectuer ?

    > ```javascript
    > > comic
    > Object {__ember_meta__: Meta}
    > 
    > > comic.title = "new title"
    > Uncaught EmberError {description: undefined, fileName: undefined, lineNumber: undefined, message: "Assertion Failed: You must use Ember.set() to set … `title` property (of [object Object]) to `test`.", name: "Error"…}
    >
    > > Ember.set(comic, 'title', 'new title');
    > "new title"
    > ```
    
    > On constate les choses suivantes : 
    >
    > 1. L'objet 'comic' créé a été enrichi par Ember. De ce fait, on ne peut doit plus et on ne peut plus manipuler directement ses propriétés sans accesseurs. cf [Modèle objet](../object-model)
    > 2. En utilisant les outils proposés par le modèle objet d'[Ember](http://emberjs.com), on constate que le template est automatiquement mis à jour lorsque l'on modifie l'objet. C'est ce que l'on appelle le **binding**.

  {% endraw %}
   
  {% endcapture %}{{ m | markdownify }}
</div>

{% raw %}

### Binding dans des attributs HTML

Le *binding*, via la notation ``{{}}`` peut s'effectuer au sein d'un élément HTML mais il peut également être nécessaire de dynamiser le contenu des attributs eux-mêmes : noms de classes, url source d'une image ou
d'un lien, etc.

Depuis la [version 1.11](http://emberjs.com/deprecations/v1.x/#toc_bind-attr), la syntaxe pour le *binding* d'attributs est similaire à celle utilisée pour le *binding* d'éléments :
 
```html
<div title={{comic.title}} class="comic {{if comic.scriptwriter 'with-scriptwriter' 'no-scriptwriter'}}"></div>
```

De la même manière que pour le *binding* d'éléments, le template est mis à jour automatiquement lors de la mise à jour du modèle. Cela peut s'avérer très utile pour conditionner les classes portées par
un élément et donc son affichage d'un éléments en fonction de l'état des données injectées.


### Binding bidirectionnel ou unidirectionnel

Deux sortes de *bindings* sont régulièrement évoqués : le **binding bidirectionnel** (*two-way binding*) et le **binding unidirectionnel** (*one-way binding*). Dans chacun de ces deux modes, tout 
changement survenant sur un objet du model est automatiquement répércuté dans l'ensemble des templates et fragments HTML qui y font référence. Dans le premier mode, en revanche, la réciproque est également 
vraie et tout changement qui intervient au niveau HTML via un champ éditable (``input`` par exemple) est transmis au model et, par voie de conséquence, aux autres templates et fragments HTML.
Comme nous l'illustrerons dans les chapitres suivants, ce fonctionnement permet de voir par exemple un changement de libellé immédiatement mis à jour dans une page alors même que l'on est encore en train de
le saisir dans une autre zone de cette page - sans que nous ayions eu à implémenter une quelconque logique évènementielle pour cela. [Ember][ember] se charge de tout.
 
Jusqu'à [Ember][ember] 2.0, tous les *bindings* étaient par défaut voire obligatoirement bidirectionnels. Or, si ce fonctionnement peut s'avérer extêmement puissant et utile, il est évidément plus coûteux qu'un 
*binding* unidirectionnel et pas toujours pertinent. Dans le cas majoritaire où l'on souhaite simplement afficher une information non éditable qui sera mise à jour au changement du modèle mais non modifiable
par les utilisateurs, la mise en place d'un tel mécanisme est inutile. 

Depuis [Ember][ember] 2.0, le *binding* est unidirectionnel par défaut lorsque l'on utilise la notation *chevron* (`<` ou *angle-bracket*) pour nos composants, standards ou custom :

```html
{{!-- one-way binding --}}
<input type="text" value={{comic.title}} />
```

Le *binding* bidirectionnel est possible si l'on utilise l'ancienne notation *accolades* (`{{`) : 

```html
{{!-- two-way binding --}}
{{input type="text" value=comic.title}}
```

Cette dernière option est notamment obligatoire si l'on souhaite un *binding* bidirectionnel sur des composants standards (``input``, ``textarea``, etc.) pour lesquels le helper ``mut`` n'est pas supporté.
Dans tous les autres cas de composants custom, l'utilisation de ce helper ``mut`` est à privilégier pour indiquer le caractère mutable de la propriété *bindée*.

```html
{{!-- two-way binding --}}
<my-component value={{mut comic.title}} />
```

Nous aurons l'occasion de constater et d'expérimenter ces comportements dans les sections suivantes et ne nous y attardons donc pas d'avantage ici.

## Helpers

[Handlebars][handlebars] et [Ember][ember] propose de nombreux *helpers* qui permettent d'introduire un minimum de logique au sein de nos templates. Ces *helpers* peuvent être de types différents :

* **blocks** : C'est le cas majoritaire. Ces *helpers* englobent des éléments HTML (et / ou d'autres *helpers*) au sein d'un bloc comprenant un début et une fin.

C'est le cas, par exemple du *helper* ``each`` : 

```html
<ul>
  {{#each model as |comic|}}
    <li>{{comic.title}}</li>
  {{/each}}
</ul>
```

Ou encore du *helper* ``if`` :

```html
{{#if comic.scriptwriter}}
  by {{comic.scriptwriter}}
{{else}}
  by unknown scriptwriter
{{/if}}
```

* **inline** : Ce type de *helper* n'encapsule pas un block HTML mais exécute une seule instruction.
 
C'est le cas du *helper* ``log`` : 

```html
{{log "Model log: " model}}
```

Ou d'une autre sorte de *helper* ``if`` :

```html
<li>{{user.lastname}} {{if user.firstname user.firstname "unknown firstname"}}</li>
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

* accès aux propriétés : ``get`` pour un accés dynamique, ``mut`` pour signaler le caractère *mutable* et donc le binding bidirectionnel d'une propriété
* listes et collections : ``each-in`` pour parcourir les propriétés d'un objet ainsi q'une extension du ``each`` [Handlebars][handlebars] conservant le scope
* navigation : ``link-to`` en inline ou en block et ``query-param``, ``outlet``
* évènements : ``action`` pour propager des évènements vers des composants depuis des interactions sur des éléments HTML
* formulaires : ``input``, ``textarea`` 
* instantiation & rendering : ``component``, ``render``, ``partial``
* développement : ``debugger``

La liste complète des *helpers* [Ember][ember] est accessible dans la [documentation](http://emberjs.com/api/classes/Ember.Templates.helpers.html).

[Ember][ember] et [Handlebars][handlebars] facilitent enfin la création et la contribution de nouveaux *helpers* via la fonction ``registerHelper`` d'[Handlebars](http://handlebarsjs.com/#helpers),
la commande ``ember generate helper helper-name`` ou la contribution directe dans le dossier ``app/helpers``. cf [Ember documentation](http://guides.emberjs.com/v2.1.0/templates/writing-helpers/) & 
[Ember CLI documentation](http://www.ember-cli.com/user-guide/#resolving-handlebars-helpers) sur le sujet (attention au `-` obligatoire dans le nom pour [Ember CLI][ember-cli]).

{% endraw %}

<div class="work">
    {% capture m %}
    {% raw %}

1. **Parcourir et afficher une liste** : Nous allons avoir plusieurs comics, transformer l'affichage du model seul par celui d'une liste complète de comics (un seul élément pour le moment).

    **Style** : encapsuler la liste dans une ``<div class="comics">``
    
    **Test** : *Les modifications doivent permettre de rendre le test [01 - Templates - 02 - Should display comics](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/01-templates-test.js#L55) passant.*
      
    >  ```javascript
    >  // app/routes/application.js
    >  ...
    >  window.comics = [{title: "BlackSad"}, {title: "Calvin and Hobbes"}];
    >  ...
    >  ```
    >  
    >  ```html
    >  {{!-- app/templates/application.hbs --}}
    >  ...
    >  <div class="row">
    >    <div class="comics">
    >      <ul>
    >        {{#each model as |comic|}}
    >          <li>{{comic.title}}</li>
    >        {{/each}}
    >      </ul>
    >    </div>
    >  </div>
    >  ...
    >  ```
        
1. Via la console, accéder à l'objet `comics` et ajouter un élément à la liste.
    * Utiliser d'abord la méthode `push` native des arrays javascript : [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) 
    * Puis la méthode `pushObject` d' [Ember](http://emberjs.com) : [pushObject](http://emberjs.com/api/classes/Ember.MutableArray.html#method_pushObject)
     
    Que constate-t-on ?
    
    > ```javascript
    > > comics
    > [Object]
    > 
    > > comics.push({title: "The Killer"})
    > 3
    > 
    > > comics.pushObject({title: "Akira"})
    > Object {title: "Akira"}
    > 
    > > comics
    > [Object, Object, Object, Object]
    > ```
    > 
    > * Dans le premier cas, en utilisant la méthode native `push`, le template n'a pas été mis à jour alors que l'objet a bien été ajouté (on a maintenant 2 éléments).
    > * Dans le second cas, en utilisant la méthode [Ember](http://emberjs.com) `pushObject`, le template a été correctement mis à jour avec le nouvel objet. On constate d'ailleurs que l'élément
    >   ajouté précédemment apparaît également.
    >   
    > Cela s'explique par le fait que la méthode `pushObject` proposée par [Ember](http://emberjs.com) génère des évènements permettant de connaitre et de réagir aux changements. On dit qu'elle est
    > compatible *KVO* - *Key-Value Observing*). Cette méthode est mise à disposition par [Ember](http://emberjs.com) alors même que nous utilisons un objet `array` natif et non pas un objet 
    > [Ember](http://emberjs.com) parce que ce dernier enrichit le prototype de certains objets de manière transparente (note : ce comportement peut être désactivé). 
    > cf. [documentation](http://guides.emberjs.com/v2.1.0/configuring-ember/disabling-prototype-extensions/)

1. Modifier l'application pour afficher les auteurs des comics.
    * Dans la route, modifier la collection `comics` pour ajouter l'auteur au second comic
    * Pour chaque comic afficher l'auteur si il existe à côté du titre sous la forme ``<title> by <scriptwriter>`` ou ``<titre> by unknown scriptwriter`` si aucun auteur n'existe. 
      Ajouter à la liste un comic en renseignant son auteur pour constater les changements.
     
     
    **Test** : *Les modifications doivent permettre de rendre le test [01 - Templates - 03 - Should display scriptwriter if exists](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/01-templates-test.js#L87) passant.*

    
    >  ```javascript
    >  // app/routes/application.js
    >  ...
    >  window.comics = [{title: "BlackSad"}, {title: "Calvin and Hobbes", scriptwriter:"Bill Watterson"}];
    >  ...
    >  ```
    >  ```html
    >  {{!-- app/templates/application.hbs --}}
    >  ...
    >  <ul>
    >    {{#each model as |comic|}}
    >      <li>{{comic.title}} by {{if comic.scriptwriter comic.scriptwriter "unknown scriptwriter"}}</li>
    >    {{/each}}
    >  </ul>
    >  ...
    >  ```    
    >
    > * Pour effectuer l'affichage conditionnel on a utilisé le *helper inline* if tertiaire : ``{{if <condition> <val_if_true> <val_if_false>}}``

     
1. Via la console, modifier ensuite les objets de la liste.
    * Le premier objet d'abord (sans auteur) en supprimant / ajoutant le champ `scriptwriter`. 
    * Puis le second (avec auteur) pour modifier la valeur de la propriété `scriptwriter`.
    
    Que constate-t-on ?
    
    > ```javascript
    >  > Ember.set(comics[0], 'scriptwriter', "Juan Diaz Canales")
    >  "Juan Diaz Canales"
    >  .
    >  > Ember.set(comics[1], 'scriptwriter', "New scriptwriter")
    >  "New scriptwriter"
    > ```
    >  
    > * Dans le premier cas, lorsqu'on ajoute une nouvelle propriété à un objet existant, le changement n'est pas detecté puisque la propriété n'était pas observée par [Ember](http://emberjs.com). Le template
    >   n'est pas mis à jour.
    > * Dans le second cas, lorsque l'on modifie une propriété existante, le binding fonctionne parfaitement et le template est mis à jour
    
1. Modifier l'affichage de chaque comic pour changer la classe de l'élément en fonction du fait que l'auteur soit renseigné ou non.
    
    **style** : utiliser les classes `comic-with-scriptwriter` et `comic-without-scriptwriter`.
    
    **Test** : *Les modifications doivent permettre de rendre le test [01 - Templates - 04 - Should change class if no scriptwriter](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/01-templates-test.js#L115) passant.*
    
    > ```html
    > {{!-- app/templates/application.hbs --}}
    > ...
    > <ul>
    >   {{#each model as |comic|}}
    >     <li class="{{if comic.scriptwriter 'comic-with-scriptwriter' 'comic-without-scriptwriter'}}">
    >       {{comic.title}} by {{if comic.scriptwriter comic.scriptwriter "unknown scriptwriter"}}
    >     </li>
    >   {{/each}}
    > </ul>
    > ```
    > 
    > Ici encore, on utilise le *helper inline* `if` tertiaire mais cette fois au sein d'un attribut `class` et non dans un élément HTML. On note que cela ne perturberait en rien l'utilisation d'une
    > classe CSS *statique* déjà présente. Cela permet de conditionner très facilement un affichage sans avoir à gérer soi-même la logique d'affichage / masquage, etc. 
 
1. Modifier le template pour afficher un simple message `"Sorry, no comic found"` si la liste est vide. 
    * Via la console, supprimer tous les objets de la liste et constater les changements. 
    
       **Test** : *Les modifications doivent permettre de rendre le test [01 - Templates - 05 - Should display message if empty](https://github.com/bmeurant/ember-training/blob/master/tests/acceptance/01-templates-test.js#L133) passant.*
 
    > ```html
    > {{!-- app/templates/application.hbs --}}
    > ...
    > <ul>
    >   {{#each model as |comic|}} 
    >     <li class="{{if comic.scriptwriter 'comic-with-scriptwriter' 'comic-without-scriptwriter'}}">
    >       {{comic.title}} by {{if comic.scriptwriter comic.scriptwriter "unknown scriptwriter"}}
    >     </li>
    >   {{else}}
    >     Sorry, no comic found
    >   {{/each}}
    > </ul>
    > ```
    > 
    > ```javascript
    > > comics.removeAt(0);
    >  []
    > ```
    >
    > Cette fois c'est le *helper* `each` et son branchement conditionnel `else` qui font le travail pour nous sans que l'on ait à écrire une seule ligne de code !
 
   {% endraw %}
 
   {% endcapture %}{{ m | markdownify }}
 </div>
 
## Conclusion

Cette section a permis d'explorer les aspects principaux du fonctionnement des templates et du binding dans [Ember][ember]. Au travers d'un exemple simple, nous avons pu nous familiariser également 
avec les *helpers* [Handlebars][handlebars]. Cependant nous n'avons couvert qu'une infime partie des caractéristiques et des outils proposés par [Ember][ember] dans ce domaine. Au fil des expérimentations
à venir dans les sections suivantes, nous poursuivrons cette découverte au travers d'exemples concrêts et de mises en pratique. Des outils et *helpers* fondamentaux d'[Ember][ember] tels que ``link-to``, 
``action``, ``input`` ou encore ``textarea`` n'ont pas été abordés ici et seront largement détaillés par la suite.
 
[handlebars]: http://handlebarsjs.com/
[ember-cli]: http://www.ember-cli.com/
[ember]: http://emberjs.com/