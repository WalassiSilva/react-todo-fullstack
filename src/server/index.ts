import express from "express";
import { api } from "./api";


const app = express();
const port = 3002;

app.use(api);

app.get("/api/hi", (_, res) => {
  res.send("Hi!");
})

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));