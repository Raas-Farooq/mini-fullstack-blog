import winston from "winston";


const logger = winston.createLogger({
    type:"error",
    format:winston.format.json(),
    transports:[
        new winston.transports.Console(),
        new winston.transports.File({filename:'error.log'})
    ]
})
const errorLogger = (err,req,res, next) => {

    logger.error(err.stack);
    const statusCode = res.status || res.statusCode || 500
    return res.status(statusCode).json({
        success:false,
        message:"Server Error Occurred. Please Try Again Later",
        err:err.message
    })
}


export default errorLogger

