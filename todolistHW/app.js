import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3004;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "RichIman@2000",
  port: 5434,
});
db.connect();

// изменить код чтоб список задач вытягивался из таблицы items в БД
app.get("/", async (req, res) => {
  const results = await db.query("Select * from todolist");
  // console.log(results);
  // results.rows.forEach((item) => {
  //   items.push(item);
  // });
  const items = [...results?.rows];
  res.render("index.ejs", {
    listTitle: "Сегодня",
    listItems: items,
  });
});

// изменить код так чтобы список задач добавлялся в таблицу items в БД
app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  // items.push({ title: item });
  try {
    if (item.trim().length > 0) {
      const result = await db.query(
        "INSERT INTO todolist (title) VALUES ($1)",
        [item]
      );
      console.log(result);
      // res.status(200).json({ message: "Successfull!" });
    } else {
      res.status(422).json({ message: "Invalid value!" });
    }
    res.redirect("/");
  } catch (err) {
    res.status(500).json({ error: "An error occurred while adding the item" });
    res.redirect("/");
  }
});

app.post("/edit", async (req, res) => {
  const { updatedItemId, updatedItemTitle } = req.body;
  try {
    if (updatedItemTitle.trim().length > 0) {
      await db.query("Update todolist set title =$1 where id=$2", [
        updatedItemTitle,
        updatedItemId,
      ]);
      // res.status(200).json({ message: "Successfull!" });
    } else {
      res.status(422).json({ message: "Invalid value!" });
    }
    res.redirect("/");
  } catch (err) {
    res.status(500).json({ error: "An error occurred while adding the item" });
    res.redirect("/");
  }
});
//добавить код для редактирования списка задач в таблице БД

app.post("/delete", async (req, res) => {
  const { deleteItemId } = req.body;
  try {
    await db.query("Delete from todolist where id =$1", [deleteItemId]);
    res.redirect("/");
  } catch {
    res.status(500).json({ error: "An error occurred while adding the item" });
  }
});
//добавить код для удаления задачи

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
