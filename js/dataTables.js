const div = document.getElementById('usersTable');
const table = document.createElement('table');
const thead = document.createElement('thead');
const tbody = document.createElement('tbody');

function DataTable(config) {

    div.append(table);
    table.append(thead);

    createHead(config, thead);
    createAddBtn(div);

    if (config.apiUrl) {
        getData(config.apiUrl).then((data) => createTableBody(data, thead))
    } else createTableBody(users, thead);
}

function createAddBtn(elementInDOM) {

    let addBtn = document.createElement('button');
    addBtn.innerText = 'Додати';
    addBtn.className = 'btn add';
    elementInDOM.prepend(addBtn);
    addBtn.addEventListener('click', addNewElementInTable);
}

function addNewElementInTable() {

    let tr = document.createElement('tr');
    tbody.prepend(tr);

    for (let i = 0; i < config1.columns.length; i++) {

        let elementOfTbody = document.createElement('td');
        let inputField = document.createElement('input');

        elementOfTbody.className = 'inputTd';
        inputField.className = 'inputField';
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') collectData();
        });

        tr.append(elementOfTbody);
        elementOfTbody.append(inputField);
    }
    let elementOfTbody = document.createElement('td');
    tr.append(elementOfTbody);
}

function collectData() {
    //collect data from inputs and if no empty inputs create obj with and send to server
    let inputFields = document.querySelectorAll('.inputField');

    if (checkValues(inputFields)) {
        let inputData = {
            name: inputFields[0].value,
            surname: inputFields[1].value,
            avatar: inputFields[2].value,
            birthday: inputFields[3].value,
        }
        sendData(inputData);
    } else {
        console.log('Wrong values in input!');
    }
}

async function sendData(inputData) {

    let response = await fetch('https://mock-api.shpp.me/oserdiuk/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(inputData),
    })
    //reload page to see changes
    response.then(getData(config1.apiUrl)
        .then((data) => createTableBody(data, thead)))
        .then(() => { window.location.reload() });
}

function checkValues(inputFields) {

    inputFields.forEach((el) => {
        (!el.value.match(/\s+/g) && el.value === '') ?
            el.classList.add('redBorder') :
            el.classList.remove('redBorder');
    })

    for (let i = 0; i < inputFields.length; i++) {
        if (inputFields[i].classList.contains('redBorder')) {
            return false;
        }
    }
    return true;
}

function createHead(config, thead) {

    if (config.columns) {

        let tr = document.createElement('tr');

        thead.append(tr);

        config.columns.forEach(el => {
            let elementOfThead = document.createElement('th');
            elementOfThead.innerText = el.title;
            tr.append(elementOfThead);
        });
        let elementOfThead = document.createElement('th');
        elementOfThead.innerText = "Видалити";
        tr.append(elementOfThead);
    }
}

function createTableBody(data, thead) {
    thead.after(tbody);
    if (data) {
        for (let el in data) {
            let tr = document.createElement('tr');
            tbody.append(tr);

            for (let value in data[el]) {
                if (value === 'id') continue;
                let elementOfTbody = document.createElement('td');
                elementOfTbody.innerText = data[el][value];
                tr.append(elementOfTbody);
            }
            createDelBtn(tr, el)
        }
    }
}

function createDelBtn(elementInDOM, el) {

    let elementOfTbody = document.createElement('td');
    let delBtn = document.createElement('button');
    delBtn.innerText = "Видалити";
    delBtn.className = "btn del";
    elementInDOM.append(elementOfTbody);
    elementOfTbody.append(delBtn);
    delBtn.onclick = () => { deleteUser(el) };
}

async function deleteUser(userId) {

    let response = fetch(config1.apiUrl + `/${userId}`, {
        method: 'DELETE',
    })
    //reload page to see changes
    response.then(getData(config1.apiUrl)
        .then((data) => createTableBody(data, thead)))
        .then(() => { window.location.reload() });
}

async function getData(url) {

    let data = await fetch(url);
    let allData = await data.json();
    return allData.data;
}


const config1 = {
    parent: '#usersTable',
    columns: [
        { title: 'Ім\'я', value: 'name' },
        { title: 'Прізвище', value: 'surname' },
        { title: 'Аватар', value: 'avatar' },
        { title: 'День Народження', value: 'birthday' },
    ],
    apiUrl: 'https://mock-api.shpp.me/oserdiuk/users',
};

const users = {
    0: { id: 30050, name: 'Вася', surname: 'Петров', age: 12 },
    1: { id: 30051, name: 'Вася', surname: 'Васечкін', age: 15 },
};


DataTable(config1);
