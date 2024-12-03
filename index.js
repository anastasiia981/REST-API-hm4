const express = require("express");
const fs = require("fs");
const app = express();
const usersFilePath = "./users.json";

let uniqueID = 0;
app.use(express.json());

// Функция для чтения пользователей из файла
const readUsersFromFile = () => {
    try {
        const data = fs.readFileSync(usersFilePath);
        return JSON.parse(data);
    } catch (error) {
        return []; //возвращаем пустой массив, если не нашли пользователя
    }
};

// Функция для записи пользователей в файл
const writeUsersToFile = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

app.get("/users", (req, res) => {
    const users = readUsersFromFile();
    res.send({ users });
});

app.post("/users", (req, res) => {
    let users = readUsersFromFile();
    uniqueID = users.length > 0 ? users[users.length - 1].id : 0;
    uniqueID += 1;
    const newUser = {
        id: uniqueID,
        ...req.body,
    };
    users.push(newUser);
    writeUsersToFile(users);
    res.send({ id: uniqueID });
});

app.put("/users/:id", (req, res) => {
    const userId = +req.params.id;
    let users = readUsersFromFile();
    const userIndex = users.findIndex((user) => user.id === userId);
    
    if (userIndex !== -1) {
        const { firstName, secondName, age, city } = req.body;
        users[userIndex] = { id: userId, firstName, secondName, age, city }; // Обновление данных пользователя
        writeUsersToFile(users);
        res.send({ message: "Пользователь обновлен", user: users[userIndex] });
    } else {
        res.status(404).send({ message: "Пользователь не найден" });
    }
});

app.delete("/users/:id", (req, res) => {
    const userId = +req.params.id;
    let users = readUsersFromFile();
    const userIndex = users.findIndex((user) => user.id === userId);
    
    if (userIndex !== -1) {
        users.splice(userIndex, 1); // Удаляем пользователя из массива
        writeUsersToFile(users);
        res.send({ message: "Пользователь удален" });
    } else {
        res.status(404).send({ message: "Пользователь не найден" });
    }
});


app.listen(3000, () => {
    console.log("Сервер запущен на порту 3000");
});