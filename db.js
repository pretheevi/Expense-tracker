const mysql = require('mysql2');

const connection  = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '7y$W8oL3@xZrQ1#eT2vN',
  database: 'expense tracker'
});

connection.connect((err) => {
  if(err){
    console.error('Error connecting to the database',err);
  }else{
    console.log('Connected to database');
  }
});


module.exports =  connection;

