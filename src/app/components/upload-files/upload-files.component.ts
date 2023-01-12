import { Component, OnInit } from '@angular/core';
import { Arquivo } from 'src/app/models/Arquivo';
import { UploadService } from 'src/app/services/upload.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent {

  arquivosCarrregados: Arquivo[] = [];
  loading: boolean = false;
  quantidadeArquivosSelecionada: number = 0;
  mensagemProcessamento: string ="";

  constructor(private uploadService: UploadService,
    private _snackBar: MatSnackBar) { }

  ///Limpa o preço médio e armazena o conteúdo a ser enviado
  async carregaLimpaArquivo(file: File) {
    var reader = new FileReader();
    var xmlSemPreco: string;
    reader.onload = () => {
      const parser = new DOMParser();
      let xml = reader.result ? reader.result.toString() : "";
      const doc = parser.parseFromString(xml, "application/xml");
      var precoNodes = doc.getElementsByTagName("precoMedio");
      for (let i = 0; i < precoNodes.length; i++) {
        precoNodes[i].innerHTML = "";
      }
      const serializer = new XMLSerializer();
      xmlSemPreco = serializer.serializeToString(doc);
    };
    reader.onloadend = async () => {
      var arquivo: Arquivo = new Arquivo();
      arquivo.nome = file.name;
      arquivo.xml = xmlSemPreco;
      this.arquivosCarrregados.push(arquivo);

      if (this.quantidadeArquivosSelecionada == this.arquivosCarrregados.length)
        this.loading = false;
    }
    reader.readAsText(file);
  }

  ///Carrega os arquivos selecionados e limpa o preço médio
  selecionaArquivos(event: any): void {
    this.arquivosCarrregados = [];
    this.quantidadeArquivosSelecionada = event.target.files.length
    this.loading = true;
    if (event.target.files) {
      for (let i = 0; i < this.quantidadeArquivosSelecionada; i++) {
        this.carregaLimpaArquivo(event.target.files[i]);
      }
    }
  }

  ///Envia os arquivos de forma sequencial (síncrona)
  async enviaArquivos() {
    this.loading = true;
    this.mensagemProcessamento="";
    for (let i = 0; i < this.arquivosCarrregados.length; i++) {
      try{
        	let result = await this.uploadService.upload(this.arquivosCarrregados[i]);
          this.mensagemProcessamento += ` - Arquivo ${this.arquivosCarrregados[i].nome} enviado com sucesso \n`;
      } catch {
        this.mensagemProcessamento += ` - Arquivo ${this.arquivosCarrregados[i].nome} não enviado`;
      }
    }
    this.alerta();
    this.limpar();
  }

  ///Limpa formuário
  async limpar() {
    this.arquivosCarrregados = [];
    this.loading = false;
    this.quantidadeArquivosSelecionada =0;
  }

  ///Mostra mensagem ao usuário
  alerta() {
    if(this.mensagemProcessamento)
      this._snackBar.open(this.mensagemProcessamento, 'Fechar',{
        duration: 4000,
        panelClass: ['alerta-snackbar']
      });
  }
}
