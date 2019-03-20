---
layout: ember-training
title: Formation Ember - Notions avancées
permalink:  ember/training/advanced/
prev: ember/training/ember-data
next: ember/training/backend
---

<div id="toc"></div>

L'évolution de [Ember][ember] se fait notament par le passage de RFC proposés par ces utilisateurs et developpeurs.
Nous allons nous pencher sur quelques propositions qui sont ou seront mises en place.

## Classes natives et decorators
### Topo rapide sur les classes natives
Au passage à Ember 3, l'un des changements majeurs a été la compatibilité avec les classes natives JavaScript. La syntaxe de **class** a été définie dans ECMAScript 2015 et est, en réalité, une fonction permettant un travail plus précis avec l'héritage de prototype.

La déclaration et l'instanciation d'une classe se fait de telle façon:

```javascript
class Book {
    /**
     * Il s'agit du constructeur de l'objet 
     * Notons la présence de l'argument volume avec une valeur par défaut à 1
     */
    constructor(title, author, volume = 1) {
        this.title = title;
        this.author = author;
        this.volume = volume;
    }
    
    getDescription() {
        return `"${this.title}" est une oeuvre de ${this.author}${this.getPrecision()}`;
    }
  
    getPrecision() {
        if (this.volume =< 1) {
          return '';
      }
      return ` en ${this.volume} volumes`;
    }
}


const alice = new Book("Les aventures de Alice au pays des Merveilles", "Levis Carroll")
console.log(alice.getDescription());
//"Les aventures de Alice au pays des Merveilles" est une oeuvre de Levis Carroll


const harryPotter = new Book("Harry Potter", "JK Rowling", 7)
console.log(harryPotter.getDescription());
//"Harry Potter" est une oeuvre de JK Rowling en 7 volumes
```

L'héritage est également disponible lors de la définition d'une classe. Ainsi:

```javascript
// L'heritage de Book se fait via le mot-clef `extends`.
class Comics extends Book {
  construction(title, author, volume) {
    // La fonction clef `super` permet de faire appel à une fonction mère.
    this.super(title, author, volume);
  }
  
  getPrecision() {
    if (this.volume === 0) {
        // On note l'appel à la fonction mère getPrecision() dans le cas le volume est nul
        return super.getPrecision();
    }
    return ` en ${this.volume} issues`;
  }
} 

const watchmen = new Comics("Watchmen", "Alan Moore", 12);
console.log(watchmen.getDescription());
//"Watchmen" est une oeuvre de Alan Moore en 12 issues


const spiderManVsAsterix = new Comics("Spider-Man VS Asterix", "Julien Ripault", 0);
console.log(spiderManVsAsterix.getDescription());
//"Spider-Man VS Asterix" est une oeuvre de Julien Ripault
```


<div class="work no-answer">
  {% capture m %}

Convertir la route **routes/application.js** en classe native.
```javascript
import Route from '@ember/routing/route';

export default class ApplicationRoute extends Route {
    model() {
        return this.store.findAll('comic');
    }
}

```
  {% endcapture %}{{ m | markdownify }}
</div>

### Decorators (et ember-decorators)

Les **decorators** sont un système d'annotations meta-langage permettant de définir des propriétés de propriété. Son comportement peut se rapprocher des annotations en Java ou des attributs standardisés en C++.
Les **decorators** ont été introduit dans [ES6 et TypeScript](https://www.typescriptlang.org/docs/handbook/decorators.html) et sont actuellement à l'[Etape 2 d'intégration de JavaScript](https://github.com/tc39/proposal-decorators).

Dans Ember, ces **decorators** ont été défini lors de la [RFC-0408][ember-rfc-0408] et leur intégration est en attente de la validation de l'étape 2 de validation des decorators dans JavaScript. Cependant, l'addon [ember-decorators][ember-decorators] permet leurs utilisations.
La documentation de cet add-on contient également de nombreux [exemples d'utilisation de classe native](https://ember-decorators.github.io/ember-decorators/docs/native-class-basics).

Nous allons voir comment les utiliser efficacement au sein d'une application Ember.

<div class="work no-answer">
  {% capture m %}

1. Mettre en place le plugin ember-decorators.
    * Installer le plugin via `ember install ember-decorators`
 
    ```console
    ➜  ember-training git:(addDecorators) ember install ember-decorators
        Yarn: Installed ember-decorators
        installing ember-decorators
        install package babel-eslint
        Yarn: Installed babel-eslint@^8.0.0
        install addon @ember-decorators/babel-transforms@^3.1.0
        Yarn: Installed @ember-decorators/babel-transforms@^3.1.0
        Installed addon package.
        Installed addon package.
    ```

    * Lors du lancement de Ember, il est possible que ce dernier refuse de compiler parce que la version de **ember-cli-babel** est trop basse:
    ```console
    Build Error (broccoli-persistent-filter:Babel > [Babel: ember-training])

    ember-training/models/comic.js: Unexpected token (5:4)

    3 | 
    4 | export default class ComicModel extends Model {        
    > 5 |     @attr('string', { defaultValue: 'new' }) title;
        |     ^
    ```

    
    En effet, certaines options de **ember-decorators** necessitent une version plus récente du plugin de transpilation.
    
    Une mise à jour à l'aide de **yarn** permet de résoudre ce problème:

    ```console
        ➜  ember-training git:(addDecorators) ✗ yarn upgrade ember-cli-babel@^7.0.0
    ```

    * Configurer son IDE pour accepter les **decorators**. Il s'agit généralement d'un fichier de configuration de compiler permettant d'accepter des features experimentales.
        Pour Visual Studio Code, la configuration se fait à l'aide d'un fichier **jsconfig.json**
        ```json
            {"compilerOptions":{"target":"es6","experimentalDecorators":true},"exclude":["node_modules","bower_components","tmp","vendor",".git","dist"]}
        ```   
    1. Convertir le model `comic` en classe native avec decorators.
```javascript
    import DS from 'ember-data';
    import { attr, hasMany } from '@ember-decorators/data'; 
    import { computed } from '@ember-decorators/object';

    const { Model } = DS;

    export default class ComicModel extends Model {        
        @attr('string', { defaultValue: 'new' }) title;
        @attr('string') scriptwriter;
        @attr('string') illustrator;
        @attr('string') publisher;
        @attr('boolean', { defaultValue: false }) isFavorite;
        @hasMany('album') albums;

        @computed('title')
        get slug() {
            const title = this.get('title') || 'new';
            return title.dasherize();
        }
    }
```

  {% endcapture %}{{ m | markdownify }}
</div>

[ember]: http://emberjs.com/
[ember-data]: https://guides.emberjs.com/v3.4.0/models/
[ember-decorators]: https://github.com/ember-decorators/ember-decorators
[ember-rfc]: https://github.com/emberjs/rfcs/
[ember-rfc-0408]: https://github.com/emberjs/rfcs/blob/master/text/0408-decorators.md