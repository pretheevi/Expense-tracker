const title = document.querySelector('#title');
const amount = document.querySelector('#amount'); // Added this line
const category = document.querySelector('#category');
const dateTime = document.querySelector('#datetime');
const notes = document.querySelector('#notes');
const recent_expense_container = document.querySelector('.recent_expense_container');



function submitForm(event) {
  event.preventDefault();

  if (!title.value || !category.value || !dateTime.value) {
    displayError('Please fill in the required fields: Title, Category, and Date.');
    return;
  }

  const amountValue = Number(amount.value);
  if (isNaN(amountValue) || amountValue <= 0) {
    displayError('Amount must be a positive number.');
    return;
  }

  const formData = {
    title: title.value,
    amount: amountValue,
    category: category.value,
    dateTime: dateTime.value,
    notes: notes.value
  };

  fetch('/api/formData', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'My-Header': 'formData'
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    document.querySelector('form').reset();
    displayError('', true); // Clear error message
    getData(); // Refresh expenses
  })
  .catch(error => {
    console.error('Error in submitting form data', error);
    displayError('An error occurred while submitting the form. Please try again later.');
  });
}

//chart.js

  const ctx = document.getElementById('myChart');

  const myChart =  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: [],
      datasets:  [{
        label: 'My First Dataset',
        data: [],
        backgroundColor: [],
        hoverOffset: 4
      }]
    },
    options: {}
  });

  // Update chart data based on fetched expense data
async function updateChartData(data) {
  const chartData = {};
 // Calculate cumulative amounts by category
data.forEach(expense => {
  chartData[expense.category] = (chartData[expense.category] || 0) + Number(expense.amount);
});

  const labels = Object.keys(chartData);
  const values = Object.values(chartData);

  // Log to check data before updating chart
  // console.log("Labels:", labels);
  // console.log("Values:", values);

    // Full reset of chart data
    myChart.data.labels = [];
    myChart.data.datasets[0].data = [];
    myChart.data.datasets[0].backgroundColor = [];

 // Update chart if data is available
    if (labels.length && values.length) {
          myChart.data.labels = labels;
          myChart.data.datasets[0].data = values;
          myChart.data.datasets[0].backgroundColor = generateBackgroundColors(labels.length);

          myChart.update()
    } else {
      console.warn("No data available to display in the chart.");
    }
}

// Function to generate background colors for the chart
function generateBackgroundColors(count) {
  const colors = [
    'rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)', 
    'rgb(75, 192, 192)', 'rgb(153, 102, 255)'
  ];
  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
}


async function getData() {
  recent_expense_container.innerHTML = 'Loading...'; // Loading message
  try {
    const response = await fetch('/api/getData');
    if (!response.ok) {
      throw new Error('Error fetching data');
    }
    const data = await response.json();
    console.log(data);
    recent_expense_container.innerHTML = ''; // Clear previous content

    if (data && data.length > 0) {
      data.forEach(expense => {
        const div = document.createElement('div');
        div.classList.add('recent_expense', 'd-flex', 'justify-content-between');

        const div2 = document.createElement('div');
        div2.innerHTML = `<h1>${expense.title}</h1><p>${expense.notes}</p>`;

        const div3 = document.createElement('div');
        div3.innerHTML = `<h1>${expense.amount}₹</h1><p>${expense.formattedDate}</p>`;
        
        div.append(div2, div3);
        recent_expense_container.append(div);
      });

      updateChartData(data);
    } else {
      recent_expense_container.innerHTML = 'No expenses available.';
    }
  } catch (error) {
    console.error('Error in loading expense data:', error);
    recent_expense_container.innerHTML = 'Failed to load expenses.';
  }
}

function displayError(message, clear = false) {
  const errorMessage = document.querySelector('#displayError');
  errorMessage.textContent = message;
  errorMessage.style.display = clear ? 'none' : 'block';
  if (!clear) {
    errorMessage.style.color = 'red';
  }
}

window.onload = getData;
