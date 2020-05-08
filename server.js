require('module-alias/register');
const dotenv = require('dotenv');
const app = require('./bin').default;

dotenv.config();

// set the port for the server
app.set('port', process.env.PORT || 7777);

// start listening on the port
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
