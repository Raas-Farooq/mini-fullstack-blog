import morgan from 'morgan';


// const logger = morgan(':method :url :status res:content-length response-')
const logger = morgan('dev');

export default logger