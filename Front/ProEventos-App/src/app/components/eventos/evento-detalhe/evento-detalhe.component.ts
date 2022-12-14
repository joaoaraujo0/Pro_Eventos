import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

import { EventoService } from '@app/services/evento.service';
import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';
import { LoteService } from '@app/services/lote.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {

  modalRef:BsModalRef;
  eventoId: number;
  evento = {} as Evento;
  form: FormGroup;
  estadoSalvar = 'post';
  loteAtual={id: 0,nome: '',indice: 0};

  get modoEditar():boolean{
    return this.estadoSalvar=='put';
  }

  get lotes():FormArray{
    return this.form.get('lotes')as FormArray;
  }

  get f(): any {
    return this.form.controls;
  }

  get bsConfig(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }

  constructor(private fb: FormBuilder,
              private localeService: BsLocaleService,
              private activetedRouter: ActivatedRoute,
              private eventoService: EventoService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private router:Router,
              private loteService :LoteService,
              private modalService:BsModalService
              )
  {
    this.localeService.use('pt-br');
  }

  public carregarEvento(): void {
    this.eventoId = +this.activetedRouter.snapshot.paramMap.get('id');

    if (this.eventoId !== null && this.eventoId !==0) {
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.eventoService.getEventoById(this.eventoId).subscribe(
        (evento: Evento) => {
          this.evento = {...evento};
          this.form.patchValue(this.evento);
          this.evento.lotes.forEach(lote=>{
            this.lotes.push(this.criarLote(lote));
          });
          //this.carregarLotes();
        },
        (error: any) => {
          this.toastr.error('Erro ao tentar carregar Evento.', 'Erro!');
          console.error(error);
        }
      ).add(() => this.spinner.hide());
    }
  }

   public carregarLotes():void {
    this.loteService.getLotesByEventoId(this.eventoId).subscribe(
      (lotesRetorno:Lote[])=>{
        lotesRetorno
      },
      (error:any)=>{
        this.toastr.error('Erro ao tentar carregar lotes','Erro');
        console.error(error);
      },


      ).add(() => this.spinner.hide());

  }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }

  public validation(): void {
    this.form = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: ['', Validators.required],
      lotes:this.fb.array([])
    });
  }

  adicionarLote():void{
    this.lotes.push(this.criarLote({id:0} as Lote));
  }

  criarLote(lote:Lote):FormGroup{
    return this.fb.group({
      id:[lote.id],
      nome:[lote.nome,Validators.required],
      preco:[lote.preco,Validators.required],
      quantidade:[lote.quantidade,Validators.required],
      dataInicio:[lote.dataInicio],
      dataFim:[lote.dataFim],
    });
  }

  public mudarValorData(value: Date, indice: number,campo:string): void {
    this.lotes.value[indice][campo] = value;

  }


  public resetForm(): void {
    this.form.reset();
  }
  public retornaTituloLote(nome:string):string{
    return nome == null ||nome == ''?'Nome do lote':nome;
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return {'is-invalid': campoForm.errors && campoForm.touched};
  }

  public salvarEvento(): void {
    this.spinner.show();
    if(this.form.valid){

      this.evento=(this.estadoSalvar=='post')
          ?{...this.form.value}
          :{id:this.evento.id,...this.form.value};

      this.eventoService[this.estadoSalvar](this.evento).subscribe(
        (eventoRetorno:Evento)=>{
          this.toastr.success('Evento salvo com Sucesso!','Sucesso');
          this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
      },
        (error:any)=>{
          console.error(error);
          this.spinner.hide();
          this.toastr.error('Error ao salvar evento','Erro');
        },
        ()=>this.spinner.hide()
      );
    }
  }
  public salvarLotes():void{
    if(this.form.controls.lotes.valid){
      this.spinner.show();
      this.loteService.saveLote(this.eventoId, this.form.value.lotes)
      .subscribe(
        ()=>{
          this.toastr.success('Lotes salvos com Sucesso!','Sucesso!');
        },
        (error:any)=>{
          this.toastr.error('Erro ao tentar salvar lotes.','Erro');
          console.error(error);
        }

      ).add(()=>this.spinner.hide());
    }
  }

  public removerLote(template:TemplateRef<any>,indice:number):void{

    this.loteAtual.id=this.lotes.get(indice + '.id').value;
    this.loteAtual.nome=this.lotes.get(indice + '.nome').value;
    this.loteAtual.indice=indice;


    this.modalRef= this.modalService.show(template,{class:'modal-sm'});
  }

  public confirmDeleteLote():void{
    this.modalRef.hide();
    this.spinner.show();

    this.loteService.deleteLote(this.eventoId,this.loteAtual.id)
    .subscribe(
      ()=>{
        this.toastr.success('Lote deletado com sucesso','Sucesso');
        this.lotes.removeAt(this.loteAtual.indice);
      },
      (error:any)=>{
        this.toastr.error(`Erro ao tentar excluir o Lote ${this.loteAtual.id}, tente mais tarde','Erro'`);
        console.error(error);
      },
    ).add(()=>this.spinner.hide());

  }
  public declineDeleteLote():void{
    this.modalRef.hide();

  }

}
