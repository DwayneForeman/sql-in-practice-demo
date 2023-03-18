require("dotenv").config();
const { CONNECTION_STRING } = process.env;
const { response, request } = require("express");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const userId = 4;
const clientId = 3;

module.exports = {
  getUserInfo: (request, response) => {
    sequelize
      .query(
        `SELECT * FROM cc_clients AS c
    JOIN cc_users AS u ON c.user_id = u.user_id
    WHERE u.user_id = ${userId}`
      )
      .then((dbResult) => {
        console.log(dbResult);
        response.status(200).send(dbResult[0]);
      })
      .catch((error) => console.log(error));
  },

  updateUserInfo: (request, response) => {
    let {
      firstName,
      lastName,
      phoneNumber,
      email,
      address,
      city,
      state,
      zipCode,
    } = request.body;

    sequelize
      .query(
        `UPDATE cc_users set first_name = '${firstName}',
  last_name = '${lasttName}',
  email = '${email}',
  phone_number = ${phoneNumber}
  WHERE user_id = ${userId};

  UPDATE cc_clients set address = '${address}',
  city = '${city}',
  state = '${state}',
  zip_code = ${zipCode}
  WHERE user_id = ${userId};`
      )
      .then(() => response.sendStatus(200))
      .catch((error) => console.log(error));
  },

  getUserAppt: (request, response) => {
    sequelize
      .query(
        `SELECT * FROM cc_appointments
    WHERE client_id = ${clientId}
    ORDER BY date DESC`
      )
      .then((dbResult) => response.status(200).send(dbResult[0]))
      .catch((error) => console / log(error));
  },

  requestAppointment: (request, response) => {
    const { date, service } = request.body;

    sequelize
      .query(
        `INSERT INTO cc_appointments (client_id, date, service_type, notes, approved, completed)
          VALUES (${clientId}, '${date}', '${service}', '', false, false)
          RETURNING *;`
      )
      .then((dbResult) => response.status(200).send(dbResult[0]))
      .catch((error) => console / log(error));
  },
};
