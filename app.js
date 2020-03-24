const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/fruitsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const fruitsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Check your data entry,no name specified"]
  },
  rating: {
    //tipos de validacao
    type: Number,
    min: 1,
    max: 10
  },
  review: String
});

const Fruit = mongoose.model("Fruit", fruitsSchema); // Pega o Schema fruitsSchema e cria uma collection dele com o nome fruits(lodash)

const fruit = new Fruit({
  //cria uma nova fruta e adiciona ao model Fruit
  name: "orange",
  rating: 7,
  review: "Nice"
});
//fruit.save() //cada vez que rodar esse comando vai salvar essa fruta

const pineapple = new Fruit({
  name: "Pineapple",
  score: 9,
  review: "great fruit"
});

/* pineapple.save(); */

const kiwi = new Fruit({
  //cria uma nova fruta e adiciona ao model Fruit
  name: "kiwi",
  rating: 4,
  review: "not good"
});

const banana = new Fruit({
  //cria uma nova fruta e adiciona ao model Fruit
  name: "Banana",
  rating: 1,
  review: "eca"
});

/* Fruit.insertMany([kiwi, banana], function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Succesfully saved all the fruits to fruitsDB")
    }
}); */

/* Fruit.updateOne({
    _id: "5e5d44e892a21708841bbf84" // primeiro parametro e a condicao(igual)
}, {
    rating: "8" // primeiro parametro e a condicao(igual), segundo e o que será mudado
}, function (err) { // terceiro e um callback
    if (err) {
        console.log(err);
    } else {
        console.log("Succesfully updated all the fruits to fruitsDB")
    }
}); */

/* Fruit.deleteOne({
    name: "Banana" // primeiro parametro e a condicao(igual)
}, function (err) { // terceiro e um callback
    if (err) {
        console.log(err);
    } else {
        console.log("Succesfully deleted the fruit to fruitsDB")
    }
}); */

Fruit.find(function(err, oQueVaiEncontrar) {
  //o segundo parametro e o que achar
  if (err) {
    console.log(err);
  } else {
    mongoose.connection.close(); //fecha a conexao com o mongoose

    console.log(oQueVaiEncontrar); //lista o que foi encontrado
    console.log("Apenas os nomes das frutas :");

    oQueVaiEncontrar.forEach(elements => {
      //seleciona o array oquevaiencontrar ,elements sao seus elementos
      console.log(elements.name);
    });
  }
});

//------------------------- Collections(model) de  Pessoas  dentro do fruitsDB  ---------------------------//

const personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  favouriteFruit: fruitsSchema //pega o schema do fruits
});

const Person = mongoose.model("Person", personSchema);

const pessoaNova = new Person({
  //adiciona a pessoa nova no model "Person" que tem o personschema
  name: "Amy",
  age: 42,
  favouriteFruit: pineapple
});

/* pessoaNova.save(); */

/* Person.deleteMany({ name: "John" }, function(err) {
  // terceiro e um callback
  if (err) {
    console.log(err);
  } else {
    console.log("Succesfully deleted");
  }
}); */

Person.updateOne(
  {
    name: "John" // primeiro parametro e a condicao(igual)
  },
  {
    favouriteFruit: kiwi // primeiro parametro e a condicao(igual), segundo e o que será mudado
  },
  function(err) {
    // terceiro e um callback
    if (err) {
      console.log(err);
    } else {
      console.log("Succesfully updated all the fruits to fruitsDB");
    }
  }
);

//------------------------- Collections(model) de  Pessoas  dentro do fruitsDB  ---------------------------//
