const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

const app = express();

const PORT = 3005;

const limiter = rateLimit({
    max: 5,
    windowMs: 2 * 60 * 1000,
});


const setupAndStartServer = () =>{
    app.use(morgan('default'));

    app.use(limiter);  
    
    app.use('')

    app.use('/bookingService', createProxyMiddleware({target:'http://localhost:3002/',changeOrigin:true}));
    app.use('/flightSearch', createProxyMiddleware({target:'http://localhost:3000/',changeOrigin:true}));

    app.listen(PORT,()=>{
        console.log(`Listening on ${PORT}`);
    });
}

setupAndStartServer();