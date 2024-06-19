import AWS from 'aws-sdk';
import * as ConfigContainer from './lib/config.cjs';
import { UID } from './lib/utils/index.mjs';

const AWS_REGION = ConfigContainer.config.aws_region;
const SQS_URL = ConfigContainer.config.aws_sqs_url;
const SQS_NAME = ConfigContainer.config.aws_sqs_name;

// Configure AWS SDK
AWS.config.update({
    region: AWS_REGION, // e.g., 'us-east-1'
});

const sqs = new AWS.SQS();

const checkQueueExists = async (queueName) => {
    const params = {
        QueueName: queueName,
    };

    try {
        const data = await sqs.getQueueUrl(params).promise();
        console.log(`Queue exists: ${data.QueueUrl}`);
        return true;
    } catch (error) {
        if (error.code === 'AWS.SimpleQueueService.NonExistentQueue') {
            console.log('Queue does not exist.');
            return false;
        }
        console.error('Error checking if queue exists:', error);
        throw error;
    }
};

const sendMessage = async (messageBody) => {
    const params = {
        QueueUrl: SQS_URL,
        MessageBody: JSON.stringify(messageBody),
    };

    try {
        const data = await sqs.sendMessage(params).promise();
        console.log(`Message sent with ID: ${data.MessageId}`);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

const sqsExist = await checkQueueExists(SQS_NAME);

if (sqsExist) {
    sendMessage({ uid: UID() });
} else {
    console.error(`The "${SQS_NAME}" SQS with "${SQS_URL}" URL does not exist.`);
}
