const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 8085;
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");



app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const connection = require("./connector");

let data = require("./data");

/**
 * @swagger
 * /api/order:
 *   get:
 *     summary:  To get first 10 order.
 *     description: This endpoint returns the first 10 orders from the `orders`
 *     responses:
 *       200:
 *         description: Status Ok
 */
app.get("/api/order", (req, res) => {
  try {
    connection.query(
      "select * from orders limit 10 offset 0",
      (err, respond) => {
        res.status(200).json(respond);
      }
    );
  } catch (err) {
    res.status(401).json({ message: "401 bad request" });
  }
});

/**
 * @swagger
 * /api/order/{limit}/{offset}:
 *   get:
 *     summary: Get orders with pagination.
 *     parameters:
 *       - in: path
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The number of records to retrieve.
 *       - in: path
 *         name: offset
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: The number of records to skip before starting to retrieve.
 *     responses:
 *       '200':
 *         description: OK. Returns the list of orders.
 *       '400':
 *         description: Bad Request. When an error occurs during the query.
 */
app.get("/api/order/:limit/:offset", async (req, res) => {
  const { limit, offset } = req.params;

  try {
    await connection.query(
      `SELECT * FROM orders LIMIT ${limit} OFFSET ${offset}`,
      (error, respond) => {
        res.status(200).send(respond);
      }
    );
  } catch (error) {
    res.status(400).json({ message: "400 bad request" });
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
module.exports = app;
