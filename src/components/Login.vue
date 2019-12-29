<template>
    <div>
        <h2>Ingresar</h2>
        <b-form @submit.prevent="login">
            <b-form-group
        id="input-group-1"
        label="Direccion de correo:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="usuario"
          type="email"
          required
          placeholder="Ingresar direccion de email"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Contraseña:" label-for="input-2">
        <b-form-input
        type="password"
          id="input-2"
          v-model="contrasena"
          required
          placeholder="Ingresar contraseña"
        ></b-form-input>
      </b-form-group>
        <b-nav>
      <b-button pill type="submit" variant="outline-primary">Siguiente</b-button>
      <b-button pill type="reset" @click="reseteo" variant="outline-danger">Borrar campos</b-button>
        </b-nav>
        </b-form>
        
    </div>
</template>
<script>
import Firebase from 'firebase'
import config from '../config'
import {app} from '../App'
import {db} from '../App'
import {EventBus} from '../main'
import Swal from 'sweetalert2'




export default {
    
    data(){
        return{
            usuario:'',
            contrasena:''
        }
    },
    
    methods:{
        login(){
            Firebase
            .auth()
            .signInWithEmailAndPassword(this.usuario, this.contrasena)
            .then((user)=>
                {this.$router.replace('home'); Swal.fire({
  position: 'center',
  type: 'success',
  title: 'Ingresaste con exito',
  showConfirmButton: false,
  timer: 1500
})}, (error)=>{console.error(error);Swal.fire({
  title: 'Error!',
  text: 'Por favor introducir bien la contraseña',
  type: 'error',
  confirmButtonText: 'Ok'
})});
        },
        reseteo(){
            this.usuario='';
            this.contrasena='';
        },
      
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
pre{
  color:white;
}
</style>