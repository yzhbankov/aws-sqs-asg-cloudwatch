import AWS from 'aws-sdk';
import * as ConfigContainer from './lib/config.cjs';
import { delay } from './lib/utils/index.mjs';

const AWS_REGION = ConfigContainer.config.aws_region;
const SQS_URL = ConfigContainer.config.aws_sqs_url;
const SQS_NAME = ConfigContainer.config.aws_sqs_name;
const DELAY = ConfigContainer.config.delay;

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

const receiveMessages = async () => {
    const params = {
        QueueUrl: SQS_URL,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 20, // Long polling
    };

    try {
        const data = await sqs.receiveMessage(params).promise();
        if (data.Messages && data.Messages.length > 0) {
            const message = data.Messages[0];
            console.log('Message received:', message.Body);

            await delay(DELAY);

            // Delete the message from the queue
            await deleteMessage(message.ReceiptHandle);

            // Continue to receive messages
            receiveMessages();
        } else {
            console.log('No messages to process');
            // Continue to receive messages
            receiveMessages();
        }
    } catch (error) {
        console.error('Error receiving message:', error.message);
        if (error.message.includes('specified queue does not exist')) throw error;
        // Continue to receive messages even in case of an error
        receiveMessages();
    }
};

const deleteMessage = async (receiptHandle) => {
    const params = {
        QueueUrl: SQS_URL,
        ReceiptHandle: receiptHandle,
    };

    try {
        await sqs.deleteMessage(params).promise();
        console.log('Message deleted successfully');
    } catch (error) {
        console.error('Error deleting message:', error);
    }
};

const sqsExist = await checkQueueExists(SQS_NAME);

if (sqsExist) {
    receiveMessages();
} else {
    console.error(`The "${SQS_NAME}" SQS with "${SQS_URL}" URL does not exist.`);
}
