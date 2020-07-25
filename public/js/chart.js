const ctx = document.getElementById('myChart').getContext('2d');
let myData = document.getElementsByClassName('deleteAfter').length;
let todoLengthChart = document.getElementById('todo-length-chart').innerHTML;
console.log(myData)

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Лимит", "Всего записей", "Ваши записи"],
        datasets: [{
            label: "Всего",
            backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
            data: [100, todoLengthChart, myData]
        }]
    },
    options: {
        legend: {
            display: false
        },
        title: {
            display: true,
            text: 'Количество всех записей (max: 100)'
        }
    }
});