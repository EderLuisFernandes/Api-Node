const express = require("express");
const uuid = require("uuid");
const cors = require("cors")
const app = express();
app.use(express.json());
app.use(cors())
const rota =  process.env.PORT ||3002;

const Hanburgue = [];

const VerificarId = (request, response, next) => {
  const { id } = request.params;
  const index = Hanburgue.findIndex((user) => user.id === id);
  if (index < 0) {
    return response.status(404).json({ ERRO: "Pedido Não Encontrado" });
  }

  request.Userid = id;
  request.Userindex = index;

  next();
};
const addTodasRotas = (request, response, next) => {
  console.log(`[${request.method}] - [${request.url}]`);
  next();
};
app.use(addTodasRotas); 

app.post("/order", (request, response) => {
  const { Pedido, Nome, Valor } = request.body;
  const Usuarios = { 
    id: uuid.v4(),
    Pedido,
    Nome,
    Valor,  
    Status: "Em Preparação",
  };

  Hanburgue.push(Usuarios);

  return response.status(201).json(Usuarios);
});
 
app.get("/order", (request, response) => {
  return response.json(Hanburgue);
});
app.put("/order/:id", VerificarId, (request, response) => {
  const id = request.Userid;
  const index = request.Userindex;
  const { Pedido, Nome, Valor } = request.body;

  const atualizarPedidos = { id, Pedido, Nome, Valor, Status: "Em Preparação" };

  Hanburgue[index] = atualizarPedidos;
  return response.json(atualizarPedidos);
});
 
app.delete("/order/:id", VerificarId, (request, response) => {
  const index = request.Userindex;
  Hanburgue.splice(index, 1);

  return response.json({ Sucesso: "Remove" });
});

app.get("/order/:id", VerificarId, (request, response) => {
  const { id } = request.params;
  const index = Hanburgue.find((users) => users.id === id);
  if (index < 0) {
    return response.status(404).json({ ERRO: "Pedido Não Encontrado" });
  }
  return response.send(index);
});

app.patch("/order/:id", VerificarId, (request, response) => {
  const index = request.Userindex;

  Hanburgue[index].Status = "Pronto";

  return response.json(Hanburgue[index]);
});

app.listen(rota, () => {
  console.log("🚀 HERE 📚 IS 🚀 CODE 😁");
});
