import { EventEmitter, Component, ElementRef, Input, Output, OnInit, ViewChild, AfterContentChecked } from '@angular/core';
import { HighlightJsService } from 'angular2-highlight-js/lib/highlight-js.service';

@Component({
  selector: 'app-campo-codigo',
  templateUrl: './campo-codigo.component.html',
  styleUrls: ['./campo-codigo.component.css']
})
export class CampoCodigoComponent implements OnInit, AfterContentChecked {

  cursor: { pos: number, encontrado: boolean };
  @ViewChild('tagCodigo') tagCodigo: ElementRef;
  @Input() editavel = true;
  _codigo = '';
  @Input() set codigo(valor: string) {
    if (this.tagCodigo.nativeElement.innerText === valor) {
      return;
    }

    this.salvarPosicaoCursor();
    this._codigo = valor;

    setTimeout(this.atualizarRealce.bind(this));
  }
  get codigo() {
    return this._codigo;
  }

  @Output() codigoChange = new EventEmitter<string>();
  @Input() linguagem: string;
  constructor(private servicoRealce: HighlightJsService) { }

  salvarPosicaoCursor(enter = false) {
    if (this.tagCodigo.nativeElement) {
      this.cursor = this.procurar(this.tagCodigo.nativeElement);
      if (enter) {
        this.cursor.pos++;
      }
    }
  }

  ngOnInit() {
    this.realcarCodigo();
  }

  teclaPressionada(kev: KeyboardEvent) {
    this.atualizarRealce(kev.code === 'Enter');
    this.codigoChange.emit(this.tagCodigo.nativeElement.innerText);
  }

  textoAlterado() {
    this.atualizarRealce();
    this.codigoChange.emit(this.tagCodigo.nativeElement.innerText);
  }

  atualizarRealce(enter = false) {
    this.salvarPosicaoCursor(enter);
    const texto = this.tagCodigo.nativeElement.innerText;
    this.tagCodigo.nativeElement.innerText = texto;
    this.realcarCodigo();

    this.restaurarPosicaoCursor();

  }

  restaurarPosicaoCursor() {
    if (this.cursor.encontrado) {
      const novoCursor = this.procurarNovaPosicao(this.tagCodigo.nativeElement, this.cursor.pos);
      if (novoCursor.encontrado) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart(novoCursor.ref, novoCursor.pos);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }

  getCurPos(ref: Node = null, pos = 0) {
    let newPos;
    let newRef;
    if (!ref) {
      newRef = window.getSelection().anchorNode;
      newPos = window.getSelection().anchorOffset;
    } else {
      newRef = ref;
      newPos += ref.nodeValue.length;
    }

    if (newRef.previousSibling) {
      if (newRef.previousSibling.lastChild) {
        newRef = newRef.previousSibling.lastChild;
      } else {
        newRef = newRef.previousSibling;
      }
      return this.getCurPos(newRef, newPos);
    } else {
      return newPos;
    }
  }

  procurarNovaPosicao(ref: Node, pos: number): { pos: number, ref: Node, encontrado: boolean } {
    let posLeft = pos - (ref.nodeValue ? ref.nodeValue.length : 0);

    if (posLeft <= 0) {
      return { pos: (ref.nodeValue ? ref.nodeValue.length : 0) + posLeft, ref: ref, encontrado: true };
    }

    for (let cn = 0; ref.childNodes && cn < ref.childNodes.length; cn++) {
      const res = this.procurarNovaPosicao(ref.childNodes[cn], posLeft);
      if (res.encontrado) {
        return res;
      } else {
        posLeft = res.pos;
      }
    }

    return { pos: posLeft, ref: null, encontrado: false };
  }

  procurar(ref: Node, pos = 0, selection = window.getSelection()): { pos: number, encontrado: boolean } {

    let newPos = pos + (ref.nodeValue ? ref.nodeValue.length : 0);

    for (let cn = 0; ref.childNodes && cn < ref.childNodes.length; cn++) {
      const res = this.procurar(ref.childNodes[cn], newPos, selection);
      if (res.encontrado) {
        return res;
      } else {
        newPos = res.pos;
      }
    }

    if (ref === selection.anchorNode) {
      return { pos: newPos + selection.anchorOffset - (ref.nodeValue ? ref.nodeValue.length : 0), encontrado: true };
    }

    return { pos: newPos, encontrado: false };
  }

  realcarCodigo() {
    this.servicoRealce.highlight(this.tagCodigo.nativeElement);
  }

  ngAfterContentChecked() {
    // this.atualizarRealce();
    // this.realcarCodigoRestaurarCursor();
  }
}
