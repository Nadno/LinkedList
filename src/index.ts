import LinkedList from './models/LinkedList';

import '../public/styles/main.scss';


const list = new LinkedList<string>();

list.push(
 'Fernando',
 'Kaio',
 'Noel',
 'Ana',
 'Ricardo',
 'Hamilton',
 'Erica',
 'Luis',
 'João',
 'Eric',
 'Lucas',
 'Guilherme' 
);

console.log(list.toArray());

list.sort();
console.log(list.toArray());


console.log(`at ${4}: `, list.at(4));
list.insertFrom(4, 'Alex', 'Karine', 'Eduardo');


console.log(`at ${8}: `, list.at(8));
list.insertFrom(8, 'Icaro', 'Ico', 'Silas');

console.log(list.toArray());

list.sort();
console.log(list.toArray());

list.insertSort((v, n) => v < n, 'Felipe', 'Noel', 'Caio', 'Alice', 'A', 'Zé');

console.log(list.toArray());