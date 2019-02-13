import React, { Component } from 'react';
import next from '../next.svg';
import cancel from '../cancel.svg'
import io from "socket.io-client";

class chatApp extends Component {
    constructor(){
        super()
        this.state = {
            name: '',
            message: '',
            list: []
        }

        this.socket = io('localhost:8080');

        this.socket.on('RECEIVE_MESSAGE', function(data){                        
            console.log(data)
            this.setState({list: data});
        }        
        .bind(this));        
    }


    handleChangeName = (event) => {
        this.setState({
            name: event.target.value
        })
    }
    handleChangeMessage = (event) => {
        this.setState({
            message: event.target.value
        })
    }
    handleSumbit = (event) => {
        let name = this.state.name;
        let message = this.state.message;
        let jam =  new Date().getHours();
        let menit = new Date().getMinutes();
        let id = Date.now()
        let time = `${jam<10 ? '0'+jam : jam} : ${menit<10 ? '0'+menit : menit}`;
        let data = { id,name, message, time }
        this.socket.emit('SEND_MESSAGE', data)
        this.setState({message:''})
        event.preventDefault()
    }
    deleteMessage = (id) => {
        
        this.socket.emit('DELETE_MESSAGE', id)
    }
    render() {
        return (
            <div id="container_chat">
                <div id="inputData">
                    <form onSubmit={this.handleSumbit}>

                        <div id="name">
                            <input type="text" id="isi" placeholder="nama.." onChange={this.handleChangeName} required value={this.state.name} />
                            
                        </div>

                        <div id="pesan">
                            <input type="text" id="isi" placeholder="pesan.." onChange={this.handleChangeMessage} value={this.state.message} />
                            <img src={next} className="App-logo" onClick={this.handleSumbit}/>

                        </div>
                        <button type="submit" id="hiddenInput" />
                    </form>
                </div>
                <div className="list">
                    {this.state.list.map((item,index) => (
                        <div id="list_chat" key={index}>
                            <div className="chat_box">
                                <div id="sender">@{item.name}</div>
                                <div id="msg">{item.message}</div>
                                <div id="time">{item.time}</div>
                            </div>
                            <img src={cancel}  className="deleteBtn" onClick={e=>this.deleteMessage(item.id,e)}/>
                        </div>
                    ))}



                </div>

            </div>
        );
    }
}

export default chatApp;