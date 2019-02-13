const express = require('express');
const app = express();
const fs = require('fs');
let socket = require('socket.io');

const port = process.env.PORT || 8080

io = socket(app.listen(port, function () {
    io.on('connection', (socket) => {
        let data = JSON.parse(fs.readFileSync('data.json', 'utf8'))
        io.emit('RECEIVE_MESSAGE', data);

        socket.on('SEND_MESSAGE', function (snap) {
            data.push(snap)
            fs.writeFile('data.json', JSON.stringify(data), (err) => {
                if (err) throw err;
                console.log('The message has been saved!');
                io.emit('RECEIVE_MESSAGE', data);
            });
        });

        socket.on('DELETE_MESSAGE',(id)=>{
            let data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
            let result = data.filter(item=> item.id!=id)            
            fs.writeFile('data.json', JSON.stringify(result), (err) => {
                if (err) throw err;
                console.log('The message has been deleted!');
                io.emit('RECEIVE_MESSAGE', result);
            });


        })

    });
}));
