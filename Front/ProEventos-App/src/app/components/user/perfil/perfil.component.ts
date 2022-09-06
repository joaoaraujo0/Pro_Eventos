import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorField } from '@app/helpers/ValidatorField';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  form!:FormGroup;

  get f():any{return this.form.controls;}

  constructor(private fb:FormBuilder) { }


  ngOnInit() {
    this.validation();
  }

  private validation():void{
    const formOptions:AbstractControlOptions={
      validators:ValidatorField.MustMatch('senha','confirmarSenha')
    };

    this.form=this.fb.group({
    titulo:['',Validators.required],
    primeiroNome:['',Validators.required],
    ultimoNome:['',Validators.required],
    email:['',[Validators.required,Validators.email]],
    telefone:['',Validators.required],
    funcao:['',Validators.required],
    descricao:['',Validators.required],
    senha:['',[Validators.minLength(6),Validators.required]],
    confirmarSenha:['',Validators.nullValidator],
    },formOptions);
  }
  onSubmit(): void {

    if (this.form.invalid) {
      return;
    }
  }


  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }
}
