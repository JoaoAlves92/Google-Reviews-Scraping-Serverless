const database = require("./database");
const { Review } = require("./models/Review");

const consumer = async (event) => {
  await database.sync();

  for (const record of event.Records) {
    try {
      const messageAttributes = record.messageAttributes;
      const reviews = JSON.parse(record.body).reviews;

      const tableName = messageAttributes.TableName.stringValue;

      await Review.bulkCreate(reviews);
    } catch (error) {
      console.error("Erro ao processar mensagem:", error);
    }
  }
};

module.exports = {
  consumer,
};
