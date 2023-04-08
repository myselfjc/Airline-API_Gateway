const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const authServicePath = 'http://localhost:3001';

const app = express();

const PORT = 3005;

const limiter = rateLimit({
    max: 5,
    windowMs: 2 * 60 * 1000,
});


const setupAndStartServer = () =>{
    app.use(morgan('default'));

    app.use(limiter);  
    
    app.use('/bookingService', async (req,res,next) => {
        const checkUser = await axios.get(`${authServicePath}/authService/api/v1/user/authenticate`,{
            headers:{
                "x-access-token":req.headers['x-access-token']
            }
        });
        if(!checkUser){
            return new Error('User is not authorized! Please login..')
        }
        next();
    })

    app.use('/bookingService', createProxyMiddleware({target:'http://localhost:3002/',changeOrigin:true}));
    app.use('/flightSearch', createProxyMiddleware({target:'http://localhost:3000/',changeOrigin:true}));
    app.use('/authService', createProxyMiddleware({target:'http://localhost:3001/',changeOrigin:true}));

    app.listen(PORT,()=>{
        console.log(`Listening on ${PORT}`);
    });
}

setupAndStartServer();