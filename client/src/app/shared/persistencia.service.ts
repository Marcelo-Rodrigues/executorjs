import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromEvent';

@Injectable()
export class PersistenciaService {

  private socket: SocketIOClient.Socket;

  connect(): Subject<MessageEvent> {
    this.socket = io(`http://localhost:3000`);

    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    const observable = new Observable(o => {
      this.socket.on('message', (data) => {
        console.log('Received message from Websocket Server');
        o.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });

    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
    const observer = {
      next: (data: Object) => {
        this.socket.emit('message', JSON.stringify(data));
      },
    };

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Subject.create(observer, observable);
  }

}
