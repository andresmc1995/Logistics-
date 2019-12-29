<template>
  <div id="app">
      <b-navbar toggleable="lg" type="dark" variant="info">
    
      
    <b-navbar-brand href="#"><p>Sistema digital</p> <p style="font-size:10px;">Usuario: {{hola}}</p> </b-navbar-brand>
    
    
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="#" right @click="verResumen">Ver transacciones historicas</b-nav-item>
        <b-nav-item href="#" right @click="verTransacciones">Envios pendientes</b-nav-item>
        <b-nav-item href="#" right @click="verTransaccionesOtros">Recibos pendientes</b-nav-item>
        <b-nav-item href="#" right @click="verTransaccionesRechazadas">Ver balance</b-nav-item>
        <b-nav-item href="#" right @click="hacerTransferencia">Realizar transaccion</b-nav-item>
        <b-nav-item href="#" left @click="logout" style="align:right;">Salir</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
    <router-view/>
  </div>
</template>

<script>
import Firebase from 'firebase'
import config from './config'
import {EventBus} from './main'
export let app = Firebase.initializeApp(config)
export let db = app.database()
let transaccionesHechasRef = db.ref('transaccionesHechas')
let transaccionesEnCursoRef = db.ref('transaccionesEnCurso')
let transaccionesRechazadasRef = db.ref('transaccionesRechazadas')
export default {
  name: 'App',
  data:()=>({transaccionesHechas:[],transaccionesEnCurso:[]}),
  
  computed:{
    hola:function(){
      if(Firebase.auth().currentUser!==null)
      return Firebase.auth().currentUser.email;
      else
      return ''
    }
  },
 
  firebase:{
      transaccionesHechas:transaccionesHechasRef,
      transaccionesEnCurso:transaccionesEnCursoRef,
      transaccionesRechazadas:transaccionesRechazadasRef
    
  },
  methods:{
    logout(){
      Firebase.auth().signOut().then(()=>this.$router.replace('login'));
    },
    verTransacciones(){
      this.$router.replace('encurso'); 
    },
    verTransaccionesOtros(){
      this.$router.replace('encurso2');
    },
    verTransaccionesRechazadas(){
      this.$router.replace('rechazadas');
    },
    verResumen(){
      this.$router.replace('home');
    },
    hacerTransferencia(){
      this.$router.replace('enviar');
    }
  }
  }

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
