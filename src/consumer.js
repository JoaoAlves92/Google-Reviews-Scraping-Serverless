const format = require("pg-format");
const { pool } = require("./database");
const { convertReviewToArrayOfValues } = require("./utils/helpers");

const consumer = async (event) => {
  const connection = await pool.connect();

  for (const record of event.Records) {
    try {
      const messageAttributes = record.messageAttributes;
      const reviews = JSON.parse(record.body).reviews;

      const tableName = messageAttributes.TableName.stringValue;

      const tableExistsQuery = `
          SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_name = $1
          );
        `;
      const tableExistsResult = await connection.query(tableExistsQuery, [
        tableName.toLowerCase(),
      ]);
      const tableExists = tableExistsResult.rows[0].exists;

      // Se a tabela não existir, cria ela
      if (!tableExists) {
        const createTableQuery = `
          CREATE TABLE ${tableName} (
            id SERIAL PRIMARY KEY,
            author_name VARCHAR(255),
            language VARCHAR(10),
            original_language VARCHAR(10),
            rating INTEGER,
            relative_time_description VARCHAR(50),
            text TEXT,
            time TIMESTAMPTZ
          );
        `;

        await connection.query(createTableQuery);
      }

      const insertDataQueries = `
            INSERT INTO ${tableName} (
              author_name,
              language,
              original_language,
              rating,
              relative_time_description,
              text,
              time
            )
            VALUES %L
          `;

      const queryParameters = convertReviewToArrayOfValues(reviews);

      await connection.query(format(insertDataQueries, queryParameters));
    } catch (error) {
      console.error("Erro ao processar mensagem:", error);
    }
  }

  connection.release();
};

module.exports = {
  consumer,
};
