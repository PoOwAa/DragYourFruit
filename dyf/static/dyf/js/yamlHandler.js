/**
 * Created by raymund on 2016.04.01..
 */

var globalFruits;

// getElementById
function $id(id) {
    return document.getElementById(id);
}

function ymlHandler(fruits) {
    /*console.log(fruits);*/
    globalFruits = fruits;

    //fruitMenu
    var fm = $id("fruitMenu");
    var section = document.createElement('section');
    section.setAttribute('id', 'fm');

    var ul = document.createElement('ul');

    fm.appendChild(section);
    section.appendChild(ul);


    for (var fruit in fruits) {

        var li = document.createElement('li');
        ul.appendChild(li);

        var a = document.createElement('a');
        li.appendChild(a);

        a.setAttribute('href','#');
        a.setAttribute('value', fruit);
        a.setAttribute('onclick', 'drawFruit("'+ fruit + '")');

        a.innerHTML = fruit;
    }

    /*
     //fruits
     for (var fruit in fruits) {
     console.log(fruit);
     fruitNames.push(fruit);

     //properties
     for (var property in fruits[fruit]) {
     console.log(property);
     //fruitNames[i].push(property);

     //values
     for (var value in fruits[fruit][property]) {
     console.log(fruits[fruit][property][value]);
     //fruitNames[i][j].push(fruits[fruit][property][value]);
     j++;
     }
     i++;
     }

     }
     */

    console.log(fruits);

    canvasInit();
}