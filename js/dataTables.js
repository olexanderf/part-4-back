function DataTable(config) {
    let div = document.getElementById('usersTable');
    let table = document.createElement('table');
    let thead = document.createElement('thead');

    div.append(table);
    table.append(thead);


    createHead(config, thead);

    if (config.apiUrl) {
        getData(config.apiUrl).then((data) => createTableBody(data, thead))
    } else createTableBody(users, thead);
}
function createHead(config, thead) {

    if (config.columns) {
        let tr = document.createElement('tr');
        let th = document.createElement('th');

        thead.append(tr);
        th.innerText = '№'
        tr.append(th);

        config.columns.forEach(el => {
            let elementOfThead = document.createElement('th');
            elementOfThead.innerText = el.title;
            tr.append(elementOfThead);
        });
        let elementOfThead = document.createElement('th');
        elementOfThead.innerText = "Удалить";
        tr.append(elementOfThead);
    }
}
function createTableBody(data, thead) {
    let tbody = document.createElement('tbody');

    thead.after(tbody);
    if (data) {
        for (let el in data) {
            let tr = document.createElement('tr');
            tbody.append(tr);

            let numberOfElement = document.createElement('td');
            numberOfElement.innerText = el;
            tr.append(numberOfElement);

            for (let value in data[el]) {
                if (value === 'id') continue;
                let elementOfTbody = document.createElement('td');
                elementOfTbody.innerText = data[el][value];
                tr.append(elementOfTbody);
            }

            let elementOfTbody = document.createElement('td');
            let delBtn = document.createElement('button');
            delBtn.innerText = "Удалить";
            delBtn.className = "btn del";
            tr.append(elementOfTbody);
            elementOfTbody.append(delBtn);
            delBtn.onclick = () => { deleteUser(el) };
        }
    }
}
async function deleteUser(userId) {
    let response = fetch(config1.apiUrl + `/${userId}`, {
        method: 'DELETE',
    }).then(getData(config1.apiUrl)
        .then((data) => createTableBody(data, thead)))
        .then(()=>{window.location.reload()});
}

async function getData(url) {

    let data = await fetch(url);
    let allData = await data.json();

    return allData.data;
}


const config1 = {
    parent: '#usersTable',
    columns: [
        { title: 'Имя', value: 'name' },
        { title: 'Фамилия', value: 'surname' },
        { title: 'Аватар', value: 'avatar' },
        { title: 'День Рождения', value: 'birthday' },
    ],
    apiUrl: 'https://mock-api.shpp.me/oserdiuk/users',
};

const users = [
    { id: 30050, name: 'Вася', surname: 'Петров', age: 12 },
    { id: 30051, name: 'Вася', surname: 'Васечкин', age: 15 },
];


DataTable(config1);
