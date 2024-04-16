import express from 'express'
import amqp from 'amqplib'
import ModelProduct from '../models/Product.js'

const routes = express.Router()

var connection, channel;
const queueName1='order-service-queue'
const queueName2='product-service-queue'

async function connectToRabbitMQ() {
    const amqpServer = process.env.rabbitMQ;
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue(queueName1);
    await channel.assertQueue(queueName2);
 }

 connectToRabbitMQ().then(() => {
    console.log('Connected to RabbitMQ')
 }).catch((err) =>{
    console.log('Not connected to RabbitMQ' + err)
 })

routes.post('/', (req, res) => {

    const product = req.body;

    ModelProduct.create(product).then((p) => {
        res.json(p)
    }).catch((err) => {
        res.status(520).send('Insertion Impossible')
    })
})

routes.post('/buy', (req, res) => {
    const liste = req.body;

    ModelProduct.find({_id: {$in:liste}}).then((p) => {
        channel.sendToQueue(queueName1, Buffer.from(JSON.stringify(p)))
        res.json(p);
    }).catch((err) => {
        res.status(520).send('Insertion Impossible')
    })
})

export default routes

 