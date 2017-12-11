import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromEvent';
import { Observer } from 'rxjs/Observer';
import { Promise } from 'q';

export class ControleEvento<T> {
  constructor(public receberNovo: Observable<T>, public enviarNovo: Observer<T>, public obterTodos: () => Promise<T>) {

  }
}

@Injectable()
export class PersistenciaService {

  private socket: SocketIOClient.Socket;
  public readonly test: ControleEvento<any>;

  constructor() {
    this.socket = io(`http://localhost:3000`);
    this.test = this.obterControleEvento<any>('test');
  }

  private obterControleEvento<T>(evento: string): ControleEvento<T> {

    const observavelNovoEvento = new Observable<T>(o => {
      this.socket.on('new ' + evento, (data) => {
        o.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });

    const observadorNovoEvento = {
      next: (data: T) => {
        this.socket.emit('new ' + evento, data);
      },
      error: () => { },
      complete: () => { }
    };

    const funcaoObterTodos = () => {
      return Promise<T>(
        (resolve) => {
          this.socket.on('new ' + evento, (data) => {
            resolve(data);
          });
        }
      );
    };

    return new ControleEvento<T>(observavelNovoEvento, observadorNovoEvento, funcaoObterTodos);
  }

}
