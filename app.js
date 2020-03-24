<<<<<<< HEAD
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
=======
let express = require("express");
let bodyParser = require("body-parser");
let date = require(__dirname + "/date.js"); //importa tudo de date.js
const mongoose = require("mongoose");
const _ = require("lodash");

let app = express();

// *******************  MONGOOOSE ****************
mongoose.connect(
  "mongodb+srv://admin-caetano:johnzin1@pedrodb-qh4xd.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);
mongoose.set("useFindAndModify", false);

var todolistSchema = new mongoose.Schema({
  name: String
});

const ItemsModel = mongoose.model("itemsmongoose", todolistSchema); // Pega o Schema fruitsSchema e faz o Nome virar listmodels pelo lodash

const item1 = new ItemsModel({
  name: "Welcome to your todolist!"
});

const item2 = new ItemsModel({
  name: "hit the + button to add a new item."
});

const item3 = new ItemsModel({
  name: "<-- hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

/* ItemsModel.insertMany(defaultItems, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("succesfully saved all items on Database!");
  }
}); */

/* esquema para route parameters */
var routeListSchema = new mongoose.Schema({
  name: String,
  items: [todolistSchema]
});

const listForRouters = mongoose.model("listForRouter", routeListSchema);

// ******************* FIM MONGOOOSE ****************

app.set("view engine", "ejs"); // faz o node reconhecer o ejs como seu view engine(usar a paste views)

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(express.static("public")); // faz o express ver a pasta public

app.get("/", function(req, res) {
  let day = date.getDate(); //importa do modulo date.js a funcao getDate

  ItemsModel.find({}, function(err, foundItems) {
    if (err) {
      console.log(err);
    } else {
      if (foundItems.length === 0) {
        //verifica se há algum item encontrado na pesquisa
        ItemsModel.insertMany(defaultItems, function(err) {
          //defaultItem foi criado na parte do moongose(3 itens explicando o site), adiciona os 3 items no banco de dados caso esteja vazio

          if (err) {
            console.log(err);
          } else {
            console.log("succesfully saved all items on Database!");
          }
        });
        res.redirect("/"); //volta para a pagina inicial a fim de atualizar o site
      } else {
        res.render("list", {
          //procura na paste views o arquivo list
          kindOfDay: day,
          listItems: foundItems
        });
      }
    }
  });
});

/* app.get("/work", function(req, res) {
  res.render("list", {
    kindOfDay: "Work",
    listItems: workItem
  });
}); */

/************ Get de ROUTE PARAMETERS *****************/

app.get("/:customListName", function(req, res) {
  /* console.log(req.params); */
  /* (exibe um objeto customlistname: "videos") */
  /* console.log(req.params.customListName); */
  const routeParameters = _.capitalize(req.params.customListName);

  listForRouters.findOne(
    {
      name: routeParameters
    },
    function(err, foundList) {
      if (!err) {
        if (!foundList) {
          //não encontrou (cria uma nova lista)

          const list = new listForRouters({
            name: routeParameters,
            items: defaultItems //default são os 3 items criados no inicio do projeto
          });
          list.save();
          res.redirect("/" + routeParameters);
        } else {
          //Encontrou (Exibe a lista encontrada)
          res.render("list", {
            //procura na paste views o arquivo list
            kindOfDay: routeParameters,
            listItems: foundList.items
          });
        }
      }
    }
  );
});

/************ FIM Get de ROUTE PARAMETERS *****************/

app.post("/", function(req, res) {
  let itemAdicionadoFront = req.body.newItem; //recebe o valor do item digitado no formulario
  let listName = req.body.typeOfList;
  let todayy = date.getDay(); //importa do modulo date.js a funcao getDate
  const itemDigitado = new ItemsModel({
    name: itemAdicionadoFront
  });

  if (listName === todayy + ",") {
    //compara listname(o valor do botão clicado que é o dia da pagina ou nome)
    itemDigitado.save();
    res.redirect("/");
  } else {
    listForRouters.findOne(
      {
        name: listName
      },
      function(err, foundList) {
        foundList.items.push(itemDigitado); //vai no item encontrado que é um objeto {name:xxxxx, items:[]} e insere nos items
        foundList.save();
        res.redirect("/" + listName);
      }
    );
  }
});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkBoxDeleted;
  const listName = req.body.listName;
  let today = date.getDate();

  if (listName === today) {
    /*  ItemsModel.deleteOne({ _id: checkedItemId }, function(err, foundItems) { */
    //ou model.findByIdAndRemove(id, options, callback) feito abaixo
    ItemsModel.findByIdAndRemove(checkedItemId, function(err, foundItems) {
      if (err) {
        console.log(err);
      } else {
        console.log("Removido com sucesso");
      }
      res.redirect("/");
    });
  } else {
    listForRouters.findOneAndUpdate(
      {
        name: listName
      },
      {
        $pull: {
          items: {
            _id: checkedItemId
          }
        }
      }, //funcao pull do mongo remove o do array o que foi encontrado
      function(err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("server is running on port 3000.");
});

/* ou 
App.listen(process.env.PORT || 3000, function () { 
  console.log("server is running on port 3000."); 
}); *** */
>>>>>>> 69d5e2772033b02c6dd9abefea48febe2c9d8c18
