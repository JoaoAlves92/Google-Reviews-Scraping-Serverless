const moment = require("moment");

function buildQueryString(params) {
  return Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");
}

const isLocalHost = (event) => {
  const isLocalHost = event.headers?.host?.includes("localhost");
  return isLocalHost ?? false;
};

const generateSQSQueueUrlFromArn = (arn) => {
  if (!arn) return "";
  const [_, __, ___, region, accountId, queueName] = arn.split(":");
  return `https://sqs.${region}.amazonaws.com/${accountId}/${queueName}`;
};

const getOfflineSqsQueueUrl = (sqsQueueUrl) => {
  const url = new URL(sqsQueueUrl);
  return `${process.env.SQS_OFFLINE_ENDPOINT}${url.pathname}`;
};

const toDateTime = (timestamp) => {
  const date = moment(timestamp * 1000);
  return date.format('YYYY-MM-DD HH:MM:SS');
}

const convertReviewToArrayOfValues = (reviewsArray) => {
  return reviewsArray.map((obj) => [
    obj.author_name,
    obj.language,
    obj.original_language,
    obj.rating,
    obj.relative_time_description,
    obj.text,
    toDateTime(obj.time),
  ]);
};

module.exports = {
  buildQueryString,
  isLocalHost,
  generateSQSQueueUrlFromArn,
  getOfflineSqsQueueUrl,
  convertReviewToArrayOfValues
};
