const moment = require('moment');

module.exports = () => {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}