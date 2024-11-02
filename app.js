const express = require('express');
const fs = require('fs');
const path = require('path');
//database
const connection = require('./db');
const app = express();
const PORT = 3000;

//middleware 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'app')))


// Define the /home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'app','index.html'));
});
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'app','index.html'));
});
app.get('/category', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname,'app', 'category.html'));
});

//constructor function for form validation - oops concept
function FormData(title, amount, datetime, notes, category) {
  this.title = title;
  this.amount = (!isNaN(amount) && amount !== null) ? amount : null;
  this.datetime = datetime;
  this.notes = notes;
  this.category = category;
} 
// constructor function prototype function 
FormData.prototype.formatDate  = function() {
  return new Date(this.datetime).toLocaleString();
}

//constructor function for form validation - oops concept
function getData(id ,title, amount, datetime, notes, category) {
  this.id = id;
  this.title = title;
  this.amount = (!isNaN(amount) && amount !== null) ? amount : null;
  this.datetime = datetime;
  this.notes = notes;
  this.category = category;
} 
// constructor function prototype function 
getData.prototype.formatDate  = function() {
  return new Date(this.datetime).toLocaleString();
}

app.post('/api/formData', (req, res) => {
  const formData = req.body;
  //constructor function instance object
  const newForm = new FormData(formData.title,formData.amount, formData.dateTime, formData.notes, formData.category);
  try{
    const InsertTable = `
    INSERT INTO expense_tracker(title, amount, datetime, notes, category)
    values(?,?,?,?,?)`;
    const values = [newForm.title, newForm.amount, newForm.datetime, newForm.notes, newForm.category];

    connection.query(InsertTable, values, (err, result) => {
        if(err){
              console.log('error inserting', err)
              res.status(500).send('Error creating table');
              return;
        }
        console.log('inserted table successfully', result.affectedRows)
        res.send(formData)
      });
  }
  catch(err){
    console.log('Error inserting table');
    res.status(500).send('Server error during insertion');
  }
})

app.get('/api/getData', (req, res) => {

  try{
    const getAllExpenses = `SELECT * FROM expense_tracker;`
    connection.query(getAllExpenses, (err, rows) => {
      if(err){
        console.log('Error fetching data:', err);
        return res.status(404).send('Error fetching data')
      }else {
        const formattedExpense = rows.map(row => {
          const expense = new getData(row.id ,row.title,row.amount, row.datetime, row.notes, row.category);
          const expenseObject = {
            id: expense.id,
            title: expense.title,
            amount: expense.amount,
            formattedDate: expense.formatDate(),
            notes: expense.notes,
            category: expense.category
          }
          return expenseObject;
        })

        res.status(200).json(formattedExpense)
      }
    })
  }catch(err){
    console.log('Error fetching data', err)
    res.status(404).send('Error fetching data', err)
  }
    
})

app.get('/api/getAllExpenses',(req, res) => {
  
  try{
    const getAllExpenses = `SELECT * FROM expense_tracker;`
    connection.query(getAllExpenses, (err, rows) => {
      if(err){
        console.log('Error fetching data:', err);
        return res.status(404).send('Error fetching data')
      }else {
        const formattedExpense = rows.map(row => {
          const expense = new getData(row.id ,row.title,row.amount, row.datetime, row.notes, row.category);
          const expenseObject = {
            id: expense.id,
            title: expense.title,
            amount: expense.amount,
            formattedDate: expense.formatDate(),
            notes: expense.notes,
            category: expense.category
          }
          return expenseObject;
        })

        res.status(200).json(formattedExpense)
      }
    })
  } catch(error){
    console.log('Error fetching data', error)
  }
})

app.delete('/api/deleteCard', async (req, res) => {
  console.log(req.query)
  const {id} = req.query
  try{
    const deleteCard = `DELETE FROM expense_tracker 
    WHERE id = '${id}'`

    connection.query(deleteCard, (err, result) => {
      if(err){
        console.log('Error deleting card:', err);
        return res.status(404).send('Error fetching data')
      }
      if (result.affectedRows === 0) {
        return res.status(404).send('Card not found'); // Checks if the card exists
      }

      res.status(200).send('Card deleted successfully');
    });

  } catch (err) {
  console.error('Unexpected error:', err);
    res.status(500).send('Unexpected server error');
  }
})



// Start the server
app.listen(PORT, 'localhost', () => {
  console.log(`Listening on http://localhost:${PORT}/home`);
});

