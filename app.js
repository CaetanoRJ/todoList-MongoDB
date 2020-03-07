let express = require("express");
let bodyParser = require("body-parser");
let date = require(__dirname + "/date.js"); //importa tudo de date.js
const mongoose = require("mongoose");
const _ = require("lodash");

let app = express();

// *******************  MONGOOOSE ****************
mongoose.connect(
  "mongodb+srv://admin-caetano:johnzin1@pedrodb-qh4xd.mongodb.net/todolistDB", {
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

app.get("/", function (req, res) {
  let day = date.getDate(); //importa do modulo date.js a funcao getDate

  ItemsModel.find({}, function (err, foundItems) {
    if (err) {
      console.log(err);
    } else {
      if (foundItems.length === 0) {
        //verifica se há algum item encontrado na pesquisa
        ItemsModel.insertMany(defaultItems, function (err) {
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

app.get("/:customListName", function (req, res) {
  /* console.log(req.params); */
  /* (exibe um objeto customlistname: "videos") */
  /* console.log(req.params.customListName); */
  const routeParameters = _.capitalize(req.params.customListName);

  listForRouters.findOne({
      name: routeParameters
    },
    function (err, foundList) {
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

app.post("/", function (req, res) {
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
    listForRouters.findOne({
        name: listName
      },
      function (err, foundList) {
        foundList.items.push(itemDigitado); //vai no item encontrado que é um objeto {name:xxxxx, items:[]} e insere nos items
        foundList.save();
        res.redirect("/" + listName);
      }
    );
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkBoxDeleted;
  const listName = req.body.listName;
  let today = date.getDate();

  if (listName === today) {
    /*  ItemsModel.deleteOne({ _id: checkedItemId }, function(err, foundItems) { */
    //ou model.findByIdAndRemove(id, options, callback) feito abaixo
    ItemsModel.findByIdAndRemove(checkedItemId, function (err, foundItems) {
      if (err) {
        console.log(err);
      } else {
        console.log("Removido com sucesso");
      }
      res.redirect("/");
    });
  } else {
    listForRouters.findOneAndUpdate({
        name: listName
      }, {
        $pull: {
          items: {
            _id: checkedItemId
          }
        }
      }, //funcao pull do mongo remove o do array o que foi encontrado
      function (err, foundList) {
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

app.listen(port, function () {
  console.log("server is running on port 3000.");
});


/* ou 
App.listen(process.env.PORT || 3000, function () { 
  console.log("server is running on port 3000."); 
});  */