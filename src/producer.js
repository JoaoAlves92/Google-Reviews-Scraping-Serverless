const SQS = require("aws-sdk/clients/sqs");
const { v1 } = require("uuid");
const {
  buildQueryString,
  generateSQSQueueUrlFromArn,
  isLocalHost,
  getOfflineSqsQueueUrl,
} = require("./utils/helpers");
const axios = require("axios");

const producer = async (event) => {
  const placeId = process.env.PLACE_ID;
  const googleAppKey = process.env.GOOGLE_APP_KEY;

  const id = v1();
  const sqs = new SQS();
  const sqsQueueUrl = generateSQSQueueUrlFromArn(process.env.FIFO_QUEUE_ARN);
  const url = isLocalHost(event)
    ? getOfflineSqsQueueUrl(sqsQueueUrl)
    : sqsQueueUrl;

  const queryParams = {
    place_id: placeId,
    language: "pt-BR",
    fields: "reviews,name,user_ratings_total,formatted_address,place_id,rating",
    reviews_sort: "newest",
    key: googleAppKey,
  };

  const base = "https://maps.googleapis.com/maps/api/place/details/json";
  const queryString = buildQueryString(queryParams);
  const urlGoogle = `${base}?${queryString}`;

  try {
    const response = await axios.get(urlGoogle);
    const result = response.data.result;

    await sqs
      .sendMessage({
        QueueUrl: url,
        MessageBody: JSON.stringify({ reviews: result.reviews }),
        MessageAttributes: {
          TableName: {
            StringValue: "Reviews_" + result.name.split(' ')[0],
            DataType: "String",
          },
        },
        MessageDeduplicationId: id,
        MessageGroupId: `Test-Group-${id}`,
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `[${id}] - Reviews sent to SQS!` }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

module.exports = { producer };
