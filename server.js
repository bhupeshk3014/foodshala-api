const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "B@9582kumar",
    database: "foodshala"
  }
});

const app = express();
app.use(express.json());
app.use(cors());

const database = {
  customer: [
    {
      id: "123",
      name: "jatin",
      email: "bhupesh@gmail.com",
      password: "cookies",
      address: "6171 dev nagar",
      pnumber: "9997939999",
      preference: "Veg",
      joined: new Date()
    },
    {
      id: "124",
      name: "khushboo",
      email: "khushboo@gmail.com",
      password: "facebook",
      address: "6155 dev nagar",
      pnumber: "9999999999",
      preference: "Non Veg",
      joined: new Date()
    },
    {
      id: "125",
      name: "neelima",
      email: "neelima@gmail.com",
      password: "parveen",
      address: "6171 Patel nagar",
      pnumber: "9999988999",
      preference: "Veg",
      joined: new Date()
    }
  ],
  restaurant: [
    {
      id: "123",
      name: "rohit",
      email: "bhupesh@gmail.com",
      password: "cookies",
      rname: "aggarwal sweets",
      address: "6171 dev nagar",
      pnumber: "9997939999",
      cuisines: "North indian",
      cf2: "800",
      tfrom: "11",
      tto: "8",
      joined: new Date()
    },
    {
      id: "124",
      name: "khushboo",
      email: "khushboo@gmail.com",
      password: "facebook",
      rname: "dominos",
      address: "6155 dev nagar",
      pnumber: "9999999999",
      cuisines: "North indian",
      cf2: "1000",
      tfrom: "8",
      tto: "8",
      joined: new Date()
    },
    {
      id: "125",
      name: "neelima",
      email: "neelima@gmail.com",
      password: "parveen",
      rname: "pizza hut",
      address: "6171 Patel nagar",
      pnumber: "9999988999",
      cuisines: "indian",
      cf2: "1800",
      tfrom: "10",
      tto: "11",
      joined: new Date()
    }
  ],
  menu: [
    {
      id: "123",
      starter: [
        {
          dish: "kebab",
          type: "Non veg",
          price: "200"
        }
      ],
      maincourse: [
        {
          dish: "dal makhni",
          type: "Veg",
          price: "180"
        }
      ],
      beverages: [
        {
          dish: "limca",
          price: "60"
        }
      ]
    },
    {
      id: "124",
      starter: [
        {
          dish: "chicken tikka",
          type: "Non veg",
          price: "300"
        }
      ],
      maincourse: [
        {
          dish: "shahi paneer",
          type: "Veg",
          price: "180"
        }
      ],
      beverages: [
        {
          dish: "Mojito",
          price: "60"
        }
      ]
    }
  ],
  orders: [
    {
      id: "123",
      order: [
        {
          dish: "shahi paneer",
          type: "Veg",
          price: "180"
        },
        {
          dish: "palak paneer",
          type: "Veg",
          price: "180"
        }
      ]
    },
    {
      id: "124",
      order: [
        {
          dish: "Afgani chicken",
          type: "Non veg",
          price: "180"
        },
        {
          dish: "palak paneer",
          type: "Veg",
          price: "180"
        }
      ]
    }
  ],
  starter: [{ id: "123", dish: "tikka", type: "non veg", price: "455" }],
  maincourse: [{ id: "123", dish: "tikka", type: "non veg", price: "455" }],
  beverages: [{ id: "123", dish: "tikka", type: "non veg", price: "455" }]
};

app.get("/", (req, res) => {
  res.send(database.starter);
});

app.get("/restaurant", (req, res) => {
  db.select("*")
    .from("restaurant")
    .then(restaurant => {
      if (restaurant.length) {
        res.json(restaurant);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch(err => res.status(400).json("Error getting restaurant"));
});

app.post("/signin/customer", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("incorrect form submission");
  }
  db.select("email", "hash")
    .from("customerLogin")
    .where("email", "=", req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("customer")
          .where("email", "=", req.body.email)
          .then(customer => {
            res.json(customer[0]);
          })
          .catch(err => res.status(400).json("Unable to get customer"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch(err => {
      res.status(400).json("wrong credentials");
    });
});

app.post("/signin/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("incorrect form submission");
  }
  db.select("email", "hash")
    .from("restaurantLogin")
    .where("email", "=", req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("restaurant")
          .where("email", "=", req.body.email)
          .then(restaurant => {
            res.json(restaurant[0]);
          })
          .catch(err => res.status(400).json("Unable to get restaurant"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch(err => {
      res.status(400).json("wrong credentials");
    });
});

app.post("/register/customer", (req, res) => {
  const { name, email, password, address, pnumber, preference } = req.body;

  if (!name || !email || !password || !address || !pnumber || !preference) {
    return res.status(400).json("incorrect form submission");
  }

  const hash = bcrypt.hashSync(password);

  db.transaction(trx => {
    trx
      .insert({
        hash: hash,
        email: email
      })
      .into("customerLogin")
      .then(resp => {
        db("customer")
          .where({ customer_id: resp })
          .select("email")
          .then(loginEmail => {
            return trx("customer")
              .insert({
                name: name,
                email: email,
                address: address,
                pnumber: pnumber,
                preference: preference,
                joined: new Date()
              })
              .then(response => {
                db("customer")
                  .where("customer_id", response)
                  .then(customer => {
                    //console.log(customer);
                    res.json("success");
                    // res.json(customer[0]);
                  })
                  .catch(err => {
                    res.status(400).json("Unable to register");
                  });
              })
              .then(trx.commit)
              .catch(trx.rollback);
          })
          .catch(err => {
            res.status(400).json("Unable to register");
          });
      })
      .catch(err => {
        res.status(400).json("Unable to register");
      });
  }).catch(err => {
    res.status(400).json("Unable to register");
  });
});

app.post("/register/restaurant", (req, res) => {
  const {
    name,
    email,
    rname,
    address,
    password,
    pnumber,
    cuisines,
    cf2,
    tfrom,
    tto
  } = req.body;

  if (
    !name ||
    !email ||
    !rname ||
    !password ||
    !address ||
    !pnumber ||
    !cuisines ||
    !cf2 ||
    !tfrom ||
    !tto
  ) {
    return res.status(400).json("incorrect form submission");
  }

  const hash = bcrypt.hashSync(password);

  db.transaction(trx => {
    trx
      .insert({
        hash: hash,
        email: email
      })
      .into("restaurantLogin")
      .then(resp => {
        db("restaurant")
          .where({ restaurant_id: resp })
          .select("email")
          .then(loginEmail => {
            return trx("restaurant")
              .insert({
                name: name,
                email: email,
                address: address,
                pnumber: pnumber,
                rname: rname,
                cuisines: cuisines,
                cf2: cf2,
                tfrom: tfrom,
                tto: tto,
                joined: new Date()
              })
              .then(response => {
                db("restaurant")
                  .where("restaurant_id", response)
                  .then(restaurant => {
                    //console.log(restaurant);
                    res.json("success");
                    // res.json(restaurant[0]);
                  })
                  .catch(err => {
                    res.status(400).json("Unable to register");
                  });
              })
              .then(trx.commit)
              .catch(trx.rollback);
          })
          .catch(err => {
            res.status(400).json("Unable to register");
          });
      })
      .catch(err => {
        res.status(400).json("Unable to register");
      });
  }).catch(err => {
    res.status(400).json("Unable to register");
  });
});

app.get("/menu/:id/starter", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .where({
      id: id
    })
    .from("starter")
    .then(starter => {
      if (starter.length) {
        res.json(starter);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch(err => res.status(400).json("Error getting starter's menu"));
});

app.get("/menu/:id/maincourse", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .where({
      id: id
    })
    .from("maincourse")
    .then(maincourse => {
      if (maincourse.length) {
        res.json(maincourse);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch(err => res.status(400).json("Error getting main course's menu"));
});

app.get("/menu/:id/beverages", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .where({
      id: id
    })
    .from("beverages")
    .then(beverages => {
      if (beverages.length) {
        res.json(beverages);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch(err => res.status(400).json("Error getting beverage's menu"));
});

app.post("/additem/:id/starter", (req, res) => {
  const { id } = req.params;
  const { dish, type, price } = req.body;

  if (!dish || !type || !price) {
    return res.status(400).json("incorrect form submission");
  }

  db("starter")
    .insert({
      id: id,
      dish: dish,
      type: type,
      price: price
    })
    .then(response => {
      db("starter")
        .where("starter_id", response)
        .then(starter => {
          res.json("success");
        });
    })
    .catch(err => {
      res.status(400).json("Unable to Add item");
    });
});

app.post("/additem/:id/maincourse", (req, res) => {
  const { id } = req.params;
  const { dish, type, price } = req.body;

  if (!dish || !type || !price) {
    return res.status(400).json("incorrect form submission");
  }

  db("maincourse")
    .insert({
      id: id,
      dish: dish,
      type: type,
      price: price
    })
    .then(response => {
      db("maincourse")
        .where("maincourse_id", response)
        .then(maincourse => {
          res.json("success");
        });
    })
    .catch(err => {
      res.status(400).json("Unable to Add item");
    });
});

app.post("/additem/:id/beverages", (req, res) => {
  const { id } = req.params;
  const { dish, price } = req.body;

  if (!dish || !price) {
    return res.status(400).json("incorrect form submission");
  }

  db("beverages")
    .insert({
      id: id,
      dish: dish,
      price: price
    })
    .then(response => {
      db("beverages")
        .where("beverages_id", response)
        .then(beverages => {
          res.json("success");
        });
    })
    .catch(err => {
      res.status(400).json("Unable to Add item");
    });
});

app.post("/addtocart/:cid/:rid", (req, res) => {
  const { cid, rid } = req.params;
  const { dish, type, price } = req.body;
  db("additem")
    .insert({
      customer_id: cid,
      restaurant_id: rid,
      dish: dish,
      type: type,
      price: price
    })
    .then(response => {
      db("additem")
        .where("add_id", response)
        .then(additem => {
          res.json(additem[0]);
          // res.json("success");
        });
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

app.post("/order/:id/:rid", (req, res) => {
  const { id, rid } = req.params;
  const { name } = req.body;
  db("orderitem")
    .insert({
      customer_id: id,
      restaurant_id: rid,
      name: name
    })
    .then(response => {
      db("orderitem")
        .where("order_id", response)
        .then(orderitem => {
          res.json(orderitem[0]);
        });
    })
    .catch(err => {
      res.status(400).json("Unable to order your food");
    });
});

app.get("/vieworder/orderitem/:rid/", (req, res) => {
  const { rid } = req.params;
  db.select("*")
    .where({
      restaurant_id: rid
    })
    .from("orderitem")
    .then(item => {
      if (item.length) {
        res.json(item);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch(err => res.status(400).json("Error getting order's"));
});

app.get("/vieworder/dishes/:rid/:cid", (req, res) => {
  const { rid, cid } = req.params;
  db.select("*")
    .where({
      restaurant_id: rid,
      customer_id: cid
    })
    .from("additem")
    .then(item => {
      if (item.length) {
        res.json(item);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch(err => res.status(400).json("Error getting dishes"));
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
