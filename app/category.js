const expense_data_container = document.querySelector('.expense_data_container');

async function getExpenseData(){
  expense_data_container.innerHTML = `<p>Loading...</p>`

  try{
    const response = await fetch('/api/getAllExpenses');
    if(!response.ok){
      throw new Error('Error in fetch all expense');
    }
    
    const data = await response.json();
    expense_data_container.innerHTML = ""; // Clear loading message
  
    data.forEach(expense => {
      console.log('expense data ', expense)
      //main div container
      const div = document.createElement('div');
      div.classList.add('expense-card', 'p-2', 'mb-2');
      div.id = `${expense.id}`;

       // Title and amount
      const div2 = document.createElement('div');
      div2.classList.add('d-flex', 'flex-row', 'justify-content-between')

      const h1_1 = document.createElement('h1');
      h1_1.classList.add('heading')
      h1_1.innerText = `${expense.title}`

      const h1_2 = document.createElement('h1');
      h1_2.classList.add('heading')
      h1_2.innerText = `${expense.amount}₹`

      div2.append(h1_1, h1_2);


      // Category and date Time
      const div3 = document.createElement('div');
      div3.classList.add('d-flex','flex-row', 'justify-content-between')

      const h1_3 = document.createElement('h1');
      h1_3.classList.add('sub-heading')
      h1_3.innerText = `${expense.category}`

      const h1_4 = document.createElement('h1');
      h1_4.classList.add('sub-heading')
      h1_4.innerText = `${expense.formattedDate}`

      div3.append(h1_3, h1_4);


      // Description
      const div4 = document.createElement('div');
      div4.classList.add('d-flex', 'flex-column', 'justify-content-between')

      const h1_5 = document.createElement('h1');
      h1_5.classList.add('heading')
      h1_5.innerText = 'Description';

      const p = document.createElement('p');
      p.innerHTML = `${expense.notes}`

      div4.append(h1_5, p);

      // Delete button
      const button = document.createElement('button');
      button.innerText = 'delete';
      button.addEventListener('click',() => {DeleteCard(expense.id)});

      div.append(div2, div3, div4, button);
      expense_data_container.append(div);
    });
  } catch(error) {
    console.log('Failed to load data..', error);
  }
}


async function DeleteCard(cardId){
  console.log(cardId)
  try{
    const response = await fetch(`/api/deleteCard?id=${cardId}`, {method: 'DELETE'});
    
    if(!response.ok) throw new Error('Error in deleting card');

    const message = await response.text();
    document.getElementById(cardId).remove();
    
    console.log(message); // Logs "Card deleted successfully"

  } catch(error) {
    console.log('failed to delete card', error);
  }
} 

window.onload = getExpenseData;