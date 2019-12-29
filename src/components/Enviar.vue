<template>
    <div class="enviar">
        <h3>Realizar transaccion</h3>
        <b-form @submit.prevent="realizarTransaccion">
            <b-card>
            <b-form-group
        id="input-group-1"
        label="Empresa a recibir:"
        label-for="input-1"
      >
        <b-form-select
          id="input-1"
          v-model="nuevaTransaccion.recibidor"
          :options="listaEmails"
          type="email"
          required
          placeholder="Ingresar empresa que va a recbir pallets"
        ></b-form-select>
      </b-form-group>

      <b-form-group id="input-group-2" label="Cantidad a enviar:" label-for="input-2">
        <b-form-input
        type=""
          id="input-2"
          v-model="nuevaTransaccion.cantidadEnviada"
          required
          placeholder="Ingresar cantidad de pallets a enviar"
        ></b-form-input>
      </b-form-group>
            </b-card>
     <b-card>
      <b-form-group id="input-group-3" label="Numero de remito:" label-for="input-3" >
        <b-form-input
        type=""
          id="input-3"
          v-model="nuevaTransaccion.remito"
          required
          placeholder="Ingresar numero de remito"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-4" label="Numero de orden de compra:" label-for="input-4" >
        <b-form-input
        type=""
          id="input-4"
          v-model="nuevaTransaccion.ordenCompra"
          required
          placeholder="Ingresar orden de compra"
        ></b-form-input>
      </b-form-group>
</b-card>
<b-card>
      <b-form-group id="input-group-5" label="Nombre del chofer:" label-for="input-5" >
        <b-form-input
        type=""
          id="input-5"
          v-model="nuevaTransaccion.nombreChofer"
          required
          placeholder="Ingresar nombre del chofer"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-6" label="DNI del chofer:" label-for="input-6" >
        <b-form-input
        type=""
          id="input-6"
          v-model="nuevaTransaccion.dniChofer"
          required
          placeholder="Ingresar DNI del chofer"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-7" label="Patente del chofer:" label-for="input-7" >
        <b-form-input
        type=""
          id="input-7"
          v-model="nuevaTransaccion.patenteChofer"
          required
          placeholder="Ingresar patente del chofer"
        ></b-form-input>
      </b-form-group>
     </b-card>
      

        <b-card>
        <b-nav>
      <b-button pill type="submit" variant="outline-primary">Siguiente</b-button>
      <b-button pill type="reset" @click="reseteo" variant="outline-danger">Borrar campos</b-button>
        </b-nav>
        </b-card>
        </b-form >
        <!--/**/*/-->
        </div>
</template>


<script>
import Firebase from 'firebase'
import config from '../config'
import {app} from '../App'
import {db} from '../App'
import {EventBus} from '../main'
import Swal from 'sweetalert2'
let transaccionesEnCursoRef = db.ref('transaccionesEnCurso')
let usuariosRef=db.ref('usuarios')
console.log(transaccionesEnCursoRef)
export default {
    name: 'Enviar',
    data:()=>({
      usuarios:[],
        nuevaTransaccion:{
            enviador:Firebase.auth().currentUser.email,
            cantidadEnviada:'',
            recibidor:'',
            fechaEnviada:'',
            remito:'',
            ordenCompra:'',
            nombreChofer:'',
            dniChofer:'',
            patenteChofer:''
        }
    }),
    methods:{
        reseteo(){
            this.nuevaTransaccion.recibidor='';
            this.nuevaTransaccion.cantidadEnviada='';
            this.nuevaTransaccion.fechaEnviada='';
            this.nuevaTransaccion.remito=''
            this.nuevaTransaccion.ordenCompra=''
            this.nuevaTransaccion.nombreChofer=''
            this.nuevaTransaccion.dniChofer=''
            this.nuevaTransaccion.patenteChofer=''
        },
        realizarTransaccion(){
          if(isNaN(parseInt(this.nuevaTransaccion.cantidadEnviada))||parseInt(this.nuevaTransaccion.cantidadEnviada)<0){
   this.$swal({type: 'error',
  title: 'Oops...',
  text: 'Por favor introducir un numero entero positivo',
  });

          return;
        }
            Swal.fire({
  title: '¿Estas seguro de enviar?',
  text: `Estas enviando ${this.nuevaTransaccion.cantidadEnviada} a ${this.nuevaTransaccion.recibidor}`,
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Si, enviar'
}).then((result) => {
  if (result.value) {
    Swal.fire(
      'Enviado',
      `Enviaste la cantidad de ${this.nuevaTransaccion.cantidadEnviada} a ${this.nuevaTransaccion.recibidor}`,
      'Exito'
    )
    this.nuevaTransaccion.fechaEnviada=new Date();
            this.nuevaTransaccion.fechaEnviada=this.nuevaTransaccion.fechaEnviada.toUTCString();
            transaccionesEnCursoRef.push(this.nuevaTransaccion);
            this.nuevaTransaccion.enviador=Firebase.auth().currentUser.email;
            this.nuevaTransaccion.cantidadEnviada='';
            this.nuevaTransaccion.recibidor='';
            this.nuevaTransaccion.fechaEnviada='';
            this.nuevaTransaccion.remito=''
            this.nuevaTransaccion.ordenCompra=''
            this.nuevaTransaccion.nombreChofer=''
            this.nuevaTransaccion.dniChofer=''
            this.nuevaTransaccion.patenteChofer=''
  }
})

        }
      
    },
    computed:{
      listaEmails:function(){
        let hola = this.usuarios.map(element => {
          return element.email;
        });
        return hola.filter((email)=>{
          return email!==Firebase.auth().currentUser.email;
        })
      }
    },
    mounted(){
        this.totalRows = this.transaccionesEnCursoOtrosMostrar.length
      },
    firebase:{
    transaccionesEnCurso:transaccionesEnCursoRef,
    usuarios:usuariosRef
  }
  
}
</script>
<style scoped>
div{
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:column;
}
form >*{
    display:block;
}

.gh{
  display:inline-block;
}
</style>